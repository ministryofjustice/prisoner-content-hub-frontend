const { path, pathOr, isNil, isEmpty } = require('ramda');
const defaultConfig = require('../config');

const isEmptyResponse = val => isEmpty(val) || isNil(val);

function getEstablishmentId(name, config = defaultConfig) {
  return Object.keys(config.establishments).reduce(
    (matchingEstablishmentId, establishmentId) =>
      config.establishments[establishmentId].name === name
        ? parseInt(establishmentId, 10)
        : matchingEstablishmentId,
    0,
  );
}

function getEstablishmentName(id, config = defaultConfig) {
  return path(['establishments', id, 'name'], config);
}

function getEstablishmentPrefix(id, config = defaultConfig) {
  return pathOr('HMP', ['establishments', id, 'prefix'], config);
}

function getEstablishmentFormattedName(id, config = defaultConfig) {
  return path(['establishments', id, 'formattedName'], config);
}

function getEstablishmentUiId(id, config = defaultConfig) {
  return path(['establishments', id, 'uuId'], config);
}

function getEstablishmentHomepageLinks(id, config = defaultConfig) {
  return path(['establishments', id, 'homePageLinks'], config);
}

function getEstablishmentHomepageLinksTitle(id, config = defaultConfig) {
  return path(['establishments', id, 'homePageLinksTitle'], config);
}

const capitalize = (str = '') => {
  if (str === '') return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

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

function fillContentItems(contentItems = [], number = 4) {
  const numberItems = contentItems.length;

  if (numberItems % number === 0) {
    return contentItems;
  }

  const remainingItems =
    contentItems.length < number
      ? number - contentItems.length
      : number - (contentItems.length % number);
  let newItems = [];

  if (remainingItems > 0) {
    newItems = new Array(remainingItems);
  }

  return contentItems.concat(newItems);
}

module.exports = {
  getEstablishmentId,
  getEstablishmentName,
  getEstablishmentFormattedName,
  getEstablishmentUiId,
  getEstablishmentPrefix,
  getEstablishmentHomepageLinks,
  getEstablishmentHomepageLinksTitle,
  isEmptyResponse,
  capitalize,
  capitalizeAll,
  capitalizePersonName,
  fillContentItems,
};
