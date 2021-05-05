const { hubMenuRepository } = require('../hubMenu');
const categoryMenuResponse = require('../../../test/resources/categoryMenuResponse.json');

describe('hubMenuRepository', () => {
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
