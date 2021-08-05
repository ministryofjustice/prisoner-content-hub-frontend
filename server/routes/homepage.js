const express = require('express');

const {
  getEstablishmentHomepageLinks,
  getEstablishmentHomepageLinksTitle,
} = require('../utils');

const createHomepageRouter = ({
  cmsService,
  offenderService,
  establishmentData,
}) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      const establishmentId = req.session?.establishmentId;

      const personalInformation =
        req.session?.establishmentPersonalisationEnabled;

      const homePageLinks = getEstablishmentHomepageLinks(
        establishmentId,
        establishmentData,
      );

      const homePageLinksTitle = getEstablishmentHomepageLinksTitle(
        establishmentId,
        establishmentData,
      );

      const { establishmentName } = req.session;

      if (!establishmentId) {
        throw new Error('Could not determine establishment!');
      }

      const homepage = await cmsService.getHomepage(establishmentName);

      const pageConfig = {
        content: true,
        header: true,
        postscript: true,
        detailsType: 'large',
        personalInformation,
        establishmentId,
        returnUrl: req.originalUrl,
      };

      let currentEvents = {};
      const { user } = req;

      if (user) {
        const userName = user.getFullName();
        pageConfig.userName = userName;
        pageConfig.welcomeMessage = `Hi, ${userName}`;
        currentEvents = await offenderService.getCurrentEvents(user);
      }
      res.render('pages/home', {
        config: pageConfig,
        title: 'Home',
        homePageLinks,
        homePageLinksTitle,
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
