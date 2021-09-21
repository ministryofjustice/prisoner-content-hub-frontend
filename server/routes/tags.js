const express = require('express');
const { path } = require('ramda');

const createTagRouter = ({ hubTagsService }) => {
  const router = express.Router();

  router.get('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) {
        return next();
      }
      const userName = req.user && req.user.getFullName();
      const establishmentId = path(['session', 'establishmentId'], req);
      const config = {
        content: true,
        header: false,
        postscript: false,
        detailsType: 'small',
        userName,
        returnUrl: req.originalUrl,
      };

      const data = await hubTagsService.termFor(
        id,
        establishmentId,
        req.session.establishmentName,
      );

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
