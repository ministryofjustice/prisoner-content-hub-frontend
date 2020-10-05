const R = require('ramda');
const config = require('../config');
const { featuredContentTileResponseFrom } = require('../utils/adapters');

function hubFeaturedContentRepository(httpClient) {
  async function contentFor({ establishmentId } = {}) {
    const query = {
      _prison: establishmentId,
    };

    const response = await httpClient.get(config.apiV2.hubContentFeatured, {
      query,
    });

    if (!Array.isArray(response)) return [];

    return R.map(featuredContentTileResponseFrom, response);
  }

  return {
    contentFor,
  };
}

module.exports = {
  hubFeaturedContentRepository,
};
