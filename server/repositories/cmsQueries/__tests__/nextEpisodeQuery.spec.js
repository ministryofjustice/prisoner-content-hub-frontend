const { NextEpisodeQuery } = require('../nextEpisodeQuery');

describe('Next Episode query', () => {
  const query = new NextEpisodeQuery('berwyn');
  describe('path', () => {
    it('should create correct path', async () => {
      expect(query.path()).toStrictEqual(
        '/jsonapi/prison/berwyn/node?filter%5Bseries_sort_value%5D%5Bcondition%5D%5Bpath%5D=series_sort_value&filter%5Bseries_sort_value%5D%5Bcondition%5D%5Boperator%5D=%3E&include=field_moj_thumbnail_image&page%5Blimit%5D=3&sort=series_sort_value&fields%5Bnode--page%5D=drupal_internal__nid%2Cfield_moj_episode%2Ctitle%2Cfield_moj_season%2Cfield_moj_series%2Cseries_sort_value%2Cfield_moj_thumbnail_image&fields%5Bnode--moj_video_item%5D=drupal_internal__nid%2Cfield_moj_episode%2Ctitle%2Cfield_moj_season%2Cfield_moj_series%2Cseries_sort_value%2Cfield_moj_thumbnail_image&fields%5Bnode--moj_radio_item%5D=drupal_internal__nid%2Cfield_moj_episode%2Ctitle%2Cfield_moj_season%2Cfield_moj_series%2Cseries_sort_value%2Cfield_moj_thumbnail_image&fields%5Bnode--moj_pdf_item%5D=drupal_internal__nid%2Cfield_moj_episode%2Ctitle%2Cfield_moj_season%2Cfield_moj_series%2Cseries_sort_value%2Cfield_moj_thumbnail_image&fields%5Bnode--landing_page%5D=drupal_internal__nid%2Cfield_moj_episode%2Ctitle%2Cfield_moj_season%2Cfield_moj_series%2Cseries_sort_value%2Cfield_moj_thumbnail_image&fields%5Bfile--file%5D=uri%2Cimage_style_uri',
      );
    });
  });

  describe('transform', () => {
    it('should create correct tag structure', async () => {
      const nextEpisodes = {
        drupalInternal_Nid: 3647,
        fieldMojEpisode: 1001,
        title: 'Your news, stories and ideas here',
        fieldMojSeason: null,
        seriesSortValue: 1001,
        fieldMojThumbnailImage: {
          type: 'file--file',
          uri: {
            url: 'https://cms.org/jdajsgjdfj.jpg',
          },
          resourceIdObjMeta: {
            alt: 'faith',
          },
        },
      };

      expect(query.transformEach(nextEpisodes)).toStrictEqual({
        id: 3647,
        episodeId: 1001,
        title: 'Your news, stories and ideas here',
        seasonId: null,
        seriesSortValue: 1001,
        image: {
          url: 'https://cms.org/jdajsgjdfj.jpg',
          alt: 'faith',
        },
      });
    });
  });
});
