const { analyticsRepository } = require('../analytics');

describe('analyticsRepository', () => {
  describe('sendEvent', () => {
    it('should send all passed in data through to GA', async () => {
      const basicData = {
        category: 'category',
        action: 'action',
        label: 'label',
        value: 'value',
        sessionId: 'sessionId',
        userAgent: 'userAgent',
      };
      const client = {
        postFormData: jest.fn(),
      };
      const repository = analyticsRepository(client);

      let exception = null;

      try {
        await repository.sendEvent(basicData);
      } catch (e) {
        exception = e;
      }

      expect(exception).toBeNull();
      expect(client.postFormData.mock.calls[0][1].ec).toBe(basicData.category);
      expect(client.postFormData.mock.calls[0][1].ea).toBe(basicData.action);
      expect(client.postFormData.mock.calls[0][1].el).toBe(basicData.label);
      expect(client.postFormData.mock.calls[0][1].ev).toBe(basicData.value);
      expect(client.postFormData.mock.calls[0][1].cid).toBe(
        basicData.sessionId,
      );
      expect(client.postFormData.mock.calls[0][1].ua).toBe(basicData.userAgent);
    });

    it('should skip userAgent if not present', async () => {
      const basicData = {
        category: 'category',
        action: 'action',
        label: 'label',
        value: 'value',
        sessionId: 'sessionId',
      };
      const client = {
        postFormData: jest.fn(),
      };
      const repository = analyticsRepository(client);

      let exception = null;

      try {
        await repository.sendEvent(basicData);
      } catch (e) {
        exception = e;
      }

      expect(exception).toBeNull();
      expect(client.postFormData.mock.calls[0][1].ec).toBe(basicData.category);
      expect(client.postFormData.mock.calls[0][1].ea).toBe(basicData.action);
      expect(client.postFormData.mock.calls[0][1].el).toBe(basicData.label);
      expect(client.postFormData.mock.calls[0][1].ev).toBe(basicData.value);
      expect(client.postFormData.mock.calls[0][1].cid).toBe(
        basicData.sessionId,
      );
      expect(client.postFormData.mock.calls[0][1].ua).toBe(undefined);
    });

    it('should skip value if not present', async () => {
      const basicData = {
        category: 'category',
        action: 'action',
        label: 'label',
        sessionId: 'sessionId',
      };
      const client = {
        postFormData: jest.fn(),
      };
      const repository = analyticsRepository(client);

      let exception = null;

      try {
        await repository.sendEvent(basicData);
      } catch (e) {
        exception = e;
      }

      expect(exception).toBeNull();
      expect(client.postFormData.mock.calls[0][1].ec).toBe(basicData.category);
      expect(client.postFormData.mock.calls[0][1].ea).toBe(basicData.action);
      expect(client.postFormData.mock.calls[0][1].el).toBe(basicData.label);
      expect(client.postFormData.mock.calls[0][1].ev).toBe(undefined);
      expect(client.postFormData.mock.calls[0][1].cid).toBe(
        basicData.sessionId,
      );
    });
  });
  describe('sendPageTrack', () => {
    it('should send all passed in data through to GA', async () => {
      const basicData = {
        hostname: 'hostname',
        page: 'page',
        title: 'title',
        sessionId: 'sessionId',
        userAgent: 'userAgent',
        screen: 'screen',
        viewport: 'viewport',
        topics: 'topics',
        categories: 'categories',
        series: 'series',
      };
      const client = {
        postFormData: jest.fn(),
      };
      const repository = analyticsRepository(client);

      let exception = null;

      try {
        await repository.sendPageTrack(basicData);
      } catch (e) {
        exception = e;
      }

      expect(exception).toBeNull();
      expect(client.postFormData.mock.calls[0][1].dh).toBe(basicData.hostname);
      expect(client.postFormData.mock.calls[0][1].dp).toBe(basicData.page);
      expect(client.postFormData.mock.calls[0][1].dt).toBe(basicData.title);
      expect(client.postFormData.mock.calls[0][1].cid).toBe(
        basicData.sessionId,
      );
      expect(client.postFormData.mock.calls[0][1].ua).toBe(basicData.userAgent);
      expect(client.postFormData.mock.calls[0][1].sr).toBe(basicData.screen);
      expect(client.postFormData.mock.calls[0][1].vp).toBe(basicData.viewport);
      expect(client.postFormData.mock.calls[0][1].cd1).toBe(basicData.topics);
      expect(client.postFormData.mock.calls[0][1].cd2).toBe(
        basicData.categories,
      );
      expect(client.postFormData.mock.calls[0][1].cd3).toBe(basicData.series);
    });

    it('should skip userAgent if not present', async () => {
      const basicData = {
        hostname: 'hostname',
        page: 'page',
        title: 'title',
        sessionId: 'sessionId',
        screen: 'screen',
        viewport: 'viewport',
        topics: 'topics',
        categories: 'categories',
        series: 'series',
      };
      const client = {
        postFormData: jest.fn(),
      };
      const repository = analyticsRepository(client);

      let exception = null;

      try {
        await repository.sendPageTrack(basicData);
      } catch (e) {
        exception = e;
      }

      expect(exception).toBeNull();
      expect(client.postFormData.mock.calls[0][1].dh).toBe(basicData.hostname);
      expect(client.postFormData.mock.calls[0][1].dp).toBe(basicData.page);
      expect(client.postFormData.mock.calls[0][1].dt).toBe(basicData.title);
      expect(client.postFormData.mock.calls[0][1].cid).toBe(
        basicData.sessionId,
      );
      expect(client.postFormData.mock.calls[0][1].ua).toBe(undefined);
      expect(client.postFormData.mock.calls[0][1].sr).toBe(basicData.screen);
      expect(client.postFormData.mock.calls[0][1].vp).toBe(basicData.viewport);
      expect(client.postFormData.mock.calls[0][1].cd1).toBe(basicData.topics);
      expect(client.postFormData.mock.calls[0][1].cd2).toBe(
        basicData.categories,
      );
      expect(client.postFormData.mock.calls[0][1].cd3).toBe(basicData.series);
    });

    it('should skip topics if not present', async () => {
      const basicData = {
        hostname: 'hostname',
        page: 'page',
        title: 'title',
        sessionId: 'sessionId',
        screen: 'screen',
        viewport: 'viewport',
        categories: 'categories',
        series: 'series',
      };
      const client = {
        postFormData: jest.fn(),
      };
      const repository = analyticsRepository(client);

      let exception = null;

      try {
        await repository.sendPageTrack(basicData);
      } catch (e) {
        exception = e;
      }

      expect(exception).toBeNull();
      expect(client.postFormData.mock.calls[0][1].dh).toBe(basicData.hostname);
      expect(client.postFormData.mock.calls[0][1].dp).toBe(basicData.page);
      expect(client.postFormData.mock.calls[0][1].dt).toBe(basicData.title);
      expect(client.postFormData.mock.calls[0][1].cid).toBe(
        basicData.sessionId,
      );
      expect(client.postFormData.mock.calls[0][1].sr).toBe(basicData.screen);
      expect(client.postFormData.mock.calls[0][1].vp).toBe(basicData.viewport);
      expect(client.postFormData.mock.calls[0][1].cd1).toBe(undefined);
      expect(client.postFormData.mock.calls[0][1].cd2).toBe(
        basicData.categories,
      );
      expect(client.postFormData.mock.calls[0][1].cd3).toBe(basicData.series);
    });

    it('should skip categories if not present', async () => {
      const basicData = {
        hostname: 'hostname',
        page: 'page',
        title: 'title',
        sessionId: 'sessionId',
        screen: 'screen',
        viewport: 'viewport',
      };
      const client = {
        postFormData: jest.fn(),
      };
      const repository = analyticsRepository(client);

      let exception = null;

      try {
        await repository.sendPageTrack(basicData);
      } catch (e) {
        exception = e;
      }

      expect(exception).toBeNull();
      expect(client.postFormData.mock.calls[0][1].dh).toBe(basicData.hostname);
      expect(client.postFormData.mock.calls[0][1].dp).toBe(basicData.page);
      expect(client.postFormData.mock.calls[0][1].dt).toBe(basicData.title);
      expect(client.postFormData.mock.calls[0][1].cid).toBe(
        basicData.sessionId,
      );
      expect(client.postFormData.mock.calls[0][1].sr).toBe(basicData.screen);
      expect(client.postFormData.mock.calls[0][1].vp).toBe(basicData.viewport);
      expect(client.postFormData.mock.calls[0][1].cd1).toBe(
        basicData.categories,
      );
      expect(client.postFormData.mock.calls[0][1].cd2).toBe(undefined);
      expect(client.postFormData.mock.calls[0][1].cd3).toBe(basicData.series);
    });

    it('should skip series if not present', async () => {
      const basicData = {
        hostname: 'hostname',
        page: 'page',
        title: 'title',
        sessionId: 'sessionId',
        screen: 'screen',
        viewport: 'viewport',
      };
      const client = {
        postFormData: jest.fn(),
      };
      const repository = analyticsRepository(client);

      let exception = null;

      try {
        await repository.sendPageTrack(basicData);
      } catch (e) {
        exception = e;
      }

      expect(exception).toBeNull();
      expect(client.postFormData.mock.calls[0][1].dh).toBe(basicData.hostname);
      expect(client.postFormData.mock.calls[0][1].dp).toBe(basicData.page);
      expect(client.postFormData.mock.calls[0][1].dt).toBe(basicData.title);
      expect(client.postFormData.mock.calls[0][1].cid).toBe(
        basicData.sessionId,
      );
      expect(client.postFormData.mock.calls[0][1].sr).toBe(basicData.screen);
      expect(client.postFormData.mock.calls[0][1].vp).toBe(basicData.viewport);
      expect(client.postFormData.mock.calls[0][1].cd1).toBe(
        basicData.categories,
      );
      expect(client.postFormData.mock.calls[0][1].cd2).toBe(basicData.topics);
      expect(client.postFormData.mock.calls[0][1].cd3).toBe(undefined);
    });
  });
});
