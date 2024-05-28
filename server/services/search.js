const { SearchQuery } = require('../repositories/cmsQueries/searchQuery');

const createSearchService = ({ cmsApi }) => {
  const isInvalid = query => !query || query === '' || query.length > 50;
  const sanitise = query => query.replace(/[^a-zA-Z0-9';,\-()!"]+/g, ' ');

  function find(query, establishmentName) {
    if (isInvalid(query)) {
      return [];
    }

    return cmsApi.get(new SearchQuery(establishmentName, sanitise(query), 15));
  }

  function typeAhead(query, establishmentName) {
    if (isInvalid(query)) {
      return [];
    }

    return cmsApi.get(new SearchQuery(establishmentName, sanitise(query), 5));
  }

  return {
    isInvalid,
    sanitise,
    find,
    typeAhead,
  };
};

module.exports = {
  createSearchService,
};
