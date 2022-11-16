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
        { href: '?page=1', current: true, number: 1 },

        { href: '?page=2', current: false, number: 2 },

        { href: '?page=3', current: false, number: 3 },
      ],

      next: { href: '?page=2', text: 'Next' },

      previous: false,
    });
  });

  it('should generate a page two pagination data', () => {
    Object.assign(pageData, { page: 2, min: 8, max: 14 });

    expect(toPagination(pageData, '')).toEqual({
      items: [
        { href: '?page=1', current: false, number: 1 },

        { href: '?page=2', current: true, number: 2 },

        { href: '?page=3', current: false, number: 3 },
      ],

      next: { href: '?page=3', text: 'Next' },

      previous: { href: '?page=1', text: 'Previous' },
    });
  });

  it('should generate a page three pagination data', () => {
    Object.assign(pageData, { page: 3, min: 15, max: 19 });

    expect(toPagination(pageData, '')).toEqual({
      items: [
        { href: '?page=1', current: false, number: 1 },

        { href: '?page=2', current: false, number: 2 },

        { href: '?page=3', current: true, number: 3 },
      ],

      next: false,

      previous: { href: '?page=2', text: 'Previous' },
    });
  });
});
