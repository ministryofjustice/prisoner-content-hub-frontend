const { capitalizePersonName } = require('../../../utils/index');

const sortContacts = ({ createDateTime: a }, { createDateTime: b }) =>
  new Date(b) - new Date(a);

module.exports = ({ nextOfKin, otherContacts }) =>
  [...nextOfKin, ...otherContacts]
    .filter(
      ({ activeFlag, approvedVisitorFlag }) =>
        activeFlag && approvedVisitorFlag,
    )
    .sort(sortContacts)
    .map(({ firstName, lastName }) =>
      capitalizePersonName(`${firstName} ${lastName}`),
    );
