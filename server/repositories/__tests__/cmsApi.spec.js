const nock = require('nock');
const {
  primaryMenuResponse,
  prisons,
  landingPage,
} = require('../../../test/resources/primaryMenu');
const { JsonApiClient } = require('../../clients/jsonApiClient');
const { CmsApi } = require('../cmsApi');

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

  describe('primaryMenu', () => {
    const path =
      '/jsonapi/node/landing_page?fields[node--landing_page]=title,field_moj_description,drupal_internal__nid,field_moj_prisons';

    it('should handle no items', async () => {
      mockDrupal.get(path).reply(200, primaryMenuResponse([]));

      const response = await cmsApi.primaryMenu(792);

      expect(response).toStrictEqual([]);
    });

    it('should handle empty responses', async () => {
      mockDrupal.get(path).reply(200);

      const response = await cmsApi.primaryMenu(792);

      expect(response).toStrictEqual([]);
    });

    it('should propagate errors', () => {
      mockDrupal.get(path).reply(500, 'unexpected error');

      return expect(cmsApi.primaryMenu(792)).rejects.toEqual(
        Error('Request failed with status code 500'),
      );
    });

    it('should format and return matching item', async () => {
      mockDrupal.get(path).reply(
        200,
        primaryMenuResponse([
          landingPage({
            id: '1',
            title: 'One',
            processed: 'Desc 1',
            prisons: [prisons[792]],
          }),
          landingPage({
            id: '2',
            title: 'Two',
            processed: 'Desc 2',
            prisons: [prisons[792]],
          }),
        ]),
      );
      const response = await cmsApi.primaryMenu(792);

      expect(response).toStrictEqual([
        {
          description: 'Desc 1',
          href: '/content/1',
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

    it('does not return pages configured for other prisons', async () => {
      mockDrupal.get(path).reply(
        200,
        primaryMenuResponse([
          landingPage({
            id: '1',
            title: 'One',
            processed: 'Desc 1',
            prisons: [prisons[793]],
          }),
        ]),
      );
      const response = await cmsApi.primaryMenu(792);

      expect(response).toStrictEqual([]);
    });

    it('returns pages configured for no prisons', async () => {
      mockDrupal.get(path).reply(
        200,
        primaryMenuResponse([
          landingPage({
            id: '1',
            title: 'One',
            processed: 'Desc 1',
            prisons: [],
          }),
        ]),
      );
      const response = await cmsApi.primaryMenu(792);

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
