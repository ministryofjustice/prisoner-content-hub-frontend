require('dotenv').config();
const { readFileSync } = require('node:fs');
const path = require('node:path');
const config = require('./server/config');

let ssl = true;

if (process.env.LOCAL_ENV === 'true') {
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
