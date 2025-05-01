require('./instrument');
const express = require('express');
const compression = require('compression');
const { randomUUID } = require('crypto');
const helmet = require('helmet');
const noCache = require('nocache');
const path = require('path');
const session = require('cookie-session');
const Sentry = require('@sentry/node');
const i18next = require('i18next');
const middleware = require('i18next-http-middleware');
const filesystem = require('i18next-fs-backend');
const nunjucksSetup = require('./utils/nunjucksSetup');

const { createHealthRouter } = require('./routes/health');

const { featureToggleMiddleware } = require('./middleware/featureToggle');
const getEstablishmentFromUrl = require('./middleware/getEstablishmentFromUrl');
const configureEstablishment = require('./middleware/configureEstablishment');

const defaultConfig = require('./config');
const defaultEstablishmentData = require('./content/establishmentData.json');
const routes = require('./routes');
const { NotFound } = require('./repositories/apiError');
const setCurrentUser = require('./middleware/setCurrentUser');
const setReturnUrl = require('./middleware/setReturnUrl');

i18next
  .use(middleware.LanguageDetector)
  .use(filesystem)
  .init({
    preload: ['en', 'cy'],
    fallbackLng: 'en',
    backend: {
      loadPath: path.join(__dirname, 'locales/{{lng}}.json'),
    },
    detection: {
      caches: ['cookie'],
    },
  });

const createApp = services => {
  const {
    logger,
    config = defaultConfig,
    establishmentData = defaultEstablishmentData,
  } = services;

  const app = express();

  app.locals.config = config;

  // View Engine Configuration
  app.set('view engine', 'html');

  nunjucksSetup(app);
  app.set('json spaces', 2);

  // Configure Express for running behind proxies
  // https://expressjs.com/en/guide/behind-proxies.html
  app.set('trust proxy', true);

  // Server Configuration
  app.set('port', process.env.PORT || 3000);

  app.use(
    middleware.handle(i18next, {
      removeLngFromUrl: false,
    }),
  );

  // Secure code best practice - see:
  // 1. https://expressjs.com/en/advanced/best-practice-security.html,
  // 2. https://www.npmjs.com/package/helmet

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      referrerPolicy: { policy: ['no-referrer', 'same-origin'] },
    }),
  );

  app.use((req, res, next) => {
    const headerName = 'X-Request-Id';
    const oldValue = req.get(headerName);
    const id = oldValue === undefined ? randomUUID() : oldValue;

    res.set(headerName, id);
    req.id = id;

    next();
  });

  // Resource Delivery Configuration
  app.use(compression());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  //  Static Resources Configuration
  const cacheControl = { maxAge: config.staticResourceCacheDuration * 1000 };

  app.use(
    session({
      secret: config.cookieSecret,
      resave: false,
      saveUninitialized: true,
      maxAge: 4.32e7, // 12 Hours
    }),
  );
  // https://github.com/jaredhanson/passport/issues/904#issuecomment-1307558283
  // register regenerate & save after the cookieSession middleware initialization
  app.use((req, res, next) => {
    if (req.session && !req.session.regenerate) {
      req.session.regenerate = callback => {
        callback();
      };
    }
    if (req.session && !req.session.save) {
      req.session.save = callback => {
        callback();
      };
    }
    next();
  });

  [
    '../public',
    '../assets',
    '../assets/stylesheets',
    '../node_modules/govuk-frontend/dist/govuk/',
    '../node_modules/jquery/dist',
    '../node_modules/nunjucks/browser',
    '../node_modules/@ministryofjustice/frontend/moj/',
    '../node_modules/video.js/dist',
  ].forEach(dir => {
    app.use('/public', express.static(path.join(__dirname, dir), cacheControl));
  });

  app.use(
    '/assets',
    express.static(
      path.join(__dirname, '../node_modules/govuk-frontend/dist/govuk/assets'),
      cacheControl,
    ),
  );

  app.use(
    '/assets',
    express.static(
      path.join(
        __dirname,
        '/node_modules/@ministryofjustice/frontend/moj/assets',
      ),
      cacheControl,
    ),
  );

  app.use(
    '/favicon.ico',
    express.static(
      path.join(process.cwd(), `/assets/images/favicon.ico`),
      cacheControl,
    ),
  );

  // Don't cache dynamic resources
  app.use(noCache());

  // feature toggles
  app.use(featureToggleMiddleware(config.features));

  // Health end point
  app.use('/health', createHealthRouter(config));

  app.use(getEstablishmentFromUrl);
  app.use(configureEstablishment);

  app.use([setCurrentUser, setReturnUrl]);

  app.use(routes(services, establishmentData));
  // Add Sentry error handler to the Express app as per the latest version
  // https://docs.sentry.io/platforms/javascript/guides/express/migration/v7-to-v8/
  Sentry.setupExpressErrorHandler(app);

  app.use(renderErrors);

  // eslint-disable-next-line no-unused-vars
  function renderErrors(error, req, res, next) {
    if (error.response?.status === 403) {
      logger.warn(`Failed to find: ${error.message}`);
      logger.debug(error.stack);
      res.status(403);
      return res.render('pages/404', { title: 'Page not found' });
    }

    if (error instanceof NotFound) {
      logger.warn(`Failed to find: ${error.message}`);
      logger.debug(error.stack);
      res.status(404);
      return res.render('pages/404', { title: 'Page not found' });
    }

    logger.error(`Unhandled error - ${req.originalUrl} - ${error.message}`);
    logger.debug(error.stack);
    res.status(500);

    const locals = config.features.showStackTraces ? { error } : {};
    return res.render('pages/error', { ...locals, title: 'Error' });
  }

  return app;
};

module.exports = {
  createApp,
};
