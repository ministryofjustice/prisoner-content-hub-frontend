const R = require('ramda');

const { logger } = require('../utils/logger');
const config = require('../config');

const { featuredContentResponseFrom } = require('../utils/adapters');

function categoryFeaturedContentRepository(httpClient) {
  async function contentFor({ categoryId, establishmentId, number = 8 } = {}) {
    const endpoint = `${config.api.hubCategoryFeatured}`;
    const query = {
      _number: number,
      _category: categoryId,
      _prison: establishmentId,
    };

    if (!categoryId) {
      logger.error(
        `CategoryFeaturedContentRepository (contentFor) - No Category ID passed`,
      );
      return [];
    }

    const response = await httpClient.get(endpoint, { query });

    if (!Array.isArray(response)) {
      return [];
    }

    return R.map(featuredContentResponseFrom, response);
  }

  return {
    contentFor,
  };
}

module.exports = {
  categoryFeaturedContentRepository,
};
