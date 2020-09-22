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
});
