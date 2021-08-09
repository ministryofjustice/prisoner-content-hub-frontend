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

describe('toPagination', () => {
  let toPagination;

  let pageData;

  beforeEach(() => {
    const env = nunjucksSetup(express());

    toPagination = env.getFilter('toPagination');

    pageData = { page: 1, totalPages: 3, min: 1, max: 7, totalCount: 19 };
  });

  it('should generate a page one pagination data', () => {
    expect(toPagination(pageData, '')).toEqual({
      items: [
        { href: '?page=1', selected: true, text: 1 },

        { href: '?page=2', selected: false, text: 2 },

        { href: '?page=3', selected: false, text: 3 },
      ],

      next: { href: '?page=2', text: 'Next' },

      previous: false,

      results: { count: 19, from: 1, to: 7 },
    });
  });

  it('should generate a page two pagination data', () => {
    Object.assign(pageData, { page: 2, min: 8, max: 14 });

    expect(toPagination(pageData, '')).toEqual({
      items: [
        { href: '?page=1', selected: false, text: 1 },

        { href: '?page=2', selected: true, text: 2 },

        { href: '?page=3', selected: false, text: 3 },
      ],

      next: { href: '?page=3', text: 'Next' },

      previous: { href: '?page=1', text: 'Previous' },

      results: { count: 19, from: 8, to: 14 },
    });
  });

  it('should generate a page three pagination data', () => {
    Object.assign(pageData, { page: 3, min: 15, max: 19 });

    expect(toPagination(pageData, '')).toEqual({
      items: [
        { href: '?page=1', selected: false, text: 1 },

        { href: '?page=2', selected: false, text: 2 },

        { href: '?page=3', selected: true, text: 3 },
      ],

      next: false,

      previous: { href: '?page=2', text: 'Previous' },

      results: { count: 19, from: 15, to: 19 },
    });
  });
});
