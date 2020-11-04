const { createHubContentService } = require('../hubContent');
const { lastCall, lastCallLastArg } = require('../../../test/test-helpers');

describe('#hubContentService', () => {
  describe('content', () => {
    it('returns content for a given ID', async () => {
      const contentRepository = {
        contentFor: jest.fn().mockReturnValue({
          title: 'foo',
          href: 'www.foo.com',
          type: 'foo',
          secondaryTags: [12],
          categories: [13],
          description: {},
        }),
        termFor: jest
          .fn()
          .mockReturnValue({ name: 'foo series name', id: 'foo' }),
      };
      const service = createHubContentService({ contentRepository });
      const result = await service.contentFor('contentId');

      expect(result).toStrictEqual({
        title: 'foo',
        href: 'www.foo.com',
        type: 'foo',
        secondaryTags: [12],
        categories: [13],
        description: {},
        tags: [{ name: 'foo series name', id: 'foo' }],
        secondaryTagNames: 'foo series name',
        categoryNames: 'foo series name',
      });
    });

    ['radio', 'video'].forEach(contentType => {
      it(`returns ${contentType} show content`, async () => {
        const contentRepository = {
          contentFor: jest.fn().mockReturnValue({
            id: 1,
            title: 'foo',
            href: 'www.foo.com',
            contentType,
            seriesId: 'seriesId',
            episodeId: 'episodeId',
            secondaryTags: [12],
            categories: [13],
            description: {},
          }),
          suggestedContentFor: jest
            .fn()
            .mockReturnValue([
              { title: 'foo', href: 'www.foo.com', type: 'foo' },
            ]),
          termFor: jest
            .fn()
            .mockReturnValue({ name: 'foo series name', id: 'foo' }),
          nextEpisodesFor: jest.fn().mockReturnValue([
            { id: 1, title: 'foo episode' },
            { id: 2, title: 'bar episode' },
          ]),
        };

        const service = createHubContentService({ contentRepository });
        const result = await service.contentFor(1);

        expect(result).toStrictEqual({
          id: 1,
          title: 'foo',
          href: 'www.foo.com',
          contentType,
          seriesId: 'seriesId',
          seriesName: 'foo series name',
          suggestedContent: [
            {
              href: 'www.foo.com',
              title: 'foo',
              type: 'foo',
            },
          ],
          description: {},
          episodeId: 'episodeId',
          secondaryTags: [12],
          categories: [13],
          season: [{ id: 2, title: 'bar episode' }], // hides the current episode from season
          tags: [{ name: 'foo series name', id: 'foo' }],
          secondaryTagNames: 'foo series name',
          categoryNames: 'foo series name',
        });

        expect(lastCall(contentRepository.termFor)[0]).toBe(
          'seriesId',
          'The termFor method was called incorrectly',
        );
        expect(lastCall(contentRepository.nextEpisodesFor)[0]).toHaveProperty(
          'id',
          'seriesId',
          'The nextEpisodeFor method was called incorrectly',
        );

        expect(lastCall(contentRepository.nextEpisodesFor)[0]).toHaveProperty(
          'episodeId',
          'episodeId',
          'The nextEpisodeFor method was called incorrectly',
        );
      });
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
      description: {},
    };

    const createContentRepository = () => ({
      relatedContentFor: jest.fn().mockReturnValue([]),
      termFor: jest
        .fn()
        .mockReturnValue({ name: 'foo series name', id: 'foo' }),
      contentFor: jest
        .fn()
        .mockReturnValueOnce(content)
        .mockReturnValueOnce('fooBar'),
      suggestedContentFor: jest
        .fn()
        .mockReturnValue({ title: 'foo', href: 'www.foo.com', type: 'foo' }),
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
      const categoryFeaturedContentRepository = createCategoryFeaturedContentRepository();
      const menuRepository = createMenuRepository();
      const service = createHubContentService({
        contentRepository,
        menuRepository,
        categoryFeaturedContentRepository,
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
      const categoryFeaturedContentRepository = createCategoryFeaturedContentRepository();
      const menuRepository = createMenuRepository();
      const service = createHubContentService({
        contentRepository,
        menuRepository,
        categoryFeaturedContentRepository,
      });

      await service.contentFor(content.id, establishmentId);

      expect(lastCallLastArg(contentRepository.contentFor)).toBe(
        'featuredContentId',
        `the featuredContentId was supposed to be ${content.featuredContentId}`,
      );
    });

    it('calls for the categoryFeaturedContentRepository', async () => {
      const contentRepository = createContentRepository();
      const categoryFeaturedContentRepository = createCategoryFeaturedContentRepository();
      const menuRepository = createMenuRepository();
      const service = createHubContentService({
        contentRepository,
        menuRepository,
        categoryFeaturedContentRepository,
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
      const categoryFeaturedContentRepository = createCategoryFeaturedContentRepository();
      const menuRepository = createMenuRepository();
      const service = createHubContentService({
        contentRepository,
        menuRepository,
        categoryFeaturedContentRepository,
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
