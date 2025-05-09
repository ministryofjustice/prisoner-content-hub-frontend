const nock = require('nock');
const { jsonApiResponse } = require('../../../test/resources/jsonApi');
const { JsonApiClient } = require('../../clients/jsonApiClient');
const { NotFound } = require('../apiError');
const { CmsApi } = require('../cmsApi');

const host = 'http://localhost:3333';
const path = `/jsonapi/test`;
const key = 'TESTKEY';
class TestPathTransformQuery {
  path() {
    return path;
  }

  transform(item, links) {
    const { name, description, fieldTopic } = item;
    const id = fieldTopic?.resourceIdObjMeta?.drupal_internal__target_id;
    return {
      id,
      linkText: name,
      self: links?.self,
      description: description?.processed,
      href: `/content/${id}`,
    };
  }

  getKey() {
    return key;
  }
}

class TestUrlTransformEachQuery {
  url() {
    return `${host}${path}`;
  }

  transformEach(item) {
    const { name, description, fieldTopic } = item;
    const id = fieldTopic?.resourceIdObjMeta?.drupal_internal__target_id;
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
    field_topic: {
      data: {
        type: 'node--topic',
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

  const testCacheStrategy = {
    set: jest.fn(),
    get: jest.fn(),
  };

  beforeEach(() => {
    testCacheStrategy.set.mockClear();
    testCacheStrategy.get.mockClear();
    if (!nock.isActive()) {
      nock.activate();
    }
    cmsApi = new CmsApi({
      jsonApiClient: new JsonApiClient(host),
      cachingStrategy: testCacheStrategy,
    });
    mockDrupal = nock(host);
  });

  afterEach(() => {
    nock.restore();
  });

  describe('getCache', () => {
    describe('no cache key defined', () => {
      it('should throw an error', async () => {
        const query = new TestUrlTransformEachQuery();
        await expect(cmsApi.getCache({ query })).rejects.toThrow(
          'Could not retrieve cache key from query: TestUrlTransformEachQuery',
        );
      });
    });
    describe('with cached data', () => {
      it('should return the cached value', async () => {
        const cachedValue = {
          location: 'https://cms.org/jsonapi/node/page/carrot',
          type: 'node--bun',
          uuid: 42,
        };
        testCacheStrategy.get.mockResolvedValueOnce(cachedValue);
        const response = await cmsApi.getCache({ query: new TestPathTransformQuery() });
        expect(response).toStrictEqual(cachedValue);
      });
    });
    describe('with no cached data', () => {
      const expectedResult = {
        description: 'Desc 1',
        href: '/content/1',
        id: '1',
        self: {
          href: 'http://cms.prg/jsonapi/node/not-used',
        },
        linkText: 'One',
      };
      let response;
      beforeEach(async () => {
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
        response = await cmsApi.getCache({ query: new TestPathTransformQuery() });
      });
      it('should return the drupal value', async () => {
        expect(response).toStrictEqual(expectedResult);
      });
      it('should set the cache', async () => {
        expect(testCacheStrategy.set).toHaveBeenCalledWith(
          key,
          expectedResult,
          300,
        );
      });
    });
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

    it('propogates 403', () => {
      mockDrupal.get(path).reply(403, 'unexpected error');

      return expect(
        cmsApi.get(new TestUrlTransformEachQuery()),
      ).rejects.toEqual(Error('Request failed with status code 403'));
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
        self: {
          href: 'http://cms.prg/jsonapi/node/not-used',
        },
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
    describe('when not using cache', () => {
      let response;
      let lookupResult;
      beforeEach(async () => {
        mockDrupal.get(lookupPath).reply(200, {
          jsonapi: {
            individual:
              'https://cms.org/jsonapi/node/page/abd97f5c-072b-4e1f-a446-85fd021d7fa7',
            resourceName: 'node--page',
          },
          entity: { uuid: 101 },
        });
        response = await cmsApi.lookupContent('berwyn', 1234);
        lookupResult = {
          location:
            'https://cms.org/jsonapi/node/page/abd97f5c-072b-4e1f-a446-85fd021d7fa7',
          type: 'node--page',
          uuid: 101,
        };
      });
      it('should check the cache', async () => {
        expect(testCacheStrategy.get).toHaveBeenCalledTimes(1);
      });
      it('should format and return single value', async () => {
        expect(response).toStrictEqual(lookupResult);
      });
      it('should save the value to the cache', async () => {
        expect(testCacheStrategy.set).toHaveBeenCalledTimes(1);
        expect(testCacheStrategy.set).toHaveBeenCalledWith(
          'cms-api:router:berwyn:content:1234',
          lookupResult,
          86400,
        );
      });
    });
    it('should use cache if available', async () => {
      const cachedValue = {
        location: 'https://cms.org/jsonapi/node/page/carrot',
        type: 'node--bun',
        uuid: 42,
      };
      testCacheStrategy.get.mockResolvedValueOnce(cachedValue);
      const response = await cmsApi.lookupContent('berwyn', 1234);
      expect(response).toStrictEqual(cachedValue);
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
        'https://cms.org//jsonapi/prison/etwoe/taxonomy_term/series/1562712e-ecdc-4d99-82ae-86c04349a6a0';
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

  describe('lookup external link', () => {
    const lookupPath = `/router/prison/berwyn/translate-path?path=link/1234`;

    it('should propagate errors', () => {
      mockDrupal.get(lookupPath).reply(500, 'unexpected error');

      return expect(cmsApi.lookupLink('berwyn', 1234)).rejects.toEqual(
        Error('Request failed with status code 500'),
      );
    });

    it('propagates 404 as NotFound', () => {
      mockDrupal.get(lookupPath).reply(404, 'unexpected error');

      return expect(cmsApi.lookupLink('berwyn', 1234)).rejects.toEqual(
        new NotFound(lookupPath),
      );
    });

    it('propagates 403 as NotFound', () => {
      mockDrupal.get(lookupPath).reply(403, 'unexpected error');

      return expect(cmsApi.lookupLink('berwyn', 1234)).rejects.toEqual(
        new NotFound(lookupPath),
      );
    });

    it('should format and return single value', async () => {
      const individual =
        'https://cms.org//jsonapi/prison/etwoe/taxonomy_term/series/1562712e-ecdc-4d99-82ae-86c04349a6a0';
      const resourceName = 'taxonomy_term--series';
      mockDrupal.get(lookupPath).reply(200, {
        jsonapi: {
          individual,
          resourceName,
        },
        entity: { uuid: 101 },
      });
      const response = await cmsApi.lookupLink('berwyn', 1234);

      expect(response).toStrictEqual({
        location: individual,
        type: resourceName,
        uuid: 101,
      });
    });
  });
});
