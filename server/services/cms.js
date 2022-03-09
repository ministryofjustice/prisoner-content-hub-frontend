const { TopicsQuery } = require('../repositories/cmsQueries/topicsQuery');
const { HomepageQuery } = require('../repositories/cmsQueries/homePageQuery');
const { BasicPageQuery } = require('../repositories/cmsQueries/basicPageQuery');
const { LinkPageQuery } = require('../repositories/cmsQueries/linkPageQuery');
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
const { AllSeriesQuery } = require('../repositories/cmsQueries/allSeriesQuery');
const {
  CategoryOtherQuery,
} = require('../repositories/cmsQueries/categoryOtherQuery');
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
    const [categoryData, categorySeries, categoryOther] = await Promise.all([
      this.#cmsApi.get(new CategoryPageQuery(establishmentName, uuid)),
      this.#cmsApi.get(new AllSeriesQuery(establishmentName, uuid, 40)),
      this.#cmsApi.get(new CategoryOtherQuery(establishmentName, uuid, 40)),
    ]);
    return {
      ...categoryData,
      categorySeries,
      categoryOther,
    };
  }

  async getCategoryPage(establishmentName, uuid, page, catType) {
    switch (catType) {
      case 'series':
        return this.#cmsApi.get(
          new AllSeriesQuery(establishmentName, uuid, 40, page),
        );
      case 'other':
        return this.#cmsApi.get(
          new CategoryOtherQuery(establishmentName, uuid, 40, page),
        );
      default:
        throw new Error(
          `Unknown type for category page: ${catType} with content uuid: ${uuid}`,
        );
    }
  }

  async getLink(establishmentName, id) {
    const { location } = await this.#cmsApi.lookupLink(establishmentName, id);
    return this.#cmsApi.get(new LinkPageQuery(location));
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

  async getPage(establishmentName, id, page, catType) {
    const lookupData = await this.#cmsApi.lookupTag(establishmentName, id);
    const { type, uuid, location } = lookupData;
    switch (type) {
      case 'taxonomy_term--tags':
        return this.getSecondaryTag(
          establishmentName,
          uuid,
          location,
          page,
        ).then(({ relatedContent }) => relatedContent);
      case 'taxonomy_term--series':
        return this.getSeries(establishmentName, uuid, location, page).then(
          ({ relatedContent }) => relatedContent,
        );
      case 'taxonomy_term--moj_categories':
        return this.getCategoryPage(establishmentName, uuid, page, catType);
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
    const { seriesId, seriesSortValue, uuid, createdDate } = data;
    const [nextEpisodes, suggestedContent] = await Promise.all([
      this.getNextEpisode(
        establishmentName,
        seriesId,
        seriesSortValue,
        createdDate,
      ),
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

  async getNextEpisode(
    establishmentName,
    seriesId,
    seriesSortValue,
    createdDate,
  ) {
    return this.#cmsApi.get(
      new NextEpisodeQuery(
        establishmentName,
        seriesId,
        seriesSortValue || undefined,
        createdDate,
      ),
    );
  }
}

module.exports = {
  CmsService,
};
