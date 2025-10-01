// Game constants
const BOTTLE_COST = 0.5; // Cost of empty bottle in INR (50 paise)
const FILTERED_WATER_COST = 3; // Cost of filtered water per bottle in INR
const RIVER_WATER_COST = 0; // Cost of river water (free)
const MIN_STARTING_MONEY = 5;
const MAX_STARTING_MONEY = 50;
let gameState = {
    day: 1,
    money: 0,
    totalProfit: 0,
    currentStep: 'intro',
    bottlesBought: 0,
    sellingPrice: 0,
    waterType: '',
    riverWaterUsage: 0,
    totalCost: 0,
    consecutiveProfitDays: 0,
    consecutiveLossDays: 0,
    inventory: {
        riverWaterBottles: 0,
        filteredWaterBottles: 0,
        emptyBottles: 0
    }
};
// DOM elements
let storyTextElement;
let inputSection;
let userInput;
let submitButton;
// Typewriter control variables
let isTyping = false;
let skipTyping = false;
let currentTypingElement = null;
// Game flow steps
var GameStep;
(function (GameStep) {
    GameStep["INTRO"] = "intro";
    GameStep["BUY_BOTTLES"] = "buy_bottles";
    GameStep["CHOOSE_WATER"] = "choose_water";
    GameStep["GO_TO_STATION"] = "go_to_station";
    GameStep["SET_PRICE"] = "set_price";
    GameStep["SELLING"] = "selling";
    GameStep["DAY_RESULTS"] = "day_results";
    GameStep["NEXT_DAY"] = "next_day";
})(GameStep || (GameStep = {}));
// Utility functions
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function typewriterText(text, speed = 50) {
    const paragraph = document.createElement('div');
    paragraph.className = 'story-paragraph';
    storyTextElement.appendChild(paragraph);
    isTyping = true;
    currentTypingElement = paragraph;
    skipTyping = false;
    await sleep(500); // Pause before typing
    // If skip was triggered during the initial pause, complete immediately
    if (skipTyping) {
        paragraph.textContent = text;
        isTyping = false;
        currentTypingElement = null;
        await sleep(200); // Brief pause
        return;
    }
    for (let i = 0; i <= text.length; i++) {
        // Check if we should skip typing
        if (skipTyping) {
            paragraph.textContent = text;
            break;
        }
        paragraph.textContent = text.slice(0, i);
        await sleep(speed);
    }
    isTyping = false;
    currentTypingElement = null;
    await sleep(skipTyping ? 200 : 800); // Shorter pause if skipped
}
async function showText(text) {
    const paragraph = document.createElement('div');
    paragraph.className = 'story-paragraph';
    paragraph.textContent = text;
    storyTextElement.appendChild(paragraph);
    await sleep(1000);
}
function showInput(placeholder = "Type your answer...") {
    userInput.placeholder = placeholder;
    userInput.value = '';
    inputSection.classList.remove('hidden');
    userInput.focus();
}
function hideInput() {
    inputSection.classList.add('hidden');
}
function clearStory() {
    storyTextElement.innerHTML = '';
}
function skipCurrentTyping() {
    if (isTyping && currentTypingElement) {
        skipTyping = true;
    }
}
async function showInventoryStatus() {
    const totalBottles = gameState.inventory.riverWaterBottles + gameState.inventory.filteredWaterBottles + gameState.inventory.emptyBottles;
    if (totalBottles > 0 || gameState.day > 1) {
        await typewriterText("=== Inventory Check ===", 60);
        await typewriterText(`Bottles with river water: ${gameState.inventory.riverWaterBottles}`, 40);
        await typewriterText(`Bottles with filtered water: ${gameState.inventory.filteredWaterBottles}`, 40);
        await typewriterText(`Empty bottles: ${gameState.inventory.emptyBottles}`, 40);
        await typewriterText(`Total money: ₹${gameState.money.toFixed(2)}`, 40);
        await sleep(1000);
    }
}
async function showProgressBar(message, duration = 3000) {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    progressContainer.innerHTML = `
        <div class="progress-message">${message}</div>
        <div class="progress-bar">
            <div class="progress-fill"></div>
        </div>
    `;
    storyTextElement.appendChild(progressContainer);
    const progressFill = progressContainer.querySelector('.progress-fill');
    // Animate the progress bar
    let progress = 0;
    const interval = 50;
    const increment = (interval / duration) * 100;
    return new Promise((resolve) => {
        const timer = setInterval(() => {
            progress += increment;
            progressFill.style.width = `${Math.min(progress, 100)}%`;
            if (progress >= 100) {
                clearInterval(timer);
                setTimeout(() => {
                    progressContainer.remove();
                    resolve();
                }, 500);
            }
        }, interval);
    });
}
// Game logic functions
async function startIntro() {
    await typewriterText("# Water Bottle Tycoon", 100);
    await sleep(1000);
    await typewriterText("You are a very poor person, and you somehow managed to get hold of some money (legally) and you want to make more money...", 40);
    await typewriterText("So you decide that you will sell water bottles.", 40);
    await typewriterText("But first, let me explain how this works:", 40);
    await typewriterText("• Empty bottles cost ₹0.50 each (50 paise)", 40);
    await typewriterText("• You need to fill them with water", 40);
    await typewriterText("• Filtered water costs ₹3 per bottle", 40);
    await typewriterText("• River water is free (but...)", 40);
    await sleep(1000);
    // Generate random starting money
    gameState.money = getRandomInt(MIN_STARTING_MONEY, MAX_STARTING_MONEY);
    gameState.day = 1;
    await typewriterText(`You wake up on Day ${gameState.day} and check your pocket...`, 40);
    await typewriterText(`You have ₹${gameState.money} with you!`, 40);
    gameState.currentStep = GameStep.BUY_BOTTLES;
    await askBuyBottles();
}
async function askBuyBottles() {
    const maxBottles = Math.floor(gameState.money / BOTTLE_COST);
    await typewriterText(`With ₹${gameState.money}, you can buy a maximum of ${maxBottles} empty bottles at ₹0.50 each.`, 40);
    await typewriterText("How many bottles do you want to buy?", 40);
    showInput(`Enter a number between 1 and ${maxBottles}`);
}
async function processBuyBottles(input) {
    const bottles = parseInt(input);
    const maxBottles = Math.floor(gameState.money / BOTTLE_COST);
    if (isNaN(bottles) || bottles < 1 || bottles > maxBottles) {
        await typewriterText(`Please enter a valid number between 1 and ${maxBottles}.`, 40);
        showInput(`Enter a number between 1 and ${maxBottles}`);
        return;
    }
    gameState.bottlesBought = bottles;
    gameState.money -= bottles * BOTTLE_COST;
    gameState.totalCost = bottles * BOTTLE_COST;
    hideInput();
    await typewriterText(`You bought ${bottles} empty bottles for ₹${(bottles * BOTTLE_COST).toFixed(2)}.`, 40);
    await typewriterText(`You have ₹${gameState.money.toFixed(2)} left.`, 40);
    gameState.currentStep = GameStep.CHOOSE_WATER;
    await askWaterChoice();
}
async function askWaterChoice() {
    await typewriterText("Now you need to fill the bottles with water.", 40);
    await typewriterText(`Option 1: Filtered water - ₹3 per bottle (Total: ₹${(gameState.bottlesBought * FILTERED_WATER_COST).toFixed(2)})`, 40);
    await typewriterText("Option 2: River water - Free (but you never know...)", 40);
    const canAffordFiltered = gameState.money >= gameState.bottlesBought * FILTERED_WATER_COST;
    if (!canAffordFiltered) {
        await typewriterText("⚠️ You don't have enough money for filtered water!", 40);
        await typewriterText("You'll have to use river water.", 40);
        await processWaterChoice('river');
        return;
    }
    await typewriterText("Which water do you choose?", 40);
    showInput("Type 'filtered'/'filter'/'1' or 'river'/'2'");
}
async function processWaterChoice(input) {
    const choice = input.toLowerCase().trim();
    
    // Check for filtered water options
    if (choice === 'filtered' || choice === 'filter' || choice === '1') {
        gameState.waterType = 'filtered';
    }
    // Check for river water options
    else if (choice === 'river' || choice === '2') {
        gameState.waterType = 'river';
    }
    // Invalid input
    else {
        await typewriterText("Please type ''filtered', 'filter', '1' for filtered water, or 'river', '2' for river water.'", 40);
        showInput("Type 'filtered'/'filter'/'1' or 'river'/'2'");
        return;
    }
    
    hideInput();
    if (gameState.waterType === 'filtered') {
        const waterCost = gameState.bottlesBought * FILTERED_WATER_COST;
        gameState.money -= waterCost;
        gameState.totalCost += waterCost;
        await typewriterText(`You chose filtered water and paid ₹${waterCost.toFixed(2)}.`, 40);
        gameState.inventory.filteredWaterBottles += gameState.bottlesBought;
    }
    else {
        gameState.riverWaterUsage++;
        await typewriterText("You chose river water - it's free!", 40);
        await typewriterText("You fill your bottles from the nearby river.", 40);
        gameState.inventory.riverWaterBottles += gameState.bottlesBought;
    }
    await typewriterText(`Money left: ₹${gameState.money.toFixed(2)}`, 40);
    gameState.currentStep = GameStep.GO_TO_STATION;
    await goToStation();
}
async function goToStation() {
    await typewriterText("Time to head to the railway station to sell your water bottles...", 40);
    await sleep(1500);
    await typewriterText("*Walking to the station...*", 60);
    await sleep(1500);
    await typewriterText("You arrive at the busy railway station with your water bottles.", 40);
    gameState.currentStep = GameStep.SET_PRICE;
    await askSellingPrice();
}
async function askSellingPrice() {
    const totalBottles = gameState.inventory.riverWaterBottles + gameState.inventory.filteredWaterBottles;
    await typewriterText(`You have ${totalBottles} bottles to sell.`, 40);
    if (gameState.inventory.riverWaterBottles > 0 && gameState.inventory.filteredWaterBottles > 0) {
        await typewriterText(`(${gameState.inventory.riverWaterBottles} with river water, ${gameState.inventory.filteredWaterBottles} with filtered water)`, 30);
    }
    await typewriterText("At what price do you want to sell each bottle?", 40);
    await typewriterText("(Remember: Higher prices = fewer sales, Lower prices = more sales)", 30);
    showInput("Enter price in ₹ (e.g., 2.5)");
}
async function processSellingPrice(input) {
    const price = parseFloat(input);
    if (isNaN(price) || price <= 0) {
        await typewriterText("Please enter a valid price greater than ₹0.", 40);
        showInput("Enter price in ₹ (e.g., 2.5)");
        return;
    }
    gameState.sellingPrice = price;
    hideInput();
    await typewriterText(`You set the price at ₹${price} per bottle.`, 40);
    await typewriterText("Time to start selling!", 40);
    gameState.currentStep = GameStep.SELLING;
    await startSelling();
}
async function startSelling() {
    await showProgressBar("Selling bottles...", 3000);
    await simulateSales();
}
async function simulateSales() {
    // Calculate total bottles available for sale
    const totalBottles = gameState.inventory.riverWaterBottles + gameState.inventory.filteredWaterBottles;
    // Calculate sales based on price
    let salesMultiplier;
    if (gameState.sellingPrice <= 1.5) {
        salesMultiplier = 0.9; // High sales
    }
    else if (gameState.sellingPrice <= 3) {
        salesMultiplier = 0.7; // Good sales
    }
    else if (gameState.sellingPrice <= 5) {
        salesMultiplier = 0.5; // Moderate sales
    }
    else if (gameState.sellingPrice <= 8) {
        salesMultiplier = 0.3; // Low sales
    }
    else {
        salesMultiplier = 0.1; // Very low sales
    }
    // River water penalty (hidden mechanic)
    if (gameState.waterType === 'river') {
        const penalty = Math.min(0.3, gameState.riverWaterUsage * 0.1); // Max 30% penalty
        salesMultiplier *= (1 - penalty);
    }
    // Add some randomness
    const randomFactor = 0.7 + Math.random() * 0.6; // 0.7 to 1.3
    const actualSalesRate = Math.min(1, salesMultiplier * randomFactor);
    const bottlesSold = Math.floor(totalBottles * actualSalesRate);
    const revenue = bottlesSold * gameState.sellingPrice;
    const profit = revenue - gameState.totalCost;
    // Update inventory by removing sold bottles (prioritize river water first)
    let remainingSold = bottlesSold;
    if (remainingSold > 0 && gameState.inventory.riverWaterBottles > 0) {
        const riverSold = Math.min(remainingSold, gameState.inventory.riverWaterBottles);
        gameState.inventory.riverWaterBottles -= riverSold;
        remainingSold -= riverSold;
    }
    if (remainingSold > 0 && gameState.inventory.filteredWaterBottles > 0) {
        const filteredSold = Math.min(remainingSold, gameState.inventory.filteredWaterBottles);
        gameState.inventory.filteredWaterBottles -= filteredSold;
    }
    // Update game state
    gameState.money += revenue;
    gameState.totalProfit += profit;
    
    // Track consecutive profit/loss days
    if (profit > 0) {
        gameState.consecutiveProfitDays++;
        gameState.consecutiveLossDays = 0;
    } else if (profit < 0) {
        gameState.consecutiveLossDays++;
        gameState.consecutiveProfitDays = 0;
    } else {
        // Break-even resets both counters
        gameState.consecutiveProfitDays = 0;
        gameState.consecutiveLossDays = 0;
    }
    
    gameState.currentStep = GameStep.DAY_RESULTS;
    await showDayResults(bottlesSold, revenue, profit);
}
async function showDayResults(bottlesSold, revenue, profit) {
    await typewriterText("=== End of Day Results ===", 40);
    await typewriterText(`Bottles sold: ${bottlesSold} out of ${gameState.bottlesBought}`, 40);
    await typewriterText(`Revenue earned: ₹${revenue.toFixed(2)}`, 40);
    await typewriterText(`Total cost: ₹${gameState.totalCost.toFixed(2)}`, 40);
    // Create profit/loss display with colors
    const profitElement = document.createElement('div');
    profitElement.className = 'story-paragraph';
    if (profit > 0) {
        profitElement.innerHTML = `<span class="profit">✓ Profit: ₹${profit.toFixed(2)}</span>`;
    }
    else if (profit < 0) {
        profitElement.innerHTML = `<span class="loss">✗ Loss: ₹${Math.abs(profit).toFixed(2)}</span>`;
    }
    else {
        profitElement.innerHTML = `<span class="neutral">➤ Break-even: ₹0</span>`;
    }
    storyTextElement.appendChild(profitElement);
    await sleep(1000);
    await typewriterText(`Money in pocket: ₹${gameState.money.toFixed(2)}`, 40);
    await typewriterText(`Total profit so far: ₹${gameState.totalProfit.toFixed(2)}`, 40);
    const remainingBottles = gameState.inventory.riverWaterBottles + gameState.inventory.filteredWaterBottles;
    if (remainingBottles > 0) {
        await typewriterText(`Unsold bottles: ${remainingBottles}`, 40);
        await typewriterText(`(${gameState.inventory.riverWaterBottles} river water, ${gameState.inventory.filteredWaterBottles} filtered water)`, 30);
    }
    gameState.currentStep = GameStep.NEXT_DAY;
    await askNextDay();
}
async function askNextDay() {
    await sleep(2000);
    await typewriterText("Would you like to continue to the next day?", 40);
    
    // Only show the "kind savior" message for day 1 (going to day 2)
    if (gameState.day === 1) {
        await typewriterText("(You'll get some extra money from a kind savior + your current money)", 30);
    }
    
    showInput("Type 'yes' to continue or 'no' to end");
}
async function processNextDay(input) {
    const answer = input.toLowerCase().trim();
    if (answer === 'yes' || answer === 'y') {
        hideInput();
        clearStory();
        // Start new day
        gameState.day++;
        
        // Dynamic bonus money based on performance
        let bonusMoney = 0;
        let bonusMessage = '';
        
        if (gameState.consecutiveProfitDays >= 5) {
            // Stop giving money after 5 consecutive profitable days
            bonusMoney = 0;
            bonusMessage = 'You\'re doing well on your own now! No extra help today.';
        } else if (gameState.consecutiveLossDays >= 3) {
            // Increased help for struggling players
            bonusMoney = getRandomInt(20, 35);
            bonusMessage = `A concerned stranger sees your struggles and gives you ₹${bonusMoney} to help!`;
        } else if (gameState.consecutiveLossDays >= 1) {
            // Moderate help for some losses
            bonusMoney = getRandomInt(10, 20);
            bonusMessage = `A kind stranger gives you ₹${bonusMoney} to help with your business!`;
        } else {
            // Normal help
            bonusMoney = getRandomInt(3, 15);
            bonusMessage = `A kind stranger gives you ₹${bonusMoney} to help with your business!`;
        }
        
        gameState.money += bonusMoney;
        
        // Reset day-specific values but keep inventory
        gameState.bottlesBought = 0;
        gameState.sellingPrice = 0;
        gameState.waterType = '';
        gameState.totalCost = 0;
        
        await typewriterText(`=== Day ${gameState.day} ===`, 80);
        if (bonusMoney > 0) {
            await typewriterText(bonusMessage, 40);
        } else {
            await typewriterText(bonusMessage, 40);
        }
        // Show inventory status from Day 2 onwards
        if (gameState.day >= 2) {
            await showInventoryStatus();
        }
        gameState.currentStep = GameStep.BUY_BOTTLES;
        await askBuyBottles();
    }
    else if (answer === 'no' || answer === 'n') {
        hideInput();
        await endGame();
    }
    else {
        await typewriterText("Please type 'yes' or 'no'.", 40);
        showInput("Type 'yes' to continue or 'no' to end");
    }
}
async function endGame() {
    await typewriterText("=== Game Over ===", 80);
    await typewriterText(`You played for ${gameState.day} day(s).`, 40);
    await typewriterText(`Final money: ₹${gameState.money.toFixed(2)}`, 40);
    await typewriterText(`Total profit earned: ₹${gameState.totalProfit.toFixed(2)}`, 40);
    if (gameState.riverWaterUsage > 0) {
        await typewriterText(`You used river water ${gameState.riverWaterUsage} time(s). This may have affected your sales...`, 40);
    }
    if (gameState.totalProfit > 0) {
        await typewriterText("Congratulations! You're a successful water bottle entrepreneur!", 40);
    }
    else if (gameState.totalProfit < 0) {
        await typewriterText("Better luck next time! Business can be tough.", 40);
    }
    else {
        await typewriterText("You broke even! Not bad for a beginner.", 40);
    }
    await sleep(3000);
    await typewriterText("Refresh the page to play again!", 40);
}
// Event handlers
function handleSubmit() {
    const input = userInput.value.trim();
    if (!input)
        return;
    switch (gameState.currentStep) {
        case GameStep.BUY_BOTTLES:
            processBuyBottles(input);
            break;
        case GameStep.CHOOSE_WATER:
            processWaterChoice(input);
            break;
        case GameStep.SET_PRICE:
            processSellingPrice(input);
            break;
        case GameStep.NEXT_DAY:
            processNextDay(input);
            break;
    }
}
// Initialize game
function initGame() {
    storyTextElement = document.getElementById('story-text');
    inputSection = document.getElementById('input-section');
    userInput = document.getElementById('user-input');
    submitButton = document.getElementById('submit-button');
    // Event listeners
    submitButton.addEventListener('click', handleSubmit);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    });
    // Right-click to skip typing animation
    document.addEventListener('contextmenu', (e) => {
        if (isTyping) {
            e.preventDefault(); // Prevent context menu from showing
            skipCurrentTyping();
        }
    });
    // Spacebar to skip typing animation
    document.addEventListener('keydown', (e) => {
        if (isTyping && e.code === 'Space' && e.target !== userInput) {
            e.preventDefault(); // Prevent page scroll
            skipCurrentTyping();
        }
    });
    // Also allow left-click to skip (optional)
    document.addEventListener('click', (e) => {
        if (isTyping && e.target !== userInput && e.target !== submitButton) {
            skipCurrentTyping();
        }
    });
    // Start the game
    startIntro();
}
// Start game when page loads
window.addEventListener('DOMContentLoaded', initGame);
