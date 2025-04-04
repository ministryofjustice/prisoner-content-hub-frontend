const knex = require('knex');
const { readFileSync } = require('node:fs');
const path = require('node:path');

const config = require('../config');

const { logger } = require('../utils/logger');

class FeedbackClient {
  constructor(
    sslConfig = {
      rejectUnauthorized: false,
      cert: readFileSync(path.join(__dirname, '../../global-bundle.pem')),
    },
  ) {
    this.config = {
      client: 'pg',
      connection: {
        host: config.feedback.host,
        port: 5432,
        user: config.feedback.user,
        password: config.feedback.password,
        database: config.feedback.database,
        ssl: sslConfig,
      },
    };

    try {
      this.connection = knex(this.config);
      logger.debug('Database connection established');
    } catch (error) {
      logger.error('Failed to connect to database', error);
    }
  }

  async postFeedback(feedback) {
    this.title = `${feedback.title}`;
    this.url = `${feedback.url}`;
    this.contentType = `${feedback.contentType}`;
    this.series = `${feedback.series}`;
    this.categories = `${feedback.categories}`;
    this.topics = `${feedback.topics}`;
    this.sentiment = `${feedback.sentiment}`;
    this.comment = `${feedback.comment}`;
    this.date = `${feedback.date}`;
    this.establishment = `${feedback.establishment}`;
    this.sessionId = `${feedback.sessionId}`;
    this.feedbackId = `${feedback.feedbackId}`;

    try {
      const insertResult = await this.connection('feedback').insert({
        title: this.title,
        url: this.url,
        contentType: this.contentType,
        series: this.series,
        categories: this.categories,
        topics: this.topics,
        sentiment: this.sentiment,
        comment: this.comment,
        date: this.date,
        establishment: this.establishment,
        sessionId: this.sessionId,
        feedbackId: this.feedbackId,
      });

      return insertResult;
    } catch (error) {
      logger.error('Database insert failed', error);
      return Promise.reject();
    }
  }
}

module.exports = { FeedbackClient };
