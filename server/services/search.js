const utils = require('../utils');

const createSearchService = ({
  searchRepository,
  getEstablishmentFormattedName = utils.getEstablishmentFormattedName,
}) => {
  function find({ query, limit, from, establishmentId }) {
    const prison = getEstablishmentFormattedName(establishmentId);

    if (query === '') {
      return [];
    }

    return searchRepository.find({ query, limit, from, prison });
  }

  function typeAhead({ query, limit, establishmentId }) {
    const prison = getEstablishmentFormattedName(establishmentId);

    if (query === '') {
      return [];
    }

    return searchRepository.typeAhead({ query, limit, prison });
  }

  return {
    find,
    typeAhead,
  };
};

module.exports = {
  createSearchService,
};
