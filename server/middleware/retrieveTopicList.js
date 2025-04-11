module.exports = cmsService => async (req, res, next) => {
  try {
    const { establishmentName } = req.session;

    if (!establishmentName) {
      throw new Error('Could not determine establishment!');
    }
    res.locals.allTopics = await cmsService.getTopics(establishmentName);
    // We have to sort the results even though we specified a sort order in
    // the JSON:API request.
    // See https://www.drupal.org/project/drupal/issues/3186834.
    res.locals.allTopics.sort((a, b) => {
      if (a.linkText > b.linkText) {
        return 1;
      }
      if (b.linkText > a.linkText) {
        return -1;
      }
      return 0;
    });
    next();
  } catch (e) {
    e.message = `Error loading topics: ${e.message}`;
    next(e);
  }
};
