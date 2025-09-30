// =============================================================================
// COIN COLLECTOR TYCOON - GAME LOGIC
// =============================================================================

// Game state variables
let playerCoins = 0;                    // Total coins collected by player
let autoCollectorCount = 0;             // Number of auto collectors purchased
let coinsPerSecondFromAuto = 0;         // Total coins generated per second
let autoCollectorUpgradeCost = 10;      // Current cost for next auto collector

// Cooldown system variables with heat mechanics
let baseCooldownDuration = 500;         // Base cooldown time in milliseconds (0.5 seconds)
let maxCooldownDuration = 3000;         // Maximum cooldown time (3 seconds when overheated)
let currentCooldownDuration = 500;      // Current cooldown duration (starts at base)
let isClickOnCooldown = false;          // Whether click is currently on cooldown
let cooldownStartTime = 0;              // When the current cooldown started

// Heat system variables (minigun mechanics)
let heatLevel = 0;                      // Current heat level (0-100)
let maxHeatLevel = 100;                 // Maximum heat before overheating
let heatIncreasePerClick = 15;          // Heat gained per click
let heatDecayRate = 8;                  // Heat lost per second when not clicking
let lastClickTime = 0;                  // Timestamp of last click for heat calculations

// DOM element references
const coinClickButton = document.getElementById('coin-btn');
const coinCountDisplay = document.getElementById('coin-count');
const autoUpgradeButton = document.getElementById('auto-upgrade-btn');
const autoInfoDisplay = document.getElementById('auto-info');
const upgradeCostDisplay = document.getElementById('auto-cost');
const cooldownFillBar = document.getElementById('cooldown-fill');

// =============================================================================
// CLICK HANDLING AND COOLDOWN SYSTEM
// =============================================================================

/**
 * Handles manual coin collection when player clicks the coin
 * Implements heat buildup system - rapid clicking increases cooldown like a minigun
 */
function handleCoinClick() {
    // Check if click is on cooldown
    if (isClickOnCooldown) {
        return; // Ignore click if on cooldown
    }
    
    const currentTime = Date.now();
    
    // Update heat level based on clicking speed
    updateHeatLevel(currentTime);
    
    // Calculate cooldown duration based on current heat
    calculateDynamicCooldown();
    
    // Collect coin and start cooldown
    playerCoins++;
    startClickCooldown();
    updateAllDisplays();
    playClickAnimation();
    
    // Update last click time for heat calculations
    lastClickTime = currentTime;
}

/**
 * Updates the heat level based on clicking patterns
 * Fast clicking = more heat, waiting = heat decay
 */
function updateHeatLevel(currentTime) {
    // Calculate time since last click
    const timeSinceLastClick = currentTime - lastClickTime;
    
    if (lastClickTime > 0) {
        // Apply heat decay based on time elapsed (heat cools down over time)
        const secondsElapsed = timeSinceLastClick / 1000;
        const heatDecay = heatDecayRate * secondsElapsed;
        heatLevel = Math.max(0, heatLevel - heatDecay);
    }
    
    // Add heat from this click
    heatLevel = Math.min(maxHeatLevel, heatLevel + heatIncreasePerClick);
}

/**
 * Calculates dynamic cooldown duration based on current heat level
 * Higher heat = longer cooldown (like a minigun overheating)
 */
function calculateDynamicCooldown() {
    // Convert heat level (0-100) to cooldown multiplier
    const heatPercentage = heatLevel / maxHeatLevel;
    
    // Cooldown increases exponentially with heat for dramatic effect
    const cooldownMultiplier = 1 + (heatPercentage * heatPercentage * 5); // Exponential curve
    
    currentCooldownDuration = Math.min(
        maxCooldownDuration,
        baseCooldownDuration * cooldownMultiplier
    );
}

/**
 * Starts the click cooldown timer and visual progress bar
 */
function startClickCooldown() {
    isClickOnCooldown = true;
    cooldownStartTime = Date.now();
    
    // Disable coin button during cooldown
    coinClickButton.style.pointerEvents = 'none';
    coinClickButton.style.opacity = '0.7';
}

