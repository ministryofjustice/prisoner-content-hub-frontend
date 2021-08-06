const { prop, filter, not, equals, map } = require('ramda');

// Eventually will remove this file and call cms service directly
function createHubContentService({
  contentRepository,
  menuRepository,
  categoryFeaturedContentRepository,
  cmsService,
}) {
  async function contentFor(id, establishmentId, establishmentName) {
    if (!id) {
      return {};
    }
    // will need tests and eventually pass in establishmentName when leon make change 
    const result = await cmsService.getContent(id);
    if (result) {
      return result;
    }
    const content = await contentRepository.contentFor(id, establishmentId);
    const secondaryTags = prop('secondaryTags', content);

    if (secondaryTags) {
      const tagsPromises = map(
        tag => contentRepository.termFor(tag, establishmentId),
        secondaryTags,
      );
      const tags = (await Promise.all(tagsPromises)).filter(
        secondaryTag => secondaryTag !== null,
      ); // Filter out Terms that returned 404;

      content.tags = tags;
      content.secondaryTagNames = tags
        .map(secondaryTag => secondaryTag.name)
        .join(',');
    }

    const categories = prop('categories', content);

    if (categories) {
      const categoriesPromises = map(
        tag => contentRepository.termFor(tag, establishmentId),
        categories,
      );

      const categoryNames = (await Promise.all(categoriesPromises)).filter(
        category => category !== null,
      ); // Filter out Categories that returned 404;

      content.categoryNames = categoryNames
        .map(category => category.name)
        .join(',');
    }

    const contentType = prop('contentType', content);
    const suggestedContent =
      contentType === 'radio' || contentType === 'video'
        ? await contentRepository.suggestedContentFor({
            id,
            establishmentId,
          })
        : [];

    switch (contentType) {
      case 'radio':
      case 'video': {
        return media(establishmentId, {
          ...content,
          suggestedContent,
        });
      }
      case 'landing-page':
        return landingPage(establishmentId, {
          ...content,
        });
      default:
        return {
          ...content,
        };
    }
  }

  async function streamFor(url) {
    return contentRepository.streamFor(url);
  }

  async function media(establishmentId, data) {
    const id = prop('id', data);
    const seriesId = prop('seriesId', data);
    const episodeId = prop('episodeId', data);
    const filterOutCurrentEpisode = filter(item =>
      not(equals(prop('id', item), id)),
    );

    const [series, seasons] = await Promise.all([
      contentRepository.termFor(seriesId, establishmentId),
      contentRepository.nextEpisodesFor({
        id: seriesId,
        establishmentId,
        perPage: 3,
        episodeId,
      }),
    ]);

    return {
      ...data,
      seriesName: prop('name', series),
      season: seasons ? filterOutCurrentEpisode(seasons) : seasons,
    };
  }

  async function landingPage(establishmentId, data) {
    const featuredContentId = prop('featuredContentId', data);
    const categoryId = prop('categoryId', data);

    const [featuredContent, categoryFeaturedContent, categoryMenu] =
      await Promise.all([
        contentRepository.contentFor(featuredContentId),
        categoryFeaturedContentRepository.contentFor({
          categoryId,
          establishmentId,
        }),
        menuRepository.categoryMenu({
          categoryId,
          prisonId: establishmentId,
        }),
      ]);

    return {
      ...data,
      featuredContent,
      categoryFeaturedContent: {
        contentType: 'default',
        data: categoryFeaturedContent,
      },
      categoryMenu,
    };
  }

  return {
    contentFor,
    streamFor,
  };
}

module.exports = {
  createHubContentService,
};
