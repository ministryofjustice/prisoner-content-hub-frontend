const {
  getEstablishmentId,
  getEstablishmentFormattedName,
  getEstablishmentPrefix,
} = require('../utils');

const configureEstablishment = () => (req, res, next) => {
  req.session.prison = req.session.establishmentName;

  const establishmentId = getEstablishmentId(req.session.prison);

  res.locals.establishmentId = establishmentId;
  res.locals.establishmentDisplayName = `${getEstablishmentPrefix(
    establishmentId,
  )} ${getEstablishmentFormattedName(establishmentId)}`;

  next();
};

module.exports = {
  configureEstablishment,
};
