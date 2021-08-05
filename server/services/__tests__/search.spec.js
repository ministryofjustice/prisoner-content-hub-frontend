const { SearchQuery } = require('../../repositories/cmsQueries/searchQuery');
const { createSearchService } = require('../search');

describe('SearchService', () => {
  const cmsApi = {
    get: jest.fn(),
  };
  const getEstablishmentSearchName = jest
    .fn()
    .mockReturnValue('HMP Development');
  let service;

  beforeEach(() => {
    jest.resetAllMocks();
    getEstablishmentSearchName.mockReturnValue('HMP Development');

    service = createSearchService({
      cmsApi,
      getEstablishmentSearchName,
    });
  });

  describe('#find', () => {
    it('returns search results', async () => {
      cmsApi.get.mockResolvedValue(['result_1', 'result_2', 'result_3']);

      const result = await service.find({
        query: 'Test Query',
        establishmentId: 123,
      });

      expect(cmsApi.get).toHaveBeenCalledTimes(1);

      expect(cmsApi.get).toHaveBeenCalledWith(
        new SearchQuery('HMP Development', 'Test Query', 15),
      );

      expect(getEstablishmentSearchName).toHaveBeenCalledTimes(1);
      expect(getEstablishmentSearchName).toHaveBeenCalledWith(123);
      expect(Array.isArray(result)).toBe(true);
    });

    it('returns empty when there is no query', async () => {
      cmsApi.get.mockResolvedValue([]);

      const results = await service.find({
        query: '',
        establishmentId: 123,
      });

      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
      expect(cmsApi.get).not.toHaveBeenCalled();
    });
  });

  describe('#typeAhead', () => {
    it('returns search results', async () => {
      cmsApi.get.mockResolvedValue(['result_1', 'result_2', 'result_3']);

      const result = await service.typeAhead({
        query: 'Test Query',
        establishmentId: 123,
      });

      expect(cmsApi.get).toHaveBeenCalledTimes(1);

      expect(cmsApi.get).toHaveBeenCalledWith(
        new SearchQuery('HMP Development', 'Test Query', 5),
      );

      expect(getEstablishmentSearchName).toHaveBeenCalledTimes(1);
      expect(getEstablishmentSearchName).toHaveBeenCalledWith(123);
      expect(Array.isArray(result)).toBe(true);
    });

    it('returns empty when there is no query', async () => {
      cmsApi.get.mockResolvedValue([]);

      const results = await service.typeAhead({
        query: '',
        establishmentId: 123,
      });

      expect(cmsApi.get).not.toHaveBeenCalled();
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
    });
  });
});
