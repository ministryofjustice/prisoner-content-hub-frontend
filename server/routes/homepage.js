const express = require('express');

const createHomepageRouter = ({ cmsService, offenderService }) => {
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
        },
        hideSignInLink: true,
        title: 'Home',
        homepage,
        currentEvents,
      });
    } catch (error) {
      next(error);
    }
  });

  router.get('/new-homepage', async (req, res, next) => {
    try {
      const { establishmentName } = req.session;

      if (!establishmentName) {
        throw new Error('Could not determine establishment!');
      }


      const [homepageContent, recentlyAddedHomepageContent, exploreContent] =
        await Promise.all([
          cmsService.getHomepageContent(establishmentName),
          cmsService.getRecentlyAddedHomepageContent(establishmentName),
          cmsService.getExploreContent(establishmentName),
        ]);

      const currentEvents = res.locals.isSignedIn
        ? await offenderService.getCurrentEvents(req.user)
        : {};

      const { featuredContent } = homepageContent;

      res.render('pages/home-new', {
        config: {
          content: true,
          header: true,
          postscript: true,
          detailsType: 'large',
        },
        hideSignInLink: true,
        title: 'Home',
        recentlyAddedHomepageContent,
        featuredContent,
        exploreContent,
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
