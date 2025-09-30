let coins = 0;
let autoCoins = 0;
const coinBtn = document.getElementById('coin-btn');
const coinCount = document.getElementById('coin-count');
const autoUpgradeBtn = document.getElementById('auto-upgrade-btn');
const autoInfo = document.getElementById('auto-info');

coinBtn.addEventListener('click', () => {
  coins++;
  updateCoins();
});

autoUpgradeBtn.addEventListener('click', () => {
  if (coins >= 50) {
    coins -= 50;
    autoCoins += 1;
    updateCoins();
    updateAuto();
  }
});

function updateCoins() {
  coinCount.textContent = `Coins: ${coins}`;
}

function updateAuto() {
  autoInfo.textContent = `Auto coins/s: ${autoCoins}`;
}

// Auto coin generator loop
setInterval(() => {
  if (autoCoins > 0) {
    coins += autoCoins;
    updateCoins();
  }
}, 1000);

updateCoins();
updateAuto();