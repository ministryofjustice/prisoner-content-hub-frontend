const express = require('express');
const addRequestId = require('express-request-id')();
const compression = require('compression');
const helmet = require('helmet');
const noCache = require('nocache');
const nunjucks = require('nunjucks');
const path = require('path');
const sassMiddleware = require('node-sass-middleware');
const session = require('cookie-session');
const passport = require('passport');
const AzureAdOAuth2Strategy = require('passport-azure-ad-oauth2');
const { path: ramdaPath, pathOr } = require('ramda');
const Sentry = require('@sentry/node');

const { createIndexRouter } = require('./routes/index');
const { createTopicsRouter } = require('./routes/topics');
const { createTimetableRouter } = require('./routes/timetable');
const { createHealthRouter } = require('./routes/health');
const { createContentRouter } = require('./routes/content');
const { createVisitsRouter } = require('./routes/visits');
const { createIncentivesRouter } = require('./routes/incentives');
const { createMoneyRouter } = require('./routes/money');
const { createProfileRouter } = require('./routes/profile');
const { createTagRouter } = require('./routes/tags');
const { createGamesRouter } = require('./routes/games');
const { createAnalyticsRouter } = require('./routes/analytics');
const { createFeedbackRouter } = require('./routes/feedback');
const { createSearchRouter } = require('./routes/search');
const { createAuthRouter } = require('./routes/auth');
const { createNprRouter } = require('./routes/npr');
const { featureToggleMiddleware } = require('./middleware/featureToggle');
const {
  configureEstablishment,
} = require('./middleware/configureEstablishment');

const { User } = require('./auth/user');
const defaultConfig = require('./config');
const defaultEstablishmentData = require('./content/establishmentData.json');
const defaultAuthMiddleware = require('./auth/middleware');

const createApp = ({
  logger,
  requestLogger,
  hubFeaturedContentService,
  hubMenuService,
  hubContentService,
  hubTagsService,
  offenderService,
  prisonerInformationService,
  searchService,
  analyticsService,
  feedbackService,
  config = defaultConfig,
  establishmentData = defaultEstablishmentData,
  authMiddleware = defaultAuthMiddleware,
}) => {
  const app = express();

  const appViews = [
    path.join(__dirname, '../node_modules/govuk-frontend/'),
    path.join(__dirname, '/views/'),
  ];

  app.locals.config = config;

  // View Engine Configuration
  app.set('views', path.join(__dirname, '../server/views'));
  app.set('view engine', 'html');
  nunjucks.configure(appViews, {
    express: app,
    autoescape: true,
  });

  app.set('json spaces', 2);

  // Configure Express for running behind proxies
  // https://expressjs.com/en/guide/behind-proxies.html
  app.set('trust proxy', true);

  // Server Configuration
  app.set('port', process.env.PORT || 3000);

  // Set up Sentry before (almost) everything else, so we can
  // capture any exceptions during startup
  Sentry.init();
  app.use(Sentry.Handlers.requestHandler());

  // Secure code best practice - see:
  // 1. https://expressjs.com/en/advanced/best-practice-security.html,
  // 2. https://www.npmjs.com/package/helmet

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

  app.use(addRequestId);

  // Resource Delivery Configuration
  app.use(compression());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  if (!config.isProduction) {
    app.use(
      '/public',
      sassMiddleware({
        src: path.join(__dirname, '../assets/sass'),
        dest: path.join(__dirname, '../assets/stylesheets'),
        debug: false,
        outputStyle: 'compressed',
        prefix: '/stylesheets/',
      }),
    );
  }

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

  [
    '../public',
    '../assets',
    '../assets/stylesheets',
    '../node_modules/govuk-frontend/govuk/',
    '../node_modules/jquery/dist',
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

  app.use('/favicon.ico', express.static(path.join(process.cwd(), `/assets/images/favicon.ico`), cacheControl))

  // Don't cache dynamic resources
  app.use(noCache());

  app.use(requestLogger());

  // feature toggles
  app.use(featureToggleMiddleware(config.features));

  // establishment toggle
  app.use(configureEstablishment());

  // Health end point
  app.use('/health', createHealthRouter());

  if (config.features.useMockAuth) {
    app.use('*', (req, res, next) => {
      const serializedUser = ramdaPath(['session', 'passport', 'user'], req);
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
            callbackURL: `https://${pathOr(
              'localhost',
              ['headers', 'host'],
              req,
            )}${config.auth.callbackPath}`,
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

  // Routing
  if (!process.env.HOTJAR_ID) {
    logger.warn('HOTJAR_ID not set');
    Sentry.captureMessage('HOTJAR_ID not set', 'warning');
  }

  app.use((req, res, next) => {
    const hotJarId = process.env.HOTJAR_ID;
    res.locals.hotJarId = hotJarId;
    next();
  });

  app.use(
    '/',
    createIndexRouter({
      logger,
      hubFeaturedContentService,
      offenderService,
      config,
      establishmentData,
    }),
  );

  app.use('/topics', createTopicsRouter({ hubMenuService }));

  app.use('/timetable', createTimetableRouter({ offenderService }));

  app.use(
    '/visits',
    createVisitsRouter({
      hubContentService,
      offenderService,
    }),
  );

  app.use(
    '/incentives',
    createIncentivesRouter({
      hubContentService,
      offenderService,
    }),
  );

  app.use(
    '/money',
    createMoneyRouter({
      hubContentService,
      offenderService,
      prisonerInformationService,
    }),
  );

  app.use(
    '/profile',
    createProfileRouter({
      hubContentService,
      offenderService,
      prisonerInformationService,
    }),
  );

  app.use(
    '/content',
    createContentRouter({
      hubContentService,
      analyticsService,
    }),
  );

  app.use('/npr', createNprRouter());
  app.use('/tags', createTagRouter({ hubTagsService }));
  app.use('/games', createGamesRouter());
  app.use('/analytics', createAnalyticsRouter({ analyticsService }));
  app.use('/feedback', createFeedbackRouter({ feedbackService }));
  app.use('/search', createSearchRouter({ searchService, analyticsService }));

  app.use('*', (req, res) => {
    res.status(404);
    res.render('pages/404');
  });

  // the sentry error handler has to be placed between our controllers and our error handler
  // https://docs.sentry.io/platforms/node/guides/express/
  app.use(Sentry.Handlers.errorHandler());

  app.use(renderErrors);

  // eslint-disable-next-line no-unused-vars
  function renderErrors(error, req, res, next) {
    logger.error(`Unhandled error - ${error.message}`);
    logger.debug(error.stack);
    res.status(error.status || 500);

    const locals = {};

    if (config.features.showStackTraces) {
      locals.error = error;
    }

    res.render('pages/error', locals);
  }

  return app;
};

module.exports = {
  createApp,
};
