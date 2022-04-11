const bunyan = require('bunyan');
const bunyanFormat = require('bunyan-format');
const config = require('../config');

const formatOut = bunyanFormat({ outputMode: 'short', color: true });

const logger = bunyan.createLogger({
  name: 'Prisoner Content Hub Frontend',
  level: config.logLevel,
  stream: formatOut,
});

module.exports = { logger };
