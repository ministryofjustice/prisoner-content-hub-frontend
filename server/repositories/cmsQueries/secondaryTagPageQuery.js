const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const {
  getSmallTile,
  getLargeTile,
  getPagination,
} = require('../../utils/jsonApi');

class SecondaryTagPageQuery {
  static #TILE_FIELDS = [
    'drupal_internal__nid',
    'title',
    'field_moj_description',
    'field_moj_thumbnail_image',
    'path',
    'field_moj_secondary_tags',
  ];

  constructor(establishmentName, uuid, page) {
    this.establishmentName = establishmentName;
    this.uuid = uuid;
    const queryWithoutOffset = new Query()
      .addFilter('field_moj_secondary_tags.id', uuid)
      .addFields('node--page', SecondaryTagPageQuery.#TILE_FIELDS)
      .addFields('node--moj_video_item', SecondaryTagPageQuery.#TILE_FIELDS)
      .addFields('node--moj_radio_item', SecondaryTagPageQuery.#TILE_FIELDS)
      .addFields('moj_pdf_item', SecondaryTagPageQuery.#TILE_FIELDS)
      .addFields('file--file', ['image_style_uri'])
      .addFields('taxonomy_term--tags', [
        'name',
        'description',
        'drupal_internal__tid',
        'field_featured_image',
        'path',
        'field_exclude_feedback',
      ])
      .addInclude([
        'field_moj_thumbnail_image',
        'field_moj_secondary_tags.field_featured_image',
      ])
      .addSort('created', 'DESC')
      .getQueryString();
    this.query = `${queryWithoutOffset}&${getPagination(page)}`;
  }

  path() {
    return `/jsonapi/prison/${this.establishmentName}/node?${this.query}`;
  }

  #getTag = fieldMojSecondaryTags => {
    const item = fieldMojSecondaryTags.find(({ id }) => id === this.uuid);
    return {
      ...getLargeTile(item),
      excludeFeedback: item.fieldExcludeFeedback,
    };
  };

  transform(deserializedResponse) {
    if (deserializedResponse.length === 0) return null;
    return {
      ...this.#getTag(deserializedResponse[0].fieldMojSecondaryTags),
      ...{
        relatedContent: {
          contentType: 'default',
          data: deserializedResponse.map(item => getSmallTile(item)),
        },
      },
    };
  }
}

module.exports = { SecondaryTagPageQuery };
