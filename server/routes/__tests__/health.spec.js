const request = require('supertest');
const express = require('express');

const { createHealthRouter } = require('../health');

describe('GET healthchecks', () => {
  let config;
  let app;
  const BUILD_NUMBER = 'foo-number';
  const GIT_REF = 'foo-ref';
  const GIT_DATE = 'foo-date';
  beforeEach(() => {
    config = {
      buildInfo: {
        buildNumber: BUILD_NUMBER,
        gitRef: GIT_REF,
        gitDate: GIT_DATE,
      },
    };
    app = express();
    app.use('/health', createHealthRouter(config));
  });
  it('returns the health status of the application on /health', () =>
    request(app)
      .get('/health')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).toStrictEqual({
          build: {
            buildNumber: BUILD_NUMBER,
            gitDate: GIT_DATE,
            gitRef: GIT_REF,
          },
          healthy: true,
          uptime: expect.any(Number),
          version: BUILD_NUMBER,
        });
      }));
  it('returns the readiness status of the application', () =>
    request(app)
      .get('/health/readiness')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).toStrictEqual({
          status: 'OK',
        });
      }));
});
