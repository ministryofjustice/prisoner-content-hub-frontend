const { TopicsQuery } = require('../../repositories/cmsQueries/topicsQuery');
const { TopicsService } = require('../topics');

describe('Topics Service', () => {
  const cmsApi = { get: jest.fn() };
  let topicService;

  beforeEach(() => {
    jest.resetAllMocks();
    topicService = new TopicsService(cmsApi);
  });

  const createTopic = name => ({
    description: `${name} Desc`,
    href: '/content/1',
    id: '1',
    linkText: name,
  });

  describe('getTopics', () => {
    it('returns topics', async () => {
      cmsApi.get.mockResolvedValue([createTopic('topic')]);

      const result = await topicService.getTopics('berwyn');

      expect(result).toStrictEqual([
        {
          description: 'topic Desc',
          href: '/content/1',
          id: '1',
          linkText: 'topic',
        },
      ]);
    });

    it('Source to have been called correctly', async () => {
      cmsApi.get.mockResolvedValue([]);

      await topicService.getTopics('berwyn');

      expect(cmsApi.get).toHaveBeenCalledWith(new TopicsQuery('berwyn'));
    });

    it('Propagates errors from cmsApi', async () => {
      cmsApi.get.mockRejectedValue(Error('some error!'));

      return expect(topicService.getTopics('berwyn')).rejects.toEqual(
        Error('some error!'),
      );
    });
  });
});
