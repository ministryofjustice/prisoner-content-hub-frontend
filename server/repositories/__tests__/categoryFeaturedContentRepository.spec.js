const {
  categoryFeaturedContentRepository,
} = require('../categoryFeaturedContent');

describe('CategoryFeaturedContentRepository', () => {
  describe('#contentFor', () => {
    describe('When content is returned from the endpoint', () => {
      it('returns a featured content', async () => {
        const client = generateFeatureContentClient([
          { contentType: 'moj_radio_item' },
        ]);
        const repository = categoryFeaturedContentRepository(client);

        const expectedKeys = [
          'id',
          'title',
          'contentType',
          'summary',
          'image',
          'contentUrl',
        ];

        const result = await repository.contentFor({
          categoryId: 'fooCategoryId',
        });

        const requestQueryString = JSON.stringify(
          client.get.mock.calls[client.get.mock.calls.length - 1][1],
        );

        expect(requestQueryString).toContain('fooCategoryId');

        expect(result.length).toBe(1);

        const keys = Object.keys(result[0]);

        expectedKeys.forEach(key => {
          expect(keys).toContain(key);
        });
      });
    });

    describe('When no content is returned from the endpoint', () => {
      it('returns no data', async () => {
        const repository = categoryFeaturedContentRepository(
          generateNoDataResponse(),
        );
        const content = await repository.contentFor(1);

        expect(content).toStrictEqual([]);
      });
    });
  });
});

function generateFeatureContentClient(data) {
  const httpClient = {
    get: jest.fn().mockReturnValue(data),
  };

  return httpClient;
}

function generateNoDataResponse() {
  const httpClient = {
    get: jest.fn().mockReturnValue([]),
  };

  return httpClient;
}
