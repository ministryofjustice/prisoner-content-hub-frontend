const breadcrumbs = require('../content/breadcrumbs.json');

const createBreadcrumbs = ({ originalUrl }) => {
  if (!originalUrl) {
    return [];
  }

  switch (originalUrl.match(/^\/[a-z,-]*/g)[0]) {
    case '/profile':
      return [breadcrumbs.home];

    case '/timetable':
    case '/money':
    case '/approved-visitors':
      return [breadcrumbs.home, breadcrumbs.profile];

    case '/games':
      return [breadcrumbs.home, breadcrumbs.entertainment, breadcrumbs.games];

    default:
      return [];
  }
};

module.exports = {
  createBreadcrumbs,
};