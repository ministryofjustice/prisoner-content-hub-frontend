const { v4: uuid } = require('uuid');
const { getEstablishmentId, getEstablishmentDisplayName } = require('../utils');

const configureEstablishment = () => (req, res, next) => {
  if (req.session && (!req.session.id || !req.session.establishmentId)) {
    const replaceUrl = /-prisoner-content-hub.*$/g;

    const establishmentName = (req.headers?.host || 'wayland')
      .split('.')[0]
      .replace(replaceUrl, '');

    const establishmentId = getEstablishmentId(establishmentName);

    req.session.id = uuid();
    if (typeof establishmentId !== 'undefined') {
      req.session.establishmentId = establishmentId;
      req.session.establishmentName = establishmentName;
    }
  }

  res.locals.feedbackId = uuid();
  res.locals.establishmentName = req.session.establishmentName;
  res.locals.establishmentDisplayName = `${getEstablishmentDisplayName(
    req.session.establishmentId,
  )}`;

  next();
};

module.exports = {
  configureEstablishment,
};
