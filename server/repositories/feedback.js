const config = require('../config');

function feedbackRepository(httpClient, feedbackClient) {
  async function sendFeedback({
    title,
    url,
    contentType,
    series,
    categories,
    topics,
    sentiment,
    comment,
    date,
    establishment,
    sessionId,
    feedbackId,
  }) {
    const postData = {
      title,
      url,
      contentType,
      sentiment,
      date,
      establishment,
      sessionId,
      categories,
      topics,
    };

    if (series) {
      postData.series = series;
    }

    if (comment) {
      postData.comment = comment;
    }

    if (feedbackId) {
      const endpoint = `${config.feedback.endpoint}/${feedbackId}`;
      const openSeach = httpClient.post(endpoint, postData);
      const feedback = feedbackClient.postFeedback({ ...postData, feedbackId });

      return openSeach && feedback;
    }

    return Promise.resolve();
  }
  return {
    sendFeedback,
  };
}

module.exports = {
  feedbackRepository,
};
