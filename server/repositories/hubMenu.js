const config = require('../config');
const {
  tagIdFrom,
  nameFrom,
  termDescriptionValueFrom,
} = require('../selectors/hub');

const caseInsensitive = new Intl.Collator('en', { caseFirst: 'lower' });

function hubMenuRepository(httpClient) {
  async function tagsMenu(prisonId) {
    const query = {
      _prison: prisonId,
    };
    const response = await httpClient.get(config.api.tags, { query });

    if (response === null) return [];

    return parseTagsResponse(response);
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

  function parseTagsResponse(data) {
    if (data === null) return [];

    const tags = Object.keys(data).map(key => ({
      id: tagIdFrom(data[key]),
      linkText: nameFrom(data[key]),
      description: termDescriptionValueFrom(data[key]),
      href: `/tags/${tagIdFrom(data[key])}`,
    }));

    return tags.sort((a, b) => caseInsensitive.compare(a.linkText, b.linkText));
  }

  return {
    categoryMenu,
    tagsMenu,
  };
}

module.exports = {
  hubMenuRepository,
};
