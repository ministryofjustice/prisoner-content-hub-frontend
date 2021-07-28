const utils = require('../utils');
const { SearchQuery } = require('../repositories/cmsQueries/searchQuery');

const createSearchService = ({
  cmsApi,
  getEstablishmentSearchName = utils.getEstablishmentSearchName,
}) => {
  function find({ query, establishmentId }) {
    const prison = getEstablishmentSearchName(establishmentId);

    if (query === '') {
      return [];
    }

    return cmsApi.get(new SearchQuery(prison, query, 15));
  }

  function typeAhead({ query, establishmentId }) {
    const prison = getEstablishmentSearchName(establishmentId);

    if (query === '') {
      return [];
    }

    return cmsApi.get(new SearchQuery(prison, query, 5));
  }

  return {
    find,
    typeAhead,
  };
};

module.exports = {
  createSearchService,
};
