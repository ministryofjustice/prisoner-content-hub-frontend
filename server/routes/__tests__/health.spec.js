const request = require('supertest');

const { createHealthRouter } = require('../health');
const { setupBasicApp } = require('../../../test/test-helpers');

describe('GET /health', () => {
  it('returns the health status of the application', () => {
    const router = createHealthRouter();
    const app = setupBasicApp({
      buildInfo: {
        buildNumber: 'foo-number',
        gitRef: 'foo-ref',
        gitDate: 'foo-date',
      },
    });

    app.use('/health', router);

    return request(app)
      .get('/health')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).toStrictEqual({
          status: 'OK',
        });
      });
  });
});

describe('GET /health/readiness', () => {
  it('returns the readiness status of the application', () => {
    const router = createHealthRouter();
    const app = setupBasicApp({
      buildInfo: {
        buildNumber: 'foo-number',
        gitRef: 'foo-ref',
        gitDate: 'foo-date',
      },
    });

    app.use('/health/readiness', router);

    return request(app)
      .get('/health/readiness')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).toStrictEqual({
          status: 'OK',
        });
      });
  });
});
