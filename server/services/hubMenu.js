const createHubMenuService = repository => ({
  allTopics: prisonId => repository.allTopics(prisonId),
});

module.exports = {
  createHubMenuService,
};
