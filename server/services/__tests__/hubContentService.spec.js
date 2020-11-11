const { createHubContentService } = require('../hubContent');

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
          description: { raw: '' },
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
        description: {
          raw: '',
        },
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
            description: { raw: '' },
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
          description: {
            raw: '',
          },
          episodeId: 'episodeId',
          secondaryTags: [12],
          categories: [13],
          season: [{ id: 2, title: 'bar episode' }], // hides the current episode from season
          tags: [{ name: 'foo series name', id: 'foo' }],
          secondaryTagNames: 'foo series name',
          categoryNames: 'foo series name',
        });

        expect(
          contentRepository.termFor.mock.calls[
            contentRepository.termFor.mock.calls.length - 1
          ][0],
        ).toBe('seriesId', 'The termFor method was called incorrectly');
        expect(
          contentRepository.nextEpisodesFor.mock.calls[
            contentRepository.nextEpisodesFor.mock.calls.length - 1
          ][0],
        ).toHaveProperty(
          'id',
          'seriesId',
          'The nextEpisodeFor method was called incorrectly',
        );

        expect(
          contentRepository.nextEpisodesFor.mock.calls[
            contentRepository.nextEpisodesFor.mock.calls.length - 1
          ][0],
        ).toHaveProperty(
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
      description: { raw: '' },
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

      const { calls } = contentRepository.contentFor.mock;
      const lastCall = calls[calls.length - 1];
      const lastArg = lastCall[lastCall.length - 1];
      expect(lastArg).toBe(
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

      const { calls } = categoryFeaturedContentRepository.contentFor.mock;
      const lastCall = calls[calls.length - 1];
      const lastArg = lastCall[lastCall.length - 1];
      expect(lastArg).toStrictEqual(
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

      const { calls } = menuRepository.categoryMenu.mock;
      const lastCall = calls[calls.length - 1];
      const lastArg = lastCall[lastCall.length - 1];
      expect(lastArg).toStrictEqual(
        expectedResult,
        `the call arguments were supposed to be "${JSON.stringify(
          expectedResult,
        )}"`,
      );
    });
  });
});
