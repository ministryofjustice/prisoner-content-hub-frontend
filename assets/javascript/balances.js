(function () {
  const balanceToggle = document.getElementById('balance-toggle-button');
  if (balanceToggle) {
    console.log('Setting up balances');
    const SHOW_LABEL = 'Show balances';
    const HIDE_LABEL = 'Hide balances';
    const PLACEHOLDER = '****';
    let isHidden = true;
    const getButtonLabel = isCurrentlyHidden =>
      isCurrentlyHidden ? SHOW_LABEL : HIDE_LABEL;
    const setBalances = (balanceObjects, isCurrentlyHidden) => {
      for (let i = 0; i < balanceObjects.length; i++) {
        balanceObjects[i].innerHTML = isCurrentlyHidden
          ? PLACEHOLDER
          : balanceObjects[i].dataset.amount;
        balanceObjects[i].setAttribute('aria-hidden', isCurrentlyHidden);
      }
    };
    balanceToggle.innerHTML = getButtonLabel(isHidden);
    const balances = document.getElementsByClassName('balance-amount');
    setBalances(balances, isHidden);
    balanceToggle.onclick = e => {
      isHidden = !isHidden;
      e.target.innerHTML = getButtonLabel(isHidden);
      setBalances(balances, isHidden);
    };
  }
})();
