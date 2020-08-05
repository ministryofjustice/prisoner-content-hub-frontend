const { pathOr } = require('ramda');
// const esb = require('elastic-builder');
const config = require('../config');
const { searchResultFrom } = require('../utils/adapters');

function searchRepository(httpClient) {
  async function find({ query, page = 0, limit = 15, prison }) {
    const response = await httpClient.get(config.api.search, {
      query: {
        'page[offset]': page,
        'page[limit]': limit,
        'filter[or-group][group][conjunction]': 'OR',
        'filter[has-prison][condition][path]': 'prison_name',
        'filter[has-prison][condition][value]': prison,
        'filter[has-prison][condition][memberOf]': 'or-group',
        'filter[has-no-prison][condition][path]': 'prison_name',
        'filter[has-no-prison][condition][operator]': 'IS NULL',
        'filter[has-no-prison][condition][memberOf]': 'or-group',
        'filter[fulltext]': query,
      },
    });

    const results = pathOr([], ['data'], response);
    return results.map(searchResultFrom);
  }

  async function typeAhead({ query, limit = 5, prison }) {
    const response = await httpClient.get(config.api.search, {
      query: {
        'page[limit]': limit,
        'filter[or-group][group][conjunction]': 'OR',
        'filter[has-prison][condition][path]': 'prison_name',
        'filter[has-prison][condition][value]': prison,
        'filter[has-prison][condition][memberOf]': 'or-group',
        'filter[has-no-prison][condition][path]': 'prison_name',
        'filter[has-no-prison][condition][operator]': 'IS NULL',
        'filter[has-no-prison][condition][memberOf]': 'or-group',
        'filter[fulltext]': query,
      },
    });

    const results = pathOr([], ['data'], response);
    return results.map(searchResultFrom);
  }

  return {
    find,
    typeAhead,
  };
}

module.exports = {
  searchRepository,
};
