const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const {
  getSmallTile,
  getLargeTile,
  getPagination,
  mapBreadcrumbs,
} = require('../../utils/jsonApi');
const { getCmsCacheKey } = require('../../utils/caching/cms');

class TopicPageQuery {
  static #TILE_FIELDS = [
    'drupal_internal__nid',
    'title',
    'field_summary',
    'field_moj_thumbnail_image',
    'field_topics',
    'path',
    'published_at',
  ];

  constructor(establishmentName, uuid, page) {
    this.establishmentName = establishmentName;
    this.uuid = uuid;
    this.page = page;
    const queryWithoutOffset = new Query()
      .addFilter('field_topics.id', uuid)
      .addFields('node--page', TopicPageQuery.#TILE_FIELDS)
      .addFields('node--moj_video_item', TopicPageQuery.#TILE_FIELDS)
      .addFields('node--moj_radio_item', TopicPageQuery.#TILE_FIELDS)
      .addFields('node--moj_pdf_item', TopicPageQuery.#TILE_FIELDS)
      .addFields('file--file', ['image_style_uri'])
      .addFields('taxonomy_term--topics', [
        'name',
        'description',
        'drupal_internal__tid',
        'field_moj_thumbnail_image',
        'path',
        'field_exclude_feedback',
        'breadcrumbs',
      ])
      .addInclude([
        'field_moj_thumbnail_image',
        'field_topics.field_moj_thumbnail_image',
      ])
      .addSort('created', 'DESC')
      .getQueryString();
    this.query = `${queryWithoutOffset}&${getPagination(page)}`;
  }

  getKey() {
    return getCmsCacheKey(
      'topicPage',
      this.establishmentName,
      this.uuid,
      `page:${this.page}`,
    );
  }

  getExpiry() {
    return 3600;
  }

  path() {
    return `/jsonapi/prison/${this.establishmentName}/node?${this.query}`;
  }

  #getTopic = fieldTopics => {
    const item = fieldTopics.find(({ id }) => id === this.uuid);
    return {
      ...getLargeTile(item),
      excludeFeedback: item.fieldExcludeFeedback,
      breadcrumbs: mapBreadcrumbs(item.breadcrumbs, item.name),
    };
  };

  transform(deserializedResponse, links) {
    if (deserializedResponse.length === 0) return null;
    return {
      ...this.#getTopic(deserializedResponse[0].fieldTopics),
      ...{
        hubContentData: {
          contentType: 'topic',
          isLastPage: !links.next,
          data: deserializedResponse.map(item => getSmallTile(item)),
        },
      },
    };
  }
}

module.exports = { TopicPageQuery };
