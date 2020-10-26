const { v4: uuid } = require('uuid');
const {
  getEstablishmentId,
  getEstablishmentFormattedName,
  getEstablishmentPrefix,
  getEstablishmentPersonalisation,
} = require('../utils');

const configureEstablishment = () => (req, res, next) => {
  const establishmentName = 'wayland';

  req.session.id = uuid();
  req.session.establishmentName = establishmentName;
  req.session.establishmentId = getEstablishmentId(establishmentName);
  req.session.establishmentPersonalisationEnabled = getEstablishmentPersonalisation(
    req.session.establishmentId,
  );

  res.locals.feedbackId = uuid();
  res.locals.establishmentDisplayName = `${getEstablishmentPrefix(
    req.session.establishmentId,
  )} ${getEstablishmentFormattedName(req.session.establishmentId)}`;

  next();
};

module.exports = {
  configureEstablishment,
};
