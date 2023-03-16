const { createPagination } = require('../pagination');

describe('Pagination', () => {
  let data;
  let maxItemsPerPage;
  let query;

  beforeEach(() => {
    data = [
      {
        adjudicationNumber: 1111111,
        reportTime: '19 March 2017, 10.10am',
        numberOfCharges: 1,
      },
      {
        adjudicationNumber: 2222222,
        reportTime: '15 March 2017, 4.07pm',
        numberOfCharges: 1,
      },
      {
        adjudicationNumber: 3333333,
        reportTime: '14 March 2017, 1.51pm',
        numberOfCharges: 1,
      },
      {
        adjudicationNumber: 4444444,
        reportTime: '12 March 2017, 10.10am',
        numberOfCharges: 1,
      },
      {
        adjudicationNumber: 5555555,
        reportTime: '10 March 2017, 7.07pm',
        numberOfCharges: 1,
      },
      {
        adjudicationNumber: 6666666,
        reportTime: '10 March 2017, 3.47pm',
        numberOfCharges: 1,
      },
      {
        adjudicationNumber: 7777777,
        reportTime: '9 March 2017, 10.10am',
        numberOfCharges: 1,
      },
      {
        adjudicationNumber: 8888888,
        reportTime: '9 March 2017, 4.07pm',
        numberOfCharges: 1,
      },
      {
        adjudicationNumber: 9999999,
        reportTime: '8 March 2017, 2.10pm',
        numberOfCharges: 1,
      },
      {
        adjudicationNumber: 1010101,
        reportTime: '7 March 2017, 11.11am',
        numberOfCharges: 1,
      },
      {
        adjudicationNumber: 1121121,
        reportTime: '7 March 2017, 4.07pm',
        numberOfCharges: 1,
      },
      {
        adjudicationNumber: 1212121,
        reportTime: '4 March 2017, 1.51pm',
        numberOfCharges: 1,
      },
    ];
    maxItemsPerPage = 10;
    query = {};
  });

  afterEach(() => {
    data = [];
    maxItemsPerPage = 10;
    query = {};
  });

  it('should return the expected values when data, maxItemsPerPage, query values are not provided', () => {
    const { paginatedData, pageData } = createPagination({});
    expect(paginatedData).toEqual([]);
    expect(pageData).toEqual({});
  });

  it('should return paginated adjudications data', () => {
    const { paginatedData } = createPagination({
      data,
      maxItemsPerPage,
      query,
    });

    expect(paginatedData).toHaveLength(maxItemsPerPage);
    expect(paginatedData).toEqual(data.slice(0, 10));
  });

  it('should return the expected number of remaining paginated adjudication items', () => {
    const { paginatedData } = createPagination({
      data,
      maxItemsPerPage,
      query: {
        page: 2,
      },
    });

    expect(paginatedData).toHaveLength(2);
    expect(paginatedData).toEqual(data.slice(-2));
  });

  it('should return the expected pageData values', () => {
    const { pageData } = createPagination({
      data,
      maxItemsPerPage,
      query,
    });

    expect(pageData).toEqual({
      page: 1,
      totalPages: 2,
      min: 1,
      max: 10,
      totalCount: 12,
    });
  });

  it('should throw an error when data is not an Array', () => {
    expect(() =>
      createPagination({
        data: {},
        maxItemsPerPage,
        query,
      }),
    ).toThrow('data.slice is not a function');
  });
});
