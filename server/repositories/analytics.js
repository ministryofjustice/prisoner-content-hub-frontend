const config = require('../config');

function analyticsRepository(httpClient) {
  function sendEvent({ category, action, label, value, sessionId, userAgent }) {
    const postData = {
      v: '1',
      tid: config.analytics.siteId,
      cid: sessionId,
      t: 'event',
      ec: category,
      ea: action,
      el: label,
    };

    if (value !== undefined) {
      postData.ev = value;
    }

    if (userAgent !== undefined) {
      postData.ua = userAgent;
    }

    return httpClient.postFormData(config.analytics.endpoint, postData);
  }

  return {
    sendEvent,
  };
}

module.exports = {
  analyticsRepository,
};
