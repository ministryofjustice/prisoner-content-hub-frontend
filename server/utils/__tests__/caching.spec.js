const { InMemoryCachingStrategy } = require('../caching/memory');
const { getCacheKey, getCacheArrayQuery } = require('../caching/cms');

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

describe('getCacheKey', () => {
  it('should concatenate two params with ":"', () => {
    expect(getCacheKey('start', 'end')).toBe('start:end');
  });
  it('should concatenate multiple params with ":"', () => {
    expect(getCacheKey('start', 'middle', 'end')).toBe('start:middle:end');
  });
});

describe('getCacheArrayQuery', () => {
  const CACHEKEY = 'quiche';
  const CACHEVALUE = [{ id: 1 }, { id: 2 }, { id: 3 }];
  const QUERYVALUE = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  const EXPIRYVALUE = 237;
  const cache = { get: jest.fn(), set: jest.fn() };
  const query = jest.fn();
  let result;

  beforeEach(() => {
    query.mockResolvedValue(QUERYVALUE);
    cache.set.mockResolvedValue('');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
  describe('with cached data', () => {
    beforeEach(async () => {
      cache.get.mockResolvedValue(CACHEVALUE);
      result = await getCacheArrayQuery(query, cache, CACHEKEY, EXPIRYVALUE);
    });
    it('consults the cache', () => {
      expect(cache.get).toHaveBeenCalledTimes(1);
      expect(cache.get).toHaveBeenCalledWith(CACHEKEY);
    });
    it('returns the cached value', () => {
      expect(result).toStrictEqual(CACHEVALUE);
    });
    it('does not consult the query', () => {
      expect(query).not.toHaveBeenCalled();
    });
    it('does not set the cache', () => {
      expect(cache.set).not.toHaveBeenCalled();
    });
  });
  describe('with NO cached data', () => {
    beforeEach(async () => {
      cache.get.mockResolvedValue('');
      result = await getCacheArrayQuery(query, cache, CACHEKEY, EXPIRYVALUE);
    });
    it('consults the cache', () => {
      expect(cache.get).toHaveBeenCalledTimes(1);
      expect(cache.get).toHaveBeenCalledWith(CACHEKEY);
    });
    it('consults the query', () => {
      expect(query).toHaveBeenCalledTimes(1);
    });
    it('sets the cache', () => {
      expect(cache.set).toHaveBeenCalledTimes(1);
      expect(cache.set).toHaveBeenCalledWith(CACHEKEY, QUERYVALUE, EXPIRYVALUE);
    });
    it('returns the query value', () => {
      expect(result).toStrictEqual(QUERYVALUE);
    });
  });
});
