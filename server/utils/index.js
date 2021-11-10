const { isNil, isEmpty } = require('ramda');
const defaultEstablishmentData = require('../content/establishmentData.json');

const isEmptyResponse = val => isEmpty(val) || isNil(val);

const getEstablishmentId = (
  establishmentName,
  establishmentData = defaultEstablishmentData,
) =>
  parseInt(
    Object.keys(establishmentData).find(
      id => establishmentData?.[id]?.name === establishmentName,
    ),
    10,
  );

const getEstablishment = (
  agencyId,
  establishmentData = defaultEstablishmentData,
) => {
  const establishmentId = Object.keys(establishmentData).find(
    id => establishmentData?.[id]?.agencyId === agencyId,
  );
  return {
    establishmentId,
    establishmentName: establishmentData[establishmentId]?.name,
  };
};

const updateSessionEstablishment = (req, agencyId) => {
  if (
    !req.session?.establishmentName ||
    req.session.establishmentName === 'localhost:3000'
  ) {
    const { establishmentId, establishmentName } = getEstablishment(agencyId);
    req.session.establishmentId = establishmentId;
    req.session.establishmentName = establishmentName;
  }
};

const getEstablishmentSearchName = (
  id,
  establishmentData = defaultEstablishmentData,
) => establishmentData?.[id]?.name;

const getEstablishmentDisplayName = (
  id,
  establishmentData = defaultEstablishmentData,
) => establishmentData?.[id]?.displayName;

const getEstablishmentHomepageLinks = (
  id,
  establishmentData = defaultEstablishmentData,
) => establishmentData?.[id]?.homePageLinks;

const getEstablishmentHomepageLinksTitle = (
  id,
  establishmentData = defaultEstablishmentData,
) => establishmentData?.[id]?.homePageLinksTitle;

const capitalize = (str = '') =>
  str === '' ? '' : str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

function capitalizeAll(input, separator = ' ') {
  if (input === '') return '';

  const names = input.split(separator);

  return names.map(name => capitalize(name.trim())).join(separator);
}

function capitalizePersonName(input, separator = ' ') {
  if (input === '') return '';

  const names = input.split(separator);

  return names
    .map(name => capitalizeAll(capitalize(name.trim()), '-'))
    .join(separator);
}

const fillContentItems = (contentItems = [], number = 4) =>
  contentItems.length % number
    ? contentItems.concat(new Array(number - (contentItems.length % number)))
    : contentItems;

module.exports = {
  getEstablishmentId,
  getEstablishment,
  updateSessionEstablishment,
  getEstablishmentDisplayName,
  getEstablishmentSearchName,
  getEstablishmentHomepageLinks,
  getEstablishmentHomepageLinksTitle,
  isEmptyResponse,
  capitalize,
  capitalizeAll,
  capitalizePersonName,
  fillContentItems,
};
