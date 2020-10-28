const request = require('supertest');

const { createApp } = require('../server/app');
const config = require('../server/config');
const { logger } = require('./test-helpers');

describe('App', () => {
  it('renders a 404 page correctly on invalid url', async () => {
    config.auth.callbackPath = '/testPath';
    await request(app())
      .get('/unknown-url')
      .expect(404)
      .then(res => {
        expect(res.text).to.contain(
          'The page you are looking for could not be found',
        );
      });
  });

  it('hides the stack trace on error pages', async () => {
    config.auth.callbackPath = '/testPath';
    const error = {
      message: 'Something has gone horribly wrong',
      stack: 'beep-boop',
    };

    await request(
      app({
        hubFeaturedContentService: {
          hubFeaturedContent: sinon.stub().rejects(error),
        },
        hubMenuService: {
          tagsMenu: sinon.stub().resolves({}),
        },
        offenderService: {
          getOffenderDetailsFor: sinon.stub().resolves({}),
        },
      }),
    )
      .get('/')
      .expect(500)
      .then(response => {
        expect(response.text).to.not.contain(
          error.stack,
          'it should not show the error message',
        );
        expect(response.text).to.not.contain(
          error.stack,
          'it should not show the stack',
        );
      });
  });

  it('shows the stack trace on error pages', async () => {
    const error = {
      message: 'Something has gone horribly wrong',
      stack: 'beep-boop',
    };
    const previousConfiguration = JSON.stringify(config.features);

    config.auth.callbackPath = '/testPath';
    config.features.showStackTraces = true;

    await request(
      app({
        hubFeaturedContentService: {
          hubFeaturedContent: sinon.stub().rejects(error),
        },
        offenderService: {
          getEventsForToday: sinon.stub().resolves([]),
          getEventsFor: sinon.stub().resolves([]),
          getOffenderDetailsFor: sinon.stub().resolves({}),
        },
      }),
    )
      .get('/')
      .expect(500)
      .then(res => {
        expect(res.text).to.contain(
          error.message,
          'it should show the error message',
        );
        expect(res.text).to.contain(error.stack, 'it should show the stack');

        // restore config
        config.features = JSON.parse(previousConfiguration);
      });
  });

  it('contains the correct security headers per request', async () => {
    config.auth.callbackPath = '/testPath';
    await request(app())
      .get('/')
      .then(res => {
        expect(res.headers).to.have.property('x-dns-prefetch-control');
        expect(res.headers).to.have.property('x-frame-options');
        expect(res.headers).to.have.property('x-download-options');
        expect(res.headers).to.have.property('x-content-type-options');
        expect(res.headers).to.have.property('x-xss-protection');
      });
  });
});

function app(opts) {
  const services = {
    hubFeaturedContentService: {
      hubFeaturedContent: sinon.stub().resolves([]),
    },
    hubMenuService: {
      navigationMenu: sinon.stub().returns({ topicsMenu: [] }),
    },
    offenderService: {
      getOffenderDetailsFor: sinon.stub().resolves({}),
    },
    hubContentService: { contentFor: sinon.stub().resolves({}) },
    searchService: { find: sinon.stub() },
    logger,
    requestLogger: () => (req, res, next) => next(),
    ...opts,
  };
  return createApp(services);
}
