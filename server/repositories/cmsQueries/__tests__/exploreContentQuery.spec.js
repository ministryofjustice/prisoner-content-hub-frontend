const { ExploreContentQuery } = require('../exploreContentQuery');

describe('Recently Added Content page query', () => {
  const ESTABLISHMENTNAME = 'Wayland';
  const PAGE_LIMIT = 4;
  let query;

  beforeEach(() => {
    query = new ExploreContentQuery(ESTABLISHMENTNAME, PAGE_LIMIT);
  });

  describe('path', () => {
    it('should return correct path', () => {
      expect(query.path()).toStrictEqual(
        `/jsonapi/prison/Wayland/explore/node?include=field_moj_thumbnail_image&page%5Blimit%5D=4&fields%5Bnode--page%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_moj_description%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id%2Cpublished_at&fields%5Bnode--moj_video_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_moj_description%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id%2Cpublished_at&fields%5Bnode--moj_radio_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_moj_description%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id%2Cpublished_at&fields%5Bnode--moj_pdf_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_moj_description%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id%2Cpublished_at`,
      );
    });

    it("should return a path containing the default page limit of '4' when a page limit is not provided", () => {
      const queryWithoutPageLimit = new ExploreContentQuery(ESTABLISHMENTNAME);
      expect(queryWithoutPageLimit.path()).toContain('page%5Blimit%5D=4');
    });

    it('should return a path containing the specifi page limit value when one is provided', () => {
      const queryWithPageLimit = new ExploreContentQuery(ESTABLISHMENTNAME, 8);
      expect(queryWithPageLimit.path()).toContain('page%5Blimit%5D=8');
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
        isLastPage: false,
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
            isNew: false,
          },
        ],
      });
    });
  });
});
