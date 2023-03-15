const createPagination = ({ data, maxItemsPerPage, query }) => {
  let paginatedData = [];
  let pageData = {};

  if (!data || !maxItemsPerPage || !query)
    return {
      paginatedData,
      pageData,
    };

  try {
    const totalCount = data.length;
    const totalPages = Math.ceil(totalCount / maxItemsPerPage);
    const pageNumber = Math.round(query.page) || 1;
    const page = pageNumber > 0 && pageNumber <= totalPages ? pageNumber : 1;
    const max = Math.min(page * maxItemsPerPage, totalCount);
    const min = (page - 1) * maxItemsPerPage + 1;
    pageData = { page, totalPages, min, max, totalCount };
    paginatedData = data.slice(min - 1, max);

    return {
      paginatedData,
      pageData,
    };
  } catch (error) {
    throw error.message;
  }
};

module.exports = {
  createPagination,
};
