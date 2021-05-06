const primaryMenuResponse = (landingPages = []) => ({
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
  data: landingPages,
  links: {
    self: {
      href:
        'http://cms.prg/jsonapi/node/landing_page?fields%5Bnode--landing_page%5D=title%2Cfield_moj_description%2Cdrupal_internal__nid%2Cfield_moj_prisons',
    },
  },
});

const landingPage = ({ id, title, processed, prisons = [] }) => ({
  type: 'node--landing_page',
  id: 'fb260ea4-ee70-4070-b2fa-f34480d3be73',
  links: {
    self: {
      href:
        'http://cms.gov.uk/jsonapi/node/landing_page/fb260ea4-ee70-4070-b2fa-f34480d3be73?resourceVersion=id%3A4758',
    },
  },
  attributes: {
    drupal_internal__nid: id,
    title,
    field_moj_description: {
      value: 'A value',
      format: 'basic_html',
      processed,
      summary: 'A summary',
    },
  },
  relationships: {
    field_moj_prisons: {
      data: prisons,
      links: {
        related: {
          href:
            'http://cms.gov.uk/jsonapi/node/landing_page/fb260ea4-ee70-4070-b2fa-f34480d3be73/field_moj_prisons?resourceVersion=id%3A4758',
        },
        self: {
          href:
            'http://cms.gov.uk/jsonapi/node/landing_page/fb260ea4-ee70-4070-b2fa-f34480d3be73/relationships/field_moj_prisons?resourceVersion=id%3A4758',
        },
      },
    },
  },
});

module.exports = {
  primaryMenuResponse,
  landingPage,
  prisons: {
    792: {
      type: 'taxonomy_term--prisons',
      id: 'fd1e1db7-d0be-424a-a3a6-3b0f49e33293',
    },
    793: {
      type: 'taxonomy_term--prisons',
      id: 'b73767ea-2cbb-4ad5-ba22-09379cc07241',
    },
  },
};
