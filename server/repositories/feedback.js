function feedbackRepository(feedbackClient) {
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
      return feedbackClient.postFeedback({ ...postData, feedbackId });
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
