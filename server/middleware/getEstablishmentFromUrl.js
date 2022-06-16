module.exports = (req, _res, next) => {
  const developmentStaging = '(\\.|-)(\\d{3,4}\\.)*prisoner-content-hub';
  const production = '\\.content-hub';
  const localDevelopment = '\\.prisoner-content-hub.local';

  if (!req.session?.establishmentName) {
    const matchEstablishment = new RegExp(
      `^[A-Z,a-z]{1,20}(?=(\\.localhost|${developmentStaging}|${production}|${localDevelopment}))`,
    );

    const [establishmentName] = req.headers?.host.match(matchEstablishment) || [
      '',
    ];
    if (establishmentName) req.session.establishmentName = establishmentName;
  }
  next();
};
