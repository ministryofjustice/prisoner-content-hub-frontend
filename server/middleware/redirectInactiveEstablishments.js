const { getEstablishmentActive } = require('../utils');
const { newContentHub } = require('../config');

module.exports = (req, res, next) => {
  if (!req.session?.establishmentId || !newContentHub.url?.length) {
    next()
    return
  } 

  if(!getEstablishmentActive(req.session?.establishmentId)) {
    res.redirect(newContentHub.url)
    return
  }

  next();
};
