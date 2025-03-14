const nunjucks = require('nunjucks');
const path = require('path');
const { URLSearchParams } = require('url');
const i18next = require('i18next');
const { analytics } = require('../config');

const knownPages = require('../content/knownPages.json');

module.exports = expressApp => {
  const appViews = [
    path.join(__dirname, '../../node_modules/govuk-frontend/dist'),
    path.join(__dirname, '../../node_modules/@ministryofjustice/frontend'),
    path.join(__dirname, '../views/'),
  ];

  const nunjucksEnv = nunjucks.configure(appViews, {
    express: expressApp,
    autoescape: true,
  });

  nunjucksEnv.addGlobal('knownPages', knownPages);
  nunjucksEnv.addGlobal('GA4SiteId', analytics.siteId);
  nunjucksEnv.addGlobal('GTMSiteId', analytics.gtmSiteId);
  nunjucksEnv.addFilter('skip', (array, count) => array.slice(count));

  nunjucksEnv.addFilter('toPagination', ({ page, totalPages }, query) => {
    const urlForPage = n => {
      const urlSearchParams = new URLSearchParams(query);
      urlSearchParams.set('page', n);
      return `?${urlSearchParams.toString()}`;
    };
    const items = [...Array(totalPages).keys()].map(n => ({
      number: n + 1,
      href: urlForPage(n + 1),
      current: n + 1 === page,
    }));
    return {
      previous: page > 1 && {
        text: 'Previous',
        href: urlForPage(page - 1),
      },
      next: page < totalPages && {
        text: 'Next',
        href: urlForPage(page + 1),
      },
      items,
    };
  });

  nunjucksEnv.addFilter(
    'makeCurrentPrimaryCategoryActive',
    (primaryNavigation, currentUrl, breadcrumbs = []) => {
      const currentPrimaryCategory = primaryNavigation.find(navItem => {
        const { href: navItemHref } = navItem;
        return (
          currentUrl === navItemHref ||
          breadcrumbs.find(({ href }) => href === navItemHref)
        );
      });

      if (currentPrimaryCategory) currentPrimaryCategory.active = true;
      return primaryNavigation;
    },
  );

  nunjucksEnv.addGlobal('t', key => i18next.t(key));

  return nunjucksEnv;
};
