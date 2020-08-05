require('dotenv').config();

const Sentry = require('@sentry/node');
const { getEnv } = require('./utils/index');

// Set up Sentry before (almost) everything else, so we can
// capture any exceptions during startup
Sentry.init({
  dsn: getEnv('SENTRY_DSN', ''),
});

const app = require('./server/index');
const { logger } = require('./server/utils/logger');

app.listen(app.get('port'), () => {
  logger.info(`Server listening on port ${app.get('port')}`);
});
