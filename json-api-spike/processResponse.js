function mergeIncludes(obj, includeMap) {
  if (obj === null) {
    return null;
  }
  if (Array.isArray(obj)) {
    return obj.map(v => mergeIncludes(v, includeMap));
  }
  if (typeof obj === 'object') {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const foundValue = includeMap.get(value);
      const thisVal =
        key === 'links' ? {} : { [key]: mergeIncludes(value, includeMap) };

      return {
        ...acc,
        ...thisVal,
        ...(foundValue || {}),
      };
    }, {});
  }
  return obj;
}

const createIncludeMap = included => {
  const map = new Map(included.map(({ id, ...item }) => [id, item]));
  const values = Array.from(map.entries()).map(([id, item]) => [
    id,
    // Merge includes into each other.. this probably doesn't work for multiple levels of nesting.
    // Probably need to do this as many times as we have depth of nesting? - tests would flush this out
    mergeIncludes(item, map),
  ]);
  return new Map(values);
};

module.exports = {
  /** This goes through and links all the includes  */
  linkUpIncludes: ({ data, included }) => {
    const includeMap = createIncludeMap(included);

    return mergeIncludes(data, includeMap);
  },
};
