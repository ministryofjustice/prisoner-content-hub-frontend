const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    Sentry.httpIntegration({ tracing: true }),
    Sentry.expressIntegration,
  ],

  tracesSampler: samplingContext => {
    const transactionName = samplingContext?.name;
    return transactionName &&
      (transactionName.includes('/health') ||
        transactionName.includes('/public/') ||
        transactionName.includes('/assets/') ||
        transactionName.includes('/analytics/page') ||
        transactionName.includes('/analytics/event'))
      ? 0
      : 0.05;
  },
});
