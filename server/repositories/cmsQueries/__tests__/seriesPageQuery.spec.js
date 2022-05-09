const { getPagination } = require('../../../utils/jsonApi');
const { SeriesPageQuery } = require('../seriesPageQuery');

describe('Series page query', () => {
  const ESTABLISHMENTNAME = 'Wayland';
  const UUID = `42`;
  const query = new SeriesPageQuery(ESTABLISHMENTNAME, UUID, 2);
  describe('path', () => {
    it('should create correct path', async () => {
      expect(query.path()).toStrictEqual(
        `/jsonapi/prison/${ESTABLISHMENTNAME}/node?filter%5Bfield_moj_series.id%5D=${UUID}&include=field_moj_thumbnail_image%2Cfield_moj_series.field_featured_image&sort=series_sort_value%2Ccreated&fields%5Bnode--page%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_description%2Cfield_moj_thumbnail_image%2Cfield_moj_series%2Cpath&fields%5Bnode--moj_video_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_description%2Cfield_moj_thumbnail_image%2Cfield_moj_series%2Cpath&fields%5Bnode--moj_radio_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_description%2Cfield_moj_thumbnail_image%2Cfield_moj_series%2Cpath&fields%5Bnode--moj_pdf_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_description%2Cfield_moj_thumbnail_image%2Cfield_moj_series%2Cpath&fields%5Bfile--file%5D=image_style_uri&fields%5Btaxonomy_term--series%5D=name%2Cdescription%2Cdrupal_internal__tid%2Cfield_featured_image%2Cpath%2Cfield_exclude_feedback%2Cbreadcrumbs&${getPagination(
          2,
        )}`,
      );
    });
  });

  describe('transform', () => {
    const fieldMojSeries = {
      UUID,
      drupalInternal_Tid: `100${UUID}`,
      name: `name${UUID}`,
      type: 'taxonomy_term--series',
      breadcrumbs: [{ uri: 'parent1Url', title: 'parent1' }],
      description: { processed: `description${UUID}` },
      fieldExcludeFeedback: undefined,
      fieldFeaturedImage: {
        imageStyleUri: [{ tile_large: `tile_large${UUID}` }],
        resourceIdObjMeta: { alt: `alt${UUID}` },
      },
      path: { alias: `/tags/${UUID}` },
    };
    const createContent = id => ({
      drupalInternal_Nid: id,
      title: `title${id}`,
      fieldMojDescription: { summary: `summary${id}` },
      fieldMojThumbnailImage: {
        imageStyleUri: [{}, { tile_small: `tile_small${id}` }],
        resourceIdObjMeta: { alt: `alt${id}` },
      },
      type: 'node--moj_video_item',
      fieldMojSeries,
      path: { alias: `/content/${id}` },
      displayUrl: undefined,
      externalContent: false,
    });
    const createTransformedContent = id => ({
      id,
      title: `title${id}`,
      summary: `summary${id}`,
      contentUrl: `/content/${id}`,
      image: {
        url: `tile_small${id}`,
        alt: `alt${id}`,
      },
      displayUrl: undefined,
      externalContent: false,
      contentType: 'video',
    });
    it('should list the content', async () => {
      const response = [
        createContent('A'),
        createContent('B'),
        createContent('C'),
      ];

      expect(query.transform(response, { next: 'URL' })).toStrictEqual({
        id: `100${UUID}`,
        contentType: 'series',
        breadcrumbs: [
          { href: 'parent1Url', text: 'parent1' },
          { href: '', text: `name${UUID}` },
        ],
        title: `name${UUID}`,
        summary: `description${UUID}`,
        image: {
          url: `tile_large${UUID}`,
          alt: `alt${UUID}`,
        },
        displayUrl: undefined,
        excludeFeedback: undefined,
        externalContent: false,
        contentUrl: `/tags/${UUID}`,
        relatedContent: {
          contentType: 'series',
          isLastPage: false,
          data: [
            createTransformedContent('A'),
            createTransformedContent('B'),
            createTransformedContent('C'),
          ],
        },
      });
    });

    it('should not display next content link on last page', async () => {
      const response = [createContent('A')];

      expect(query.transform(response, {})).toStrictEqual({
        id: `100${UUID}`,
        contentType: 'series',
        breadcrumbs: [
          { href: 'parent1Url', text: 'parent1' },
          { href: '', text: `name${UUID}` },
        ],
        title: `name${UUID}`,
        summary: `description${UUID}`,
        image: {
          url: `tile_large${UUID}`,
          alt: `alt${UUID}`,
        },
        displayUrl: undefined,
        excludeFeedback: undefined,
        externalContent: false,
        contentUrl: `/tags/${UUID}`,
        relatedContent: {
          contentType: 'series',
          isLastPage: true,
          data: [createTransformedContent('A')],
        },
      });
    });
  });
});
