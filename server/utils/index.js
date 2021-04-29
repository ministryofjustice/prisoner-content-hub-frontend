const { isNil, isEmpty } = require('ramda');
const defaultEstablishmentData = require('../content/establishmentData');

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

const getEstablishmentName = (
  id,
  establishmentData = defaultEstablishmentData,
) => establishmentData?.[id]?.name;

const getEstablishmentPrefix = (
  id,
  establishmentData = defaultEstablishmentData,
) => establishmentData?.[id]?.prefix ?? 'HMP';

const getEstablishmentFormattedName = (
  id,
  establishmentData = defaultEstablishmentData,
) => establishmentData?.[id]?.formattedName;

const getEstablishmentUiId = (
  id,
  establishmentData = defaultEstablishmentData,
) => establishmentData?.[id]?.uuId;

const getEstablishmentHomepageLinks = (
  id,
  establishmentData = defaultEstablishmentData,
) => establishmentData?.[id]?.homePageLinks;

const getEstablishmentHomepageLinksTitle = (
  id,
  establishmentData = defaultEstablishmentData,
) => establishmentData?.[id]?.homePageLinksTitle;

const getEstablishmentPersonalisation = (
  id,
  establishmentData = defaultEstablishmentData,
) => establishmentData?.[id]?.personalInformation;

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
  getEstablishmentName,
  getEstablishmentFormattedName,
  getEstablishmentUiId,
  getEstablishmentPrefix,
  getEstablishmentHomepageLinks,
  getEstablishmentHomepageLinksTitle,
  getEstablishmentPersonalisation,
  isEmptyResponse,
  capitalize,
  capitalizeAll,
  capitalizePersonName,
  fillContentItems,
};
