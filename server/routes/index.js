const express = require('express');
const {
  getEstablishmentHomepageLinks,
  getEstablishmentHomepageLinksTitle,
} = require('../utils');

const createIndexRouter = ({
  hubFeaturedContentService,
  offenderService,
  config,
}) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      const establishmentId = req?.session?.establishmentId;

      const envPersonalisationEnabled =
        res?.locals?.features?.personalInformation;

      const personalInformation =
        req?.session?.establishmentPersonalisationEnabled &&
        envPersonalisationEnabled;

      const homePageLinks = getEstablishmentHomepageLinks(
        establishmentId,
        config,
      );

      const homePageLinksTitle = getEstablishmentHomepageLinksTitle(
        establishmentId,
        config,
      );

      const featuredContent = await hubFeaturedContentService.hubFeaturedContent(
        { establishmentId },
      );

      const pageConfig = {
        content: true,
        header: true,
        postscript: true,
        detailsType: 'large',
        personalInformation,
        establishmentId,
        returnUrl: req.originalUrl,
      };

      let todaysEvents = {};
      const { user } = req;

      if (user) {
        const userName = user.getFullName();
        pageConfig.userName = userName;
        pageConfig.welcomeMessage = `Hi, ${userName}`;
        todaysEvents = await offenderService.getEventsForToday(user);
      }

      res.render('pages/home', {
        config: pageConfig,
        title: 'Home',
        homePageLinks,
        homePageLinksTitle,
        featuredContent: featuredContent.featured[0],
        todaysEvents,
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
};

module.exports = {
  createIndexRouter,
};
