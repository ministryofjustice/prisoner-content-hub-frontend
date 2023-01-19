const getCmsCacheKey = (...args) => `cms-api:${args.join(':')}`;

module.exports = {
  getCmsCacheKey,
};
