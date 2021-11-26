const nock = require('nock');
const { jsonApiResponse } = require('../../../test/resources/jsonApi');
const { JsonApiClient } = require('../../clients/jsonApiClient');
const { NotFound } = require('../apiError');
const { CmsApi } = require('../cmsApi');

const host = 'http://localhost:3333';
const path = `/jsonapi/test`;
class TestPathTransformQuery {
  path() {
    return path;
  }

  transform(item) {
    const { name, description, fieldLegacyLandingPage } = item;
    const id =
      fieldLegacyLandingPage?.resourceIdObjMeta?.drupal_internal__target_id;
    return {
      id,
      linkText: name,
      description: description?.processed,
      href: `/content/${id}`,
    };
  }
}

class TestUrlTransformEachQuery {
  url() {
    return `${host}${path}`;
  }

  transformEach(item) {
    const { name, description, fieldLegacyLandingPage } = item;
    const id =
      fieldLegacyLandingPage?.resourceIdObjMeta?.drupal_internal__target_id;
    return {
      id,
      linkText: name,
      description: description?.processed,
      href: `/content/${id}`,
    };
  }
}

const testItem = ({ id, title, processed }) => ({
  type: 'taxonomy_term--moj_test',
  id: '8d9eaf09-a53e-42d9-a7be-2a2f04a0f315',
  links: { self: { href: 'http://cms.prg/jsonapi/node/not-used' } },
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
      links: {
        self: { href: 'http://cms.prg/jsonapi/node/not-used' },
        related: { href: 'http://cms.prg/jsonapi/node/not-used' },
      },
    },
  },
});

describe('CmsApi', () => {
  let cmsApi;
  let mockDrupal;

  beforeEach(() => {
    if (!nock.isActive()) {
      nock.activate();
    }
    cmsApi = new CmsApi(new JsonApiClient(host));
    mockDrupal = nock(host);
  });

  afterEach(() => {
    nock.restore();
  });

  describe('get', () => {
    it('should handle returning no items', async () => {
      mockDrupal.get(path).reply(200, jsonApiResponse([]));

      const response = await cmsApi.get(new TestUrlTransformEachQuery());

      expect(response).toStrictEqual([]);
    });

    it('should propagate errors', () => {
      mockDrupal.get(path).reply(500, 'unexpected error');

      return expect(
        cmsApi.get(new TestUrlTransformEachQuery()),
      ).rejects.toEqual(Error('Request failed with status code 500'));
    });

    it('propogates 404 as NotFound', () => {
      mockDrupal.get(path).reply(404, 'unexpected error');

      return expect(
        cmsApi.get(new TestUrlTransformEachQuery()),
      ).rejects.toEqual(new NotFound('/jsonapi/test'));
    });

    it('should format and return single value', async () => {
      mockDrupal.get(path).reply(
        200,
        jsonApiResponse(
          testItem({
            id: '1',
            title: 'One',
            processed: 'Desc 1',
          }),
        ),
      );
      const response = await cmsApi.get(new TestPathTransformQuery());

      expect(response).toStrictEqual({
        description: 'Desc 1',
        href: '/content/1',
        id: '1',
        linkText: 'One',
      });
    });

    it('should format and return matching items', async () => {
      mockDrupal.get(path).reply(
        200,
        jsonApiResponse([
          testItem({
            id: '1',
            title: 'One',
            processed: 'Desc 1',
          }),
        ]),
      );
      const response = await cmsApi.get(new TestUrlTransformEachQuery());

      expect(response).toStrictEqual([
        {
          description: 'Desc 1',
          href: '/content/1',
          id: '1',
          linkText: 'One',
        },
      ]);
    });

    it('should request absolute URL if query requires it', async () => {
      mockDrupal.get(path).reply(
        200,
        jsonApiResponse([
          testItem({
            id: '1',
            title: 'One',
            processed: 'Desc 1',
          }),
        ]),
      );
      const response = await cmsApi.get(new TestUrlTransformEachQuery());

      expect(response).toStrictEqual([
        {
          description: 'Desc 1',
          href: '/content/1',
          id: '1',
          linkText: 'One',
        },
      ]);
    });
  });

  describe('lookup content', () => {
    const lookupPath = `/router/prison/berwyn/translate-path?path=content/1234`;

    it('should propagate errors', () => {
      mockDrupal.get(lookupPath).reply(500, 'unexpected error');

      return expect(cmsApi.lookupContent('berwyn', 1234)).rejects.toEqual(
        Error('Request failed with status code 500'),
      );
    });

    it('propagates 404 as error', () => {
      mockDrupal.get(lookupPath).reply(404, 'unexpected error');

      return expect(cmsApi.lookupContent('berwyn', 1234)).rejects.toEqual(
        Error(lookupPath),
      );
    });

    it('propagates 403 as NotFound', () => {
      mockDrupal.get(lookupPath).reply(403, 'unexpected error');

      return expect(cmsApi.lookupContent('berwyn', 1234)).rejects.toEqual(
        new NotFound(lookupPath),
      );
    });

    it('should format and return single value', async () => {
      mockDrupal.get(lookupPath).reply(200, {
        jsonapi: {
          individual:
            'https://cms.org/jsonapi/node/page/abd97f5c-072b-4e1f-a446-85fd021d7fa7',
          resourceName: 'node--page',
        },
        entity: { uuid: 101 },
      });
      const response = await cmsApi.lookupContent('berwyn', 1234);

      expect(response).toStrictEqual({
        location:
          'https://cms.org/jsonapi/node/page/abd97f5c-072b-4e1f-a446-85fd021d7fa7',
        type: 'node--page',
        uuid: 101,
      });
    });
  });

  describe('lookup tag', () => {
    const lookupPath = `/router/prison/berwyn/translate-path?path=tags/1234`;

    it('should propagate errors', () => {
      mockDrupal.get(lookupPath).reply(500, 'unexpected error');

      return expect(cmsApi.lookupTag('berwyn', 1234)).rejects.toEqual(
        Error('Request failed with status code 500'),
      );
    });

    it('propagates 404 as NotFound', () => {
      mockDrupal.get(lookupPath).reply(404, 'unexpected error');

      return expect(cmsApi.lookupTag('berwyn', 1234)).rejects.toEqual(
        new NotFound(lookupPath),
      );
    });

    it('propagates 403 as NotFound', () => {
      mockDrupal.get(lookupPath).reply(403, 'unexpected error');

      return expect(cmsApi.lookupTag('berwyn', 1234)).rejects.toEqual(
        new NotFound(lookupPath),
      );
    });

    it('should format and return single value', async () => {
      const individual =
        'https://cms.org//jsonapi/prison/cookhamwood/taxonomy_term/series/1562712e-ecdc-4d99-82ae-86c04349a6a0';
      const resourceName = 'taxonomy_term--series';
      mockDrupal.get(lookupPath).reply(200, {
        jsonapi: {
          individual,
          resourceName,
        },
        entity: { uuid: 101 },
      });
      const response = await cmsApi.lookupTag('berwyn', 1234);

      expect(response).toStrictEqual({
        location: individual,
        type: resourceName,
        uuid: 101,
      });
    });
  });
});
