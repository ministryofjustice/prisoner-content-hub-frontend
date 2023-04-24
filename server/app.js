const express = require('express');
const compression = require('compression');
const uuid = require('uuid');
const helmet = require('helmet');
const noCache = require('nocache');
const path = require('path');
const session = require('cookie-session');
const passport = require('passport');
const AzureAdOAuth2Strategy = require('passport-azure-ad-oauth2');
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const nunjucksSetup = require('./utils/nunjucksSetup');

const { createHealthRouter } = require('./routes/health');
const { createAuthRouter } = require('./routes/auth');

const { featureToggleMiddleware } = require('./middleware/featureToggle');
const getEstablishmentFromUrl = require('./middleware/getEstablishmentFromUrl');
const configureEstablishment = require('./middleware/configureEstablishment');

const { User } = require('./auth/user');
const defaultConfig = require('./config');
const defaultEstablishmentData = require('./content/establishmentData.json');
const defaultAuthMiddleware = require('./auth/middleware');
const routes = require('./routes');
const { NotFound } = require('./repositories/apiError');
const setCurrentUser = require('./middleware/setCurrentUser');
const setReturnUrl = require('./middleware/setReturnUrl');

const createApp = services => {
  const {
    logger,
    offenderService,
    analyticsService,
    config = defaultConfig,
    establishmentData = defaultEstablishmentData,
    authMiddleware = defaultAuthMiddleware,
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

  // Set up Sentry before (almost) everything else, so we can capture any exceptions during startup
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({ app }),
    ],

    tracesSampler: samplingContext => {
      const transactionName = samplingContext?.transactionContext?.name;
      return transactionName &&
        (transactionName.includes('/health') ||
          transactionName.includes('/public/') ||
          transactionName.includes('/assets/') ||
          transactionName.includes('/analytics/page') ||
          transactionName.includes('/analytics/event'))
        ? 0
        : 0.5;
    },
  });
  app.use(Sentry.Handlers.requestHandler());

  // TracingHandler creates a trace for every incoming request
  app.use(Sentry.Handlers.tracingHandler());

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
    const id = oldValue === undefined ? uuid.v4() : oldValue;

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
    '../node_modules/govuk-frontend/govuk/',
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
      path.join(__dirname, '../node_modules/govuk-frontend/govuk/assets'),
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

  // establishment toggle
  app.use(getEstablishmentFromUrl);

  if (config.features.useMockAuth) {
    app.use('*', (req, res, next) => {
      const serializedUser = req.session?.passport?.user;
      if (serializedUser) {
        req.user = User.deserialize(serializedUser);
      }
      next();
    });
    app.use(
      '/auth',
      createAuthRouter({
        logger,
        signIn: authMiddleware.createMockSignIn({
          offenderService,
        }),
        signInCallback: (req, res) => res.send('Not Implemented'),
        signOut: authMiddleware.createMockSignOut(),
      }),
    );
  } else {
    passport.serializeUser((user, done) => done(null, user.serialize()));
    passport.deserializeUser((serializedUser, done) =>
      done(null, User.deserialize(serializedUser)),
    );
    app.use((req, res, next) => {
      passport.use(
        new AzureAdOAuth2Strategy(
          {
            clientID: config.auth.clientId,
            clientSecret: config.auth.clientSecret,
            callbackURL: `${req.protocol}://${
              req.headers?.host || 'localhost'
            }${config.auth.callbackPath}`,
          },
          (accessToken, refreshToken, params, profile, done) =>
            done(null, User.from(params.id_token)),
        ),
      );
      next();
    });
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(
      '/auth',
      createAuthRouter({
        logger,
        signIn: authMiddleware.createSignInMiddleware(),
        signInCallback: authMiddleware.createSignInCallbackMiddleware({
          offenderService,
          analyticsService,
          logger,
        }),
        signOut: authMiddleware.createSignOutMiddleware({
          analyticsService,
          logger,
        }),
      }),
    );
  }

  app.use((req, res, next) => {
    if (!req.session?.establishmentName) {
      if (!req.user) {
        return res.redirect(`/auth/sign-in?returnUrl=${req.originalUrl}`);
      }
      req.session.isSignedIn = true;
    }
    return next();
  });

  // establishment toggle
  app.use(configureEstablishment);

  app.use([setCurrentUser, setReturnUrl]);

  app.use(routes(services, establishmentData));
  // the sentry error handler has to be placed between our controllers and our error handler
  // https://docs.sentry.io/platforms/node/guides/express/
  app.use(
    Sentry.Handlers.errorHandler({
      shouldHandleError(error) {
        return !(error instanceof NotFound);
      },
    }),
  );

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
