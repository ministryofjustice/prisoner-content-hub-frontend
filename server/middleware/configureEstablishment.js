const {
  getEstablishmentFormattedName,
  getEstablishmentPrefix,
} = require('../utils');

const configureEstablishment = () => (req, res, next) => {
  req.session.prison = req.session.establishmentName;

  res.locals.establishmentId = req.session.establishmentId;
  res.locals.establishmentDisplayName = `${getEstablishmentPrefix(
    req.session.establishmentId,
  )} ${getEstablishmentFormattedName(req.session.establishmentId)}`;

  next();
};

module.exports = {
  configureEstablishment,
};
