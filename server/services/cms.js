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
  SuggestionSecondaryTagQuery,
} = require('../repositories/cmsQueries/suggestionSecondaryTagQuery');
const {
  SuggestionCategoryQuery,
} = require('../repositories/cmsQueries/suggestionCategoryQuery');
const { AudioPageQuery } = require('../repositories/cmsQueries/audioPageQuery');
const { VideoPageQuery } = require('../repositories/cmsQueries/videoPageQuery');
const { PdfPageQuery } = require('../repositories/cmsQueries/pdfPageQuery');
const {
  NextEpisodeQuery,
} = require('../repositories/cmsQueries/nextEpisodeQuery');
const { removeDuplicates } = require('../utils/index');

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
      default:
        return null;
    }
  }

  async getSuggestions(establishmentName, secondaryTags, categories) {
    const limit = 4;
    const secondaryTagSuggestions = await this.#cmsApi.get(
      new SuggestionSecondaryTagQuery(
        establishmentName,
        secondaryTags.map(({ uuid }) => uuid),
        limit,
      ),
    );
    const categorySuggestions =
      secondaryTagSuggestions.length < limit && categories
        ? await this.#cmsApi.get(
            new SuggestionCategoryQuery(
              establishmentName,
              categories.map(({ uuid }) => uuid),
              limit,
            ),
          )
        : [];
    return removeDuplicates([
      ...secondaryTagSuggestions,
      ...categorySuggestions,
    ]).slice(0, limit);
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
      /// ...other types go here
      default:
        // log unsupported type
        throw new Error('Unknown content type');
    }
  }

  async getMedia(establishmentName, query) {
    const data = await this.#cmsApi.get(query);
    const { seriesId, seriesSortValue, secondaryTags, categories } = data;
    const [nextEpisodes, suggestedContent] = await Promise.all([
      this.getNextEpisode(establishmentName, seriesId, seriesSortValue),
      this.getSuggestions(establishmentName, secondaryTags, categories),
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
