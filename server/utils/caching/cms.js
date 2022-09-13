const getCmsCacheKey = (...args) => `CMS:${args.join(':')}`;

module.exports = {
  getCmsCacheKey,
};
