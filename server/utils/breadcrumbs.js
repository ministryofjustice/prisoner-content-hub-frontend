const breadcrumbs = require('../content/breadcrumbs.json');

const createBreadcrumbs = ({ originalUrl }) => {
  if (!originalUrl) {
    return [];
  }

  switch (originalUrl.match(/^\/[a-z,-]*\/?/g)[0]) {
    case '/games':
      return [breadcrumbs.home, breadcrumbs.entertainment, breadcrumbs.games];

    default:
      return [];
  }
};

module.exports = {
  createBreadcrumbs,
};
