module.exports =
  cmsService =>
  async ({ session: { establishmentName }, originalUrl }, res, next) => {
    try {
      const primaryNavigation =
        await cmsService.getPrimaryNavigation(establishmentName);
      res.locals.primaryNavigation = primaryNavigation;
      res.locals.originalUrl = mapNoneCMSUrls(originalUrl, primaryNavigation);
      return next();
    } catch (e) {
      return next(e);
    }
  };

const mapNoneCMSUrls = (originalUrl, primaryNavigation) => {
  switch (originalUrl.match(/^\/[a-z,-]*/g)[0]) {
    case '/games':
      // Assumption made that games will appear in the 'inspire and entertain' primary category
      return (
        primaryNavigation.find(({ text = '' }) =>
          text.toLowerCase().includes('inspire and entertain'),
        )?.href || originalUrl
      );
    default:
      return originalUrl;
  }
};
