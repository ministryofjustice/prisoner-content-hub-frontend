const { SearchQuery } = require('../../repositories/cmsQueries/searchQuery');
const { createSearchService } = require('../search');

describe('SearchService', () => {
  const cmsApi = {
    get: jest.fn(),
  };

  let service;

  beforeEach(() => {
    jest.resetAllMocks();
    service = createSearchService({ cmsApi });
  });

  describe('#find', () => {
    it('returns search results', async () => {
      cmsApi.get.mockResolvedValue(['result_1', 'result_2', 'result_3']);

      const result = await service.find('Test Query', 'wayland');

      expect(cmsApi.get).toHaveBeenCalledTimes(1);

      expect(cmsApi.get).toHaveBeenCalledWith(
        new SearchQuery('wayland', 'Test Query', 15),
      );

      expect(Array.isArray(result)).toBe(true);
    });

    it('returns empty when there is no query', async () => {
      cmsApi.get.mockResolvedValue([]);

      const results = await service.find('', 'wayland');

      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
      expect(cmsApi.get).not.toHaveBeenCalled();
    });

    it('returns empty when invalid', async () => {
      cmsApi.get.mockResolvedValue([]);

      const results = await service.find('a'.repeat(51), 'wayland');

      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
      expect(cmsApi.get).not.toHaveBeenCalled();
    });
  });

  describe('#typeAhead', () => {
    it('returns search results', async () => {
      cmsApi.get.mockResolvedValue(['result_1', 'result_2', 'result_3']);

      const result = await service.typeAhead('Test Query', 'wayland');

      expect(cmsApi.get).toHaveBeenCalledTimes(1);

      expect(cmsApi.get).toHaveBeenCalledWith(
        new SearchQuery('wayland', 'Test Query', 5),
      );

      expect(Array.isArray(result)).toBe(true);
    });

    it('returns empty when there is no query', async () => {
      cmsApi.get.mockResolvedValue([]);

      const results = await service.typeAhead('', 'wayland');

      expect(cmsApi.get).not.toHaveBeenCalled();
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
    });

    it('returns empty when invalid', async () => {
      cmsApi.get.mockResolvedValue([]);

      const results = await service.typeAhead('a'.repeat(51), 'wayland');

      expect(cmsApi.get).not.toHaveBeenCalled();
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
    });
  });

  describe('#isInvalid', () => {
    ['a', 'a hat', 'a'.repeat(50)].forEach(test => {
      it(`${test} should be valid input to search`, () => {
        expect(service.isInvalid(test)).toBe(false);
      });
    });
    ['', 'a'.repeat(51)].forEach(test => {
      it(`'${test}' should be valid input to search`, () => {
        expect(service.isInvalid(test)).toBe(true);
      });
    });
  });

  describe('#sanitise', () => {
    [
      ['a', 'a'],
      ['a hat', 'a hat'],
      ["Somebody's hat", "Somebody's hat"],
      ['The: thing', 'The thing'],
      ['The / thing', 'The thing'],
      ['The (large) thing', 'The (large) thing'],
      ['Weird ~ stuff', 'Weird stuff'],
      ['Weird + stuff', 'Weird stuff'],
      ['fine-stuff', 'fine-stuff'],
      ['fine,', 'fine,'],
      ['fi;ne', 'fi;ne'],
      ['fine!', 'fine!'],
      ['"fine"', '"fine"'],
    ].forEach(([test, expected]) => {
      it(`'${test}' should be sanitised to '${expected}'`, () => {
        expect(service.sanitise(test)).toBe(expected);
      });
    });
  });
});
