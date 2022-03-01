const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const { getSmallTile } = require('../../utils/jsonApi');

class CategoryPageQuery {
  static #TILE_FIELDS = [
    'drupal_internal__nid',
    'drupal_internal__tid',
    'title',
    'field_moj_thumbnail_image',
    'field_featured_image',
    'field_moj_secondary_tags',
    'path',
    'field_exclude_feedback',
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
      .addFields('taxonomy_term--moj_categories', [
        'name',
        'description',
        'field_exclude_feedback',
        'field_featured_tiles',
        'breadcrumbs',
        'child_term_count',
      ])
      .addInclude([
        'field_featured_tiles',
        'field_featured_tiles.field_moj_thumbnail_image',
        'field_featured_tiles.field_featured_image',
      ])
      .getQueryString();
  }

  path() {
    return `/jsonapi/prison/${this.establishmentName}/taxonomy_term/moj_categories/${this.uuid}?${this.query}`;
  }

  transform(data) {
    const { name: categoryName = '', breadcrumbs = [] } = data;
    breadcrumbs.push({ title: categoryName });
    return {
      title: categoryName,
      contentType: 'category',
      description: data?.description?.processed,
      excludeFeedback: data.fieldExcludeFeedback,
      breadcrumbs: breadcrumbs.map(({ uri: href = '', title: text }) => ({
        href,
        text,
      })),
      config: {
        content: true,
        header: false,
        postscript: true,
        returnUrl: data?.path?.alias,
      },
      categoryFeaturedContent: data?.fieldFeaturedTiles
        .filter(({ title = null, name = null }) => title || name)
        .slice(0, 12)
        .map(getSmallTile),
    };
  }
}

module.exports = { CategoryPageQuery };
