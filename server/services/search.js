const { SearchQuery } = require('../repositories/cmsQueries/searchQuery');

const createSearchService = ({ cmsApi }) => {
  function find(query, establishmentName) {
    if (query === '') {
      return [];
    }

    return cmsApi.get(new SearchQuery(establishmentName, query, 15));
  }

  function typeAhead(query, establishmentName) {
    if (query === '') {
      return [];
    }

    return cmsApi.get(new SearchQuery(establishmentName, query, 5));
  }

  return {
    find,
    typeAhead,
  };
};

module.exports = {
  createSearchService,
};
