const showMore = $('.showMoreTiles');
const smallTiles = $('#small-tiles');
function updateButton(isLastPage) {
  if (isLastPage) {
    showMore.remove();
  }
}

function enableShowMore() {
  showMore.html('Show more');
  showMore.attr('disabled', false);
}

function disableShowMore() {
  showMore.html('Loading');
  showMore.attr('disabled', true);
}

let page = 1;
showMore.on('click', () => {
  page++;
  const nextPage = `${location.pathname}.json?page=${page}`;
  disableShowMore();

  $.getJSON(nextPage, function (data) {
    const res = data.relatedContent.data.map(item =>
      nunjucks.render('content-tile-small', { params: item }),
    );
    smallTiles.append(res);
    enableShowMore();
    updateButton(data.relatedContent.isLastPage);
  }).fail(function () {
    enableShowMore();
  });
});
