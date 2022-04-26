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
  function sendPageTrack({
    hostname,
    page,
    title,
    sessionId,
    userAgent,
    screen,
    viewport,
    topics,
    categories,
    series,
  }) {
    const postData = {
      v: '1',
      tid: config.analytics.siteId,
      cid: sessionId,
      t: 'pageview',
      dh: hostname,
      dp: page,
      dt: title,
      sr: screen,
      vp: viewport,
    };

    if (userAgent !== undefined) {
      postData.ua = userAgent;
    }

    if (topics !== undefined) {
      postData.cd1 = topics;
    }

    if (categories !== undefined) {
      postData.cd2 = categories;
    }

    if (series !== undefined) {
      postData.cd3 = series;
    }

    return httpClient.postFormData(config.analytics.endpoint, postData);
  }

  return {
    sendEvent,
    sendPageTrack,
  };
}

module.exports = {
  analyticsRepository,
};
