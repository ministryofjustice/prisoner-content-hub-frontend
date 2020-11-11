const { createSearchService } = require('../search');

describe('SearchService', () => {
  describe('#find', () => {
    it('returns search results', async () => {
      const searchRepository = {
        find: jest.fn().mockResolvedValue(['result_1', 'result_2', 'result_3']),
      };
      const getEstablishmentName = jest.fn().mockReturnValue('HMP Development');

      const service = createSearchService({
        searchRepository,
        getEstablishmentName,
      });

      const result = await service.find({
        query: 'Test Query',
        establishmentId: 123,
        limit: 10,
        from: 5,
      });

      expect(searchRepository.find.mock.calls.length).toBe(
        1,
        'The repository should have been called',
      );

      expect(
        searchRepository.find.mock.calls[
          searchRepository.find.mock.calls.length - 1
        ][0],
      ).toStrictEqual(
        {
          query: 'Test Query',
          prison: 'HMP Development',
          limit: 10,
          from: 5,
        },
        'The repository should have been called with the correct arguments',
      );

      expect(getEstablishmentName.mock.calls.length).toBe(
        1,
        'The service should get the establishment name',
      );

      expect(
        getEstablishmentName.mock.calls[
          getEstablishmentName.mock.calls.length - 1
        ][0],
      ).toStrictEqual(123);

      expect(Array.isArray(result)).toBe(
        true,
        'The service should return an array of results',
      );
    });

    it('returns empty when there is no query', async () => {
      const searchRepository = {
        find: jest.fn(),
      };
      const getEstablishmentName = jest.fn().mockReturnValue('HMP Development');

      const service = createSearchService({
        searchRepository,
        getEstablishmentName,
      });

      const results = await service.find({
        query: '',
        establishmentId: 123,
        limit: 10,
        from: 5,
      });

      expect(Array.isArray(results)).toBe(
        true,
        'The method should return an array',
      );

      expect(results.length).toBe(0, 'The array should be empty');

      expect(searchRepository.find.mock.calls.length).toBe(
        0,
        'The repository should not have been called',
      );
    });
  });

  describe('#typeAhead', () => {
    it('returns search results', async () => {
      const searchRepository = {
        typeAhead: jest
          .fn()
          .mockResolvedValue(['result_1', 'result_2', 'result_3']),
      };
      const getEstablishmentName = jest.fn().mockReturnValue('HMP Development');

      const service = createSearchService({
        searchRepository,
        getEstablishmentName,
      });

      const result = await service.typeAhead({
        query: 'Test Query',
        establishmentId: 123,
        limit: 3,
      });

      expect(searchRepository.typeAhead.mock.calls.length).toBe(
        1,
        'The repository should have been called',
      );

      expect(
        searchRepository.typeAhead.mock.calls[
          searchRepository.typeAhead.mock.calls.length - 1
        ][0],
      ).toStrictEqual(
        {
          query: 'Test Query',
          prison: 'HMP Development',
          limit: 3,
        },
        'The repository should have been called with the correct arguments',
      );

      expect(getEstablishmentName.mock.calls.length).toBe(
        1,
        'The service should get the establishment name',
      );

      expect(
        getEstablishmentName.mock.calls[
          getEstablishmentName.mock.calls.length - 1
        ][0],
      ).toStrictEqual(123);

      expect(Array.isArray(result)).toBe(
        true,
        'The service should return an array of results',
      );
    });

    it('returns empty when there is no query', async () => {
      const searchRepository = {
        typeAhead: jest.fn(),
      };
      const getEstablishmentName = jest.fn().mockReturnValue('HMP Development');

      const service = createSearchService({
        searchRepository,
        getEstablishmentName,
      });

      const results = await service.typeAhead({
        query: '',
        establishmentId: 123,
        limit: 3,
      });

      expect(Array.isArray(results)).toBe(
        true,
        'The method should return an array',
      );

      expect(results.length).toBe(0, 'The array should be empty');

      expect(searchRepository.typeAhead.mock.calls.length).toBe(
        0,
        'The repository should not have been called',
      );
    });
  });
});
