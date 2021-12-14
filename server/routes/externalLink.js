const express = require('express');
const Cookies = require('cookies');

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
      const cookies = new Cookies(req, res);
      if (cookies.get(`externalLink_${url}`) === 'true')
        return res.redirect(url);

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
