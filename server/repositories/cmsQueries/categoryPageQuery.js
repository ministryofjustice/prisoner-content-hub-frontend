/* eslint-disable class-methods-use-this */
const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const { getSmallTile } = require('../../utils/jsonApi');
const { typeFrom } = require('../../utils/adapters');

class CategoryPageQuery {
  static #TILE_FIELDS = [
    'drupal_internal__nid',
    'title',
    'field_moj_description',
    'field_moj_thumbnail_image',
    'field_moj_secondary_tags',
  ];

  constructor(establishmentName, uuid) {
    this.establishmentName = establishmentName;
    this.uuid = uuid;
    this.query = new Query()
      .addFields('node--page', CategoryPageQuery.#TILE_FIELDS)
      .addFields('node--moj_video_item', CategoryPageQuery.#TILE_FIELDS)
      .addFields('node--moj_radio_item', CategoryPageQuery.#TILE_FIELDS)
      .addFields('moj_pdf_item', CategoryPageQuery.#TILE_FIELDS)
      .addInclude([
        'field_featured_tiles',
        'field_featured_tiles.field_moj_thumbnail_image',
      ])

      .getQueryString();
  }

  path() {
    return `/jsonapi/prison/${this.establishmentName}/taxonomy_term/moj_categories/${this.uuid}?${this.query}`;
  }

  getTile(item) {
    switch (typeFrom(item?.type)) {
      case 'radio':
      case 'pdf':
      case 'video':
      case 'page':
        return getSmallTile(item);
      case 'landing_page':
      case 'series':
      case 'tags':
      default:
        return null;
    }
  }

  transform(data) {
    const id =
      data?.fieldLegacyLandingPage?.resourceIdObjMeta
        ?.drupal_internal__target_id;
    return {
      title: data?.name,
      contentType: 'landing-page',
      description: data?.description?.processed,
      config: {
        content: true,
        header: false,
        postscript: true,
        returnUrl: `/content/${id}`,
      },
      categoryFeaturedContent: data?.fieldFeaturedTiles
        .map(item => this.getTile(item))
        .filter(item => item),
    };
  }
}

module.exports = { CategoryPageQuery };
