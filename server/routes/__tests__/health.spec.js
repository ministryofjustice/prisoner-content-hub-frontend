const request = require('supertest');
const express = require('express');

const { createHealthRouter } = require('../health');

jest.mock(
  '../../../build-info.json',
  () => ({
    buildNumber: 'foo-number',
    gitDate: 'foo-date',
    gitRef: 'foo-ref',
  }),
  { virtual: true },
);

describe('GET healthchecks', () => {
  let app;
  const buildNumber = 'foo-number';
  beforeEach(() => {
    app = express();
    app.use('/health', createHealthRouter());
  });
  it('returns the health status of the application on /health', () =>
    request(app)
      .get('/health')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).toStrictEqual({
          build: {
            buildNumber,
            gitDate: 'foo-date',
            gitRef: 'foo-ref',
          },
          healthy: true,
          uptime: expect.any(Number),
          version: buildNumber,
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
