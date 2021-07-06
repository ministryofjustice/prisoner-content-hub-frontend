const SENSITIVE_CARD = '.sensitive-card';
const SENSITIVE_CARD_CONTAINER = '.sensitive-card-container';
const HIDDEN = 'hidden';

const updateClasses = f => items => items.forEach(item => f(item.classList));
const hideAll = updateClasses(classes => classes.add(HIDDEN));
const showAll = updateClasses(classes => classes.remove(HIDDEN));

const wrapContainer = container => {
  const control = container.querySelector('.sensitive-card-control');
  const openContent = control.querySelector('.open');
  const closedContent = control.querySelector('.closed');
  const cards = container.querySelectorAll(SENSITIVE_CARD);
  return {
    control,
    isClosed: () => control.dataset.isClosed === 'true',
    cards: [...cards].map(card => wrapCard(card)),
    updateControl: function () {
      const allCardsClosed = this.cards.every(card => card.isClosed());
      if (allCardsClosed) {
        showAll([openContent]);
        hideAll([closedContent]);
      } else {
        hideAll([openContent]);
        showAll([closedContent]);
      }

      this.control.dataset.isClosed = allCardsClosed;
    },
  };
};

const wrapCard = card => {
  const sensitiveItems = [...card.querySelectorAll('.sensitive')];
  const openContent = card.querySelector('.open');
  const container = card.closest(SENSITIVE_CARD_CONTAINER);

  const itemsPresentWhenOpen = [openContent, ...sensitiveItems];
  const itemsPresentWhenClosed = [...card.querySelectorAll('.closed')];

  return {
    hasContainer: () => Boolean(container),
    getContainer: () => container && wrapContainer(container),
    isClosed: () => card.dataset.isClosed === 'true',
    toggle: isCurrentlyHidden => {
      if (isCurrentlyHidden) {
        showAll(itemsPresentWhenOpen);
        hideAll(itemsPresentWhenClosed);
      } else {
        hideAll(itemsPresentWhenOpen);
        showAll(itemsPresentWhenClosed);
      }
      card.dataset.isClosed = !isCurrentlyHidden;
    },
  };
};

window.onload = function () {
  document
    .querySelectorAll(SENSITIVE_CARD_CONTAINER)
    .forEach(sensitiveContainer => {
      const container = wrapContainer(sensitiveContainer);

      container.control.addEventListener('click', e => {
        e.preventDefault();

        container.cards.forEach(card => card.toggle(container.isClosed()));
        container.updateControl();
      });
    });

  document.querySelectorAll(SENSITIVE_CARD).forEach(sensitiveCard => {
    const card = wrapCard(sensitiveCard);

    sensitiveCard.addEventListener('click', e => {
      e.preventDefault();

      card.toggle(card.isClosed());
      if (card.hasContainer()) {
        card.getContainer().updateControl();
      }
    });
  });

  document.querySelectorAll('.content-card').forEach(card => {
    if (card.querySelector('a') !== null) {
      card.addEventListener('click', () => {
        card.querySelector('a').click();
      });
    }
  });
};
