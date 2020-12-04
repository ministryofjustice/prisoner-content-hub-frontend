const config = require('../config');
const {
  tagIdFrom,
  nameFrom,
  termDescriptionValueFrom,
} = require('../selectors/hub');
const { getEstablishmentUiId } = require('../utils');

function hubMenuRepository(httpClient, jsonClient) {
  const sortAlphabetically = (a, b) => {
    if (
      a.linkText.charAt(0).toLowerCase() > b.linkText.charAt(0).toLowerCase()
    ) {
      return 1;
    }
    return -1;
  };

  async function tagsMenu(prisonId) {
    const query = {
      _prison: prisonId,
    };
    const response = await httpClient.get(config.api.tags, { query });

    if (response === null) return [];

    return parseTagsResponse(response);
  }

  async function primaryMenu(prisonId = 0) {
    const response = await jsonClient.get(config.api.primary);
    return parseJsonResponse(response, prisonId);
  }

  async function allTopics(prisonId) {
    const tags = await tagsMenu(prisonId);
    const primary = await primaryMenu(prisonId);

    return tags.concat(primary).sort(sortAlphabetically);
  }

  async function categoryMenu({ categoryId, prisonId }) {
    const query = {
      _category: categoryId,
      _prison: prisonId,
    };
    const response = await httpClient.get(config.api.categoryMenu, { query });

    if (response === null) return [];

    return parseTagsResponse(response.series_ids);
  }

  function parseJsonResponse(data, prisonId) {
    if (data === null) return [];

    const items = Object.keys(data.data)
      .filter(key => {
        const { relationships } = data.data[key];
        const prisons = relationships?.field_moj_prisons?.data;
        const matchingPrison = prisons.some(
          prison => prison.id === getEstablishmentUiId(prisonId),
        );

        return prisons.length === 0 || matchingPrison;
      })
      .map(key => {
        const { attributes } = data.data[key];

        return {
          id: attributes.drupal_internal__nid,
          linkText: attributes.title,
          description: attributes?.field_moj_description?.processed,
          href: `/content/${attributes.drupal_internal__nid}`,
        };
      });

    return items.sort(sortAlphabetically);
  }

  function parseTagsResponse(data) {
    if (data === null) return [];

    const tags = Object.keys(data).map(key => ({
      id: tagIdFrom(data[key]),
      linkText: nameFrom(data[key]),
      description: termDescriptionValueFrom(data[key]),
      href: `/tags/${tagIdFrom(data[key])}`,
    }));

    return tags.sort(sortAlphabetically);
  }

  return {
    tagsMenu,
    primaryMenu,
    categoryMenu,
    allTopics,
  };
}

module.exports = {
  hubMenuRepository,
};
