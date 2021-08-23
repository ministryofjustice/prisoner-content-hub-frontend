const { CmsApi } = require('../../repositories/cmsApi');
const {
  BasicPageQuery,
} = require('../../repositories/cmsQueries/basicPageQuery');
const {
  HomepageQuery,
} = require('../../repositories/cmsQueries/homepageQuery');
const { TopicsQuery } = require('../../repositories/cmsQueries/topicsQuery');
const { CmsService } = require('../cms');

jest.mock('../../repositories/cmsApi');

describe('cms Service', () => {
  const cmsApi = new CmsApi();
  let cmsService;

  beforeEach(() => {
    jest.resetAllMocks();
    cmsService = new CmsService(cmsApi);
  });

  describe('getContent', () => {
    const createBasicPage = () => ({
      id: 5923,
      title: 'Novus',
      contentType: 'node--page',
      description: 'Education content for prisoners',
      standFirst: 'Education',
      categories: [1234],
      secondaryTags: [2345],
    });

    it('returns basic pages', async () => {
      cmsApi.get.mockResolvedValue(createBasicPage());
      cmsApi.lookupContent.mockResolvedValue({
        type: 'node--page',
        location: 'https://cms.org/content/1234',
      });

      const result = await cmsService.getContent(1234);

      expect(result).toStrictEqual({
        categories: [1234],
        contentType: 'node--page',
        description: 'Education content for prisoners',
        id: 5923,
        secondaryTags: [2345],
        standFirst: 'Education',
        title: 'Novus',
      });
    });

    it('handles unknown content', async () => {
      cmsApi.lookupContent.mockResolvedValue({
        type: 'node--unknown',
        location: 'https://cms.org/content/1234',
      });

      const result = await cmsService.getContent(1234);

      expect(result).toStrictEqual(null);
    });

    it('Source to have been called correctly', async () => {
      cmsApi.get.mockResolvedValue(createBasicPage());
      cmsApi.lookupContent.mockResolvedValue({
        type: 'node--page',
        location: 'https://cms.org/content/1234',
      });

      await cmsService.getContent(1234);

      expect(cmsApi.lookupContent).toHaveBeenCalledWith(1234, undefined);
      expect(cmsApi.get).toHaveBeenCalledWith(
        new BasicPageQuery('https://cms.org/content/1234'),
      );
    });
  });

  describe('getTopics', () => {
    const createTopic = name => ({
      description: `${name} Desc`,
      href: '/content/1',
      id: '1',
      linkText: name,
    });

    it('returns topics', async () => {
      cmsApi.get.mockResolvedValue([createTopic('topic')]);

      const result = await cmsService.getTopics('berwyn');

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

      await cmsService.getTopics('berwyn');

      expect(cmsApi.get).toHaveBeenCalledWith(new TopicsQuery('berwyn'));
    });
  });

  describe('getHomepage', () => {
    const homepage = {
      upperFeatured: {
        id: '10002',
        contentUrl: '/content/10002',
        contentType: 'moj_video_item',
        isSeries: true,
        title: 'Yoga',
        summary: 'Yoga workout',
        image: {
          url: 'https://cloud-platform-c3b3.eu-west-2',
          alt: 'Picture of Yoga workout',
        },
      },
      lowerFeatured: {
        id: '10003',
        contentUrl: '/content/10003',
        contentType: 'moj_video_item',
        isSeries: false,
        title: 'Lower Abs workout',
        summary: 'Intense lower core workout',
        image: {
          url: 'https://cloud-platform-c3b3.eu-west-2',
          alt: 'Picture of core workout',
        },
      },
      smallTiles: [
        {
          id: '10001',
          contentUrl: '/content/10001',
          contentType: 'moj_video_item',
          isSeries: true,
          title: 'Lower Abs workout',
          summary: 'Intense lower core workout',
          image: {
            url: 'https://cloud-platform-c3b3.eu-west-2',
            alt: 'Picture of core workout',
          },
        },
      ],
    };

    it('returns homepage content', async () => {
      cmsApi.get.mockResolvedValue([homepage]);

      const result = await cmsService.getHomepage('berwyn');

      expect(result).toStrictEqual({
        upperFeatured: {
          id: '10002',
          contentUrl: '/content/10002',
          contentType: 'moj_video_item',
          isSeries: true,
          title: 'Yoga',
          summary: 'Yoga workout',
          image: {
            url: 'https://cloud-platform-c3b3.eu-west-2',
            alt: 'Picture of Yoga workout',
          },
        },
        lowerFeatured: {
          id: '10003',
          contentUrl: '/content/10003',
          contentType: 'moj_video_item',
          isSeries: false,
          title: 'Lower Abs workout',
          summary: 'Intense lower core workout',
          image: {
            url: 'https://cloud-platform-c3b3.eu-west-2',
            alt: 'Picture of core workout',
          },
        },
        smallTiles: [
          {
            id: '10001',
            contentUrl: '/content/10001',
            contentType: 'moj_video_item',
            isSeries: true,
            title: 'Lower Abs workout',
            summary: 'Intense lower core workout',
            image: {
              url: 'https://cloud-platform-c3b3.eu-west-2',
              alt: 'Picture of core workout',
            },
          },
        ],
      });
    });

    it('Source to have been called correctly', async () => {
      cmsApi.get.mockResolvedValue([]);

      await cmsService.getHomepage('berwyn');

      expect(cmsApi.get).toHaveBeenCalledWith(new HomepageQuery('berwyn'));
    });
  });
});
