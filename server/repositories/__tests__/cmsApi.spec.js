const nock = require('nock');
const {
  jsonApiResponse,
  category,
  tag,
} = require('../../../test/resources/topics');
const { JsonApiClient } = require('../../clients/jsonApiClient');
const { CmsApi, topicsQuery } = require('../cmsApi');

describe('CmsApi', () => {
  let cmsApi;
  let mockDrupal;

  beforeEach(() => {
    if (!nock.isActive()) {
      nock.activate();
    }
    const host = 'http://localhost:3333';
    cmsApi = new CmsApi(new JsonApiClient(host));
    mockDrupal = nock(host);
  });

  afterEach(() => {
    nock.restore();
  });

  describe('getTopics', () => {
    const path = `/jsonapi/prison/berwyn/taxonomy_term?${topicsQuery}`;

    it('should handle returning no items', async () => {
      mockDrupal.get(path).reply(200, jsonApiResponse([]));

      const response = await cmsApi.getTopics('berwyn');

      expect(response).toStrictEqual([]);
    });

    it('should propagate errors', () => {
      mockDrupal.get(path).reply(500, 'unexpected error');

      return expect(cmsApi.getTopics('berwyn')).rejects.toEqual(
        Error('Request failed with status code 500'),
      );
    });

    it('propogates 404 as error', () => {
      mockDrupal.get(path).reply(404, 'unexpected error');

      return expect(cmsApi.getTopics('berwyn')).rejects.toEqual(
        Error('Request failed with status code 404'),
      );
    });

    it('should format and return matching item', async () => {
      mockDrupal.get(path).reply(
        200,
        jsonApiResponse([
          tag({
            id: '1',
            title: 'One',
            processed: 'Desc 1',
          }),
          category({
            id: '2',
            title: 'Two',
            processed: 'Desc 2',
          }),
        ]),
      );
      const response = await cmsApi.getTopics('berwyn');

      expect(response).toStrictEqual([
        {
          description: 'Desc 1',
          href: '/tags/1',
          id: '1',
          linkText: 'One',
        },
        {
          description: 'Desc 2',
          href: '/content/2',
          id: '2',
          linkText: 'Two',
        },
      ]);
    });
  });
});
