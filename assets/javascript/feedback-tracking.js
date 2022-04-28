(function () {
  function sendFeedback(data) {
    $.ajax({
      type: 'POST',
      url: '/feedback/' + data.id,
      data: data
    });
  }

  var CHARACTER_LIMIT = 240;
  var typesDisplay = {
    video: 'video',
    radio: 'podcast',
    page: 'article',
    game: 'game',
    'landing-page': 'topic',
    series: 'series',
    topic: 'topic'
  };
  var types = {
    video: 'VIDEO',
    radio: 'AUDIO',
    page: 'ARTICLE',
    game: 'GAME',
    'landing-page': 'TOPIC',
    series: 'SERIES',
    topic: 'TOPIC'
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
    window._feedback.categories = categories ? ('' + categories).split(',') : [];
    window._feedback.topics = topics ? ('' + topics).split(',') : [];
    window._feedback.id = widget.data('item-feedback-id');

    var series = widget.data('item-series');
    if (series) {
      window._feedback.series = series;
    }

    function showFeedbackForm() {
      $('[data-feedback-form]').removeClass('govuk-u-hidden');
    }

    function hideFeedbackForm() {
      $('.govuk-hub-feedback-ui').addClass('govuk-u-hidden');
      $('.govuk-hub-feedback-confirmation').removeClass('govuk-u-hidden');

    }

    function updateCharacterCount(characterCount) {
      var characterCount = characterCount || 0;
      $('[data-feedback-comment-counter]').text(CHARACTER_LIMIT - characterCount);
    }

    function enableFormSubmit() {
      $('[data-feedback-form]')
        .find('button')
        .attr('disabled', false);
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
      $('[data-item-feedback-text]').text(`I ${feedback === 'LIKE'?'':' do not' } like this ${typeText}`);
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
      showFeedbackForm();
      sendFeedback(window._feedback);
    });

    widget.find('[data-feedback-comment]').on('keyup', function (e) {
      e.preventDefault();
      var value = $(this)
        .val()
        .slice(0, CHARACTER_LIMIT);
      var characterCount = value.length;
      $('[data-feedback-comment]').val(value);
      updateCharacterCount(characterCount);
      enableFormSubmit();
    });

    widget.find('[data-feedback-form]').on('submit', function (e) {
      e.preventDefault();
      window._feedback.comment = $(this)
        .find('[data-feedback-comment]')
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
