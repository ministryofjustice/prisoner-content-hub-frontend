module.exports =
  cmsService =>
  async ({ session: { establishmentName } }, res, next) => {
    try {
      const urgentBanners = await cmsService.getUrgentBanners(
        establishmentName,
        res.locals.currentLng,
      );
      res.locals.urgentBanners = urgentBanners;
      return next();
    } catch (e) {
      return next(e);
    }
  };
