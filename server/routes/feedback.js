const { path } = require('ramda');
const express = require('express');

const createFeedbackRouter = ({ feedbackService }) => {
  const router = express.Router();

  router.post('/:feedbackId', (req, res) => {
    const sessionId = path(['session', 'id'], req);

    feedbackService.sendFeedback({
      title: path(['body', 'title'], req),
      url: path(['body', 'url'], req),
      contentType: path(['body', 'contentType'], req),
      feedbackId: path(['params', 'feedbackId'], req),
      series: path(['body', 'series'], req),
      categories: path(['body', 'categories'], req),
      secondaryTags: path(['body', 'secondaryTags'], req),
      sentiment: path(['body', 'sentiment'], req),
      comment: path(['body', 'comment'], req),
      date: new Date().toISOString(),
      establishment: path(['session', 'establishmentName'], req).toUpperCase(),
      sessionId,
    });

    return res.status(200).send();
  });

  return router;
};

module.exports = {
  createFeedbackRouter,
};
