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

  function sendPageTrack({
    hostname,
    page,
    title,
    sessionId,
    userAgent,
    screen,
    viewport,
    secondaryTags,
    categories,
  }) {
    return analyticsRepository.sendPageTrack({
      hostname,
      page,
      title,
      sessionId,
      userAgent,
      screen,
      viewport,
      secondaryTags,
      categories,
    });
  }

  return {
    sendEvent,
    sendPageTrack,
  };
};

module.exports = {
  createAnalyticsService,
};
