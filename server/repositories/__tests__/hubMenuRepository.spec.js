const { hubMenuRepository } = require('../hubMenu');
const topicsResponse = require('../../../test/resources/tagsContent.json');
const categoryMenuResponse = require('../../../test/resources/categoryMenuResponse.json');

describe('hubMenuRepository', () => {
  describe('topicsMenu', () => {
    it('returns a topicsMenu', async () => {
      const httpClient = {
        get: jest.fn().mockReturnValue(topicsResponse),
      };

      const repository = hubMenuRepository(httpClient);
      const expected = [
        { linkText: 'Bat', href: '/tags/1', id: '1', description: undefined },
        { linkText: 'Baz', href: '/tags/0', id: '0', description: undefined },
      ];
      const result = await repository.tagsMenu();

      expect(result).toStrictEqual(expected);
    });

    it('returns and empty array when there is no data returned', async () => {
      const httpClient = {
        get: jest.fn().mockReturnValue(null),
      };
      const repository = hubMenuRepository(httpClient);
      const expected = [];
      const result = await repository.tagsMenu();

      expect(result).toStrictEqual(expected);
    });
  });

  describe('categoryMenu', () => {
    it('it returns a category menu', async () => {
      const httpClient = {
        get: jest.fn().mockReturnValue(categoryMenuResponse),
      };

      const repository = hubMenuRepository(httpClient);
      const expected = [
        {
          id: 798,
          linkText: 'Creative design: Way2Learn',
          href: '/tags/798',
          description: null,
        },
        {
          id: 799,
          linkText: 'Fitness for life: Way2Learn',
          href: '/tags/799',
          description: null,
        },
        {
          id: 800,
          linkText: 'Job smart: Way2Learn',
          href: '/tags/800',
          description: null,
        },
      ];

      const result = await repository.categoryMenu({
        categoryId: 1,
        prisonId: 2,
      });

      expect(result).toStrictEqual(expected);
    });
  });
});
