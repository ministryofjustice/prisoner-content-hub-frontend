const { capitalizePersonName, sortBy } = require('../../../utils/index');

module.exports = contacts =>
  contacts
    .filter(contact => contact.approvedVisitor)
    .sort(sortBy('firstName'))
    .sort(sortBy('lastName'))
    .map(({ firstName, lastName }) =>
      capitalizePersonName(`${firstName} ${lastName}`),
    );
