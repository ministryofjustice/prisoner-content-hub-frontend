const createSearchService = ({ searchRepository }) => {
  function find({ query, limit, from, establishmentName }) {
    if (query === '') {
      return [];
    }

    return searchRepository.find({ query, limit, from, establishmentName });
  }

  function typeAhead({ query, limit, establishmentName }) {
    if (query === '') {
      return [];
    }

    return searchRepository.typeAhead({ query, limit, establishmentName });
  }

  return {
    find,
    typeAhead,
  };
};

module.exports = {
  createSearchService,
};
