const { createHubContentService } = require('../hubContent');
const { lastCallLastArg } = require('../../../test/test-helpers');
const { CmsService } = require('../cms');

jest.mock('../cms');

describe('#hubContentService', () => {
  const cmsService = new CmsService(null);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('content', () => {
    it('returns content for a given ID', async () => {
      const contentRepository = {
        contentFor: jest.fn().mockReturnValue({
          title: 'foo',
          href: 'www.foo.com',
          type: 'foo',
          secondaryTags: [12],
          categories: [13],
          description: { raw: '' },
        }),
        termFor: jest
          .fn()
          .mockReturnValue({ name: 'foo series name', id: 'foo' }),
      };
      const service = createHubContentService({
        contentRepository,
        cmsService,
      });
      const result = await service.contentFor('contentId');

      expect(result).toStrictEqual({
        title: 'foo',
        href: 'www.foo.com',
        type: 'foo',
        secondaryTags: [12],
        categories: [13],
        description: {
          raw: '',
        },
        tags: [{ name: 'foo series name', id: 'foo' }],
        secondaryTagNames: 'foo series name',
        categoryNames: 'foo series name',
      });
    });

    it('should handle when unable to find a Term', async () => {
      const contentRepository = {
        contentFor: jest.fn().mockReturnValue({
          title: 'foo',
          href: 'www.foo.com',
          type: 'foo',
          secondaryTags: [12],
          categories: [13],
          description: { raw: '' },
        }),
        termFor: jest.fn().mockReturnValue(null),
      };
      const service = createHubContentService({
        contentRepository,
        cmsService,
      });
      const result = await service.contentFor('contentId');

      expect(result.tags.length).toEqual(0);
      expect(result.secondaryTagNames.length).toEqual(0);
      expect(result.categoryNames.length).toEqual(0);
    });

    it(`returns content provided by CMS service`, async () => {
      cmsService.getContent.mockResolvedValue({
        categories: [1234],
        contentType: 'node--page',
        description: 'Education content for prisoners',
        id: 5923,
        secondaryTags: [2345],
        standFirst: 'Education',
        title: 'Novus',
      });

      const service = createHubContentService({
        cmsService,
      });
      const result = await service.contentFor(1, 794, 'berwyn');

      expect(result).toStrictEqual({
        categories: [1234],
        contentType: 'node--page',
        description: 'Education content for prisoners',
        id: 5923,
        secondaryTags: [2345],
        standFirst: 'Education',
        title: 'Novus',
      });

      expect(cmsService.getContent).toHaveBeenCalledWith('berwyn', 1);
    });
  });

  describe('landing page', () => {
    const establishmentId = 'establishmentId';
    const content = {
      id: 'foo-id',
      contentType: 'landing-page',
      featuredContentId: 'featuredContentId',
      categoryId: 'categoryId',
      establishmentId,
      secondaryTags: [12],
      categories: [13],
      description: { raw: '' },
    };

    const createContentRepository = () => ({
      termFor: jest
        .fn()
        .mockReturnValue({ name: 'foo series name', id: 'foo' }),
      contentFor: jest
        .fn()
        .mockReturnValueOnce(content)
        .mockReturnValueOnce('fooBar'),
    });

    const createMenuRepository = () => ({
      categoryMenu: jest.fn().mockReturnValue('categoryMenu'),
    });

    const createCategoryFeaturedContentRepository = () => ({
      contentFor: jest
        .fn()
        .mockReturnValueOnce([content])
        .mockReturnValueOnce('fooBar'),
    });

    it('returns landing page content', async () => {
      const contentRepository = createContentRepository();
      const categoryFeaturedContentRepository =
        createCategoryFeaturedContentRepository();
      const menuRepository = createMenuRepository();
      const service = createHubContentService({
        contentRepository,
        menuRepository,
        categoryFeaturedContentRepository,
        cmsService,
      });
      const result = await service.contentFor(content.id, establishmentId);

      expect(result).toHaveProperty('id', content.id);
      expect(result).toHaveProperty('contentType', content.contentType);
      expect(result).toHaveProperty(
        'featuredContentId',
        content.featuredContentId,
      );
      expect(result).toHaveProperty('featuredContent', 'fooBar');
      expect(result).toHaveProperty('categoryFeaturedContent');
      expect(result).toHaveProperty('categoryMenu', 'categoryMenu');
    });

    it('calls for the featured content', async () => {
      const contentRepository = createContentRepository();
      const categoryFeaturedContentRepository =
        createCategoryFeaturedContentRepository();
      const menuRepository = createMenuRepository();
      const service = createHubContentService({
        contentRepository,
        menuRepository,
        categoryFeaturedContentRepository,
        cmsService,
      });

      await service.contentFor(content.id, establishmentId);

      expect(lastCallLastArg(contentRepository.contentFor)).toBe(
        'featuredContentId',
        `the featuredContentId was supposed to be ${content.featuredContentId}`,
      );
    });

    it('calls for the categoryFeaturedContentRepository', async () => {
      const contentRepository = createContentRepository();
      const categoryFeaturedContentRepository =
        createCategoryFeaturedContentRepository();
      const menuRepository = createMenuRepository();
      const service = createHubContentService({
        contentRepository,
        menuRepository,
        categoryFeaturedContentRepository,
        cmsService,
      });

      await service.contentFor(content.id, establishmentId);

      expect(
        lastCallLastArg(categoryFeaturedContentRepository.contentFor),
      ).toStrictEqual(
        {
          categoryId: 'categoryId',
          establishmentId: 'establishmentId',
        },
        `the categoryId was supposed to be "${content.categoryId}"`,
      );
    });

    it('call for the categoryMenu', async () => {
      const contentRepository = createContentRepository();
      const categoryFeaturedContentRepository =
        createCategoryFeaturedContentRepository();
      const menuRepository = createMenuRepository();
      const service = createHubContentService({
        contentRepository,
        menuRepository,
        categoryFeaturedContentRepository,
        cmsService,
      });

      const expectedResult = {
        categoryId: content.categoryId,
        prisonId: establishmentId,
      };

      await service.contentFor(content.id, establishmentId);

      expect(lastCallLastArg(menuRepository.categoryMenu)).toStrictEqual(
        expectedResult,
        `the call arguments were supposed to be "${JSON.stringify(
          expectedResult,
        )}"`,
      );
    });
  });
});
