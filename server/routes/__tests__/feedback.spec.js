const request = require('supertest');
const { createFeedbackRouter } = require('../feedback');
const {
  setupBasicApp,
  consoleLogError,
} = require('../../../test/test-helpers');

describe('POST /feedback', () => {
  const feedbackService = { sendFeedback: jest.fn() };
  describe('/feedback', () => {
    let app;

    beforeEach(() => {
      jest.resetAllMocks();
      app = setupBasicApp();
      app.use((req, res, next) => {
        req.session = {
          id: 1234,
          establishmentId: 123,
          establishmentName: 'berwyn',
        };
        next();
      });
      app.use('/feedback', createFeedbackRouter({ feedbackService }));
      app.use(consoleLogError);
    });

    it('returns no response', () =>
      request(app)
        .post('/feedback/1234-5678')
        .send({})
        .expect(200)
        .then(response => {
          expect(response.text).toBe('');
        }));

    it('sends feedback', () => {
      const body = {
        title: 'Sports',
        url: 'http://bbc.com/sports',
        contentType: 'audio',
        series: 'Football highlight',
        categories: 'Ball sports',
        secondaryTags: 'Fitness',
        sentiment: 'Like',
        comment: 'Cracking stuff!',
      };

      return request(app)
        .post('/feedback/1234-5678')
        .send(body)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(200)
        .then(() => {
          expect(feedbackService.sendFeedback).toHaveBeenCalledWith({
            title: body.title,
            url: body.url,
            sessionId: 1234,
            establishment: 'BERWYN',
            feedbackId: '1234-5678',
            categories: body.categories,
            comment: body.comment,
            contentType: body.contentType,
            date: expect.anything(),
            secondaryTags: body.secondaryTags,
            sentiment: body.sentiment,
            series: body.series,
          });
        });
    });
  });
});
