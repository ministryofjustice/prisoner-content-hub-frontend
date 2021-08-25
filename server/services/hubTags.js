const { prop } = require('ramda');

const createHubTagsService = repository => {
  async function termFor(id, establishmentId) {
    const content = await repository.termFor(id, establishmentId);

    if (!prop('contentType', content)) return null;

    switch (content.contentType) {
      case 'series': {
        const data = await repository.seasonFor({ id, establishmentId });
        return {
          ...content,
          relatedContent: {
            contentType: 'series',
            data,
          },
        };
      }
      default: {
        const data = await repository.relatedContentFor({
          id,
          establishmentId,
        });
        return {
          ...content,
          relatedContent: {
            contentType: 'default',
            data,
          },
        };
      }
    }
  }

  return {
    termFor,
  };
};

module.exports = {
  createHubTagsService,
};
