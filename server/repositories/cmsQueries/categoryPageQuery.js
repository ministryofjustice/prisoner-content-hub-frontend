/* eslint-disable class-methods-use-this */
const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const { getSmallTile, getLargeTile } = require('../../utils/jsonApi');

class CategoryPageQuery {
  static #TILE_FIELDS = [
    'drupal_internal__nid',
    'drupal_internal__tid',
    'title',
    'field_moj_description',
    'field_moj_thumbnail_image',
    'field_featured_image',
    'field_moj_secondary_tags',
    'path',
  ];

  constructor(establishmentName, uuid) {
    this.establishmentName = establishmentName;
    this.uuid = uuid;
    this.query = new Query()
      .addFields('node--page', CategoryPageQuery.#TILE_FIELDS)
      .addFields('node--moj_video_item', CategoryPageQuery.#TILE_FIELDS)
      .addFields('node--moj_radio_item', CategoryPageQuery.#TILE_FIELDS)
      .addFields('moj_pdf_item', CategoryPageQuery.#TILE_FIELDS)
      .addFields('taxonomy_term_series', CategoryPageQuery.#TILE_FIELDS)
      .addInclude([
        'field_featured_tiles',
        'field_featured_tiles.field_moj_thumbnail_image',
        'field_featured_tiles.field_featured_image',
      ])
      .addPageLimit(100)
      .getQueryString();
  }

  path() {
    return `/jsonapi/prison/${this.establishmentName}/taxonomy_term/moj_categories/${this.uuid}?${this.query}`;
  }

  getTile(item, index) {
    return index === 0
      ? { ...getLargeTile(item), summary: '' }
      : getSmallTile(item);
  }

  transform(data) {
    return {
      title: data?.name,
      contentType: 'category',
      description: data?.description?.processed,
      config: {
        content: true,
        header: false,
        postscript: true,
        returnUrl: data?.path?.alias,
      },
      categoryFeaturedContent: data?.fieldFeaturedTiles
        .filter(({ title = null, name = null }) => title || name)
        .map(this.getTile),
    };
  }
}

module.exports = { CategoryPageQuery };
