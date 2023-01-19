const { InMemoryCachingStrategy } = require('../caching/memory');
const { getCmsCacheKey } = require('../caching/cms');

const TEST_KEY = 'bar';
const TEST_VALUE = 'foo';

describe('InMemoryCachingStrategy', () => {
  it('should construct and have an empty state by default', async () => {
    const strategy = new InMemoryCachingStrategy();

    expect(JSON.stringify(strategy.state)).toBe(
      JSON.stringify({}),
      'It should set the state to empty by default',
    );
  });

  it('should set expiry and return a value if not expired', async () => {
    const strategy = new InMemoryCachingStrategy();

    await strategy.set('baz', TEST_VALUE, 9999);
    const { baz } = strategy.state;
    expect(baz.value).toBe(TEST_VALUE);
    expect(baz.expires).toBeDefined();

    const value = await strategy.get('baz');
    expect(value).toBe(TEST_VALUE);
  });

  it('should not return an expired value', async () => {
    const strategy = new InMemoryCachingStrategy();

    await strategy.set('baz', TEST_VALUE, -9999);
    const { baz } = strategy.state;
    expect(baz.value).toBe(TEST_VALUE);
    expect(baz.expires).toBeDefined();

    const value = await strategy.get('baz');
    expect(value).toBeNull();
  });

  it('should throw when not provided the correct parameters', async () => {
    const strategy = new InMemoryCachingStrategy();

    await expect(strategy.set(TEST_KEY, TEST_VALUE)).rejects.toThrow(
      'Unable to cache - key, value or expiry not provided',
    );
    await expect(strategy.set(TEST_KEY)).rejects.toThrow(
      'Unable to cache - key, value or expiry not provided',
    );
    await expect(strategy.set()).rejects.toThrow(
      'Unable to cache - key, value or expiry not provided',
    );
    await expect(strategy.get()).rejects.toThrow(
      'Unable to retrieve cache - key not provided',
    );
  });
});

describe('getCmsCacheKey', () => {
  it('should concatenate two params with ":"', () => {
    expect(getCmsCacheKey('start', 'end')).toBe('cms-api:start:end');
  });
  it('should concatenate multiple params with ":"', () => {
    expect(getCmsCacheKey('start', 'middle', 'end')).toBe(
      'cms-api:start:middle:end',
    );
  });
});
