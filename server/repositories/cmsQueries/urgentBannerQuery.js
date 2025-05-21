const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const { getCmsCacheKey } = require('../../utils/caching/cms');

class UrgentBannerQuery {
  constructor(establishmentName, language) {
    this.establishmentName = establishmentName;
    this.language = language;
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
    return getCmsCacheKey(
      'urgentBanner',
      this.language,
      this.establishmentName,
    );
  }

  getExpiry() {
    return 300;
  }

  path() {
    return `/${this.language}/jsonapi/prison/${this.establishmentName}/node/urgent_banner?${this.query}`;
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
