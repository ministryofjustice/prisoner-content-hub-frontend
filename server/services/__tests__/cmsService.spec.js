const { CmsApi } = require('../../repositories/cmsApi');
const {
  HomepageQuery,
} = require('../../repositories/cmsQueries/homePageQuery');
const { TopicsQuery } = require('../../repositories/cmsQueries/topicsQuery');
const {
  BasicPageQuery,
} = require('../../repositories/cmsQueries/basicPageQuery');
const {
  AudioPageQuery,
} = require('../../repositories/cmsQueries/audioPageQuery');
const {
  VideoPageQuery,
} = require('../../repositories/cmsQueries/videoPageQuery');
const {
  SecondaryTagPageQuery,
} = require('../../repositories/cmsQueries/secondaryTagPageQuery');
const {
  SecondaryTagHeaderPageQuery,
} = require('../../repositories/cmsQueries/secondaryTagHeaderPageQuery');
const {
  NextEpisodeQuery,
} = require('../../repositories/cmsQueries/nextEpisodeQuery');
const { 
  SeriesPageQuery,
} = require('../../repositories/cmsQueries/seriesPageQuery');
const {
  SeriesHeaderPageQuery,
} = require('../../repositories/cmsQueries/seriesHeaderPageQuery');
const { CmsService } = require('../cms');

jest.mock('../../repositories/cmsApi');

