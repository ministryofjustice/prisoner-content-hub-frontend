const request = require('supertest');
const express = require('express');

const { createInfoRouter } = require('../info');

const mockActiveAgency = {
  "2343": {
    "name": "bedford",
    "displayName": "HMP Bedford",
    "youth": false,
    "agencyId": "BFI",
    "active": true
  },
}

const mockNoActiveAgencies = {
    "2343": {
    "name": "bedford",
    "displayName": "HMP Bedford",
    "youth": false,
    "agencyId": "BFI",
    "active": false
  },
}


describe('GET info', () => {
  let app;
  beforeEach(() => {
    app = express();
  });

  it('returns active agencies on /info', () => {
    app.use('/info', createInfoRouter(mockActiveAgency));
    request(app)
      .get('/info')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).toStrictEqual({
          activeAgencies: ['BFI']
        });
      })
  });

  it('returns an empty array on /info when there are no active agencies', () => {
    app.use('/info', createInfoRouter(mockNoActiveAgencies));
    request(app)
      .get('/info')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).toStrictEqual({
          activeAgencies: []
        });
      })
  });

  it('returns an empty array when no establishment data is present', () => {
    app.use('/info', createInfoRouter({}));
    request(app)
      .get('/info')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).toStrictEqual({
          activeAgencies: []
        });
      })
  });
});
