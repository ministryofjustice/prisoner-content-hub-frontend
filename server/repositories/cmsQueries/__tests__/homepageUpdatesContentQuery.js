const {
  HomepageUpdatesContentQuery,
} = require('../homepageUpdatesContentQuery');

describe('Recently Added Content page query', () => {
  const ESTABLISHMENTNAME = 'Wayland';
  let query;

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2020-02-20'));
    query = new HomepageUpdatesContentQuery(ESTABLISHMENTNAME, 1, 40);
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  describe('path', () => {
    it('should return correct path', () => {
      expect(query.path()).toStrictEqual(
        `/jsonapi/prison/${ESTABLISHMENTNAME}/node?filter%5Bcategories_group%5D%5Bgroup%5D%5Bconjunction%5D=OR&filter%5Bfield_moj_top_level_categories.field_is_homepage_updates%5D%5Bcondition%5D%5Bpath%5D=field_moj_top_level_categories.field_is_homepage_updates&filter%5Bfield_moj_top_level_categories.field_is_homepage_updates%5D%5Bcondition%5D%5Bvalue%5D=true&filter%5Bfield_moj_top_level_categories.field_is_homepage_updates%5D%5Bcondition%5D%5BmemberOf%5D=categories_group&filter%5Bfield_moj_series.field_is_homepage_updates%5D%5Bcondition%5D%5Bpath%5D=field_moj_series.field_is_homepage_updates&filter%5Bfield_moj_series.field_is_homepage_updates%5D%5Bcondition%5D%5Bvalue%5D=true&filter%5Bfield_moj_series.field_is_homepage_updates%5D%5Bcondition%5D%5BmemberOf%5D=categories_group&filter%5Bpublished_at%5D%5Bvalue%5D=1574380800&filter%5Bpublished_at%5D%5Boperator%5D=%3E%3D&include=field_moj_thumbnail_image&sort=-published_at%2Ccreated&fields%5Bnode--page%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_moj_description%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id%2Cpublished_at&fields%5Bnode--moj_video_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_moj_description%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id%2Cpublished_at&fields%5Bnode--moj_radio_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_moj_description%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id%2Cpublished_at&fields%5Bnode--moj_pdf_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_moj_description%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id%2Cpublished_at&fields%5Bfile--file%5D=drupal_internal__fid%2Cid%2Cimage_style_uri&page[offset]=0&page[limit]=40`,
      );
    });
  });

  describe('transform', () => {
    let links;
    let responseItem;
    let responseItemProcessed;
    let responseLargeItemProcessed;

    beforeEach(() => {
      links = {
        next: 'URL',
      };
      responseItem = {
        type: 'node--moj_video_item',
        drupalInternal_Nid: 111111,
        published_at: '2022-07-09T14:53:27+00:00',
        title: 'A Title',
        path: {
          alias: '/content/111111',
        },
        fieldMojDescription: {
          summary: 'A Summary',
        },
        fieldMojThumbnailImage: {
          imageStyleUri: [
            {
              tile_large: 'AWS_URL',
            },
            {
              tile_small: 'AWS_URL',
            },
          ],
          resourceIdObjMeta: {
            alt: 'IMAGE_ALT_TEXT',
          },
        },
      };
      responseLargeItemProcessed = {
        id: 111111,
        contentType: 'video',
        externalContent: false,
        title: 'A Title',
        summary: 'A Summary',
        contentUrl: '/content/111111',
        displayUrl: undefined,
        image: {
          url: 'AWS_URL',
          alt: 'IMAGE_ALT_TEXT',
        },
        isNew: false,
      };
      responseItemProcessed = {
        ...responseLargeItemProcessed,
        publishedAt: '',
      };
    });

    it('should return a blank object when an empty array is provided', () => {
      const result = query.transform([], links);

      expect(result).toStrictEqual({
        isLastPage: true,
        largeUpdateTileDefault: null,
        updatesContent: [],
      });
    });

    it('should create correct structure', () => {
      const result = query.transform([responseItem], links);

      expect(result).toStrictEqual({
        isLastPage: false,
        largeUpdateTileDefault: responseLargeItemProcessed,
        updatesContent: [responseItemProcessed],
      });
    });

    it('should recognise if it is the last page', () => {
      const result = query.transform([responseItem], {});

      expect(result).toStrictEqual({
        isLastPage: true,
        largeUpdateTileDefault: responseLargeItemProcessed,
        updatesContent: [responseItemProcessed],
      });
    });
  });
});
