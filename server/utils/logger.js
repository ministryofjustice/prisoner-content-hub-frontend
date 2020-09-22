const { format, createLogger, transports } = require('winston');

const { combine, logstash, timestamp, json } = format;
const morgan = require('morgan');
const config = require('../config');

const loggingTransports = [new transports.Console({ level: 'info' })];
const exceptionTransports = [new transports.Console({ level: 'info' })];

const logLevel = config.isProduction ? 'info' : 'debug';

const logger = createLogger({
  level: logLevel,
  format: combine(timestamp(), json(), logstash()),
  transports: loggingTransports,
  exceptionHandlers: exceptionTransports,
  exitOnError: true,
});

logger.info(`Logger level - "${logLevel}"`);

module.exports = {
  logger,
  requestLogger: (loggingFormat = 'tiny') =>
    morgan(loggingFormat, {
      stream: { write: message => logger.info(message) },
    }),
};
