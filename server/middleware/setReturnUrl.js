module.exports = (req, res, next) => {
  res.locals.returnUrl = req.originalUrl;
  next();
};
