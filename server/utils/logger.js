const bunyan = require('bunyan');
const bunyanFormat = require('bunyan-format');
const config = require('../config');

const formatOut = bunyanFormat({ outputMode: 'short', color: true });

const logger = bunyan.createLogger({
  name: 'Prisoner Content Hub Frontend',
  stream: formatOut,
});
logger.level = config.logLevel;

module.exports = { logger };
