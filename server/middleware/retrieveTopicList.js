module.exports = cmsService => async (req, res, next) => {
  try {
    const { establishmentName } = req.session;

    if (!establishmentName) {
      throw new Error('Could not determine establishment!');
    }
    res.locals.allTopics = await cmsService.getTopics(establishmentName);
    next();
  } catch (e) {
    e.message = `Error loading topics: ${e.message}`;
    next(e);
  }
};
