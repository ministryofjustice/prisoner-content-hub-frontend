$(document).ready(function() {
  var audio = $('#hub-audio');
  var player = videojs('hub-audio');
  var programmeCode = audio.data().programmeCode;
  var title = audio.data().title;
  var name = programmeCode + '|' + title;

  var evt0 = once(analyticsAudioEvent({ label: '0%', action: name }));
  var evt25 = once(analyticsAudioEvent({ label: '25%', action: name }));
  var evt50 = once(analyticsAudioEvent({ label: '50%', action: name }));
  var evt75 = once(analyticsAudioEvent({ label: '75%', action: name }));
  var evt90 = once(analyticsAudioEvent({ label: '90%', action: name }));

  player.on('timeupdate', function() {
    var percentage = Math.round((player.currentTime() / player.duration()) * 100);
    var currentTime = parseInt(player.currentTime());

    if (currentTime >= 1 && currentTime < 10) {
      evt0();
    } else if (percentage >= 25 && percentage < 50) {
      evt25();
    } else if (percentage >= 50 && percentage < 75) {
      evt50();
    } else if (percentage >= 75 && percentage < 90) {
      evt75();
    } else if (percentage >= 90) {
      evt90();
    }
  });

  function analyticsAudioEvent(config) {
    return function() {
      gtag('event', config.action, {
        'event_category': 'Radio',
        'event_label': config.label,
        'value': 1
      });
    };
  }

  function once(fn) {
    return function() {
      if (fn.called) return;
      var result = fn.apply(this, arguments);

      fn.called = true;

      return result;
    };
  }
});
