const { InMemoryCachingStrategy } = require('./memory');
const { RedisCachingStrategy } = require('./redis');

module.exports = {
  InMemoryCachingStrategy,
  RedisCachingStrategy,
};
