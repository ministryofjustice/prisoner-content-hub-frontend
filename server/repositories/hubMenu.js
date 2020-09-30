const { path, pathOr } = require('ramda');
const config = require('../config');
const {
  tagIdFrom,
  nameFrom,
  termDescriptionValueFrom,
} = require('../selectors/hub');
const {
  getEstablishmentName,
  getEstablishmentFormattedName,
  getEstablishmentUiId,
} = require('../utils');

function hubMenuRepository(httpClient, jsonClient) {
  const sortAlphabetically = (a, b) => {
    if (
      a.linkText.charAt(0).toLowerCase() > b.linkText.charAt(0).toLowerCase()
    ) {
      return 1;
    }
    return -1;
  };

  async function tagsMenu() {
    const response = await httpClient.get(config.api.tags);
    return parseTagsResponse(response);
  }

  async function primaryMenu(prisonId = 0) {
    const response = await jsonClient.get(config.api.primary);
    return parseJsonResponse(response, prisonId);
  }

  async function allTopics(prisonId) {
    const tags = await tagsMenu();
    const primary = await primaryMenu(prisonId);

    return tags.concat(primary).sort(sortAlphabetically);
  }

  function gettingAJobMenu(prisonId) {
    return pathOr([], ['establishments', prisonId, 'workingIn'], config);
  }

  async function categoryMenu({ categoryId, prisonId }) {
    const query = {
      _category: categoryId,
      _prison: prisonId,
    };
    const response = await httpClient.get(config.api.categoryMenu, { query });

    return parseCategoryMenu(response, prisonId, categoryId);
  }

  function parseJsonResponse(data, prisonId) {
    if (data === null) return [];

    const items = Object.keys(data.data)
      .filter(key => {
        const { relationships } = data.data[key];
        const prisons = path(['field_moj_prisons', 'data'], relationships);
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
          description: path(['field_moj_description', 'processed'], attributes),
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

  function parseCategoryMenu(data, prisonId, categoryId) {
    if (data === null) return [];

    const series = parseTagsResponse(data.series_ids);

    // inject extra link
    if (Number(categoryId) === 645) {
      const establishmentName = getEstablishmentName(prisonId);
      const link = {
        id: `working-in-${establishmentName}`,
        linkText: `Working in ${getEstablishmentFormattedName(prisonId)}`,
        href: `/working-in-${establishmentName}`,
      };

      return [link, ...series];
    }

    return series;
  }

  return {
    tagsMenu,
    primaryMenu,
    gettingAJobMenu,
    categoryMenu,
    allTopics,
  };
}

module.exports = {
  hubMenuRepository,
};
