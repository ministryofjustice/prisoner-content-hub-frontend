import * as govukFrontend from '/public/govuk/govuk-frontend.min.js';
import * as mojFrontend from '/public/moj/moj-frontend.min.js';

govukFrontend.initAll();
mojFrontend.initAll();

(function () {
  document.body.addEventListener('click', function (event) {
    if (event.target.matches('#go-back')) {
      event.preventDefault();
      window.history.go(-1);
    }

    if (event.target.matches('#go-forwards')) {
      event.preventDefault();
      window.history.go(1);
    }
  });
})();
