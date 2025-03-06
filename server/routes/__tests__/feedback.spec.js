const request = require('supertest');
const {
  testApp: { setupApp, userSupplier },
  testData: { user },
} = require('../../../test/test-helpers');
const { logger } = require('../../utils/logger');

jest.mock('../../utils/logger');

const feedback = {
  title: 'Sports',
  url: 'http://bbc.com/sports',
  contentType: 'AUDIO',
  series: 'Football highlight',
  categories: 'Ball sports',
  topics: 'Fitness',
  sentiment: 'Like',
  comment: 'Cracking stuff!',
};

describe('POST /feedback', () => {
  const feedbackService = { sendFeedback: jest.fn() };
  describe('/feedback', () => {
    let app;

    beforeEach(() => {
      jest.resetAllMocks();
      app = setupApp({ feedbackService });
    });

    it('handles no feedback', () =>
      request(app)
        .post('/feedback/1234-5678')
        .send({})
        .expect(200)
        .then(response => {
          expect(response.text).toBe('');
        }));

    it('returns no response', () =>
      request(app)
        .post('/feedback/1234-5678')
        .send(feedback)
        .expect(200)
        .then(response => {
          expect(response.text).toBe('');
        }));

    it('sends feedback', () =>
      request(app)
        .post('/feedback/1234-5678')
        .send(feedback)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(200)
        .then(() => {
          expect(feedbackService.sendFeedback).toHaveBeenCalledWith({
            title: feedback.title,
            url: feedback.url,
            sessionId: 1234,
            establishment: 'BERWYN',
            feedbackId: '1234-5678',
            categories: feedback.categories,
            comment: feedback.comment,
            contentType: feedback.contentType,
            date: expect.anything(),
            topics: feedback.topics,
            sentiment: feedback.sentiment,
            series: feedback.series,
          });
        }));

    it('logs anon user', () =>
      request(app)
        .post('/feedback/1234-5678')
        .send(feedback)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(200)
        .then(() => {
          expect(logger.info).toHaveBeenCalledWith(
            "Prisoner 'anon' leaving feedback: 1234-5678",
          );
        }));

    it('logs real user', () => {
      userSupplier.mockReturnValue(user);

      return request(app)
        .post('/feedback/1234-5678')
        .send(feedback)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(200)
        .then(() => {
          expect(logger.info).toHaveBeenCalledWith(
            "Prisoner 'A1234BC' leaving feedback: 1234-5678",
          );
        });
    });
  });
});
