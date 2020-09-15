const request = require('supertest');

const { createApp } = require('../server/app');
const config = require('../server/config');
const { logger } = require('./test-helpers');

describe('App', () => {
  it('renders a 404 page correctly on invalid url', async () => {
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
    const error = new Error('broken kittens');
    const copy = config.dev;

    config.dev = false;
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
        expect(response.text).to.contain(
          'Sorry, there is a problem with this service',
        );
        expect(response.text).to.contain(
          '<code></code>',
          'The code block is not empty',
        );
        // restore config
        config.dev = copy;
      });
  });

  it('shows the stack trace on error pages', async () => {
    const error = new Error('Broken kittens');
    const copy = config.dev;

    config.dev = true;

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
        expect(res.text).to.contain('Broken kittens');
        expect(res.text).to.not.contain(
          'Sorry, there is a problem with this service',
        );
        expect(res.text).to.not.contain(
          '<code></code>',
          'The code block should not be empty',
        );
        expect(res.text).to.contain(
          'at Context.',
          'there should be an error in the code block',
        );

        // restore config
        config.dev = copy;
      });
  });

  it('contains the correct security headers per request', async () => {
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
    hubPromotedContentService: { hubPromotedContent: sinon.stub().returns([]) },
    hubFeaturedContentService: {
      hubFeaturedContent: sinon.stub().resolves([]),
    },
    hubMenuService: {
      navigationMenu: sinon.stub().returns({ mainMenu: [], topicsMenu: [] }),
      seriesMenu: sinon.stub().returns([]),
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
