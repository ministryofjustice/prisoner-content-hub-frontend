const express = require('express');
const nunjucksSetup = require('../nunjucksSetup');

describe('skip', () => {
  let skip;
  beforeEach(() => {
    const env = nunjucksSetup(express());
    skip = env.getFilter('skip');
  });
  it('should handle an empty array', () => {
    expect(skip([], 1)).toEqual([]);
  });

  it('should skip first item', () => {
    expect(skip([1, 2, 3], 1)).toEqual([2, 3]);
  });

  it('should handle negative indexes', () => {
    expect(skip([1, 2, 3], -1)).toEqual([3]);
  });

  it('should handle null', () => {
    expect(() => skip(null, -1)).toThrowError();
  });
});
