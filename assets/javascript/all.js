(function() {
  document.body.addEventListener('click', function(event) {
    if (matchesAll('[data-state]', event.target)) {
      var element = getAncestorElementBySelector('[data-state]', event.target);

      if (element) {
        var state = element.getAttribute('data-state');
        var stateToggle = function() {
          element.setAttribute('data-state', 'hidden');
        };
        element.setAttribute('data-state', toggleShowing(state));

        if (state == 'hidden') {
          clearTimeout(stateToggle);
        }
        setTimeout(stateToggle, 5000);
      }
    }

    if (event.target.matches('#go-back')) {
      event.preventDefault();
      window.history.go(-1);
    }

    if (event.target.matches('#go-forwards')) {
      event.preventDefault();
      window.history.go(1);
    }
  });

  function toggleShowing(state) {
    if (state === 'hidden') {
      return 'showing';
    }

    return 'hidden';
  }

  function matchesAll(selector, element) {
    return element.matches(selector) || element.matches(selector + ' *');
  }

  function getAncestorElementBySelector(selector, element) {
    if (element.matches(selector)) {
      return element;
    }

    if (element.parentNode) {
      return getAncestorElementBySelector(selector, element.parentNode);
    }

    return null;
  }
})();

function showHiddenBlock(block) {
  const button = document.getElementById('show-' + block);
  const hiddenData = document.getElementById(block);

  button.style.display = 'none';
  hiddenData.style.display = 'block';

  gtag('event', 'show', {
    'event_category': 'Buttons',
    'event_label': block,
    'value': 1
  });

  window.setTimeout(function() {
    button.style.display = 'block';
    hiddenData.style.display = 'none';
  }, 3000);
}


$( document ).ready(function() {
  $('a.is-pdf').on('click', function() {
    gtag('event', $(this).data('featuredTitle'), {
      'event_category': 'PDFs',
      'event_label': 'Downloads',
      'value': 1
    });
  });

  $("a[href*='/auth/sign-in']").on('click', function() {
    gtag('event', 'signin', {
      'event_category': 'Signin',
      'event_label': 'signinclick',
      'value': 1
    });
  });

  $("a[href*='/auth/sign-out']").on('click', function() {
    gtag('event', 'signout', {
      'event_category': 'Signout',
      'event_label': 'signoutclick',
      'value': 1
    });
  });
})
