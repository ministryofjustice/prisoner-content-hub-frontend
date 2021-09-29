const { TopicsQuery } = require('../repositories/cmsQueries/topicsQuery');
const { HomepageQuery } = require('../repositories/cmsQueries/homePageQuery');
const { BasicPageQuery } = require('../repositories/cmsQueries/basicPageQuery');
const {
  SecondaryTagPageQuery,
} = require('../repositories/cmsQueries/secondaryTagPageQuery');
const {
  SecondaryTagHeaderPageQuery,
} = require('../repositories/cmsQueries/secondaryTagHeaderPageQuery');
const {
  SeriesPageQuery,
} = require('../repositories/cmsQueries/seriesPageQuery');
const {
  SeriesHeaderPageQuery,
} = require('../repositories/cmsQueries/seriesHeaderPageQuery');
const {
  SuggestionQuery,
} = require('../repositories/cmsQueries/suggestionQuery');
const { AudioPageQuery } = require('../repositories/cmsQueries/audioPageQuery');
const { VideoPageQuery } = require('../repositories/cmsQueries/videoPageQuery');
const { PdfPageQuery } = require('../repositories/cmsQueries/pdfPageQuery');
const {
  NextEpisodeQuery,
} = require('../repositories/cmsQueries/nextEpisodeQuery');

class CmsService {
  #cmsApi;

  #contentRepository;

  constructor(cmsApi, contentRepository) {
    this.#cmsApi = cmsApi;
    this.#contentRepository = contentRepository;
  }

  async getSecondaryTag(establishmentName, uuid, location) {
    const result = await this.#cmsApi.get(
      new SecondaryTagPageQuery(establishmentName, uuid),
    );
    if (result?.name) return result;
    const tagResult = await this.#cmsApi.get(
      new SecondaryTagHeaderPageQuery(location),
    );
    return tagResult;
  }

  async getSeries(establishmentName, uuid, location) {
    const result = await this.#cmsApi.get(
      new SeriesPageQuery(establishmentName, uuid),
    );
    if (result?.name) return result;
    const tagResult = await this.#cmsApi.get(
      new SeriesHeaderPageQuery(location),
    );
    return tagResult;
  }

  async getTag(establishmentName, id) {
    const lookupData = await this.#cmsApi.lookupTag(establishmentName, id);
    const { type, uuid, location } = lookupData;
    switch (type) {
      case 'taxonomy_term--tags':
        return this.getSecondaryTag(establishmentName, uuid, location);
      case 'taxonomy_term--series':
        return this.getSeries(establishmentName, uuid, location);
      case 'taxonomy_term--moj_categories':
        console.log(`777777777777777`);
        console.log(type);
        console.log(
          JSON.stringify(
            await this.#cmsApi.get(
              new CategoryPageQuery(establishmentName, uuid),
            ),
            null,
            2,
          ),
        );
        console.log(`888888888888888`);
        return null;
      default:
        console.log(`999999999999999`);
        console.log(type);
        console.log(`000000000000000`);
        return null;
    }
  }

  async getSuggestions(establishmentName, uuid) {
    const limit = 4;
    const suggestions =
      (await this.#cmsApi.get(
        new SuggestionQuery(establishmentName, uuid, limit),
      )) || [];

    return suggestions;
  }

  async getContent(establishmentName, establishmentId, contentId) {
    const { type, location } = await this.#cmsApi.lookupContent(
      establishmentName,
      contentId,
    );

    switch (type) {
      case 'node--page':
        return this.#cmsApi.get(new BasicPageQuery(location));
      case 'node--moj_pdf_item':
        return this.#cmsApi.get(new PdfPageQuery(location));
      case 'node--moj_radio_item':
        return this.getMedia(establishmentName, new AudioPageQuery(location));
      case 'node--moj_video_item':
        return this.getMedia(establishmentName, new VideoPageQuery(location));
      case 'node--landing_page':
        console.log(`333333333333333`);
        console.log(type);
        console.log(`444444444444444`);
        return null;
      /// ...other types go here
      default:
        console.log(`555555555555555`);
        console.log(type);
        console.log(`666666666666666`);
        // log unsupported type
        // throw new Error('Unknown content type');
        return null;
    }
  }

  async getMedia(establishmentName, query) {
    const data = await this.#cmsApi.get(query);
    const { seriesId, seriesSortValue, uuid } = data;
    const [nextEpisodes, suggestedContent] = await Promise.all([
      this.getNextEpisode(establishmentName, seriesId, seriesSortValue),
      this.getSuggestions(establishmentName, uuid),
    ]);
    return {
      ...data,
      nextEpisodes,
      suggestedContent,
    };
  }

  async getTopics(establishmentName) {
    return this.#cmsApi.get(new TopicsQuery(establishmentName));
  }

  async getHomepage(establishmentName) {
    const homepages = await this.#cmsApi.get(
      new HomepageQuery(establishmentName),
    );
    return homepages[0];
  }

  async getNextEpisode(establishmentName, seriesId, seriesSortValue) {
    return this.#cmsApi.get(
      new NextEpisodeQuery(
        establishmentName,
        seriesId,
        seriesSortValue || undefined,
      ),
    );
  }
}

module.exports = {
  CmsService,
};
