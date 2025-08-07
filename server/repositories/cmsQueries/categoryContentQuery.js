const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const { getSmallTile, getPagination } = require('../../utils/jsonApi');
const { getCmsCacheKey } = require('../../utils/caching/cms');

class CategoryContentQuery {
  static #TILE_FIELDS = [
    'drupal_internal__nid',
    'title',
    'field_summary',
    'field_moj_thumbnail_image',
    'path',
    'published_at',
  ];

  constructor(establishmentName, uuid, language, limit = 4, page = 1) {
    this.establishmentName = establishmentName;
    this.uuid = uuid;
    this.language = language;
    this.limit = limit;
    this.page = page;
    const queryWithoutOffset = new Query()
      .addFilter('field_moj_top_level_categories.id', uuid)
      .addFields('node--page', CategoryContentQuery.#TILE_FIELDS)
      .addFields('node--moj_video_item', CategoryContentQuery.#TILE_FIELDS)
      .addFields('node--moj_radio_item', CategoryContentQuery.#TILE_FIELDS)
      .addFields('moj_pdf_item', CategoryContentQuery.#TILE_FIELDS)
      .addInclude(['field_moj_thumbnail_image'])
      .addSort('created', 'DESC')
      .getQueryString();
    this.query = `${queryWithoutOffset}&${getPagination(page, limit)}`;
  }

  getKey() {
    return getCmsCacheKey(
      'categoryContent',
      this.language,
      this.establishmentName,
      this.uuid,
      `limit:${this.limit}`,
      `page:${this.page}`,
    );
  }

  getExpiry() {
    return 60;
  }

  path() {
    return `/${this.language}/jsonapi/prison/${this.establishmentName}/node?${this.query}`;
  }

  transform(deserializedResponse, links) {
    if (deserializedResponse.length === 0) return null;
    return {
      isLastPage: !links.next,
      data: deserializedResponse.map(getSmallTile),
    };
  }
}

module.exports = { CategoryContentQuery };
