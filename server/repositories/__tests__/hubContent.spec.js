const { contentRepository } = require('../hubContent');
const termResponse = require('../../../test/resources/terms.json');

describe('contentRepository', () => {
  describe('#contentFor', () => {
    it('returns null if no id is passed', async () => {
      const client = generateClient({ response: 'data' });
      const repository = contentRepository(client);
      const result = await repository.contentFor();

      expect(client.get.mock.calls.length).toBe(0);
      expect(result).toBe(null);
    });

    it('returns content for a given id', async () => {
      const client = generateClient({ content_type: 'moj_video_item' });
      const repository = contentRepository(client);

      const result = await repository.contentFor('id');

      expect(client.get.mock.calls.length).toBe(1);
      expect(
        client.get.mock.calls[client.get.mock.calls.length - 1][0],
      ).toContain('id');

      const expectedKeys = [
        'id',
        'title',
        'description',
        'contentType',
        'media',
        'episode',
        'season',
        'seriesId',
        'image',
        'categories',
        'secondaryTags',
        'contentUrl',
      ];
      const keys = Object.keys(result);

      expectedKeys.forEach(key => {
        expect(keys).toContain(key);
      });
    });
  });

  describe('#termFor', () => {
    it('returns null if no id is passed', async () => {
      const client = generateClient({ response: 'data' });
      const repository = contentRepository(client);
      const result = await repository.termFor();

      expect(client.get.mock.calls.length).toBe(0);
      expect(result).toBe(null);
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

      expect(
        client.get.mock.calls[client.get.mock.calls.length - 1][0],
      ).toContain('id');
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

      expect(client.get.mock.calls.length).toBe(0);
      expect(result).toStrictEqual([]);
    });

    it('returns empty if response is invalid', async () => {
      const client = generateClient({ response: 'data' });
      const repository = contentRepository(client);
      const result = await repository.seasonFor({ id: 1 });

      expect(client.get.mock.calls.length).toBe(
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
      const requestQueryString = JSON.stringify(
        client.get.mock.calls[client.get.mock.calls.length - 1][1],
      );

      expect(
        client.get.mock.calls[client.get.mock.calls.length - 1][0],
      ).toContain('id');
      expect(requestQueryString).toContain('fooPrisonID');

      expect(result.length).toBe(4);
    });
  });

  describe('#nextEpisodesFor', () => {
    it('returns empty if no id is passed', async () => {
      const client = generateClient(null);
      const repository = contentRepository(client);
      const result = await repository.nextEpisodesFor({});

      expect(client.get.mock.calls.length).toBe(0);
      expect(result).toStrictEqual([]);
    });

    it('returns empty if when invalid data is returned from the api call', async () => {
      const client = generateClient({ response: 'invalid' });
      const repository = contentRepository(client);
      const result = await repository.nextEpisodesFor({ id: 1, episodeId: 1 });

      expect(client.get.mock.calls.length).toBe(1);
      expect(result).toStrictEqual([]);
    });

    it('returns the next episodes in the series', async () => {
      const client = generateClient([
        { content_type: 'moj_video_item' },
        { content_type: 'moj_radio_item' },
      ]);
      const repository = contentRepository(client);
      const result = await repository.nextEpisodesFor({
        id: 'id',
        episodeId: 'fooEpisodeId',
        establishmentId: 'fooPrisonID',
      });
      const requestQueryString = JSON.stringify(
        client.get.mock.calls[client.get.mock.calls.length - 1][1],
      );

      expect(
        client.get.mock.calls[client.get.mock.calls.length - 1][0],
      ).toContain('id');

      expect(requestQueryString).toContain('fooEpisodeId');
      expect(requestQueryString).toContain('fooPrisonID');

      expect(result.length).toBe(2);
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

      expect(client.get.mock.calls.length).toBe(1);
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

      const requestQueryString = JSON.stringify(
        client.get.mock.calls[client.get.mock.calls.length - 1][1],
      );

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

  describe('#suggestedContentFor', () => {
    it('returns empty if no id is passed', async () => {
      const client = generateClient({ response: 'data' });
      const repository = contentRepository(client);
      const result = await repository.suggestedContentFor({});

      expect(client.get.mock.calls.length).toBe(0);
      expect(result).toStrictEqual([]);
    });

    it('returns empty when invalid data is returned from the api', async () => {
      const client = generateClient({ response: 'data' });
      const repository = contentRepository(client);
      const result = await repository.suggestedContentFor({ id: 1 });

      expect(client.get.mock.calls.length).toBe(1);
      expect(result).toStrictEqual([]);
    });
    it('returns formatted data for suggested content', async () => {
      const client = generateClient([
        { content_type: 'moj_radio_item' },
        { content_type: 'moj_radio_item' },
      ]);
      const repository = contentRepository(client);

      const result = await repository.suggestedContentFor({
        id: 'id',
        establishmentId: 'fooBarQuery',
      });

      const requestQueryString = JSON.stringify(
        client.get.mock.calls[client.get.mock.calls.length - 1][1],
      );

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
