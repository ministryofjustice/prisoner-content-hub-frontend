const express = require('express');

const createExternalLinkRouter = ({ cmsService }) => {
  const router = express.Router();

  router.get('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) {
        return next();
      }
      const config = {
        content: true,
        header: false,
        postscript: false,
        detailsType: 'small',
        returnUrl: req.originalUrl,
      };

      const { title, url } = await cmsService.getExternalLink(
        req.session.establishmentName,
        id,
      );

      return res.render(`pages/externalLink`, {
        title,
        url,
        tagId: id,
        config,
      });
    } catch (e) {
      return next(e);
    }
  });

  return router;
};

module.exports = {
  createExternalLinkRouter,
};
