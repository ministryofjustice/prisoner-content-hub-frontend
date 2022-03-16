const { getPagination } = require('../../../utils/jsonApi');
const { SecondaryTagPageQuery } = require('../secondaryTagPageQuery');

describe('Secondary Tag page query', () => {
  const ESTABLISHMENTNAME = 'Wayland';
  const UUID = `42`;
  const query = new SecondaryTagPageQuery(ESTABLISHMENTNAME, UUID, 10);
  describe('path', () => {
    it('should create correct path', async () => {
      expect(query.path()).toStrictEqual(
        `/jsonapi/prison/${ESTABLISHMENTNAME}/node?filter%5Bfield_moj_secondary_tags.id%5D=${UUID}&include=field_moj_thumbnail_image%2Cfield_moj_secondary_tags.field_featured_image&sort=-created&fields%5Bnode--page%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_description%2Cfield_moj_thumbnail_image%2Cfield_moj_secondary_tags%2Cpath&fields%5Bnode--moj_video_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_description%2Cfield_moj_thumbnail_image%2Cfield_moj_secondary_tags%2Cpath&fields%5Bnode--moj_radio_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_description%2Cfield_moj_thumbnail_image%2Cfield_moj_secondary_tags%2Cpath&fields%5Bnode--moj_pdf_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_description%2Cfield_moj_thumbnail_image%2Cfield_moj_secondary_tags%2Cpath&fields%5Bfile--file%5D=image_style_uri&fields%5Btaxonomy_term--tags%5D=name%2Cdescription%2Cdrupal_internal__tid%2Cfield_featured_image%2Cpath%2Cfield_exclude_feedback%2Cbreadcrumbs&${getPagination(
          10,
        )}`,
      );
    });
  });

  describe('transform', () => {
    const createSecondaryTag = id => ({
      id,
      type: 'taxonomy_term--tags',
      breadcrumbs: [{ uri: 'parent1Url', title: 'parent1' }],
      drupalInternal_Tid: `100${id}`,
      name: `name${id}`,
      description: { processed: `description${id}` },
      fieldExcludeFeedback: true,
      fieldFeaturedImage: {
        imageStyleUri: [{ tile_large: `tile_large${id}` }],
        resourceIdObjMeta: { alt: `alt${id}` },
      },
      path: { alias: `/tags/${id}` },
    });
    const createContent = (id, fieldMojSecondaryTags) => ({
      drupalInternal_Nid: id,
      title: `title${id}`,
      type: 'node--moj_video_item',
      fieldMojDescription: { summary: `summary${id}` },
      fieldMojThumbnailImage: {
        imageStyleUri: [{}, { tile_small: `tile_small${id}` }],
        resourceIdObjMeta: { alt: `alt${id}` },
      },
      fieldMojSecondaryTags,
      path: { alias: `/content/${id}` },
      displayUrl: undefined,
      externalContent: false,
    });
    const createTransformedSecondaryTag = id => ({
      id: `100${id}`,
      contentType: 'tags',
      title: `name${id}`,
      summary: `description${id}`,
      image: {
        url: `tile_large${id}`,
        alt: `alt${id}`,
      },
      breadcrumbs: [
        { href: 'parent1Url', text: 'parent1' },
        { href: '', text: `name${id}` },
      ],
      displayUrl: undefined,
      excludeFeedback: true,
      externalContent: false,
      contentUrl: `/tags/${id}`,
    });
    const createTransformedContent = id => ({
      id,
      title: `title${id}`,
      contentType: 'video',
      summary: `summary${id}`,
      contentUrl: `/content/${id}`,
      image: {
        url: `tile_small${id}`,
        alt: `alt${id}`,
      },
      displayUrl: undefined,
      externalContent: false,
    });

    it('should return null if the Array is empty', async () => {
      expect(query.transform([])).toBeNull();
    });

    it('should list the content', async () => {
      const SECONDARYTAG1 = createSecondaryTag(1);
      const SECONDARYTAG2 = createSecondaryTag(UUID);
      const SECONDARYTAGS = [SECONDARYTAG1, SECONDARYTAG2];
      const CONTENT1 = createContent('A', SECONDARYTAGS);
      const CONTENT2 = createContent('B', [SECONDARYTAG2]);
      const CONTENT3 = createContent('C', SECONDARYTAGS);
      const response = [CONTENT1, CONTENT2, CONTENT3];

      expect(query.transform(response, { next: 'NextPageURL' })).toStrictEqual({
        ...createTransformedSecondaryTag(UUID),
        ...{
          relatedContent: {
            contentType: 'default',
            isLastPage: false,
            data: [
              createTransformedContent('A'),
              createTransformedContent('B'),
              createTransformedContent('C'),
            ],
          },
        },
      });
    });

    it('should not display next content link on last page', async () => {
      const SECONDARYTAG1 = createSecondaryTag(UUID);
      const SECONDARYTAGS = [SECONDARYTAG1];
      const CONTENT1 = createContent('A', SECONDARYTAGS);
      const response = [CONTENT1];

      expect(query.transform(response, {})).toStrictEqual({
        ...createTransformedSecondaryTag(UUID),
        ...{
          relatedContent: {
            contentType: 'default',
            isLastPage: true,
            data: [createTransformedContent('A')],
          },
        },
      });
    });
  });
});
