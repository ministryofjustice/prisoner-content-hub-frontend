const breadcrumbs = require('../../content/breadcrumbs.json');
const { createBreadcrumbs } = require('../breadcrumbs');

describe('createBreadcrumbs', () => {
  let req = {};
  let homeBreadcrumb = [];
  let myProfileBreadcrumb = [];
  let gamesBreadcrumb = [];

  beforeEach(() => {
    homeBreadcrumb.push(breadcrumbs.home);

    myProfileBreadcrumb.push(breadcrumbs.home, breadcrumbs.profile);

    gamesBreadcrumb.push(
      breadcrumbs.home,
      breadcrumbs.entertainment,
      breadcrumbs.games,
    );
  });

  afterEach(() => {
    req = {};
    homeBreadcrumb = [];
    myProfileBreadcrumb = [];
    gamesBreadcrumb = [];
  });

  it('should return an empty array if originalUrl does not exist', () => {
    expect(createBreadcrumbs(req)).toEqual([]);
  });

  it('should return the expected breadcrumbs for the /profile route', () => {
    req = {
      originalUrl: '/profile',
    };

    expect(createBreadcrumbs(req)).toEqual(homeBreadcrumb);
  });

  it('should return the expected breadcrumbs for the /approved-visitors route', () => {
    req = {
      originalUrl: '/approved-visitors',
    };

    expect(createBreadcrumbs(req)).toEqual(myProfileBreadcrumb);
  });

  it('should return the expected breadcrumbs for the /games route', () => {
    req = {
      originalUrl: '/games',
    };

    expect(createBreadcrumbs(req)).toEqual(gamesBreadcrumb);
  });

  it('should return an empty array if a matching route is not found', () => {
    expect(createBreadcrumbs('/')).toEqual([]);
  });
});
