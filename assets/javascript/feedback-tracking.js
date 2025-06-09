(function () {
  function sendFeedback(data) {
    $.ajax({
      type: 'POST',
      url: '/feedback/' + data.id,
      data: data
    });
  }

  var typesDisplay = {
    "video": i18n.video,
    "radio": i18n.podcast,
    "page": i18n.article,
    "game": i18n.game,
    "series": i18n.series,
    "topic": i18n.topic,
    "category": i18n.category
  };
  var types = {
    video: 'VIDEO',
    radio: 'AUDIO',
    page: 'ARTICLE',
    game: 'GAME',
    series: 'SERIES',
    topic: 'TOPIC',
    category: 'CATEGORY'
  };

  window._feedback = {};

  function feedbackTracker(rootElementId) {
    var widget = $('#' + rootElementId);
    var contentType = widget.data('item-type');
    var topics = widget.data('item-topics');
    var categories = widget.data('item-categories');

    window._feedback.title = widget.data('item-title');
    window._feedback.url = window.location.pathname;
    window._feedback.contentType = types[contentType] || contentType;
    window._feedback.categories = categories || '';
    window._feedback.topics = topics || '';
    window._feedback.id = widget.data('item-feedback-id');

    var series = widget.data('item-series');
    if (series) {
      window._feedback.series = series;
    }

    function showFeedbackForm(sentiment) {
      $('[data-feedback-form]').removeClass('govuk-u-hidden');
      $('.govuk-hub-feedback-more-info').removeClass('govuk-u-hidden');
      $('.feedbackOption-LIKE, .feedbackOption-DISLIKE').addClass('govuk-u-hidden');
      $(`.feedbackOption-${sentiment}`).removeClass('govuk-u-hidden');
      $('input[name="feedbackOption"]:checked').prop('checked', false);
    }

    function hideFeedbackForm() {
      $('.govuk-hub-feedback-ui').addClass('govuk-u-hidden');
      $('.govuk-hub-feedback-confirmation').removeClass('govuk-u-hidden');

    }

    function disableButtons() {
      $('[data-feedback-form]')
        .find('button')
        .attr('disabled', true);
        $('[data-feedback-sentiment]')
        .attr('disabled', true);
    }

    function updateFeedbackSentimentText(feedback) {
      var type = widget.data('item-type');
      var typeText = typesDisplay[type] ? typesDisplay[type] : '';
      $('[data-item-feedback-text]').text(`${feedback === 'LIKE'?i18n.iLikeThis:i18n.iDontLikeThis } ${typeText}`);
    }

    function updateSentimentIcons(sentiment) {
      $('[data-feedback-sentiment]').removeClass('is-selected');
      $('[data-feedback-sentiment][value="' + sentiment + '"]').addClass('is-selected');
    }

    widget.find('[data-feedback-sentiment]').on('click', function (e) {
      e.preventDefault();
      var sentiment = $(this).val();
      window._feedback.sentiment = sentiment;
      updateFeedbackSentimentText(sentiment);
      updateSentimentIcons(sentiment);
      showFeedbackForm(sentiment);
      sendFeedback(window._feedback);
    });

    widget.find('[data-feedback-form]').on('submit', function (e) {
      e.preventDefault();
      window._feedback.comment = $(this)
        .find('input[name="feedbackOption"]:checked')
        .val();
        sendFeedback(window._feedback);
      disableButtons();

      setTimeout(function () {
        hideFeedbackForm();
        $('[data-feedback-comment]').val('');
      }, 1500);
    });
  }

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = feedbackTracker;
  } else {
    window.feedbackTracker = feedbackTracker;
  }
})();
