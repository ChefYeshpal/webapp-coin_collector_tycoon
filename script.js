let coins = 0;
const coinBtn = document.getElementById('coin-btn');
const coinCount = document.getElementById('coin-count');

coinBtn.addEventListener('click', () => {
    coins++;
    coinCount.textContent = `Coins: ${coins}`;
});