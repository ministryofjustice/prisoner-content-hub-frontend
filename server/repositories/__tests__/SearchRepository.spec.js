const { searchRepository } = require('../search');

describe('searchRepository', () => {
  describe('#find', () => {
    describe('When called with a search query', () => {
      it('should return the results', async () => {
        const mockResults = [
          {
            _id: '1',
            _source: {
              title: ['First Item'],
              summary: ['First item summary'],
            },
          },
          {
            _id: '2',
            _source: {
              title: ['Second Item'],
              summary: ['Second item summary'],
            },
          },
          {
            _id: '3',
            _source: {
              title: ['Third Item'],
              summary: ['Third item summary'],
            },
          },
        ];

        const client = createClient({ hits: { hits: mockResults } });

        const repository = searchRepository(client);

        const query = 'Test Query';

        const response = await repository.find({
          query,
          prison: 'HMP Development',
        });

        expect(client.post).toHaveBeenCalledTimes(
          1,
          'The method should have performed a post using the client',
        );

        const requestBody = JSON.stringify(
          client.post.mock.calls[client.post.mock.calls.length - 1][1],
        );

        expect(requestBody).toContain(
          query,
          'The request body should include the query',
        );

        expect(response.length).toBe(
          mockResults.length,
          'The method should have returned the same number of results',
        );

        expect(response[0]).toStrictEqual(
          {
            title: 'First Item',
            summary: 'First item summary',
            url: '/content/1',
          },
          'The method should have transformed the results',
        );
      });

      it('should filter by prison', async () => {
        const client = createClient({ hits: { hits: [] } });

        const repository = searchRepository(client);

        const query = 'Test Query';

        await repository.find({
          query,
          prison: 'HMP Development',
        });

        expect(client.post).toHaveBeenCalledTimes(
          1,
          'The method should have performed a post using the client',
        );

        const requestBody = JSON.stringify(
          client.post.mock.calls[client.post.mock.calls.length - 1][1],
        );

        expect(requestBody).toContain(
          'HMP Development',
          'The request body should include the prison name',
        );
      });

      it('should set a default limit for the number of results', async () => {
        const client = createClient({ hits: { hits: [] } });

        const repository = searchRepository(client);

        await repository.find({
          query: 'Test Query',
          prison: 'HMP Development',
        });

        expect(client.post).toHaveBeenCalledTimes(
          1,
          'The method should have performed a post using the client',
        );

        const requestBody =
          client.post.mock.calls[client.post.mock.calls.length - 1][1];

        expect(requestBody.size).toBe(
          15,
          'The query should set a default limit of results',
        );
      });

      it('should handle a malformed response', async () => {
        const client = createClient({});

        const repository = searchRepository(client);

        const response = await repository.find({
          query: 'Test Query',
          prison: 'HMP Development',
        });

        expect(client.post).toHaveBeenCalledTimes(
          1,
          'The method should have performed a post using the client',
        );

        expect(response.length).toBe(
          0,
          'The method should have returned an empty array',
        );
      });
    });
  });

  describe('#typeAhead', () => {
    describe('When called with a search query', () => {
      it('should return the results', async () => {
        const mockResults = [
          {
            _id: '1',
            _source: {
              title: ['First Item'],
              summary: ['First item summary'],
            },
          },
          {
            _id: '2',
            _source: {
              title: ['Second Item'],
              summary: ['Second item summary'],
            },
          },
          {
            _id: '3',
            _source: {
              title: ['Third Item'],
              summary: ['Third item summary'],
            },
          },
        ];

        const client = createClient({ hits: { hits: mockResults } });

        const repository = searchRepository(client);

        const query = 'Test Query';

        const response = await repository.find({
          query,
          prison: 'HMP Development',
        });

        expect(client.post).toHaveBeenCalledTimes(
          1,
          'The method should have performed a post using the client',
        );

        const requestBody = JSON.stringify(
          client.post.mock.calls[client.post.mock.calls.length - 1][1],
        );

        expect(requestBody).toContain(
          query,
          'The request body should include the query',
        );

        expect(response.length).toBe(
          mockResults.length,
          'The method should have returned the same number of results',
        );

        expect(response[0]).toStrictEqual(
          {
            title: 'First Item',
            summary: 'First item summary',
            url: '/content/1',
          },
          'The method should have transformed the results',
        );
      });

      it('should filter by prison', async () => {
        const client = createClient({ hits: { hits: [] } });

        const repository = searchRepository(client);

        const query = 'Test Query';

        await repository.typeAhead({
          query,
          prison: 'HMP Development',
        });

        expect(client.post).toHaveBeenCalledTimes(
          1,
          'The method should have performed a post using the client',
        );

        const requestBody = JSON.stringify(
          client.post.mock.calls[client.post.mock.calls.length - 1][1],
        );

        expect(requestBody).toContain(
          'HMP Development',
          'The request body should include the prison name',
        );
      });

      it('should set a default limit for the number of results', async () => {
        const client = createClient({ hits: { hits: [] } });

        const repository = searchRepository(client);

        await repository.typeAhead({
          query: 'Test Query',
          prison: 'HMP Development',
        });

        expect(client.post).toHaveBeenCalledTimes(
          1,
          'The method should have performed a post using the client',
        );

        const requestBody =
          client.post.mock.calls[client.post.mock.calls.length - 1][1];

        expect(requestBody.size).toBe(
          5,
          'The query should set a default limit of results',
        );
      });

      it('should handle a malformed response', async () => {
        const client = createClient({});

        const repository = searchRepository(client);

        const response = await repository.typeAhead({
          query: 'Test Query',
          prison: 'HMP Development',
        });

        expect(client.post).toHaveBeenCalledTimes(
          1,
          'The method should have performed a post using the client',
        );

        expect(response.length).toBe(
          0,
          'The method should have returned an empty array',
        );
      });
    });
  });
});

const createClient = response => ({
  get: jest.fn().mockResolvedValue(response),
  post: jest.fn().mockResolvedValue(response),
});
