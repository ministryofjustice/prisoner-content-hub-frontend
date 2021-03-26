const express = require('express');

const createProfileRouter = () => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      const templateParams = {
        title: 'Your profile',
        content: true,
        header: false,
        postscript: true,
        detailsType: 'small',
        category: 'profile',
        returnUrl: req.originalUrl,
      };

      if (req.user) {
        templateParams.signedInUser = req.user.getFullName();
      }

      return res.render('pages/profile', templateParams);
    } catch (e) {
      return next(e);
    }
  });

  return router;
};

module.exports = {
  createProfileRouter,
};
