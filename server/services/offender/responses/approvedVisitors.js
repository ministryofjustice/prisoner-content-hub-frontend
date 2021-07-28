const { capitalizePersonName } = require('../../../utils/index');

const sortContacts = ({ createDateTime: a }, { createDateTime: b }) => {
  if (a < b) return -1;
  return a > b ? 1 : 0;
};

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
