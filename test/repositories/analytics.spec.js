const { expect } = require('chai');
const { analyticsRepository } = require('../../server/repositories/analytics');

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
        postFormData: sinon.stub(),
      };
      const repository = analyticsRepository(client);

      let exception = null;

      try {
        await repository.sendEvent(basicData);
      } catch (e) {
        exception = e;
      }

      expect(exception).to.be.null;
      expect(client.postFormData.args[0][1].ec).to.equal(basicData.category);
      expect(client.postFormData.args[0][1].ea).to.equal(basicData.action);
      expect(client.postFormData.args[0][1].el).to.equal(basicData.label);
      expect(client.postFormData.args[0][1].ev).to.equal(basicData.value);
      expect(client.postFormData.args[0][1].cid).to.equal(basicData.sessionId);
      expect(client.postFormData.args[0][1].ua).to.equal(basicData.userAgent);
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
        postFormData: sinon.stub(),
      };
      const repository = analyticsRepository(client);

      let exception = null;

      try {
        await repository.sendEvent(basicData);
      } catch (e) {
        exception = e;
      }

      expect(exception).to.be.null;
      expect(client.postFormData.args[0][1].ec).to.equal(basicData.category);
      expect(client.postFormData.args[0][1].ea).to.equal(basicData.action);
      expect(client.postFormData.args[0][1].el).to.equal(basicData.label);
      expect(client.postFormData.args[0][1].ev).to.equal(basicData.value);
      expect(client.postFormData.args[0][1].cid).to.equal(basicData.sessionId);
      expect(client.postFormData.args[0][1].ua).to.equal(undefined);
    });

    it('should skip value if not present', async () => {
      const basicData = {
        category: 'category',
        action: 'action',
        label: 'label',
        sessionId: 'sessionId',
      };
      const client = {
        postFormData: sinon.stub(),
      };
      const repository = analyticsRepository(client);

      let exception = null;

      try {
        await repository.sendEvent(basicData);
      } catch (e) {
        exception = e;
      }

      expect(exception).to.be.null;
      expect(client.postFormData.args[0][1].ec).to.equal(basicData.category);
      expect(client.postFormData.args[0][1].ea).to.equal(basicData.action);
      expect(client.postFormData.args[0][1].el).to.equal(basicData.label);
      expect(client.postFormData.args[0][1].ev).to.equal(undefined);
      expect(client.postFormData.args[0][1].cid).to.equal(basicData.sessionId);
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
        secondaryTags: 'secondaryTags',
        categories: 'categories',
        series: 'series',
      };
      const client = {
        postFormData: sinon.stub(),
      };
      const repository = analyticsRepository(client);

      let exception = null;

      try {
        await repository.sendPageTrack(basicData);
      } catch (e) {
        exception = e;
      }

      expect(exception).to.be.null;
      expect(client.postFormData.args[0][1].dh).to.equal(basicData.hostname);
      expect(client.postFormData.args[0][1].dp).to.equal(basicData.page);
      expect(client.postFormData.args[0][1].dt).to.equal(basicData.title);
      expect(client.postFormData.args[0][1].cid).to.equal(basicData.sessionId);
      expect(client.postFormData.args[0][1].ua).to.equal(basicData.userAgent);
      expect(client.postFormData.args[0][1].sr).to.equal(basicData.screen);
      expect(client.postFormData.args[0][1].vp).to.equal(basicData.viewport);
      expect(client.postFormData.args[0][1].cd1).to.equal(
        basicData.secondaryTags,
      );
      expect(client.postFormData.args[0][1].cd2).to.equal(basicData.categories);
      expect(client.postFormData.args[0][1].cd3).to.equal(basicData.series);
    });

    it('should skip userAgent if not present', async () => {
      const basicData = {
        hostname: 'hostname',
        page: 'page',
        title: 'title',
        sessionId: 'sessionId',
        screen: 'screen',
        viewport: 'viewport',
        secondaryTags: 'secondaryTags',
        categories: 'categories',
        series: 'series',
      };
      const client = {
        postFormData: sinon.stub(),
      };
      const repository = analyticsRepository(client);

      let exception = null;

      try {
        await repository.sendPageTrack(basicData);
      } catch (e) {
        exception = e;
      }

      expect(exception).to.be.null;
      expect(client.postFormData.args[0][1].dh).to.equal(basicData.hostname);
      expect(client.postFormData.args[0][1].dp).to.equal(basicData.page);
      expect(client.postFormData.args[0][1].dt).to.equal(basicData.title);
      expect(client.postFormData.args[0][1].cid).to.equal(basicData.sessionId);
      expect(client.postFormData.args[0][1].ua).to.equal(undefined);
      expect(client.postFormData.args[0][1].sr).to.equal(basicData.screen);
      expect(client.postFormData.args[0][1].vp).to.equal(basicData.viewport);
      expect(client.postFormData.args[0][1].cd1).to.equal(
        basicData.secondaryTags,
      );
      expect(client.postFormData.args[0][1].cd2).to.equal(basicData.categories);
      expect(client.postFormData.args[0][1].cd3).to.equal(basicData.series);
    });

    it('should skip secondaryTags if not present', async () => {
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
        postFormData: sinon.stub(),
      };
      const repository = analyticsRepository(client);

      let exception = null;

      try {
        await repository.sendPageTrack(basicData);
      } catch (e) {
        exception = e;
      }

      expect(exception).to.be.null;
      expect(client.postFormData.args[0][1].dh).to.equal(basicData.hostname);
      expect(client.postFormData.args[0][1].dp).to.equal(basicData.page);
      expect(client.postFormData.args[0][1].dt).to.equal(basicData.title);
      expect(client.postFormData.args[0][1].cid).to.equal(basicData.sessionId);
      expect(client.postFormData.args[0][1].sr).to.equal(basicData.screen);
      expect(client.postFormData.args[0][1].vp).to.equal(basicData.viewport);
      expect(client.postFormData.args[0][1].cd1).to.equal(undefined);
      expect(client.postFormData.args[0][1].cd2).to.equal(basicData.categories);
      expect(client.postFormData.args[0][1].cd3).to.equal(basicData.series);
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
        postFormData: sinon.stub(),
      };
      const repository = analyticsRepository(client);

      let exception = null;

      try {
        await repository.sendPageTrack(basicData);
      } catch (e) {
        exception = e;
      }

      expect(exception).to.be.null;
      expect(client.postFormData.args[0][1].dh).to.equal(basicData.hostname);
      expect(client.postFormData.args[0][1].dp).to.equal(basicData.page);
      expect(client.postFormData.args[0][1].dt).to.equal(basicData.title);
      expect(client.postFormData.args[0][1].cid).to.equal(basicData.sessionId);
      expect(client.postFormData.args[0][1].sr).to.equal(basicData.screen);
      expect(client.postFormData.args[0][1].vp).to.equal(basicData.viewport);
      expect(client.postFormData.args[0][1].cd1).to.equal(basicData.categories);
      expect(client.postFormData.args[0][1].cd2).to.equal(undefined);
      expect(client.postFormData.args[0][1].cd3).to.equal(basicData.series);
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
        postFormData: sinon.stub(),
      };
      const repository = analyticsRepository(client);

      let exception = null;

      try {
        await repository.sendPageTrack(basicData);
      } catch (e) {
        exception = e;
      }

      expect(exception).to.be.null;
      expect(client.postFormData.args[0][1].dh).to.equal(basicData.hostname);
      expect(client.postFormData.args[0][1].dp).to.equal(basicData.page);
      expect(client.postFormData.args[0][1].dt).to.equal(basicData.title);
      expect(client.postFormData.args[0][1].cid).to.equal(basicData.sessionId);
      expect(client.postFormData.args[0][1].sr).to.equal(basicData.screen);
      expect(client.postFormData.args[0][1].vp).to.equal(basicData.viewport);
      expect(client.postFormData.args[0][1].cd1).to.equal(basicData.categories);
      expect(client.postFormData.args[0][1].cd2).to.equal(
        basicData.secondaryTags,
      );
      expect(client.postFormData.args[0][1].cd3).to.equal(undefined);
    });
  });
});
