require('dotenv').config();
const { readFileSync } = require('node:fs');
const path = require('node:path');
const config = require('./server/config');

let ssl = true;

if (config.isProduction === false) {
  ssl = {
    rejectUnauthorized: false,
    cert: readFileSync(path.join(__dirname, './global-bundle.pem')),
  };
}

module.exports = {
  feedback: {
    client: 'pg',
    connection: {
      host: config.feedback.host,
      port: 5432,
      user: config.feedback.user,
      password: config.feedback.password,
      database: config.feedback.database,
      ssl,
    },
  },
};
