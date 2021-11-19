const { contentRepository } = require('../hubContent');
const termResponse = require('../../../test/resources/terms.json');
const { lastCall } = require('../../../test/test-helpers');

describe('contentRepository', () => {
  describe('#termFor', () => {
    it('returns null if no id is passed', async () => {
      const client = generateClient({ response: 'data' });
      const repository = contentRepository(client);
      const result = await repository.termFor();

      expect(client.get).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
    it('returns terms data for a given id', async () => {
      const client = generateClient(termResponse);
      const repository = contentRepository(client);
      const result = await repository.termFor('id');

      const expectedKeys = [
        'id',
        'contentType',
        'name',
        'description',
        'image',
        'video',
        'audio',
      ];
      const keys = Object.keys(result);

      expect(lastCall(client.get)[0]).toContain('id');
      expectedKeys.forEach(key => {
        expect(keys).toContain(key);
      });
    });
  });

  describe('#seasonFor', () => {
    it('returns empty if no id is passed', async () => {
      const client = generateClient({ response: 'data' });
      const repository = contentRepository(client);
      const result = await repository.seasonFor({});

      expect(client.get).not.toHaveBeenCalled();
      expect(result).toStrictEqual([]);
    });

    it('returns empty if response is invalid', async () => {
      const client = generateClient({ response: 'data' });
      const repository = contentRepository(client);
      const result = await repository.seasonFor({ id: 1 });

      expect(client.get).toHaveBeenCalledTimes(
        1,
        'client should have been called',
      );
      expect(result).toStrictEqual([]);
    });
    it('returns formated data for a season', async () => {
      const client = generateClient([
        { content_type: 'moj_video_item' },
        { content_type: 'moj_radio_item' },
      ]);
      const repository = contentRepository(client);
      const result = await repository.seasonFor({
        id: 'id',
        establishmentId: 'fooPrisonID',
      });
      const requestQueryString = JSON.stringify(lastCall(client.get)[1]);

      expect(lastCall(client.get)[0]).toContain('id');
      expect(requestQueryString).toContain('fooPrisonID');

      expect(result.length).toBe(4);
    });
  });

  describe('#relatedContentFor', () => {
    it('returns empty if no id is passed', async () => {
      const client = generateClient({ response: 'data' });
      const repository = contentRepository(client);
      const result = await repository.relatedContentFor({});

      expect(client.get.mock.calls.length).toBe(0);
      expect(result).toStrictEqual([]);
    });

    it('returns empty when invalid data is returned from the api', async () => {
      const client = generateClient({ response: 'data' });
      const repository = contentRepository(client);
      const result = await repository.relatedContentFor({ id: 1 });

      expect(client.get).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual([]);
    });
    it('returns formated data for related content', async () => {
      const client = generateClient([
        { content_type: 'moj_radio_item' },
        { content_type: 'moj_radio_item' },
      ]);
      const repository = contentRepository(client);

      const result = await repository.relatedContentFor({
        id: 'id',
        establishmentId: 'fooBarQuery',
      });

      const requestQueryString = JSON.stringify(lastCall(client.get)[1]);

      const expectedKeys = [
        'id',
        'title',
        'contentType',
        'summary',
        'image',
        'contentUrl',
      ];

      expect(requestQueryString).toContain('id');
      expect(requestQueryString).toContain('fooBarQuery');

      expect(result.length).toBe(4);

      const keys = Object.keys(result[0]);
      expectedKeys.forEach(key => {
        expect(keys).toContain(key);
      });
    });
  });
});

function generateClient(response) {
  const httpClient = {
    get: jest.fn().mockReturnValue(response),
  };

  return httpClient;
}
