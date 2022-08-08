const { clone } = require('ramda');

const getCacheArrayQuery = async (query, cache, key, expiry = 60) => {
  let data = (await cache.get(key)) || null;
  if (!data) {
    data = (await query()) || [];
    await cache.set(key, data, expiry);
  }
  // move to "structuredClone" when on node 18+
  return clone(data);
};

const getCacheKey = (...args) => args.join(':');

module.exports = {
  getCacheKey,
  getCacheArrayQuery,
};
