const { analyticsRepository } = require('../../server/repositories/analytics');

describe.only('analyticsRepository', () => {
  describe('sendEvent', () => {
    it('validates the offender number before making a call to the API', async () => {
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
      expect(client.postFormData.called).to.equal(true);
    });
  });
});
