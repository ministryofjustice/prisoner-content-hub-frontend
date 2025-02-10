const setUpShowMore = (showMoreButton, showMoreTiles, pageType = '') => {
  const updateButton = isLastPage => {
    if (isLastPage) {
      showMoreButton.remove();
    }
  };
  const enableShowMore = () => {
    showMoreButton.html(i18nShowMore['showMore.enabled'] || 'Show more');
    showMoreButton.attr('disabled', false);
  };
  const disableShowMore = () => {
    showMoreButton.html(i18nShowMore['showMore.disabled'] || 'Loading');
    showMoreButton.attr('disabled', true);
  };

  let page = 1;
  showMoreButton.on('click', () => {
    page++;
    const nextPage = `${location.pathname}/json?page=${page}&pageType=${pageType}`;
    disableShowMore();

    $.getJSON(nextPage, response => {
      const { data, isLastPage } = response;
      const res = data.map(item =>
        nunjucks.render('content-tile-small', { params: item }),
      );
      showMoreTiles.append(res);
      enableShowMore();
      updateButton(isLastPage);
    }).fail(function () {
      enableShowMore();
    });
  });
};
