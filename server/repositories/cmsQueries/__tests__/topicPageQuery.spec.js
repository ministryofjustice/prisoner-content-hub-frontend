const { getPagination } = require('../../../utils/jsonApi');
const { TopicPageQuery } = require('../topicPageQuery');

describe('Secondary Tag page query', () => {
  const ESTABLISHMENTNAME = 'Wayland';
  const UUID = `42`;
  const query = new TopicPageQuery(ESTABLISHMENTNAME, UUID, 10);
  describe('path', () => {
    it('should create correct path', async () => {
      expect(query.path()).toStrictEqual(
        `/jsonapi/prison/${ESTABLISHMENTNAME}/node?filter%5Bfield_topics.id%5D=${UUID}&include=field_moj_thumbnail_image%2Cfield_topics.field_moj_thumbnail_image&sort=-created&fields%5Bnode--page%5D=drupal_internal__nid%2Ctitle%2Cfield_summary%2Cfield_moj_thumbnail_image%2Cfield_topics%2Cpath%2Cpublished_at&fields%5Bnode--moj_video_item%5D=drupal_internal__nid%2Ctitle%2Cfield_summary%2Cfield_moj_thumbnail_image%2Cfield_topics%2Cpath%2Cpublished_at&fields%5Bnode--moj_radio_item%5D=drupal_internal__nid%2Ctitle%2Cfield_summary%2Cfield_moj_thumbnail_image%2Cfield_topics%2Cpath%2Cpublished_at&fields%5Bnode--moj_pdf_item%5D=drupal_internal__nid%2Ctitle%2Cfield_summary%2Cfield_moj_thumbnail_image%2Cfield_topics%2Cpath%2Cpublished_at&fields%5Bfile--file%5D=image_style_uri&fields%5Btaxonomy_term--topics%5D=name%2Cdescription%2Cdrupal_internal__tid%2Cfield_moj_thumbnail_image%2Cpath%2Cfield_exclude_feedback%2Cbreadcrumbs&${getPagination(
          10,
        )}`,
      );
    });
  });

  describe('transform', () => {
    const createTopic = id => ({
      id,
      type: 'taxonomy_term--topics',
      breadcrumbs: [{ uri: 'parent1Url', title: 'parent1' }],
      drupalInternal_Tid: `100${id}`,
      name: `name${id}`,
      description: { processed: `description${id}` },
      fieldExcludeFeedback: true,
      fieldMojThumbnailImage: {
        imageStyleUri: { tile_large: `tile_large${id}` },
        resourceIdObjMeta: { alt: `alt${id}` },
      },
      path: { alias: `/tags/${id}` },
    });
    const createContent = (id, fieldTopics) => ({
      drupalInternal_Nid: id,
      title: `title${id}`,
      type: 'node--moj_video_item',
      fieldSummary: `description${id}`,
      fieldMojThumbnailImage: {
        imageStyleUri: { tile_small: `tile_small${id}` },
        resourceIdObjMeta: { alt: `alt${id}` },
      },
      fieldTopics,
      path: { alias: `/content/${id}` },
      displayUrl: undefined,
      externalContent: false,
    });
    const createTransformedTopic = id => ({
      id: `100${id}`,
      contentType: 'topic',
      title: `name${id}`,
      summary: `description${id}`,
      image: {
        url: `tile_large${id}`,
        alt: `alt${id}`,
      },
      isNew: false,
      breadcrumbs: [{ href: 'parent1Url', text: 'parent1' }],
      displayUrl: undefined,
      excludeFeedback: true,
      externalContent: false,
      contentUrl: `/tags/${id}`,
    });
    const createTransformedContent = id => ({
      id,
      title: `title${id}`,
      contentType: 'video',
      summary: `description${id}`,
      contentUrl: `/content/${id}`,
      image: {
        url: `tile_small${id}`,
        alt: `alt${id}`,
      },
      isNew: false,
      displayUrl: undefined,
      externalContent: false,
    });

    it('should return null if the Array is empty', async () => {
      expect(query.transform([])).toBeNull();
    });

    it('should list the content', async () => {
      const TOPIC1 = createTopic(1);
      const TOPIC2 = createTopic(UUID);
      const TOPICS = [TOPIC1, TOPIC2];
      const CONTENT1 = createContent('A', TOPICS);
      const CONTENT2 = createContent('B', [TOPIC2]);
      const CONTENT3 = createContent('C', TOPICS);
      const response = [CONTENT1, CONTENT2, CONTENT3];

      expect(query.transform(response, { next: 'NextPageURL' })).toStrictEqual({
        ...createTransformedTopic(UUID),
        ...{
          hubContentData: {
            contentType: 'topic',
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
      const TOPIC1 = createTopic(UUID);
      const TOPICS = [TOPIC1];
      const CONTENT1 = createContent('A', TOPICS);
      const response = [CONTENT1];

      expect(query.transform(response, {})).toStrictEqual({
        ...createTransformedTopic(UUID),
        ...{
          hubContentData: {
            contentType: 'topic',
            isLastPage: true,
            data: [createTransformedContent('A')],
          },
        },
      });
    });
  });
});
