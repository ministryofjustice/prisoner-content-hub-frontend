const express = require('express');
const { logger } = require('../utils/logger');

const createFeedbackRouter = ({ feedbackService }) => {
  const router = express.Router();

  router.post('/:feedbackId', (req, res) => {
    const {
      body,
      params: { feedbackId } = {},
      session: { id: sessionId } = {},
      user,
    } = req;

    logger.info(
      `Prisoner '${
        user?.prisonerId || 'anon'
      }' leaving feedback: ${feedbackId}`,
    );

    feedbackService.sendFeedback({
      title: body?.title,
      url: body?.url,
      contentType: body?.contentType,
      feedbackId,
      series: body?.series,
      categories: body?.categories,
      secondaryTags: body?.secondaryTags,
      sentiment: body?.sentiment,
      comment: body?.comment,
      date: new Date().toISOString(),
      establishment: req.session?.establishmentName?.toUpperCase(),
      sessionId,
    });

    return res.status(200).send();
  });

  return router;
};

module.exports = {
  createFeedbackRouter,
};
