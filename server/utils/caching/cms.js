const getCmsCacheKey = (...args) => `cms:${args.join(':')}`;

module.exports = {
  getCmsCacheKey,
};