/**
 * Updates the cooldown progress bar and checks if cooldown is complete
 * Now uses dynamic cooldown duration based on heat level
 */
function updateCooldownProgress() {
    if (!isClickOnCooldown) {
        cooldownFillBar.style.width = '0%';
        return;
    }
    
    const currentTime = Date.now();
    const elapsedTime = currentTime - cooldownStartTime;
    const progressPercentage = (elapsedTime / currentCooldownDuration) * 100;
    
    // Update progress bar visual with heat-based color
    updateCooldownBarColor();
    cooldownFillBar.style.width = Math.min(progressPercentage, 100) + '%';
    
    // Check if cooldown is complete
    if (elapsedTime >= currentCooldownDuration) {
        completeCooldown();
    }
}

/**
 * Updates the cooldown bar color based on heat level
 * Cold = green, warm = yellow, hot = red
 */
function updateCooldownBarColor() {
    const heatPercentage = heatLevel / maxHeatLevel;
    
    if (heatPercentage < 0.3) {
        // Cool - green
        cooldownFillBar.style.background = 'linear-gradient(90deg, #90ee90, #32cd32)';
    } else if (heatPercentage < 0.6) {
        // Warming up - yellow/orange
        cooldownFillBar.style.background = 'linear-gradient(90deg, #ffd700, #ff8c00)';
    } else {
        // Hot - red
        cooldownFillBar.style.background = 'linear-gradient(90deg, #ff6b6b, #dc143c)';
    }
}

/**
 * Completes the cooldown and re-enables clicking
 */
function completeCooldown() {
    isClickOnCooldown = false;
    cooldownFillBar.style.width = '0%';
    
    // Re-enable coin button
    coinClickButton.style.pointerEvents = 'auto';
    coinClickButton.style.opacity = '1';
}

/**
 * Continuously reduces heat level when player is not clicking
 * This allows the "minigun" to cool down over time
 */
function updateHeatDecay() {
    if (!isClickOnCooldown && lastClickTime > 0) {
        const currentTime = Date.now();
        const timeSinceLastClick = currentTime - lastClickTime;
        
        // Only apply decay if enough time has passed since last click
        if (timeSinceLastClick > 100) { // 0.1 second minimum
            const secondsElapsed = timeSinceLastClick / 1000;
            const heatDecay = heatDecayRate * secondsElapsed;
            const oldHeatLevel = heatLevel;
            
            heatLevel = Math.max(0, heatLevel - heatDecay);
            
            // Update last click time to current time for next calculation
            if (heatLevel !== oldHeatLevel) {
                lastClickTime = currentTime;
            }
            
            // Update cooldown bar color even when not clicking
            if (!isClickOnCooldown) {
                updateCooldownBarColor();
            }
        }
    }
}

/**
 * Plays click animation on the coin button
 */
function playClickAnimation() {
    coinClickButton.style.transform = 'scale(0.9)';
    setTimeout(() => {
        coinClickButton.style.transform = '';
    }, 100);
}

// =============================================================================
// UPGRADE SYSTEM
// =============================================================================

/**
 * Handles purchasing auto collector upgrades
 * Each upgrade adds 2 coins/sec and increases cost by 15%
 */
function handleAutoCollectorUpgrade() {
    // Check if player has enough coins
    if (playerCoins >= autoCollectorUpgradeCost) {
        // Process the purchase
        playerCoins -= autoCollectorUpgradeCost;
        autoCollectorCount++;
        coinsPerSecondFromAuto = autoCollectorCount * 2; // 2 coins/sec per collector
        
        // Increase cost for next upgrade (15% increase)
        autoCollectorUpgradeCost = Math.floor(autoCollectorUpgradeCost * 1.15);
        
        updateAllDisplays();
    }
}

// =============================================================================
// AUTO COLLECTION SYSTEM
// =============================================================================

/**
 * Generates coins automatically based on purchased auto collectors
 * Runs every second
 */
