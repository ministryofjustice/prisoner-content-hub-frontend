/* eslint-disable class-methods-use-this */
const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');

class SecondaryTagHeaderPageQuery {
  constructor(location) {
    this.location = location;
    this.query = new Query()
      .addFields('taxonomy_term--tags', [
        'name',
        'description',
        'drupal_internal__tid',
        'field_featured_image',
      ])
      .addInclude(['field_featured_image'])
      .getQueryString();
  }

  url() {
    return `${this.location}?${this.query}`;
  }

  transform(item) {
    return {
      id: item?.drupalInternal_Tid,
      contentType: 'tags',
      name: item?.name,
      description: item?.description?.processed,
      image: {
        url: item?.fieldFeaturedImage?.imageStyleUri[0]?.tile_large,
        alt: item?.fieldFeaturedImage?.resourceIdObjMeta?.alt,
      },
    };
  }
}

module.exports = { SecondaryTagHeaderPageQuery };