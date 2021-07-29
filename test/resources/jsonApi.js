const href = 'http://cms.prg/jsonapi/node/not-used';

const jsonApiResponse = (results = []) => ({
  jsonapi: {
    version: '1.0',
    meta: {
      links: {
        self: {
          href: 'http://jsonapi.org/format/1.0/',
        },
      },
    },
  },
  data: results,
  links: { self: { href } },
});

module.exports = {
  jsonApiResponse,
};