function generateAutoCoins() {
    if (coinsPerSecondFromAuto > 0) {
        playerCoins += coinsPerSecondFromAuto;
        updateAllDisplays();
    }
}

// =============================================================================
// DISPLAY UPDATE FUNCTIONS
// =============================================================================

/**
 * Updates all game displays with current values
 */
function updateAllDisplays() {
    updateCoinCountDisplay();
    updateAutoCollectorInfo();
    updateUpgradeButtonState();
}

/**
 * Updates the main coin count display
 */
function updateCoinCountDisplay() {
    coinCountDisplay.textContent = `💰 ${playerCoins.toLocaleString()} Coins`;
}

/**
 * Updates the auto collector information display
 */
function updateAutoCollectorInfo() {
    autoInfoDisplay.textContent = `Auto: ${coinsPerSecondFromAuto} coins/sec`;
    upgradeCostDisplay.textContent = `Cost: ${autoCollectorUpgradeCost.toLocaleString()} coins`;
}

/**
 * Updates the upgrade button state (enabled/disabled) and text
 */
function updateUpgradeButtonState() {
    if (playerCoins >= autoCollectorUpgradeCost) {
        // Player can afford the upgrade
        autoUpgradeButton.disabled = false;
        autoUpgradeButton.textContent = 'Buy';
    } else {
        // Player cannot afford the upgrade
        autoUpgradeButton.disabled = true;
        const coinsNeeded = autoCollectorUpgradeCost - playerCoins;
        autoUpgradeButton.textContent = `Need ${coinsNeeded.toLocaleString()} more`;
    }
}

// =============================================================================
// EVENT LISTENERS AND GAME INITIALIZATION
// =============================================================================

/**
 * Sets up all event listeners for game interactions
 */
function initializeEventListeners() {
    // Manual coin collection
    coinClickButton.addEventListener('click', handleCoinClick);
    
    // Auto collector upgrade purchase
    autoUpgradeButton.addEventListener('click', handleAutoCollectorUpgrade);
}

/**
 * Starts all game timers and intervals
 */
function startGameTimers() {
    // Auto coin generation (every 1000ms = 1 second)
    setInterval(generateAutoCoins, 1000);
    
    // Cooldown progress update (every 50ms for smooth animation)
    setInterval(updateCooldownProgress, 50);
    
    // Heat decay update (every 100ms for smooth heat reduction)
    setInterval(updateHeatDecay, 100);
}

/**
 * Initializes the game when page loads
 */
function initializeGame() {
    initializeEventListeners();
    startGameTimers();
    updateAllDisplays();
}

// Start the game when page loads
initializeGame();===================

// Game state variables
let playerCoins = 0;                    // Total coins collected by player
let autoCollectorCount = 0;             // Number of auto collectors purchased
let coinsPerSecondFromAuto = 0;         // Total coins generated per second
let autoCollectorUpgradeCost = 10;      // Current cost for next auto collector

// Cooldown system variables with heat mechanics
let baseCooldownDuration = 500;         // Base cooldown time in milliseconds (0.5 seconds)
let maxCooldownDuration = 3000;         // Maximum cooldown time (3 seconds when overheated)
let currentCooldownDuration = 500;      // Current cooldown duration (starts at base)
let isClickOnCooldown = false;          // Whether click is currently on cooldown
let cooldownStartTime = 0;              // When the current cooldown started

// Heat system variables (minigun mechanics)
let heatLevel = 0;                      // Current heat level (0-100)
let maxHeatLevel = 100;                 // Maximum heat before overheating
let heatIncreasePerClick = 15;          // Heat gained per click
let heatDecayRate = 8;                  // Heat lost per second when not clicking
let lastClickTime = 0;                  // Timestamp of last click for heat calculations

// DOM element references
const coinClickButton = document.getElementById('coin-btn');
const coinCountDisplay = document.getElementById('coin-count');
const autoUpgradeButton = document.getElementById('auto-upgrade-btn');
const autoInfoDisplay = document.getElementById('auto-info');
const upgradeCostDisplay = document.getElementById('auto-cost');
const cooldownFillBar = document.getElementById('cooldown-fill');

