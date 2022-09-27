const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const { getLargeTile } = require('../../utils/jsonApi');
const { getCmsCacheKey } = require('../../utils/caching/cms');

class SeriesHeaderPageQuery {
  constructor(location) {
    this.location = location;
    this.query = new Query()
      .addFields('taxonomy_term--series', [
        'name',
        'description',
        'drupal_internal__tid',
        'field_moj_thumbnail_image',
        'path',
        'published_at',
      ])
      .addInclude(['field_moj_thumbnail_image'])
      .getQueryString();
  }

  getKey() {
    return getCmsCacheKey('seriesHeaderPage', this.establishmentName);
  }

  getExpiry() {
    return 300;
  }

  url() {
    return `${this.location}?${this.query}`;
  }

  transform(item) {
    return getLargeTile(item);
  }
}

module.exports = { SeriesHeaderPageQuery };
