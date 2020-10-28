const { v4: uuid } = require('uuid');
const { pathOr } = require('ramda');
const {
  getEstablishmentId,
  getEstablishmentFormattedName,
  getEstablishmentPrefix,
  getEstablishmentPersonalisation,
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

    req.session.id = uuid();
    req.session.establishmentName = establishmentName;
    req.session.establishmentId = getEstablishmentId(establishmentName);
    req.session.establishmentPersonalisationEnabled = getEstablishmentPersonalisation(
      req.session.establishmentId,
    );
  }

  res.locals.feedbackId = uuid();
  res.locals.establishmentDisplayName = `${getEstablishmentPrefix(
    req.session.establishmentId,
  )} ${getEstablishmentFormattedName(req.session.establishmentId)}`;

  next();
};

module.exports = {
  configureEstablishment,
};
