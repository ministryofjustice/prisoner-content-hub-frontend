require('dotenv').config();
const config = require('./server/config');
// const { readFileSync } = require('node:fs')
// const path = require('node:path')

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  feedback: {
    client: 'pg',
    connection: {
      host: config.feedback.host,
      port: 5432,
      user: config.feedback.user,
      password: config.feedback.password,
      database: config.feedback.database,
      ssl: true,
      // ssl: {
      //   ca: readFileSync(path.join(__dirname, '../ca-certificate.crt')),
      // },
    },
  },
};
