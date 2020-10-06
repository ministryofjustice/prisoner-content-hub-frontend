const createHubMenuService = repository => {
  function primaryMenu() {
    return repository.primaryMenu();
  }

  function tagsMenu() {
    return repository.tagsMenu();
  }

  function allTopics(prisonId) {
    return repository.allTopics(prisonId);
  }

  function categoryMenu({ category, prisonId }) {
    return repository.categoryMenu({ category, prisonId });
  }

  return {
    tagsMenu,
    primaryMenu,
    categoryMenu,
    allTopics,
  };
};

module.exports = {
  createHubMenuService,
};
