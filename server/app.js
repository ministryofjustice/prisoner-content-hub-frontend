// eslint-disable-next-line import/order
const config = require('./config');

const express = require('express');
const addRequestId = require('express-request-id')();
const compression = require('compression');
const helmet = require('helmet');
const noCache = require('nocache');
const nunjucks = require('nunjucks');
const path = require('path');
const sassMiddleware = require('node-sass-middleware');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const { v4: uuid } = require('uuid');
const passport = require('passport');
const AzureAdOAuth2Strategy = require('passport-azure-ad-oauth2');

const { createIndexRouter } = require('./routes/index');
const { createTopicsRouter } = require('./routes/topics');
const { createTimetableRouter } = require('./routes/timetable');
const { createHealthRouter } = require('./routes/health');
const { createContentRouter } = require('./routes/content');
const { createVisitsRouter } = require('./routes/visits');
const { createIncentivesRouter } = require('./routes/incentives');
const { createMoneyRouter } = require('./routes/money');
const { createTagRouter } = require('./routes/tags');
const { createGamesRouter } = require('./routes/games');
const { createAnalyticsRouter } = require('./routes/analytics');
const { createFeedbackRouter } = require('./routes/feedback');
const { createGettingAJobRouter } = require('./routes/gettingAJob');
const { createSearchRouter } = require('./routes/search');
const { createAuthRouter } = require('./routes/auth');
const { createNprRouter } = require('./routes/npr');
const { featureToggleMiddleware } = require('./middleware/featureToggle');
const {
  configureEstablishment,
} = require('./middleware/configureEstablishment');

const { User } = require('./auth/user');
const {
  createSignOutMiddleware,
  createSignInMiddleware,
  createSignInCallbackMiddleware,
} = require('./auth/middleware');

const {
  getEstablishmentId,
  getEstablishmentWorkingInUrls,
} = require('./utils');

const createApp = ({
  logger,
  requestLogger,
  hubFeaturedContentService,
  hubMenuService,
  hubContentService,
  hubTagsService,
  healthService,
  offenderService,
  searchService,
  analyticsService,
  feedbackService,
}) => {
  const app = express();

  const appViews = [
    path.join(__dirname, '../node_modules/govuk-frontend/'),
    path.join(__dirname, '/views/'),
  ];

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

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

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

  passport.serializeUser((user, done) => done(null, user.serialize()));
  passport.deserializeUser((serializedUser, done) =>
    done(null, User.deserialize(serializedUser)),
  );
  passport.use(
    new AzureAdOAuth2Strategy(
      {
        clientID: config.auth.clientId,
        clientSecret: config.auth.clientSecret,
        callbackURL: config.auth.callbackUrl,
      },
      (accessToken, refreshToken, params, profile, done) =>
        done(null, User.from(params.id_token)),
    ),
  );
  app.use(passport.initialize());
  app.use(passport.session());

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

  // GovUK Template Configuration
  const establishmentId = getEstablishmentId(config.establishmentName);
  app.locals.asset_path = '/public/';
  app.locals.config = {
    ...config,
    establishmentId,
  };

  // Don't cache dynamic resources
  app.use(noCache());

  app.use(requestLogger());

  // feature toggles
  app.use(featureToggleMiddleware(config.features));

  // establishment toggle
  app.use(configureEstablishment());

  // Health end point
  app.use('/health', createHealthRouter({ healthService }));

  app.use((req, res, next) => {
    if (req.session && !req.session.id) {
      req.session.id = uuid();
    }
    res.locals.feedbackId = uuid();
    next();
  });
  // Routing

  app.use(
    '/',
    createIndexRouter({
      logger,
      hubFeaturedContentService,
      offenderService,
      config,
    }),
  );

  app.use('/topics', createTopicsRouter({ hubMenuService }));

  app.use(
    '/auth',
    createAuthRouter({
      logger,
      signIn: createSignInMiddleware(),
      signInCallback: createSignInCallbackMiddleware({ offenderService }),
      signOut: createSignOutMiddleware(),
    }),
  );

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

  app.use(
    getEstablishmentWorkingInUrls(),
    createGettingAJobRouter({
      hubContentService,
      hubMenuService,
    }),
  );
  app.use('/search', createSearchRouter({ searchService, analyticsService }));

  app.use('*', (req, res) => {
    res.status(404);
    res.render('pages/404');
  });

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
