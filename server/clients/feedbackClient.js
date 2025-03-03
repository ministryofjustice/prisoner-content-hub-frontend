const knex = require('knex');
const knexFile = require('../../knexfile');
const { logger } = require('../utils/logger');

class FeedbackClient {
  constructor(configFile = knexFile) {
    try {
      this.connection = knex(configFile.feedback);
      logger.debug('Database connection established');
    } catch (error) {
      logger.error('Failed to connect to database', error);
    }
  }

  async postFeedback(feedback) {
    this.title = feedback.title;
    this.url = feedback.url;
    this.contentType = feedback.contentType;
    this.series = feedback.contentType;
    this.categories = feedback.categories;
    this.topics = feedback.topics;
    this.sentiment = feedback.sentiment;
    this.comment = feedback.comment;
    this.date = feedback.date;
    this.establishment = feedback.establishment;
    this.sessionId = feedback.sessionId;
    this.feedbackId = feedback.feedbackId;
    logger.info(this.date);

    try {
      return this.connection('feedback').insert({
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
    } catch (error) {
      logger.error('Database insert failed', error);
      return Promise.reject();
    }
  }
}

module.exports = { FeedbackClient };
