const { TopicsQuery } = require('../repositories/cmsQueries/topicsQuery');
const { HomepageQuery } = require('../repositories/cmsQueries/homePageQuery');
const { BasicPageQuery } = require('../repositories/cmsQueries/basicPageQuery');
const {
  ExternalLinkPageQuery,
} = require('../repositories/cmsQueries/externalLinkPageQuery');
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
  CategoryPageQuery,
} = require('../repositories/cmsQueries/categoryPageQuery');
const {
  InThisSectionQuery,
} = require('../repositories/cmsQueries/inThisSectionQuery');
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

  constructor(cmsApi) {
    this.#cmsApi = cmsApi;
  }

  async getSecondaryTag(establishmentName, uuid, location, page = 1) {
    const result = await this.#cmsApi.get(
      new SecondaryTagPageQuery(establishmentName, uuid, page),
    );
    if (result?.title) return result;
    const tagResult = await this.#cmsApi.get(
      new SecondaryTagHeaderPageQuery(location),
    );
    return tagResult;
  }

  async getSeries(establishmentName, uuid, location, page = 1) {
    const result = await this.#cmsApi.get(
      new SeriesPageQuery(establishmentName, uuid, page),
    );
    if (result?.title) return result;
    const tagResult = await this.#cmsApi.get(
      new SeriesHeaderPageQuery(location),
    );
    return tagResult;
  }

  async getCategory(establishmentName, uuid) {
    const [categoryData, categoryMenu] = await Promise.all([
      this.#cmsApi.get(new CategoryPageQuery(establishmentName, uuid)),
      this.#cmsApi.get(new InThisSectionQuery(establishmentName, uuid)),
    ]);
    return {
      ...categoryData,
      categoryMenu,
    };
  }

  async getExternalLink(establishmentName, id) {
    const { location } = await this.#cmsApi.lookupExternalLink(
      establishmentName,
      id,
    );
    return this.#cmsApi.get(new ExternalLinkPageQuery(location));
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
        return this.getCategory(establishmentName, uuid);
      default:
        throw new Error(`Unknown tag type: ${type} with content id: ${id}`);
    }
  }

  async getPage(establishmentName, id, page) {
    const lookupData = await this.#cmsApi.lookupTag(establishmentName, id);
    const { type, uuid, location } = lookupData;
    switch (type) {
      case 'taxonomy_term--tags':
        return this.getSecondaryTag(establishmentName, uuid, location, page);
      case 'taxonomy_term--series':
        return this.getSeries(establishmentName, uuid, location, page);
      default:
        throw new Error(`Unknown tag type: ${type} with content id: ${id}`);
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

  async getContent(establishmentName, id) {
    const { type, location } = await this.#cmsApi.lookupContent(
      establishmentName,
      id,
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
      default:
        throw new Error(`Unknown content type: ${type} with content id: ${id}`);
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
