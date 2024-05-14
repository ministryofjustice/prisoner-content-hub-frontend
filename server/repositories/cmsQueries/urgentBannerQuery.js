const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const { getCmsCacheKey } = require('../../utils/caching/cms');

class UrgentBannerQuery {
  constructor(establishmentName) {
    this.establishmentName = establishmentName;
    this.query = new Query()

      .addFields('node--urgent_banner', [
        'drupal_internal__nid',
        'title',
        'created',
        'changed',
        'field_more_info_page',
        'unpublish_on',
      ])

      .addInclude(['field_more_info_page'])

      .getQueryString();
  }

  getKey() {
    return getCmsCacheKey('urgentBanner', this.establishmentName);
  }

  getExpiry() {
    return 3600;
  }

  path() {
    return `/jsonapi/prison/${this.establishmentName}/node/urgent_banner?${this.query}`;
  }

  transformEach(banner) {
    return {
      title: banner.title,
      moreInfoLink: banner.fieldMoreInfoPage?.path?.alias,
      unpublishOn: new Date(banner.unpublish_on).getTime() || null,
    };
  }
}

module.exports = { UrgentBannerQuery };
