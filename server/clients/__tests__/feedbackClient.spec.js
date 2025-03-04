const knex = require('knex');
const { FeedbackClient } = require('../feedbackClient');

jest.mock('knex');

const mockInsert = jest.fn();
const querybuilder = {
  insert: mockInsert.mockReturnThis(),
};
const mockKnex = jest.fn().mockReturnValue(querybuilder);
knex.mockReturnValue(mockKnex);

describe('FeedbackClient', () => {
  describe('.postFeedback', () => {
    it('should generate a basic auth token', async () => {
      const client = new FeedbackClient(true);
      const feedbackData = {
        title: 'some title',
        url: 'some url',
        contentType: 'some content type',
        series: 'some series',
        categories: 'some categories',
        topics: 'some topic',
        sentiment: 'some sentiment',
        comment: 'some comment',
        date: 'some date',
        establishment: 'some establishment',
        sessionId: 'some sessionId',
        feedbackId: 'some feedbackId',
      };

      await client.postFeedback(feedbackData);

      expect(mockInsert).toBeCalledWith(feedbackData);
    });
  });
});
