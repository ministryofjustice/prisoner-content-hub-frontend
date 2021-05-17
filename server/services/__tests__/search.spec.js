const { createSearchService } = require('../search');

describe('SearchService', () => {
  const searchRepository = {
    find: jest.fn(),
    typeAhead: jest.fn(),
  };
  const getEstablishmentFormattedName = jest
    .fn()
    .mockReturnValue('HMP Development');
  let service;

  beforeEach(() => {
    jest.resetAllMocks();
    getEstablishmentFormattedName.mockReturnValue('HMP Development');

    service = createSearchService({
      searchRepository,
      getEstablishmentFormattedName,
    });
  });

  describe('#find', () => {
    it('returns search results', async () => {
      searchRepository.find.mockResolvedValue([
        'result_1',
        'result_2',
        'result_3',
      ]);

      const result = await service.find({
        query: 'Test Query',
        establishmentId: 123,
        limit: 10,
        from: 5,
      });

      expect(searchRepository.find).toHaveBeenCalledTimes(1);

      expect(searchRepository.find).toHaveBeenCalledWith({
        query: 'Test Query',
        prison: 'HMP Development',
        limit: 10,
        from: 5,
      });

      expect(getEstablishmentFormattedName).toHaveBeenCalledTimes(1);
      expect(getEstablishmentFormattedName).toHaveBeenCalledWith(123);
      expect(Array.isArray(result)).toBe(true);
    });

    it('returns empty when there is no query', async () => {
      searchRepository.find.mockResolvedValue([]);

      const results = await service.find({
        query: '',
        establishmentId: 123,
        limit: 10,
        from: 5,
      });

      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
      expect(searchRepository.find).not.toHaveBeenCalled();
    });
  });

  describe('#typeAhead', () => {
    it('returns search results', async () => {
      searchRepository.typeAhead.mockResolvedValue([
        'result_1',
        'result_2',
        'result_3',
      ]);

      const result = await service.typeAhead({
        query: 'Test Query',
        establishmentId: 123,
        limit: 3,
      });

      expect(searchRepository.typeAhead).toHaveBeenCalledTimes(1);

      expect(searchRepository.typeAhead).toHaveBeenCalledWith({
        query: 'Test Query',
        prison: 'HMP Development',
        limit: 3,
      });

      expect(getEstablishmentFormattedName).toHaveBeenCalledTimes(1);
      expect(getEstablishmentFormattedName).toHaveBeenCalledWith(123);
      expect(Array.isArray(result)).toBe(true);
    });

    it('returns empty when there is no query', async () => {
      searchRepository.typeAhead.mockResolvedValue([]);

      const results = await service.typeAhead({
        query: '',
        establishmentId: 123,
        limit: 3,
      });

      expect(searchRepository.typeAhead).not.toHaveBeenCalled();
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
    });
  });
});
