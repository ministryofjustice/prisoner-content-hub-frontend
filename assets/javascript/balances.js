(function () {
  const balanceToggle = document.getElementById('balance-toggle-button');
  if (balanceToggle) {
    console.log('Setting up balances');
    const SHOW_LABEL = 'Show balances';
    const HIDE_LABEL = 'Hide balances';
    const PLACEHOLDER = '****';
    balanceToggle.innerHTML = SHOW_LABEL;
    const balances = document.getElementsByClassName('balance-amount');
    for (let i = 0; i < balances.length; i++) {
      balances[i].innerHTML = PLACEHOLDER;
      balances[i].setAttribute('aria-hidden', true);
    }
    balanceToggle.onclick = e => {
      const isHidden = e.target.innerHTML === HIDE_LABEL;
      e.target.innerHTML = isHidden ? SHOW_LABEL : HIDE_LABEL;
      for (let i = 0; i < balances.length; i++) {
        balances[i].innerHTML = isHidden
          ? PLACEHOLDER
          : balances[i].dataset.amount;
        balances[i].setAttribute('aria-hidden', isHidden);
      }
    };
  }
})();
