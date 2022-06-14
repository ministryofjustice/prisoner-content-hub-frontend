const { TopicsQuery } = require('../repositories/cmsQueries/topicsQuery');
const { HomepageQuery } = require('../repositories/cmsQueries/homePageQuery');
const { BasicPageQuery } = require('../repositories/cmsQueries/basicPageQuery');
const { LinkPageQuery } = require('../repositories/cmsQueries/linkPageQuery');
const { TopicPageQuery } = require('../repositories/cmsQueries/topicPageQuery');
const {
  TopicHeaderPageQuery,
} = require('../repositories/cmsQueries/topicHeaderPageQuery');
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
  CategoryCollectionsQuery,
} = require('../repositories/cmsQueries/categoryCollectionsQuery');
const {
  CategoryContentQuery,
} = require('../repositories/cmsQueries/categoryContentQuery');
const {
  SuggestionQuery,
} = require('../repositories/cmsQueries/suggestionQuery');
const { AudioPageQuery } = require('../repositories/cmsQueries/audioPageQuery');
const { VideoPageQuery } = require('../repositories/cmsQueries/videoPageQuery');
const { PdfPageQuery } = require('../repositories/cmsQueries/pdfPageQuery');
const {
  NextEpisodeQuery,
} = require('../repositories/cmsQueries/nextEpisodeQuery');
const {
  PrimaryNavigationQuery,
} = require('../repositories/cmsQueries/PrimaryNavigationQuery');
const {
  RecentlyAddedContentQuery,
} = require('../repositories/cmsQueries/recentlyAddedContentQuery');
const {
  RecentlyAddedHomepageContentQuery,
} = require('../repositories/cmsQueries/recentlyAddedHomepageContentQuery');
const {
  ExploreContentQuery,
} = require('../repositories/cmsQueries/exploreContentQuery');

const { getOffsetUnixTime } = require('../utils/date');

class CmsService {
  #cmsApi;

  constructor(cmsApi) {
    this.#cmsApi = cmsApi;
  }

  async getTopic(establishmentName, uuid, location, page = 1) {
    const result = await this.#cmsApi.get(
      new TopicPageQuery(establishmentName, uuid, page),
    );
    if (result?.title) return result;
    const tagResult = await this.#cmsApi.get(
      new TopicHeaderPageQuery(location),
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
    const [[categoryData, categoryContent = []], categorySeries] =
      await Promise.all([
        this.#cmsApi
          .get(new CategoryPageQuery(establishmentName, uuid))
          .then(async data => {
            if (!(data?.breadcrumbs?.length >= 1)) return [data];
            const rawCategoryContent = await this.#cmsApi.get(
              new CategoryContentQuery(establishmentName, uuid, 40),
            );
            return [data, rawCategoryContent];
          }),
        this.#cmsApi.get(
          new CategoryCollectionsQuery(establishmentName, uuid, 40),
        ),
      ]);
    return {
      ...categoryData,
      categorySeries,
      categoryContent,
    };
  }

  async getCategoryPage(establishmentName, uuid, page, catType) {
    switch (catType) {
      case 'series':
        return this.#cmsApi.get(
          new CategoryCollectionsQuery(establishmentName, uuid, 40, page),
        );
      case 'other':
        return this.#cmsApi.get(
          new CategoryContentQuery(establishmentName, uuid, 40, page),
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
      case 'taxonomy_term--topics':
        return this.getTopic(establishmentName, uuid, location);
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
      case 'taxonomy_term--topics':
        return this.getTopic(establishmentName, uuid, location, page).then(
          ({ hubContentData }) => hubContentData,
        );
      case 'taxonomy_term--series':
        return this.getSeries(establishmentName, uuid, location, page).then(
          ({ hubContentData }) => hubContentData,
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

  async getExploreContent(establishmentName) {
    const exploreContent = await this.#cmsApi.get(
      new ExploreContentQuery(establishmentName),
    );
    return exploreContent;
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

  async getPrimaryNavigation(establishmentName) {
    return this.#cmsApi.get(new PrimaryNavigationQuery(establishmentName));
  }

  async getRecentlyAddedContent(establishmentName, page = 1, pageLimit = 4) {
    const timeStamp = getOffsetUnixTime(14);

    const recentlyAddedContent = await this.#cmsApi.get(
      new RecentlyAddedContentQuery(
        establishmentName,
        page,
        pageLimit,
        timeStamp,
      ),
    );

    return recentlyAddedContent;
  }

  async getRecentlyAddedHomepageContent(establishmentName) {
    const RecentlyAddedHomepageContent = await this.#cmsApi.get(
      new RecentlyAddedHomepageContentQuery(establishmentName),
    );

    return RecentlyAddedHomepageContent;
  }
}

module.exports = {
  CmsService,
};
