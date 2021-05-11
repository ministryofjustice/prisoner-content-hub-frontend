const { getEstablishmentUiId } = require('../utils');

class CmsApi {
  constructor(jsonApiClient) {
    this.jsonApiClient = jsonApiClient;
  }

  async primaryMenu(prisonId = 0) {
    const response = await this.jsonApiClient.get(
      `/jsonapi/node/landing_page?fields[node--landing_page]=title,field_moj_description,drupal_internal__nid,field_moj_prisons`,
    );
    return this.transform(response?.data || {}, prisonId);
  }

  // eslint-disable-next-line class-methods-use-this
  transform(data, prisonId) {
    const items = Object.values(data)
      .filter(({ relationships }) => {
        const prisons = relationships?.field_moj_prisons?.data;
        const matchingPrison = prisons.some(
          prison => prison.id === getEstablishmentUiId(prisonId),
        );

        return prisons.length === 0 || matchingPrison;
      })
      .map(({ attributes }) => ({
        id: attributes.drupal_internal__nid,
        linkText: attributes.title,
        description: attributes?.field_moj_description?.processed,
        href: `/content/${attributes.drupal_internal__nid}`,
      }));

    return items;
  }
}

module.exports = { CmsApi };
