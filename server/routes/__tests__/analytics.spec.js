const request = require('supertest');

jest.mock('@sentry/node');

const { createAnalyticsRouter } = require('../analytics');
const { setupBasicApp } = require('../../../test/test-helpers');
const config = require('../../config');

describe('analytics', () => {
  describe('POST /page', () => {
    describe('on error', () => {
      beforeEach(() => {
        config.singleHostName = 'localhost';
        jest.clearAllMocks();
      });

      it('passes caught exceptions to next', async () => {
        const analyticsService = {
          sendPageTrack: jest.fn().mockRejectedValue('💥'),
        };
        const router = createAnalyticsRouter({ analyticsService });
        const app = setupBasicApp();

        app.use('/analytics', router);

        await request(app).post('/analytics/page').expect(500);
      });
    });

    describe('on success', () => {
      const getSessionMiddleware = (req, res, next) => {
        req.session = {
          establishmentId: 123,
          establishmentName: 'berwyn',
          id: 'abc123',
        };
        next();
      };

      let app;
      let router;
      const analyticsService = {
        sendPageTrack: jest.fn().mockResolvedValue({}),
      };

      beforeEach(() => {
        router = createAnalyticsRouter({ analyticsService });
        app = setupBasicApp();
      });

      it('raises page track', () => {
        app.use(getSessionMiddleware);
        app.use('/analytics/', router);
        return request(app)
          .post('/analytics/page')
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .send({
            page: '/content/12114',
            title: 'D&amp;I Wayland | Sam Plays Joplin',
            userAgent: 'Mozilla/5.0',
            screen: '1680x1050',
            viewport: '1680x882',
            categories: 'Informational',
            topics: 'Black lives',
            series: 'Diversity and Inclusion',
          })
          .expect(200)
          .expect(() => {
            expect(analyticsService.sendPageTrack).toHaveBeenCalledWith({
              categories: 'Informational',
              hostname: 'berwyn.localhost',
              page: '/content/12114',
              screen: '1680x1050',
              topics: 'Black lives',
              series: 'Diversity and Inclusion',
              sessionId: 'abc123',
              title: 'D&amp;I Wayland | Sam Plays Joplin',
              userAgent: 'Mozilla/5.0',
              viewport: '1680x882',
            });
          });
      });
    });
  });
});
