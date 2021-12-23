const express = require('express');

const createTagRouter = ({ cmsService }) => {
  const router = express.Router();

  router.get('/:id.json', async (req, res, next) => {
    try {
      const { id } = req.params;
      const { page } = req.query;
      const data = await cmsService.getPage(
        req.session.establishmentName,
        parseInt(id, 10),
        parseInt(page || '1', 10),
      );
      return res.json(data);
    } catch (e) {
      return next(e);
    }
  });

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

      const data = await cmsService.getTag(
        req.session.establishmentName,
        parseInt(id, 10),
      );

      const pageType = ['tags', 'series'].includes(data.contentType)
        ? 'tags'
        : 'tagsCategories';

      return res.render(`pages/${pageType}`, {
        title: data.title,
        tagId: id,
        data,
        config,
      });
    } catch (e) {
      return next(e);
    }
  });

  return router;
};

module.exports = {
  createTagRouter,
};
