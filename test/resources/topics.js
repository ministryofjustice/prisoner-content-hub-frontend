const href = 'http://cms.prg/jsonapi/node/not-used';

const jsonApiResponse = (results = []) => ({
  jsonapi: {
    version: '1.0',
    meta: {
      links: {
        self: {
          href: 'http://jsonapi.org/format/1.0/',
        },
      },
    },
  },
  data: results,
  links: { self: { href } },
});

const category = ({ id, title, processed }) => ({
  type: 'taxonomy_term--moj_categories',
  id: '8d9eaf09-a53e-42d9-a7be-2a2f04a0f315',
  links: { self: { href } },
  attributes: {
    name: title,
    description: {
      value: '<p>Not used</p>\r\n',
      format: 'basic_html',
      processed,
    },
  },
  relationships: {
    field_legacy_landing_page: {
      data: {
        type: 'node--landing_page',
        id: 'e442003a-1f77-4d7f-ac90-b518878cfacd',
        meta: {
          drupal_internal__target_id: id,
        },
      },
      links: { self: { href }, related: { href } },
    },
  },
});

const tag = ({ id, title, processed }) => ({
  type: 'taxonomy_term--tags',
  id: '5e4ea29c-a6a4-409a-8173-fd2fa49a2df3',
  links: { self: { href } },
  attributes: {
    drupal_internal__tid: id,
    name: title,
    description: {
      value: '<p>Not used.</p>\r\n',
      format: 'basic_html',
      processed,
    },
  },
});

module.exports = {
  jsonApiResponse,
  category,
  tag,
};
