const nunjucks = require('nunjucks');
const path = require('path');

module.exports = expressApp => {
  const appViews = [
    path.join(__dirname, '../../node_modules/govuk-frontend/'),
    path.join(__dirname, '../views/'),
  ];

  const nunjucksEnv = nunjucks.configure(appViews, {
    express: expressApp,
    autoescape: true,
  });

  nunjucksEnv.addFilter('skip', (array, count) => array.slice(count));

  return nunjucksEnv;
};
