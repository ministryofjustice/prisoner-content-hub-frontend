const { path } = require('ramda');
const express = require('express');

const createProfileRouter = ({ hubContentService }) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      const establishmentId = path(['session', 'establishmentId'], req);

      const data = await hubContentService.contentFor(establishmentId);

      const config = {
        content: true,
        header: false,
        postscript: true,
        detailsType: 'small',
        category: 'profile',
        returnUrl: req.originalUrl,
        isLoggedIn: false,
      };

      const { user } = req;

      if (user) {
        config.userName = user.getFullName();
        config.isLoggedIn = true;
      }

      return res.render('pages/profile', {
        title: 'Your Profile',
        config,
        data,
      });
    } catch (exp) {
      return next(exp);
    }
  });

  return router;
};

module.exports = {
  createProfileRouter,
};
