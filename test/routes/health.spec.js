const request = require('supertest');

const { createHealthRouter } = require('../../server/routes/health');
const { setupBasicApp } = require('../test-helpers');

describe('GET /health/liveness', () => {
  it('returns the health status of the application', () => {
    const healthService = {};
    const router = createHealthRouter({ healthService });
    const app = setupBasicApp({
      buildInfo: {
        buildNumber: 'foo-number',
        gitRef: 'foo-ref',
        gitDate: 'foo-date',
      },
    });

    app.use('/health', router);

    return request(app)
      .get('/health/liveness')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).eql({
          status: 'OK',
        });
      });
  });
});

describe('GET /health/readiness', () => {
  it('returns the health status of the application', () => {
    const healthService = {
      status: sinon.stub().returns({
        status: 'OK',
        dependencies: {
          foo: 'OK',
        },
      }),
    };
    const router = createHealthRouter({ healthService });
    const app = setupBasicApp({
      buildInfo: {
        buildNumber: 'foo-number',
        gitRef: 'foo-ref',
        gitDate: 'foo-date',
      },
    });

    app.use('/health', router);

    return request(app)
      .get('/health/readiness')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).eql({
          buildNumber: 'foo-number',
          gitRef: 'foo-ref',
          gitDate: 'foo-date',
          status: 'OK',
          dependencies: {
            foo: 'OK',
          },
        });
      });
  });
});
