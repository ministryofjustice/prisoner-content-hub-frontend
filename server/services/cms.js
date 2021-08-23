const { TopicsQuery } = require('../repositories/cmsQueries/topicsQuery');
const { HomepageQuery } = require('../repositories/cmsQueries/homepageQuery');
const { BasicPageQuery } = require('../repositories/cmsQueries/basicPageQuery');
const { AudioPageQuery } = require('../repositories/cmsQueries/AudioPageQuery');

class CmsService {
  #cmsApi;

  #contentRepository;

  constructor(cmsApi, contentRepository) {
    this.#cmsApi = cmsApi;
    this.#contentRepository = contentRepository;
  }

  async getContent(establishmentName, establishmentId, contentId) {
    const { type, location } = await this.#cmsApi.lookupContent(
      establishmentName,
      contentId,
    );
    switch (type) {
      case 'node--page':
        return this.#cmsApi.get(new BasicPageQuery(location));
      case 'node--moj_radio_item':
        return this.getAudio(establishmentId, location);
      // case 'node--moj_video_item':
      //   return this.#cmsApi.get(new VideoPageQuery(location));
      /// ...other types go here
      default:
        // log unsupported type
        return null;
    }
  }

  async getAudio(establishmentId, location) {
    const data = await this.#cmsApi.get(new AudioPageQuery(location));
    const { id, seriesId, episodeId } = data;
    const suggestedContent = await this.#contentRepository.suggestedContentFor({
      id,
      establishmentId,
    });

    const filterOutCurrentEpisode = episodes =>
      episodes.filter(item => item.id !== id);

    const nextEpisodes = await this.#contentRepository.nextEpisodesFor({
      id: seriesId,
      establishmentId,
      perPage: 3,
      episodeId,
    });

    return {
      ...data,
      suggestedContent,
      nextEpisodes: nextEpisodes
        ? filterOutCurrentEpisode(nextEpisodes)
        : nextEpisodes,
    };
  }

  async getTopics(prisonId) {
    return this.#cmsApi.get(new TopicsQuery(prisonId));
  }

  async getHomepage(prisonId) {
    const homepages = await this.#cmsApi.get(new HomepageQuery(prisonId));
    return homepages[0];
  }
}

module.exports = {
  CmsService,
};
