module.exports =
  cmsService =>
  async ({ session: { establishmentName }, originalUrl }, res, next) => {
    try {
      const primaryNavigation = await cmsService.getPrimaryNavigation(
        establishmentName,
      );
      res.locals.primaryNavigation = primaryNavigation;
      res.locals.originalUrl = mapNoneCMSUrls(originalUrl, primaryNavigation);
      return next();
    } catch (e) {
      return next(e);
    }
  };

const mapNoneCMSUrls = (originalUrl, primaryNavigation) => {
  switch (originalUrl.match(/^\/[a-z]*/g)[0]) {
    case '/money':
    case '/timetable':
    case '/approved-visitors':
      return '/profile';
    case '/games':
      // Assumption made that games will appear in an 'entertainment' primary category
      return (
        primaryNavigation.find(({ text = '' }) =>
          text.toLowerCase().includes('entertainment'),
        )?.href || originalUrl
      );
    default:
      return originalUrl;
  }
};
