const { view, lensPath } = require('ramda');

module.exports.tagIdFrom = view(lensPath(['tid', 0, 'value']));
module.exports.nameFrom = view(lensPath(['name', 0, 'value']));
module.exports.termDescriptionValueFrom = view(
  lensPath(['description', 0, 'value']),
);
