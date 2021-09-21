const { VideoPageQuery } = require('../videoPageQuery');

describe('Video page query', () => {
  const query = new VideoPageQuery('https://cms/content/1234');
  describe('url', () => {
    it('should create correct path', async () => {
      expect(query.url()).toStrictEqual(
        'https://cms/content/1234?include=field_moj_thumbnail_image%2Cfield_moj_series%2Cfield_video%2Cfield_moj_secondary_tags%2Cfield_moj_top_level_categories&fields%5Bnode--moj_video_item%5D=drupal_internal__nid%2Ctitle%2Cfield_video%2Cfield_moj_description%2Cfield_moj_secondary_tags%2Cfield_moj_series%2Cfield_moj_season%2Cfield_moj_episode%2Cfield_moj_top_level_categories%2Cfield_moj_thumbnail_image%2Cseries_sort_value&fields%5Bfile--file%5D=uri%2Cimage_style_uri&fields%5Btaxonomy_term--series%5D=drupal_internal__tid%2Cname%2Cpath&fields%5Btaxonomy_term--tags%5D=drupal_internal__tid%2Cname%2Cpath&fields%5Btaxonomy_term--moj_categories%5D=drupal_internal__tid%2Cname',
      );
    });
  });

  describe('transform', () => {
    it('should create correct video page structure', async () => {
      const videoPage = {
        type: 'node--node--moj_video_item',
        id: '43eb4a97-e6ef-440c-a044-88e9bb982620',
        drupalInternal_Nid: 6236,
        title: 'Buddhist reflection: 29 July',
        fieldMojDescription: { processed: 'Education content for prisoners' },
        fieldMojEpisode: 36,
        fieldMojSeason: 1,
        seriesSortValue: 1001,

        fieldVideo: {
          type: 'file--file',
          uri: {
            url: 'https://cms.org/jdajsgjdfj.mp4',
          },

          resourceIdObjMeta: {
            display: true,
            description: '',
            drupal_internal__target_id: 16361,
          },
        },
        fieldMojSecondaryTags: [
          {
            type: 'taxonomy_term--tags',
            id: '8ada6f1f-e282-48b2-a9d1-4193f7354203',
            drupalInternal_Tid: 741,
            name: 'Self-help',

            resourceIdObjMeta: {
              drupal_internal__target_id: 741,
            },
          },
        ],
        fieldMojSeries: {
          type: 'taxonomy_term--series',
          id: '224be00f-0d74-4948-b937-7b50e0b40be4',
          drupalInternal_Tid: 923,
          name: 'Buddhist',
          path: {
            alias: '/tags/923',
            pid: 8418,
            langcode: 'en',
          },

          resourceIdObjMeta: {
            drupal_internal__target_id: 923,
          },
        },
        fieldMojThumbnailImage: {
          type: 'file--file',
          imageStyleUri: [
            {
              tile_large: 'https://cms.org/jdajsgjdfj.jpg',
            },
          ],
          resourceIdObjMeta: {
            alt: 'faith',
          },
        },
        fieldMojTopLevelCategories: [
          {
            type: 'taxonomy_term--moj_categories',
            id: '8d9eaf09-a53e-42d9-a7be-2a2f04a0f315',
            name: 'steve',
            resourceIdObjMeta: {
              drupal_internal__target_id: 648,
            },
          },
        ],
      };

      expect(query.transform(videoPage)).toStrictEqual({
        categories: [{ id: 648, uuid: '8d9eaf09-a53e-42d9-a7be-2a2f04a0f315', name: 'steve' }],
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
        seriesSortValue: 1001,
        secondaryTags: [
          {
            id: 741,
            name: 'Self-help',
            uuid: '8ada6f1f-e282-48b2-a9d1-4193f7354203',
          },
        ],
        seriesId: 923,
        seriesName: 'Buddhist',
        seriesPath: '/tags/923',
        title: 'Buddhist reflection: 29 July',
      });
    });
  });
});