// =============================================================================
// CLICK HANDLING AND COOLDOWN SYSTEM
// =============================================================================

/**
 * Handles manual coin collection when player clicks the coin
 * Implements heat buildup system - rapid clicking increases cooldown like a minigun
 */
function handleCoinClick() {
    // Check if click is on cooldown
    if (isClickOnCooldown) {
        return; // Ignore click if on cooldown
    }
    
    const currentTime = Date.now();
    
    // Update heat level based on clicking speed
    updateHeatLevel(currentTime);
    
    // Calculate cooldown duration based on current heat
    calculateDynamicCooldown();
    
    // Collect coin and start cooldown
    playerCoins++;
    startClickCooldown();
    updateAllDisplays();
    playClickAnimation();
    
    // Update last click time for heat calculations
    lastClickTime = currentTime;
}

/**
 * Updates the heat level based on clicking patterns
 * Fast clicking = more heat, waiting = heat decay
 */
function updateHeatLevel(currentTime) {
    // Calculate time since last click
    const timeSinceLastClick = currentTime - lastClickTime;
    
    if (lastClickTime > 0) {
        // Apply heat decay based on time elapsed (heat cools down over time)
        const secondsElapsed = timeSinceLastClick / 1000;
        const heatDecay = heatDecayRate * secondsElapsed;
        heatLevel = Math.max(0, heatLevel - heatDecay);
    }
    
    // Add heat from this click
    heatLevel = Math.min(maxHeatLevel, heatLevel + heatIncreasePerClick);
}

/**
 * Calculates dynamic cooldown duration based on current heat level
 * Higher heat = longer cooldown (like a minigun overheating)
 */
function calculateDynamicCooldown() {
    // Convert heat level (0-100) to cooldown multiplier
    const heatPercentage = heatLevel / maxHeatLevel;
    
    // Cooldown increases exponentially with heat for dramatic effect
    const cooldownMultiplier = 1 + (heatPercentage * heatPercentage * 5); // Exponential curve
    
    currentCooldownDuration = Math.min(
        maxCooldownDuration,
        baseCooldownDuration * cooldownMultiplier
    );
}

/**
 * Starts the click cooldown timer and visual progress bar
 */
function startClickCooldown() {
    isClickOnCooldown = true;
    cooldownStartTime = Date.now();
    
    // Disable coin button during cooldown
    coinClickButton.style.pointerEvents = 'none';
    coinClickButton.style.opacity = '0.7';
}

/**
 * Updates the cooldown progress bar and checks if cooldown is complete
 * Now uses dynamic cooldown duration based on heat level
 */
function updateCooldownProgress() {
    if (!isClickOnCooldown) {
        cooldownFillBar.style.width = '0%';
        return;
    }
    
    const currentTime = Date.now();
    const elapsedTime = currentTime - cooldownStartTime;
    const progressPercentage = (elapsedTime / currentCooldownDuration) * 100;
    
    // Update progress bar visual with heat-based color
    updateCooldownBarColor();
    cooldownFillBar.style.width = Math.min(progressPercentage, 100) + '%';
    
    // Check if cooldown is complete
    if (elapsedTime >= currentCooldownDuration) {
        completeCooldown();
    }
}

/**
 * Updates the cooldown bar color based on heat level
 * Cold = green, warm = yellow, hot = red
 */
function updateCooldownBarColor() {
    const heatPercentage = heatLevel / maxHeatLevel;
    
    if (heatPercentage < 0.3) {
        // Cool - green
        cooldownFillBar.style.background = 'linear-gradient(90deg, #90ee90, #32cd32)';
    } else if (heatPercentage < 0.6) {
        // Warming up - yellow/orange
        cooldownFillBar.style.background = 'linear-gradient(90deg, #ffd700, #ff8c00)';
    } else {
        // Hot - red
        cooldownFillBar.style.background = 'linear-gradient(90deg, #ff6b6b, #dc143c)';
    }
}

