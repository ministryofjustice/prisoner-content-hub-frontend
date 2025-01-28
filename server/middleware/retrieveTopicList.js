module.exports = cmsService => async (req, res, next) => {
  try {
    const { establishmentName } = req.session;
    const { currentLng } = res.locals;

    if (!establishmentName) {
      throw new Error('Could not determine establishment!');
    }
    res.locals.allTopics = await cmsService.getTopics(
      establishmentName,
      currentLng,
    );
    next();
  } catch (e) {
    e.message = `Error loading topics: ${e.message}`;
    next(e);
  }
};
