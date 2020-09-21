const R = require('ramda');
const defaultConfig = require('../config');

const isEmpty = val => R.isEmpty(val) || R.isNil(val);

function getEstablishmentId(name, config = defaultConfig) {
  return Object.keys(config.establishments).reduce(
    (matchingEstablishmentId, establishmentId) => {
      if (config.establishments[establishmentId].name === name) {
        return parseInt(establishmentId, 10);
      }

      return matchingEstablishmentId;
    },
    0,
  );
}

function getEstablishmentName(id, config = defaultConfig) {
  return R.path(['establishments', id, 'name'], config);
}

function getEstablishmentStandFirst(id, config = defaultConfig) {
  return R.pathOr('', ['establishments', id, 'standFirst'], config);
}

function getEstablishmentPrefix(id, config = defaultConfig) {
  return R.pathOr('HMP', ['establishments', id, 'prefix'], config);
}

function getEstablishmentFormattedName(id, config = defaultConfig) {
  return R.path(['establishments', id, 'formattedName'], config);
}

function getEstablishmentUiId(id, config = defaultConfig) {
  return R.path(['establishments', id, 'uuId'], config);
}

function getEstablishmentHomepageLinks(id, config = defaultConfig) {
  return R.path(['establishments', id, 'homePageLinks'], config);
}

function getEstablishmentHomepageLinksTitle(id, config = defaultConfig) {
  return R.path(['establishments', id, 'homePageLinksTitle'], config);
}

function getEstablishmentWorkingIn(id, config = defaultConfig) {
  return R.pathOr([], ['establishments', id, 'workingIn'], config);
}

function getEstablishmentWorkingInUrls(config = defaultConfig) {
  return Object.keys(config.establishments)
    .reduce((urls, establishmentId) => {
      return `/working-in-${config.establishments[establishmentId].name},${urls}`;
    }, '')
    .slice(0, -1)
    .split(',');
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
  getEstablishmentStandFirst,
  getEstablishmentWorkingIn,
  getEstablishmentWorkingInUrls,
  getEstablishmentPrefix,
  getEstablishmentHomepageLinks,
  getEstablishmentHomepageLinksTitle,
  isEmpty,
  capitalize,
  capitalizeAll,
  capitalizePersonName,
  fillContentItems,
};
