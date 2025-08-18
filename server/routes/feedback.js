const express = require('express');
const z = require('zod');
const { logger } = require('../utils/logger');

const createFeedbackRouter = ({ feedbackService }) => {
  const router = express.Router();

  router.post('/:feedbackId', (req, res) => {
    const { body, session: { id: sessionId } = {}, user } = req;

    const schema = z.object({
      feedbackId: z.uuid(),
    });

    const params = schema.safeParse(req.params);

    if (!params.success) {
      return res.status(400).send();
    }

    logger.info(
      `Prisoner '${
        user?.prisonerId || 'anon'
      }' leaving feedback: ${params.data.feedbackId}`,
    );

    feedbackService.sendFeedback({
      title: body?.title,
      url: body?.url,
      contentType: body?.contentType,
      feedbackId: params.data.feedbackId,
      series: body?.series,
      categories: body?.categories,
      topics: body?.topics,
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
