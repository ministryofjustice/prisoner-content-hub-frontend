(function () {
  document.body.addEventListener('click', function (event) {
    if (matchesAll('[data-state]', event.target)) {
      var element = getAncestorElementBySelector('[data-state]', event.target);

      if (element) {
        var state = element.getAttribute('data-state');
        var stateToggle = function () {
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
      let historyIndex = parseInt(sessionStorage.getItem('historyIndex') === null ? 0 : sessionStorage.getItem('historyIndex'));
      sessionStorage.setItem('historyIndex', historyIndex - 1);
      window.history.go(-1);
    }

    if (event.target.matches('#go-forwards')) {
      event.preventDefault();
      let historyIndex = parseInt(sessionStorage.getItem('historyIndex') === null ? 0 : sessionStorage.getItem('historyIndex'));
      sessionStorage.setItem('historyIndex', historyIndex + 1);      
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

  sendEvent({
    category: 'Buttons',
    action: 'show',
    label: block,
    value: 1,
    userAgent: navigator.userAgent,
  });

  window.setTimeout(function () {
    button.style.display = 'block';
    hiddenData.style.display = 'none';
  }, 3000);
}

$('.is-pdf').on('click', function() {
  gtag("event", "file_download", {
    event_category: "PDFs",
    event_label: "Downloads",
    userAgent: navigator.userAgent
  });
});

$('a.sign-in-btn').on('click', function() {
  gtag("event", "signin", {
    event_category: "signin",
    event_label: "signin",
    userAgent: navigator.userAgent
  });
});

$('a.sign-out-btn').on('click', function() {
  gtag("event", "signout", {
    event_category: "signout",
    event_label: "signout",
    userAgent: navigator.userAgent
  });
});

function updateNavigationLinks(){
  const backLink = document.getElementById('go-back');
  const forwardLink = document.getElementById('go-forwards');

  let historyExists = false;

  if(history.length > 1){
    historyExists = true; 
  }else{
    historyExists = false; 
  }

  if(!historyExists){
    backLink.style.display = 'none';
    forwardLink.style.display = 'none';
  }
  else{
    let historyIndex = parseInt(sessionStorage.getItem('historyIndex') === null ? 0 : sessionStorage.getItem('historyIndex'));
    //disable forward button if we are at 0 position
    if(historyIndex < 0)
      forwardLink.style.display = 'flex';
    else
      forwardLink.style.display = 'none';

    if(historyIndex + history.length <= 1)
      backLink.style.display = 'none';
    else
      backLink.style.display = 'flex';
  }
}

updateNavigationLinks();