const { RecentlyAddedContentQuery } = require('../recentlyAddedContentQuery');

describe('Recently Added Content page query', () => {
  const ESTABLISHMENTNAME = 'Wayland';
  const TIMESTAMP = 1651737416;
  let query;

  beforeEach(() => {
    query = new RecentlyAddedContentQuery(
      ESTABLISHMENTNAME,
      1,
      40,
      TIMESTAMP,
      'en',
    );
  });

  describe('path', () => {
    it('should return correct path', () => {
      expect(query.path()).toStrictEqual(
        `/en/jsonapi/prison/${ESTABLISHMENTNAME}/node?filter%5Btype.meta.drupal_internal__target_id%5D%5Bcondition%5D%5Bpath%5D=type.meta.drupal_internal__target_id&filter%5Btype.meta.drupal_internal__target_id%5D%5Bcondition%5D%5Bvalue%5D%5B0%5D=page&filter%5Btype.meta.drupal_internal__target_id%5D%5Bcondition%5D%5Bvalue%5D%5B1%5D=moj_video_item&filter%5Btype.meta.drupal_internal__target_id%5D%5Bcondition%5D%5Bvalue%5D%5B2%5D=moj_radio_item&filter%5Btype.meta.drupal_internal__target_id%5D%5Bcondition%5D%5Bvalue%5D%5B3%5D=moj_pdf_item&filter%5Btype.meta.drupal_internal__target_id%5D%5Bcondition%5D%5Boperator%5D=IN&filter%5Bcreated%5D%5Bvalue%5D=1651737416&filter%5Bcreated%5D%5Boperator%5D=%3E%3D&include=field_moj_thumbnail_image&sort=-published_at%2Ccreated&fields%5Bnode--page%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_summary%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id%2Cpublished_at&fields%5Bnode--moj_video_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_summary%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id%2Cpublished_at&fields%5Bnode--moj_radio_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_summary%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id%2Cpublished_at&fields%5Bnode--moj_pdf_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_summary%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id%2Cpublished_at&fields%5Bfile--file%5D=drupal_internal__fid%2Cid%2Cimage_style_uri&page%5Boffset%5D=0&page%5Blimit%5D=40`,
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
          fieldMojThumbnailImage: {
            imageStyleUri: {
              tile_large: 'AWS_URL',
              tile_small: 'AWS_URL',
            },
            resourceIdObjMeta: {
              alt: 'IMAGE_ALT_TEXT',
            },
          },
        },
      ];

      const result = query.transform(response, links);

      expect(result).toStrictEqual({
        isLastPage: false,
        data: [
          {
            id: 111111,
            contentType: 'video',
            externalContent: false,
            title: 'A Title',
            summary: undefined,
            contentUrl: '/content/111111',
            displayUrl: undefined,
            image: {
              url: 'AWS_URL',
              alt: 'IMAGE_ALT_TEXT',
            },
            isNew: false,
          },
        ],
      });
    });
  });
});
