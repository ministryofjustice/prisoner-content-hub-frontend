const {
  InMemoryCachingStrategy,
  RedisCachingStrategy,
} = require('../../server/utils/caching');

const TEST_KEY = 'bar';
const TEST_VALUE = 'foo';
const TEST_EXPIRY = 60;
const TEST_SECRET = 'C6jvLBjmtt9OnzeP5C3dQH7DewI6GK1h';
const ENCRYPTED_TEST_VALUE =
  '7076c3010d79ed1deaf54425260530ca:2fa1b9681b6ee2d6a770088d25550b18';

describe('RedisCachingStrategy', () => {
  it('should wrap a Redis client and encrypt persisted data', async () => {
    const mockRedis = {};
    mockRedis.get = fn => fn(null, TEST_KEY);
    mockRedis.set = fn => fn(null, TEST_VALUE);
    const strategy = new RedisCachingStrategy(TEST_SECRET, mockRedis);

    expect(await strategy.getFromRedis()).to.equal(
      TEST_KEY,
      'It should promisify RedisClient.get()',
    );
    expect(await strategy.setInRedis()).to.equal(
      TEST_VALUE,
      'It should promisify RedisClient.set()',
    );

    const enc = strategy.encrypt(TEST_VALUE);
    expect(enc).to.not.equal(TEST_VALUE, 'It should encrypt the data');
    expect(strategy.decrypt(enc)).to.equal(
      TEST_VALUE,
      'It should decrypt the data',
    );
  });

  it('should set expiry and return a value if not expired', async () => {
    const mockRedis = {};
    const hasCalledGet = sinon.spy();
    const hasCalledSet = sinon.spy();
    mockRedis.get = (key, fn) => {
      hasCalledGet(key);
      fn(null, ENCRYPTED_TEST_VALUE);
    };
    mockRedis.set = (key, value, property, propertyValue, fn) => {
      hasCalledSet(key, value, property, propertyValue);
      fn();
    };

    const strategy = new RedisCachingStrategy(TEST_SECRET, mockRedis);

    await strategy.set(TEST_KEY, TEST_VALUE, TEST_EXPIRY);
    expect(hasCalledSet.lastCall.args[0]).to.equal(TEST_KEY);
    expect(strategy.decrypt(hasCalledSet.lastCall.args[1])).to.equal(
      TEST_VALUE,
    );
    expect(hasCalledSet.lastCall.args[2]).to.equal('EX');
    expect(hasCalledSet.lastCall.args[3]).to.equal(TEST_EXPIRY);

    const token = await strategy.get(TEST_KEY);
    expect(hasCalledGet.lastCall.args[0]).to.equal(TEST_KEY);
    expect(token).to.equal(TEST_VALUE);
  });

  it('should not return an expired value', async () => {
    const mockRedis = {};
    const hasCalledGet = sinon.spy();
    const hasCalledSet = sinon.spy();
    mockRedis.get = (key, fn) => {
      hasCalledGet(key);
      fn(null, null);
    };
    mockRedis.set = (key, value, property, propertyValue, fn) => {
      hasCalledSet(key, value, property, propertyValue);
      fn();
    };

    const strategy = new RedisCachingStrategy(TEST_SECRET, mockRedis);

    await strategy.set(TEST_KEY, TEST_VALUE, TEST_EXPIRY);
    expect(hasCalledSet.lastCall.args[0]).to.equal(TEST_KEY);
    expect(strategy.decrypt(hasCalledSet.lastCall.args[1])).to.equal(
      TEST_VALUE,
    );
    expect(hasCalledSet.lastCall.args[2]).to.equal('EX');
    expect(hasCalledSet.lastCall.args[3]).to.equal(TEST_EXPIRY);

    const token = await strategy.get(TEST_KEY);
    expect(hasCalledGet.lastCall.args[0]).to.equal(TEST_KEY);
    expect(token).to.equal(null);
  });

  it('should throw when not provided the correct parameters', async () => {
    const mockRedis = {};
    const hasCalledGet = sinon.spy();
    const hasCalledSet = sinon.spy();
    mockRedis.get = (key, fn) => {
      hasCalledGet(key);
      fn(null, ENCRYPTED_TEST_VALUE);
    };
    mockRedis.set = (key, value, property, propertyValue, fn) => {
      hasCalledSet(key, value, property, propertyValue);
      fn();
    };

    const strategy = new RedisCachingStrategy(TEST_SECRET, mockRedis);

    await expect(strategy.set(TEST_KEY, TEST_VALUE)).to.be.rejectedWith(
      /unable to cache/i,
    );
    await expect(strategy.set(TEST_KEY)).to.be.rejectedWith(/unable to cache/i);
    await expect(strategy.set()).to.be.rejectedWith(/unable to cache/i);

    await expect(strategy.get()).to.be.rejectedWith(
      /unable to retrieve cache/i,
    );
  });
});

describe('InMemoryCachingStrategy', () => {
  it('should construct and have an empty state by default', async () => {
    const strategy = new InMemoryCachingStrategy();

    expect(JSON.stringify(strategy.state)).to.equal(
      JSON.stringify({}),
      'It should set the state to empty by default',
    );
  });

  it('should set expiry and return a value if not expired', async () => {
    const strategy = new InMemoryCachingStrategy();

    await strategy.set('baz', TEST_VALUE, 9999);
    const { baz } = strategy.state;
    expect(baz.value).to.equal(TEST_VALUE);
    expect(baz.expires).to.exist;

    const value = await strategy.get('baz');
    expect(value).to.equal(TEST_VALUE);
  });

  it('should not return an expired value', async () => {
    const strategy = new InMemoryCachingStrategy();

    await strategy.set('baz', TEST_VALUE, -9999);
    const { baz } = strategy.state;
    expect(baz.value).to.equal(TEST_VALUE);
    expect(baz.expires).to.exist;

    const value = await strategy.get('baz');
    expect(value).to.equal(null);
  });

  it('should throw when not provided the correct parameters', async () => {
    const strategy = new InMemoryCachingStrategy();

    await expect(strategy.set(TEST_KEY, TEST_VALUE)).to.be.rejectedWith(
      /unable to cache/i,
    );
    await expect(strategy.set(TEST_KEY)).to.be.rejectedWith(/unable to cache/i);
    await expect(strategy.set()).to.be.rejectedWith(/unable to cache/i);

    await expect(strategy.get()).to.be.rejectedWith(
      /unable to retrieve cache/i,
    );
  });
});
