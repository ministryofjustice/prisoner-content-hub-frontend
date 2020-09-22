const createAnalyticsService = ({ analyticsRepository }) => {
  function sendEvent({ category, action, label, value, sessionId, userAgent }) {
    return analyticsRepository.sendEvent({
      category,
      action,
      label,
      value,
      sessionId,
      userAgent,
    });
  }

  return {
    sendEvent,
  };
};

module.exports = {
  createAnalyticsService,
};
