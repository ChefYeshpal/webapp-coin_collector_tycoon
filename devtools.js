// Devtools Easter Egg for Water Bottle Tycoon
(function() {
    // Create stats panel (hidden by default)
    const panel = document.createElement('div');
    panel.id = 'devtools-panel';
    panel.style.position = 'fixed';
    panel.style.top = '60px';
    panel.style.right = '30px';
    panel.style.zIndex = '9999';
    panel.style.background = '#222';
    panel.style.color = '#eee';
    panel.style.border = '2px solid #444';
    panel.style.borderRadius = '8px';
    panel.style.padding = '18px 20px';
    panel.style.minWidth = '260px';
    panel.style.boxShadow = '0 2px 12px rgba(0,0,0,0.3)';
    panel.style.display = 'none';
    panel.innerHTML = `
        <div style="font-size:18px;font-weight:bold;margin-bottom:10px;">Devtools Panel 🛠️</div>
        <div id="devtools-stats"></div>
        <hr style="margin:10px 0;">
        <div>
            <label>Money: <input id="devtools-money" type="number" style="width:80px;"></label>
            <button id="devtools-set-money">Set</button>
        </div>
        <div>
            <label>Day: <input id="devtools-day" type="number" style="width:80px;"></label>
            <button id="devtools-set-day">Set</button>
        </div>
        <div>
            <label>Reputation Bonus: <input id="devtools-rep" type="number" style="width:80px;"></label>
            <button id="devtools-set-rep">Set</button>
        </div>
        <button id="devtools-close" style="margin-top:12px;float:right;">Close</button>
    `;
    document.body.appendChild(panel);

    function updateStats() {
        if (!window.gameState) return;
        const stats = document.getElementById('devtools-stats');
        stats.innerHTML = `
            <b>Money:</b> ₹${window.gameState.money}<br>
            <b>Day:</b> ${window.gameState.day}<br>
            <b>Total Profit:</b> ₹${window.gameState.totalProfit}<br>
            <b>Reputation Bonus:</b> ${window.gameState.reputationBonus}%<br>
            <b>Bottles Bought:</b> ${window.gameState.bottlesBought}<br>
            <b>Water Type:</b> ${window.gameState.waterType}<br>
        `;
    }

    // Set up controls
    panel.querySelector('#devtools-set-money').onclick = function() {
        const val = parseFloat(panel.querySelector('#devtools-money').value);
        if (!isNaN(val) && window.gameState) {
            window.gameState.money = val;
            updateStats();
        }
    };
    panel.querySelector('#devtools-set-day').onclick = function() {
        const val = parseInt(panel.querySelector('#devtools-day').value);
        if (!isNaN(val) && window.gameState) {
            window.gameState.day = val;
            updateStats();
        }
    };
    panel.querySelector('#devtools-set-rep').onclick = function() {
        const val = parseInt(panel.querySelector('#devtools-rep').value);
        if (!isNaN(val) && window.gameState) {
            window.gameState.reputationBonus = val;
            updateStats();
        }
    };
    panel.querySelector('#devtools-close').onclick = function() {
        panel.style.display = 'none';
    };

    // Listen for 'debug' or 'devmode' in any input
    document.addEventListener('input', function(e) {
        if (e.target && e.target.tagName === 'INPUT') {
            const val = e.target.value.trim().toLowerCase();
            if (val === 'debug' || val === 'devmode') {
                panel.style.display = 'block';
                updateStats();
                // Clear input so game doesn't process it
                e.target.value = '';
            }
        }
    });

    // Update stats if gameState changes (poll every second)
    setInterval(() => {
        if (panel.style.display === 'block') updateStats();
    }, 1000);
})();