describe('cms Service', () => {
  const cmsApi = new CmsApi();
  let cmsService;
  let contentRepository;
  const ESTABLISHMENT_NAME = 'wayland';
  const SERIES_SORT_VALUE = 1001;
  const SERIES_ID = 923;

  beforeEach(() => {
    contentRepository = {
      suggestedContentFor: jest
        .fn()
        .mockReturnValue([{ title: 'foo', href: 'www.foo.com', type: 'foo' }]),
      nextEpisodesFor: jest.fn().mockReturnValue([
        { id: 1, title: 'foo episode' },
        { id: 2, title: 'bar episode' },
      ]),
    };
    cmsService = new CmsService(cmsApi, contentRepository);
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getContent', () => {
    const createBasicPage = () => ({
      id: 5923,
      title: 'Novus',
      contentType: 'page',
      description: 'Education content for prisoners',
      standFirst: 'Education',
      categories: [1234],
      secondaryTags: [2345],
    });

    const createPdfPage = () => ({
      id: 5923,
      title: 'JD Williams',
      contentType: 'pdf',
      url: 'https://cms.org/2021-03/JD%20WILLIAMS%20PDF.pdf',
    });

    const createAudioPage = () => ({
      categories: [648],
      contentType: 'radio',
      description: 'Education content for prisoners',
      episodeId: 1036,
      id: 6236,
      image: {
        alt: 'faith',
        url: 'https://cms.org/jdajsgjdfj.jpg',
      },
      media: 'https://cms.org/jdajsgjdfj.mp3',
      programmeCode: 'FAITH138',
      seasonId: 1,
      seriesSortValue: SERIES_SORT_VALUE,
      secondaryTags: [
        {
          id: 741,
          name: 'Self-help',
        },
      ],
      seriesId: SERIES_ID,
      seriesName: 'Buddhist',
      seriesPath: `/tags/${SERIES_ID}`,
      title: 'Buddhist reflection: 29 July',
    });

    const createVideoPage = () => ({
      categories: [648],
      contentType: 'video',
      description: 'Education content for prisoners',
      episodeId: 1036,
      id: 6236,
      image: {
        alt: 'faith',
        url: 'https://cms.org/jdajsgjdfj.jpg',
      },
      media: 'https://cms.org/jdajsgjdfj.mp4',
      seasonId: 1,
      seriesSortValue: SERIES_SORT_VALUE,
      secondaryTags: [
        {
          id: 741,
          name: 'Self-help',
        },
      ],
      seriesId: SERIES_ID,
      seriesName: 'Buddhist',
      seriesPath: `/tags/${SERIES_ID}`,
      title: 'Buddhist reflection: 29 July',
    });

    const createNextEpisode = () => [
      {
        id: 1,
        title: 'foo episode',
      },
      {
        id: 2,
        title: 'bar episode',
      },
    ];

    it('returns basic pages', async () => {
      cmsApi.get.mockResolvedValue(createBasicPage());
      cmsApi.lookupContent.mockResolvedValue({
        type: 'node--page',
        location: 'https://cms.org/content/1234',
      });

      const result = await cmsService.getContent(1234);

      expect(result).toStrictEqual({
        categories: [1234],
        contentType: 'page',
        description: 'Education content for prisoners',
        id: 5923,
        secondaryTags: [2345],
        standFirst: 'Education',
        title: 'Novus',
      });
    });

    it(`returns PDF content provided by CMS service`, async () => {
      cmsApi.get.mockResolvedValue(createPdfPage());
      cmsApi.lookupContent.mockResolvedValue({
        type: 'node--moj_pdf_item',
        location: 'https://cms.org/content/1234',
      });

      const result = await cmsService.getContent(ESTABLISHMENT_NAME, 793, 1234);

      expect(result).toStrictEqual({
        id: 5923,
        title: 'JD Williams',
        contentType: 'pdf',
        url: 'https://cms.org/2021-03/JD%20WILLIAMS%20PDF.pdf',
      });
    });

    describe(`with audio content`, () => {
      let result;
      beforeEach(async () => {
        cmsApi.get
          .mockResolvedValueOnce(createAudioPage())
          .mockResolvedValueOnce(createNextEpisode());
        cmsApi.lookupContent.mockResolvedValue({
          type: 'node--moj_radio_item',
          location: 'https://cms.org/content/1234',
        });
        result = await cmsService.getContent(ESTABLISHMENT_NAME, 793, 1234);
      });
      it('should make audio query', () => {
        expect(cmsApi.get).toHaveBeenNthCalledWith(
          1,
          new AudioPageQuery('https://cms.org/content/1234'),
        );
      });
      it('should retrieve the next episodes', () => {
        expect(cmsApi.get).toHaveBeenNthCalledWith(
          2,
          new NextEpisodeQuery(
            ESTABLISHMENT_NAME,
            SERIES_ID,
            SERIES_SORT_VALUE,
          ),
        );
      });
      it('should retrieve suggested content', () => {
        expect(contentRepository.suggestedContentFor).toHaveBeenCalledWith({
          establishmentId: 793,
          id: 6236,
        });
      });
      it('returns audio content provided by CMS service', async () => {
        expect(result).toStrictEqual({
          categories: [648],
          contentType: 'radio',
          description: 'Education content for prisoners',
          episodeId: 1036,
          id: 6236,
          image: {
            alt: 'faith',
            url: 'https://cms.org/jdajsgjdfj.jpg',
          },
          media: 'https://cms.org/jdajsgjdfj.mp3',
          nextEpisodes: [
            {
              id: 1,
              title: 'foo episode',
            },
            {
              id: 2,
              title: 'bar episode',
            },
          ],
          programmeCode: 'FAITH138',
          seasonId: 1,
          seriesSortValue: SERIES_SORT_VALUE,
          secondaryTags: [
            {
              id: 741,
              name: 'Self-help',
            },
          ],
          seriesId: SERIES_ID,
          seriesName: 'Buddhist',
          seriesPath: `/tags/${SERIES_ID}`,
          suggestedContent: [
            {
              href: 'www.foo.com',
              title: 'foo',
              type: 'foo',
            },
          ],
          title: 'Buddhist reflection: 29 July',
        });
      });
    });

    describe(`with video content`, () => {
      let result;
      beforeEach(async () => {
        cmsApi.get
          .mockResolvedValueOnce(createVideoPage())
          .mockResolvedValueOnce(createNextEpisode());
        cmsApi.lookupContent.mockResolvedValue({
          type: 'node--moj_video_item',
          location: 'https://cms.org/content/1234',
        });
        result = await cmsService.getContent(ESTABLISHMENT_NAME, 793, 1234);
      });
      it('should make video query', () => {
        expect(cmsApi.get).toHaveBeenNthCalledWith(
          1,
          new VideoPageQuery('https://cms.org/content/1234'),
        );
      });
      it('should retrieve the next episodes', () => {
        expect(cmsApi.get).toHaveBeenNthCalledWith(
          2,
          new NextEpisodeQuery(
            ESTABLISHMENT_NAME,
            SERIES_ID,
            SERIES_SORT_VALUE,
          ),
        );
      });
      it('should retrieve suggested content', () => {
        expect(contentRepository.suggestedContentFor).toHaveBeenCalledWith({
          establishmentId: 793,
          id: 6236,
        });
      });
      it('returns video content provided by CMS service', async () => {
        expect(result).toStrictEqual({
          categories: [648],
          contentType: 'video',
          description: 'Education content for prisoners',
          episodeId: 1036,
          id: 6236,
          image: {
            alt: 'faith',
            url: 'https://cms.org/jdajsgjdfj.jpg',
          },
          media: 'https://cms.org/jdajsgjdfj.mp4',
          nextEpisodes: [
            {
              id: 1,
              title: 'foo episode',
            },
            {
              id: 2,
              title: 'bar episode',
            },
          ],

          seasonId: 1,
          seriesSortValue: SERIES_SORT_VALUE,
          secondaryTags: [
            {
              id: 741,
              name: 'Self-help',
            },
          ],
          seriesId: SERIES_ID,
          seriesName: 'Buddhist',
          seriesPath: `/tags/${SERIES_ID}`,
          suggestedContent: [
            {
              href: 'www.foo.com',
              title: 'foo',
              type: 'foo',
            },
          ],
          title: 'Buddhist reflection: 29 July',
        });
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

      const result = await cmsService.getTopics(ESTABLISHMENT_NAME);

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

      await cmsService.getTopics(ESTABLISHMENT_NAME);

      expect(cmsApi.get).toHaveBeenCalledWith(
        new TopicsQuery(ESTABLISHMENT_NAME),
      );
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

      const result = await cmsService.getHomepage(ESTABLISHMENT_NAME);

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

      await cmsService.getHomepage(ESTABLISHMENT_NAME);

      expect(cmsApi.get).toHaveBeenCalledWith(
        new HomepageQuery(ESTABLISHMENT_NAME),
      );
    });
  });
  describe('getTag', () => {
    const TAG_ID = 9;
    const uuid = 42;

    describe('with a secondary tag', () => {
      const location = 'https://cms.org/tag/1234';
      beforeEach(() => {
        cmsApi.lookupTag.mockResolvedValue({
          type: 'taxonomy_term--tags',
          location,
          uuid,
        });
      });
      describe('which contains related content', () => {
        let result;
        const populatedSecondaryTag = { name: 'le name' };
        beforeEach(async () => {
          cmsApi.get.mockResolvedValue(populatedSecondaryTag);
          result = await cmsService.getTag(ESTABLISHMENT_NAME, TAG_ID);
        });
        it('looks up the tag', () => {
          expect(cmsApi.lookupTag).toHaveBeenCalledWith(
            ESTABLISHMENT_NAME,
            TAG_ID,
          );
        });
        it('returns the tag', async () => {
          expect(cmsApi.get).toHaveBeenCalledTimes(1);
          expect(cmsApi.get).toHaveBeenCalledWith(
            new SecondaryTagPageQuery(ESTABLISHMENT_NAME, uuid),
          );
          expect(result).toBe(populatedSecondaryTag);
        });
      });
      describe('which has no related content', () => {
        let result;
        const populatedSecondaryTag = {};
        beforeEach(async () => {
          cmsApi.get.mockResolvedValueOnce({});
          cmsApi.get.mockResolvedValue(populatedSecondaryTag);
          result = await cmsService.getTag(ESTABLISHMENT_NAME, TAG_ID);
        });
        it('looks up the tag', () => {
          expect(cmsApi.lookupTag).toHaveBeenCalledWith(
            ESTABLISHMENT_NAME,
            TAG_ID,
          );
        });
        it('returns the tag', async () => {
          expect(cmsApi.get).toHaveBeenNthCalledWith(
            1,
            new SecondaryTagPageQuery(ESTABLISHMENT_NAME, uuid),
          );
          expect(cmsApi.get).toHaveBeenNthCalledWith(
            2,
            new SecondaryTagHeaderPageQuery(location),
          );
          expect(result).toBe(populatedSecondaryTag);
        });
      });
    });

    describe('with a series', () => {
      const location = 'https://cms.org/tag/1234';
      beforeEach(() => {
        cmsApi.lookupTag.mockResolvedValue({
          type: 'taxonomy_term--series',
          location,
          uuid,
        });
      });
      describe('which contains related content', () => {
        let result;
        const populatedSeries = { name: 'le name' };
        beforeEach(async () => {
          cmsApi.get.mockResolvedValue(populatedSeries);
          result = await cmsService.getTag(ESTABLISHMENT_NAME, TAG_ID);
        });
        it('looks up the series', () => {
          expect(cmsApi.lookupTag).toHaveBeenCalledWith(
            ESTABLISHMENT_NAME,
            TAG_ID,
          );
        });
        it('returns the series', async () => {
          expect(cmsApi.get).toHaveBeenCalledTimes(1);
          expect(cmsApi.get).toHaveBeenCalledWith(
            new SeriesPageQuery(ESTABLISHMENT_NAME, uuid),
          );
          expect(result).toBe(populatedSeries);
        });
      });
      describe('which has no related content', () => {
        let result;
        const populatedSeries = {};
        beforeEach(async () => {
          cmsApi.get.mockResolvedValueOnce({});
          cmsApi.get.mockResolvedValue(populatedSeries);
          result = await cmsService.getTag(ESTABLISHMENT_NAME, TAG_ID);
        });
        it('looks up the series', () => {
          expect(cmsApi.lookupTag).toHaveBeenCalledWith(
            ESTABLISHMENT_NAME,
            TAG_ID,
          );
        });
        it('returns the series', async () => {
          expect(cmsApi.get).toHaveBeenNthCalledWith(
            1,
            new SeriesPageQuery(ESTABLISHMENT_NAME, uuid),
          );
          expect(cmsApi.get).toHaveBeenNthCalledWith(
            2,
            new SeriesHeaderPageQuery(location),
          );
          expect(result).toBe(populatedSeries);
        });
      });
    });
  });
});
