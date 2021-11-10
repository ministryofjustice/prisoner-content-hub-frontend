module.exports = (req, res, next) => {
  res.locals.userName = req.user?.getFullName();
  res.locals.isSignedIn = req.user?.isSignedIn();
  next();
};
