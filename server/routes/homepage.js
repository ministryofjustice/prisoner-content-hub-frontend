const express = require('express');

const createHomepageRouter = ({ cmsService }) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      const { establishmentName } = req.session;
      const { currentLng } = res.locals;

      if (!establishmentName) {
        throw new Error('Could not determine establishment!');
      }

      const [
        { featuredContent, keyInfo, largeUpdateTile: largeUpdateTileSpecified },
        recentlyAddedHomepageContent,
        exploreContent,
        { largeUpdateTileDefault, updatesContent, isLastPage },
      ] = await Promise.all([
        cmsService.getHomepageContent(establishmentName, currentLng),
        cmsService.getRecentlyAddedHomepageContent(
          establishmentName,
          currentLng,
        ),
        cmsService.getExploreContent(establishmentName, currentLng),
        cmsService.getUpdatesContent(establishmentName, currentLng),
      ]);
      const useLargeUpdateTile = Boolean(largeUpdateTileSpecified?.contentUrl);

      const largeUpdateTile = useLargeUpdateTile
        ? largeUpdateTileSpecified
        : largeUpdateTileDefault;

      const updatesContentWithDuplicatesRemoved = removeDuplicateUpdates(
        updatesContent,
        largeUpdateTile,
      );

      const updatesContentHideViewAll =
        isLastPage &&
        (updatesContentWithDuplicatesRemoved.length < 5 || !useLargeUpdateTile);

      console.log(featuredContent);

      res.render('pages/home', {
        config: {
          content: true,
          header: true,
          postscript: true,
          detailsType: 'large',
        },
        hideSignInLink: true,
        recentlyAddedHomepageContent,
        updatesContent: updatesContentWithDuplicatesRemoved.splice(0, 4),
        updatesContentHideViewAll,
        featuredContent,
        keyInfo,
        largeUpdateTile,
        exploreContent,
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
};

const removeDuplicateUpdates = (updatesContent, { id }) =>
  updatesContent.filter(update => update.id !== id);

module.exports = {
  createHomepageRouter,
  removeDuplicateUpdates,
};
