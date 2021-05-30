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

      const data = await hubTagsService.termFor(id, establishmentId);

      data.secondaryTags = data.id;

      return res.render('pages/tags', {
        title: data.name,
        tagId: id,
        data: {
          ...data,
          secondaryTags: data.contentType === 'series' ? '' : data.id,
        },
        config,
      });
    } catch (e) {
      return next(e);
    }
  });

  router.get('/related-content/:id', async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
      return next();
    }

    try {
      const establishmentId = path(['session', 'establishmentId'], req);
      const contentType = path(['query', 'contentType'], req);

      const method =
        contentType === 'series' ? 'relatedSeriesFor' : 'relatedContentFor';

      const data = await hubTagsService[method]({
        id,
        establishmentId,
        ...req.query,
      });

      return res.json(data);
    } catch (exp) {
      return res.json(null);
    }
  });

  return router;
};

module.exports = {
  createTagRouter,
};
