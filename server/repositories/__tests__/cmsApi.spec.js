/* eslint-disable class-methods-use-this */
const nock = require('nock');
const { jsonApiResponse } = require('../../../test/resources/jsonApi');
const { JsonApiClient } = require('../../clients/jsonApiClient');
const { CmsApi } = require('../cmsApi');

const path = `/jsonapi/test`;
class TestQuery {
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
    const host = 'http://localhost:3333';
    cmsApi = new CmsApi(new JsonApiClient(host));
    mockDrupal = nock(host);
  });

  afterEach(() => {
    nock.restore();
  });

  describe('get', () => {
    it('should handle returning no items', async () => {
      mockDrupal.get(path).reply(200, jsonApiResponse([]));

      const response = await cmsApi.get(new TestQuery());

      expect(response).toStrictEqual([]);
    });

    it('should propagate errors', () => {
      mockDrupal.get(path).reply(500, 'unexpected error');

      return expect(cmsApi.get(new TestQuery())).rejects.toEqual(
        Error('Request failed with status code 500'),
      );
    });

    it('propogates 404 as error', () => {
      mockDrupal.get(path).reply(404, 'unexpected error');

      return expect(cmsApi.get(new TestQuery())).rejects.toEqual(
        Error('Request failed with status code 404'),
      );
    });

    it('should format and return matching item', async () => {
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
      const response = await cmsApi.get(new TestQuery());

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
});
