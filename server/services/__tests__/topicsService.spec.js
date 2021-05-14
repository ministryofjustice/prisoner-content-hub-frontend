const { TopicsService } = require('../topics');

describe('Topics Service', () => {
  const cmsApi = { getTopics: jest.fn() };
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
      cmsApi.getTopics.mockResolvedValue([createTopic('topic')]);

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

    it('sorts topic by link text ignoring case', async () => {
      cmsApi.getTopics.mockResolvedValue([
        createTopic('Ad'),
        createTopic('Aa'),
        createTopic('ab'),
      ]);

      const result = await topicService.getTopics('berwyn');

      expect(result.map(r => r.linkText)).toStrictEqual(['Aa', 'ab', 'Ad']);
    });

    it('Source to have been called correctly', async () => {
      cmsApi.getTopics.mockResolvedValue([]);

      await topicService.getTopics('berwyn');

      expect(cmsApi.getTopics).toHaveBeenCalledWith('berwyn');
    });

    it('Propagates errors from cmsApi', async () => {
      cmsApi.getTopics.mockRejectedValue(Error('some error!'));

      return expect(topicService.getTopics('berwyn')).rejects.toEqual(
        Error('some error!'),
      );
    });
  });
});