/**
 * Completes the cooldown and re-enables clicking
 */
function completeCooldown() {
    isClickOnCooldown = false;
    cooldownFillBar.style.width = '0%';
    
    // Re-enable coin button
    coinClickButton.style.pointerEvents = 'auto';
    coinClickButton.style.opacity = '1';
}

/**
 * Plays click animation on the coin button
 */
function playClickAnimation() {
    coinClickButton.style.transform = 'scale(0.9)';
    setTimeout(() => {
        coinClickButton.style.transform = '';
    }, 100);
}

// =============================================================================
// UPGRADE SYSTEM
// =============================================================================

/**
 * Handles purchasing auto collector upgrades
 * Each upgrade adds 2 coins/sec and increases cost by 15%
 */
function handleAutoCollectorUpgrade() {
    // Check if player has enough coins
    if (playerCoins >= autoCollectorUpgradeCost) {
        // Process the purchase
        playerCoins -= autoCollectorUpgradeCost;
        autoCollectorCount++;
        coinsPerSecondFromAuto = autoCollectorCount * 2; // 2 coins/sec per collector
        
        // Increase cost for next upgrade (15% increase)
        autoCollectorUpgradeCost = Math.floor(autoCollectorUpgradeCost * 1.15);
        
        updateAllDisplays();
    }
}

// =============================================================================
// AUTO COLLECTION SYSTEM
// =============================================================================

/**
 * Generates coins automatically based on purchased auto collectors
 * Runs every second
 */
function generateAutoCoins() {
    if (coinsPerSecondFromAuto > 0) {
        playerCoins += coinsPerSecondFromAuto;
        updateAllDisplays();
    }
}

// =============================================================================
// DISPLAY UPDATE FUNCTIONS
// =============================================================================

/**
 * Updates all game displays with current values
 */
function updateAllDisplays() {
    updateCoinCountDisplay();
    updateAutoCollectorInfo();
    updateUpgradeButtonState();
}

/**
 * Updates the main coin count display
 */
function updateCoinCountDisplay() {
    coinCountDisplay.textContent = `💰 ${playerCoins.toLocaleString()} Coins`;
}

/**
 * Updates the auto collector information display
 */
function updateAutoCollectorInfo() {
    autoInfoDisplay.textContent = `Auto: ${coinsPerSecondFromAuto} coins/sec`;
    upgradeCostDisplay.textContent = `Cost: ${autoCollectorUpgradeCost.toLocaleString()} coins`;
}

/**
 * Updates the upgrade button state (enabled/disabled) and text
 */
function updateUpgradeButtonState() {
    if (playerCoins >= autoCollectorUpgradeCost) {
        // Player can afford the upgrade
        autoUpgradeButton.disabled = false;
        autoUpgradeButton.textContent = 'Buy';
    } else {
        // Player cannot afford the upgrade
        autoUpgradeButton.disabled = true;
        const coinsNeeded = autoCollectorUpgradeCost - playerCoins;
        autoUpgradeButton.textContent = `Need ${coinsNeeded.toLocaleString()} more`;
    }
}

// =============================================================================
// EVENT LISTENERS AND GAME INITIALIZATION
// =============================================================================

/**
 * Sets up all event listeners for game interactions
 */
function initializeEventListeners() {
    // Manual coin collection
    coinClickButton.addEventListener('click', handleCoinClick);
    
    // Auto collector upgrade purchase
    autoUpgradeButton.addEventListener('click', handleAutoCollectorUpgrade);
}

/**
 * Starts all game timers and intervals
 */
function startGameTimers() {
    // Auto coin generation (every 1000ms = 1 second)
    setInterval(generateAutoCoins, 1000);
    
    // Cooldown progress update (every 50ms for smooth animation)
    setInterval(updateCooldownProgress, 50);
}

/**
 * Initializes the game when page loads
 */
function initializeGame() {
    initializeEventListeners();
    startGameTimers();
    updateAllDisplays();
}

// Start the game when page loads
initializeGame();