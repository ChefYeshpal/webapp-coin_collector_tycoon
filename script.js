let coins = 0;
let autoCollectors = 0;
let autoCoinsPerSecond = 0;
let upgradeCost = 50;

// Get DOM elements
const coinBtn = document.getElementById('coin-btn');
const coinCount = document.getElementById('coin-count');
const autoUpgradeBtn = document.getElementById('auto-upgrade-btn');
const autoInfo = document.getElementById('auto-info');
const autoCost = document.getElementById('auto-cost');

// Manual coin collection
coinBtn.addEventListener('click', () => {
  coins++;
  updateDisplay();
  
  // Add click animation
  coinBtn.style.transform = 'scale(0.9)';
  setTimeout(() => {
    coinBtn.style.transform = '';
  }, 100);
});

// Auto collector upgrade
autoUpgradeBtn.addEventListener('click', () => {
  if (coins >= upgradeCost) {
    coins -= upgradeCost;
    autoCollectors++;
    autoCoinsPerSecond = autoCollectors * 2; // 2 coins per second per collector
    upgradeCost = Math.floor(upgradeCost * 1.15); // Increase cost by 15% each time
    updateDisplay();
  }
});

function updateDisplay() {
  // Update coin count
  coinCount.textContent = `💰 ${coins.toLocaleString()} Coins`;
  
  // Update auto collector info
  autoInfo.textContent = `Auto: ${autoCoinsPerSecond} coins/sec`;
  autoCost.textContent = `Cost: ${upgradeCost.toLocaleString()} coins`;
  
  // Disable/enable upgrade button based on affordability
  if (coins >= upgradeCost) {
    autoUpgradeBtn.disabled = false;
    autoUpgradeBtn.textContent = 'Buy';
  } else {
    autoUpgradeBtn.disabled = true;
    autoUpgradeBtn.textContent = `Need ${(upgradeCost - coins).toLocaleString()} more`;
  }
}

// Auto coin generation (runs every second)
setInterval(() => {
  if (autoCoinsPerSecond > 0) {
    coins += autoCoinsPerSecond;
    updateDisplay();
  }
}, 1000);

// Initialize display
updateDisplay();