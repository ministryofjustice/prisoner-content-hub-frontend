const express = require('express');

const createTagRouter = ({ cmsService }) => {
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

      const data = await cmsService.getTag(req.session.establishmentName, id);

      data.secondaryTags = data.id;

      const pageType = ['tags', 'series'].includes(data.contentType)
        ? 'tags'
        : 'tagsCategories';

      return res.render(`pages/${pageType}`, {
        title: data.name,
        tagId: id,
        data: {
          ...data,
          secondaryTags: data.id,
        },
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
