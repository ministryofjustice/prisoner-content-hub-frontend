const { v4: uuid } = require('uuid');
const { pathOr } = require('ramda');
const {
  getEstablishmentId,
  getEstablishmentPersonalisation,
  getEstablishmentDisplayName,
} = require('../utils');

const configureEstablishment = () => (req, res, next) => {
  if (
    req.session &&
    (!req.session.id ||
      !req.session.establishmentId ||
      req.session.establishmentPersonalisationEnabled === undefined)
  ) {
    const replaceUrl = /-prisoner-content-hub.*$/g;
    const establishmentName = pathOr('wayland', ['headers', 'host'], req)
      .split('.')[0]
      .replace(replaceUrl, '');

    const establishmentId = getEstablishmentId(establishmentName);

    req.session.id = uuid();
    if (typeof establishmentId === 'undefined') {
      req.session.establishmentId = establishmentId;
      req.session.establishmentName = establishmentName;
      req.session.establishmentPersonalisationEnabled = getEstablishmentPersonalisation(
        establishmentId,
      );
    }
  }

  res.locals.feedbackId = uuid();
  res.locals.establishmentDisplayName = `${getEstablishmentDisplayName(
    req.session.establishmentId,
  )}`;

  next();
};

module.exports = {
  configureEstablishment,
};
