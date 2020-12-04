const express = require('express');

const createFeedbackRouter = ({ feedbackService }) => {
  const router = express.Router();

  router.post('/:feedbackId', (req, res) => {
    const sessionId = req?.session?.id;

    feedbackService.sendFeedback({
      title: req?.body?.title,
      url: req?.body?.url,
      contentType: req?.body?.contentType,
      feedbackId: req?.params?.feedbackId,
      series: req?.body?.series,
      categories: req?.body?.categories,
      secondaryTags: req?.body?.secondaryTags,
      sentiment: req?.body?.sentiment,
      comment: req?.body?.comment,
      date: new Date().toISOString(),
      establishment: req?.session?.establishmentName.toUpperCase(),
      sessionId,
    });

    return res.status(200).send();
  });

  return router;
};

module.exports = {
  createFeedbackRouter,
};
