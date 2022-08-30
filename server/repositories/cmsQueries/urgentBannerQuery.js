const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');

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
      ])

      .addInclude(['field_more_info_page'])

      .getQueryString();
  }

  path() {
    return `/jsonapi/prison/${this.establishmentName}/node/urgent_banner?${this.query}`;
  }

  transformEach(banner) {
    return {
      title: banner.title,
      more_info_link: banner.fieldMoreInfoPage?.path?.alias,
    };
  }
}

module.exports = { UrgentBannerQuery };
