const express = require('express');

const { getHomepageLinks } = require('../utils');

const createHomepageRouter = ({
  cmsService,
  offenderService,
  establishmentData,
}) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      const { establishmentName } = req.session;

      if (!establishmentName) {
        throw new Error('Could not determine establishment!');
      }

      const homepage = await cmsService.getHomepage(establishmentName);

      const currentEvents = res.locals.isSignedIn
        ? await offenderService.getCurrentEvents(req.user)
        : {};

      res.render('pages/home', {
        config: {
          content: true,
          header: true,
          postscript: true,
          detailsType: 'large',
          returnUrl: req.originalUrl,
        },
        title: 'Home',
        links: getHomepageLinks(establishmentName, establishmentData),
        homepage,
        currentEvents,
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
};

module.exports = {
  createHomepageRouter,
};
