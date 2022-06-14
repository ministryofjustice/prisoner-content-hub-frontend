const {
  RecentlyAddedHomepageContentQuery,
} = require('../recentlyAddedHomepageContentQuery');

describe('Recently Added Content page query', () => {
  const ESTABLISHMENTNAME = 'Wayland';
  let query;

  beforeEach(() => {
    query = new RecentlyAddedHomepageContentQuery(ESTABLISHMENTNAME);
  });

  describe('path', () => {
    it('should return correct path', () => {
      expect(query.path()).toStrictEqual(
        `/jsonapi/prison/${ESTABLISHMENTNAME}/recently-added?include=field_moj_thumbnail_image&sort=-published_at%2Ccreated&fields%5Bnode--page%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_moj_description%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id&fields%5Bnode--moj_video_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_moj_description%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id&fields%5Bnode--moj_radio_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_moj_description%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id&fields%5Bnode--moj_pdf_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_moj_description%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id&fields%5Bfile--file%5D=drupal_internal__fid%2Cid%2Cimage_style_uri&page[offset]=0&page[limit]=4`,
      );
    });
  });

  describe('transform', () => {
    let links;

    beforeEach(() => {
      links = {
        next: 'URL',
      };
    });

    it('should return null when an empty array is provided', () => {
      const result = query.transform([], links);

      expect(result).toBeNull();
    });

    it('should create correct structure', () => {
      const response = [
        {
          type: 'node--moj_video_item',
          drupalInternal_Nid: 111111,
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
        },
      ];

      const result = query.transform(response, links);

      expect(result).toStrictEqual({
        data: [
          {
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
          },
        ],
      });
    });
  });
});
