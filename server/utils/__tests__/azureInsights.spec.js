const { Contracts } = require('applicationinsights');
const {
  addEstablishmentProcessor,
  ignoreStaticAssetsProcessor,
  ignoreInProcDependencies,
} = require('../azureAppInsights');

describe('azureAppInsights', () => {
  describe('addEstablishmentProcessor', () => {
    const context = {
      'http.ServerRequest': { session: { establishmentName: 'wayland' } },
    };

    const createEnvelope = properties => ({
      data: {
        baseType: 'RequestData',
        baseData: { properties },
      },
    });

    it('Add establishment to properties when present', () => {
      const envelope = createEnvelope({ other: 'things' });

      addEstablishmentProcessor(envelope, context);

      expect(envelope.data.baseData.properties).toStrictEqual({
        establishmentName: 'wayland',
        other: 'things',
      });
    });

    it('Inidicates processing should continue', () => {
      const envelope = createEnvelope({});

      const result = addEstablishmentProcessor(envelope, context);

      expect(result).toBe(true);
    });

    it('handles when no properties have been set', () => {
      const envelope = createEnvelope(undefined);

      addEstablishmentProcessor(envelope, context);

      expect(envelope.data.baseData.properties).toStrictEqual({
        establishmentName: 'wayland',
      });
    });

    it('handles missing establishment name', () => {
      const envelope = createEnvelope({ other: 'things' });

      addEstablishmentProcessor(envelope, {
        'http.ServerRequest': {},
      });

      expect(envelope.data.baseData.properties).toStrictEqual({
        other: 'things',
      });
    });
  });

  describe('ignoreStaticAssetsProcessor', () => {
    const context = {};

    const createRequestData = name => {
      const requestData = new Contracts.RequestData();
      requestData.name = name;
      return requestData;
    };

    const createEnvelope = requestData => ({
      data: {
        baseType: 'RequestData',
        baseData: requestData,
      },
    });

    it('processes when missing request data', () => {
      const envelope = createEnvelope(null);

      const result = ignoreStaticAssetsProcessor(envelope, context);

      expect(result).toBe(true);
    });

    it('processes when unknown request name', () => {
      const envelope = createEnvelope(createRequestData('GET /some-thing'));

      const result = ignoreStaticAssetsProcessor(envelope, context);

      expect(result).toBe(true);
    });

    it('does not process assets', () => {
      const envelope = createEnvelope(
        createRequestData('GET /assets/something-great'),
      );

      const result = ignoreStaticAssetsProcessor(envelope, context);

      expect(result).toBe(false);
    });

    it('does not process public resources', () => {
      const envelope = createEnvelope(
        createRequestData('GET /public/something-great'),
      );

      const result = ignoreStaticAssetsProcessor(envelope, context);

      expect(result).toBe(false);
    });
  });

  describe('ignoreInProcDependencies', () => {
    const context = {};

    const createRemoteDependencyData = type => {
      const baseData = new Contracts.RemoteDependencyData();
      baseData.name = 'name';
      baseData.type = type;
      return baseData;
    };

    const createEnvelope = baseData => ({
      data: {
        baseType: 'RemoteDependencyData',
        baseData,
      },
    });

    it('processes when missing request data', () => {
      const envelope = createEnvelope(null);

      const result = ignoreInProcDependencies(envelope, context);

      expect(result).toBe(true);
    });

    it('processes when unknown baseType', () => {
      const envelope = createEnvelope(createRemoteDependencyData('HTTP'));

      const result = ignoreInProcDependencies(envelope, context);

      expect(result).toBe(true);
    });

    it('does not InProc dependencies', () => {
      const envelope = createEnvelope(createRemoteDependencyData('InProc'));

      const result = ignoreInProcDependencies(envelope, context);

      expect(result).toBe(false);
    });
  });
});
