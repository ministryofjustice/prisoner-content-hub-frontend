module.exports = (req, _res, next) => {
  if (!req.session?.establishmentName) {
    const matchEstablishment =
      /^[A-Z,a-z]{1,20}(?=(-|\.)(prisoner-)?(content-hub|localhost))/;

    const [establishmentName] = req.headers?.host.match(matchEstablishment) || [
      '',
    ];
    if (establishmentName) req.session.establishmentName = establishmentName;
  }
  next();
};
