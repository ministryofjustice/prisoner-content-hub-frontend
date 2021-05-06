const { TopicsService } = require('../topics');

describe('Topics Service', () => {
  const hubMenuRepo = { tagsMenu: jest.fn() };
  const cmsApi = { primaryMenu: jest.fn() };
  let topicService;

  beforeEach(() => {
    jest.resetAllMocks();
    topicService = new TopicsService(hubMenuRepo, cmsApi);
  });

  const createTopic = name => ({
    description: `${name} Desc`,
    href: '/content/1',
    id: '1',
    linkText: name,
  });

  describe('getTopics', () => {
    it('returns topics from both sources', async () => {
      hubMenuRepo.tagsMenu.mockResolvedValue([createTopic('Hub menu topic')]);
      cmsApi.primaryMenu.mockResolvedValue([createTopic('Primary menu topic')]);

      const result = await topicService.getTopics(1);

      expect(result).toStrictEqual([
        {
          description: 'Hub menu topic Desc',
          href: '/content/1',
          id: '1',
          linkText: 'Hub menu topic',
        },
        {
          description: 'Primary menu topic Desc',
          href: '/content/1',
          id: '1',
          linkText: 'Primary menu topic',
        },
      ]);
    });

    it('sorts topic by link text ignoring case', async () => {
      hubMenuRepo.tagsMenu.mockResolvedValue([
        createTopic('Ad'),
        createTopic('Aa'),
        createTopic('ab'),
      ]);
      cmsApi.primaryMenu.mockResolvedValue([createTopic('Ac')]);

      const result = await topicService.getTopics(1);

      expect(result.map(r => r.linkText)).toStrictEqual([
        'Aa',
        'ab',
        'Ac',
        'Ad',
      ]);
    });

    it('Sources to have been called correctly', async () => {
      hubMenuRepo.tagsMenu.mockResolvedValue([]);
      cmsApi.primaryMenu.mockResolvedValue([]);

      await topicService.getTopics(1);

      expect(hubMenuRepo.tagsMenu).toHaveBeenCalledWith(1);
      expect(cmsApi.primaryMenu).toHaveBeenCalledWith(1);
    });

    it('Sources to have been called correctly', async () => {
      hubMenuRepo.tagsMenu.mockResolvedValue([]);
      cmsApi.primaryMenu.mockResolvedValue([]);

      await topicService.getTopics(1);

      expect(hubMenuRepo.tagsMenu).toHaveBeenCalledWith(1);
      expect(cmsApi.primaryMenu).toHaveBeenCalledWith(1);
    });

    it('Propagates errors from cmsApi', async () => {
      hubMenuRepo.tagsMenu.mockRejectedValue(Error('some error!'));
      cmsApi.primaryMenu.mockResolvedValue([]);

      return expect(topicService.getTopics(1)).rejects.toEqual(
        Error('some error!'),
      );
    });

    it('Propagates errors from hub menu repo', async () => {
      hubMenuRepo.tagsMenu.mockResolvedValue([]);
      cmsApi.primaryMenu.mockRejectedValue(Error('some error!'));

      return expect(topicService.getTopics(1)).rejects.toEqual(
        Error('some error!'),
      );
    });
  });
});
