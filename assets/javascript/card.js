window.onload = function () {
  document.querySelectorAll('.sensitive-card').forEach(card => {
    const reveal = card.querySelector('.reveal-sign');
    card.addEventListener('click', e => {
      e.preventDefault();
      card.querySelectorAll('.sensitive').forEach(item => {
        item.classList.toggle('hidden');
      });
      reveal.innerHTML = reveal.innerHTML === '+' ? '&ndash;' : '+';
    });
  });
  // Loops through dom and finds all elements with card--clickable class
  document.querySelectorAll('.content-card').forEach(card => {
    // Check if card has a link within it
    if (card.querySelector('a') !== null) {
      // Clicks the link within the heading to navigate to desired page
      card.addEventListener('click', () => {
        card.querySelector('a').click();
      });
    }
  });
};
