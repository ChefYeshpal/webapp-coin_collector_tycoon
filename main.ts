// Game constants
const BOTTLE_COST = 0.5; // Cost of empty bottle in INR (50 paise)
const FILTERED_WATER_COST = 3; // Cost of filtered water per bottle in INR
const RIVER_WATER_COST = 0; // Cost of river water (free)
const MIN_STARTING_MONEY = 5;
const MAX_STARTING_MONEY = 50;

// Game state
interface GameState {
    day: number;
    money: number;
    totalProfit: number;
    inventory: number;
    currentStep: string;
    bottlesBought: number;
    sellingPrice: number;
    waterType: 'filtered' | 'river' | '';
    riverWaterUsage: number; // Track how many times river water was used
    totalCost: number;
}

let gameState: GameState = {
    day: 1,
    money: 0,
    totalProfit: 0,
    inventory: 0,
    currentStep: 'intro',
    bottlesBought: 0,
    sellingPrice: 0
};

// DOM elements
let storyTextElement: HTMLElement;
let inputSection: HTMLElement;
let userInput: HTMLInputElement;
let submitButton: HTMLElement;

// Game flow steps
enum GameStep {
    INTRO = 'intro',
    BUY_BOTTLES = 'buy_bottles',
    GO_TO_STATION = 'go_to_station',
    SET_PRICE = 'set_price',
    DAY_RESULTS = 'day_results',
    NEXT_DAY = 'next_day'
}

// Utility functions
function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function typewriterText(text: string, speed: number = 50): Promise<void> {
    const paragraph = document.createElement('div');
    paragraph.className = 'story-paragraph';
    storyTextElement.appendChild(paragraph);
    
    await sleep(500); // Pause before typing
    
    for (let i = 0; i <= text.length; i++) {
        paragraph.textContent = text.slice(0, i);
        await sleep(speed);
    }
    
    await sleep(800); // Pause after typing
}

async function showText(text: string): Promise<void> {
    const paragraph = document.createElement('div');
    paragraph.className = 'story-paragraph';
    paragraph.textContent = text;
    storyTextElement.appendChild(paragraph);
    await sleep(1000);
}

function showInput(placeholder: string = "Type your answer..."): void {
    userInput.placeholder = placeholder;
    userInput.value = '';
    inputSection.classList.remove('hidden');
    userInput.focus();
}

function hideInput(): void {
    inputSection.classList.add('hidden');
}

function clearStory(): void {
    storyTextElement.innerHTML = '';
}

// Game logic functions
async function startIntro(): Promise<void> {
    await typewriterText("# Water Bottle Tycoon", 100);
    await sleep(1000);
    
    await typewriterText("You are a very poor person, and you somehow managed to get hold of some money (legally) and you want to make more money...", 40);
    
    await typewriterText("So you decide that you will sell water bottles.", 40);
    
    await typewriterText("When you check the price of one empty water bottle, you get to know that it costs ₹1.", 40);
    
    await sleep(1000);
    
    // Generate random starting money
    gameState.money = getRandomInt(MIN_STARTING_MONEY, MAX_STARTING_MONEY);
    gameState.day = 1;
    
    await typewriterText(`You wake up on Day ${gameState.day} and check your pocket...`, 40);
    await typewriterText(`You have ₹${gameState.money} with you!`, 40);
    
    gameState.currentStep = GameStep.BUY_BOTTLES;
    await askBuyBottles();
}

async function askBuyBottles(): Promise<void> {
    const maxBottles = Math.floor(gameState.money / BOTTLE_COST);
    
    await typewriterText(`With ₹${gameState.money}, you can buy a maximum of ${maxBottles} empty bottles.`, 40);
    await typewriterText("How many bottles do you want to buy?", 40);
    
    showInput(`Enter a number between 1 and ${maxBottles}`);
}

async function processBuyBottles(input: string): Promise<void> {
    const bottles = parseInt(input);
    const maxBottles = Math.floor(gameState.money / BOTTLE_COST);
    
    if (isNaN(bottles) || bottles < 1 || bottles > maxBottles) {
        await typewriterText(`Please enter a valid number between 1 and ${maxBottles}.`, 40);
        showInput(`Enter a number between 1 and ${maxBottles}`);
        return;
    }
    
    gameState.bottlesBought = bottles;
    gameState.money -= bottles * BOTTLE_COST;
    gameState.inventory = bottles;
    
    hideInput();
    
    await typewriterText(`You bought ${bottles} empty bottles for ₹${bottles * BOTTLE_COST}.`, 40);
    await typewriterText(`You have ₹${gameState.money} left in your pocket.`, 40);
    
    gameState.currentStep = GameStep.GO_TO_STATION;
    await goToStation();
}

async function goToStation(): Promise<void> {
    await typewriterText("You fill the bottles with water and head to the railway station...", 40);
    await sleep(1500);
    await typewriterText("*Time passes...*", 60);
    await sleep(1500);
    await typewriterText("You arrive at the busy railway station with your water bottles.", 40);
    
    gameState.currentStep = GameStep.SET_PRICE;
    await askSellingPrice();
}

async function askSellingPrice(): Promise<void> {
    await typewriterText(`You have ${gameState.inventory} bottles to sell.`, 40);
    await typewriterText("At what price do you want to sell each bottle?", 40);
    await typewriterText("(Remember: Higher prices = fewer sales, Lower prices = more sales)", 30);
    
    showInput("Enter price in ₹ (e.g., 2.5)");
}

async function processSellingPrice(input: string): Promise<void> {
    const price = parseFloat(input);
    
    if (isNaN(price) || price <= 0) {
        await typewriterText("Please enter a valid price greater than ₹0.", 40);
        showInput("Enter price in ₹ (e.g., 2.5)");
        return;
    }
    
    gameState.sellingPrice = price;
    hideInput();
    
    await typewriterText(`You set the price at ₹${price} per bottle.`, 40);
    
    gameState.currentStep = GameStep.DAY_RESULTS;
    await simulateSales();
}

async function simulateSales(): Promise<void> {
    await typewriterText("You start selling your bottles...", 40);
    await sleep(2000);
    await typewriterText("*Time passes as customers come and go...*", 60);
    await sleep(2000);
    
    // Calculate sales based on price
    let salesMultiplier: number;
    if (gameState.sellingPrice <= 1.5) {
        salesMultiplier = 0.9; // High sales
    } else if (gameState.sellingPrice <= 3) {
        salesMultiplier = 0.7; // Good sales
    } else if (gameState.sellingPrice <= 5) {
        salesMultiplier = 0.5; // Moderate sales
    } else if (gameState.sellingPrice <= 8) {
        salesMultiplier = 0.3; // Low sales
    } else {
        salesMultiplier = 0.1; // Very low sales
    }
    
    // Add some randomness
    const randomFactor = 0.7 + Math.random() * 0.6; // 0.7 to 1.3
    const actualSalesRate = Math.min(1, salesMultiplier * randomFactor);
    
    const bottlesSold = Math.floor(gameState.inventory * actualSalesRate);
    const revenue = bottlesSold * gameState.sellingPrice;
    const cost = gameState.bottlesBought * BOTTLE_COST;
    const profit = revenue - cost;
    
    // Update game state
    gameState.inventory -= bottlesSold;
    gameState.money += revenue;
    gameState.totalProfit += profit;
    
    await showDayResults(bottlesSold, revenue, cost, profit);
}

async function showDayResults(bottlesSold: number, revenue: number, cost: number, profit: number): Promise<void> {
    await typewriterText("=== End of Day Results ===", 40);
    await typewriterText(`Bottles sold: ${bottlesSold} out of ${gameState.bottlesBought}`, 40);
    await typewriterText(`Revenue earned: ₹${revenue.toFixed(2)}`, 40);
    await typewriterText(`Total cost: ₹${cost.toFixed(2)}`, 40);
    
    if (profit > 0) {
        await typewriterText(`✓ Profit: ₹${profit.toFixed(2)}`, 40);
    } else if (profit < 0) {
        await typewriterText(`✗ Loss: ₹${Math.abs(profit).toFixed(2)}`, 40);
    } else {
        await typewriterText(`➤ Break-even: ₹0`, 40);
    }
    
    await typewriterText(`Money in pocket: ₹${gameState.money.toFixed(2)}`, 40);
    await typewriterText(`Total profit so far: ₹${gameState.totalProfit.toFixed(2)}`, 40);
    
    if (gameState.inventory > 0) {
        await typewriterText(`Unsold bottles: ${gameState.inventory}`, 40);
    }
    
    gameState.currentStep = GameStep.NEXT_DAY;
    await askNextDay();
}

async function askNextDay(): Promise<void> {
    await sleep(2000);
    await typewriterText("Would you like to continue to the next day?", 40);
    await typewriterText("(You'll get some extra money + your current profits)", 30);
    
    showInput("Type 'yes' to continue or 'no' to end");
}

async function processNextDay(input: string): Promise<void> {
    const answer = input.toLowerCase().trim();
    
    if (answer === 'yes' || answer === 'y') {
        hideInput();
        clearStory();
        
        // Start new day
        gameState.day++;
        const bonusMoney = getRandomInt(3, 15);
        gameState.money += bonusMoney;
        
        await typewriterText(`=== Day ${gameState.day} ===`, 80);
        await typewriterText(`You wake up refreshed and find ₹${bonusMoney} extra money!`, 40);
        await typewriterText(`Current money: ₹${gameState.money.toFixed(2)}`, 40);
        
        gameState.currentStep = GameStep.BUY_BOTTLES;
        await askBuyBottles();
    } else if (answer === 'no' || answer === 'n') {
        hideInput();
        await endGame();
    } else {
        await typewriterText("Please type 'yes' or 'no'.", 40);
        showInput("Type 'yes' to continue or 'no' to end");
    }
}

async function endGame(): Promise<void> {
    await typewriterText("=== Game Over ===", 80);
    await typewriterText(`You played for ${gameState.day} day(s).`, 40);
    await typewriterText(`Final money: ₹${gameState.money.toFixed(2)}`, 40);
    await typewriterText(`Total profit earned: ₹${gameState.totalProfit.toFixed(2)}`, 40);
    
    if (gameState.totalProfit > 0) {
        await typewriterText("Congratulations! You're a successful water bottle entrepreneur!", 40);
    } else if (gameState.totalProfit < 0) {
        await typewriterText("Better luck next time! Business can be tough.", 40);
    } else {
        await typewriterText("You broke even! Not bad for a beginner.", 40);
    }
    
    await sleep(3000);
    await typewriterText("Refresh the page to play again!", 40);
}

// Event handlers
function handleSubmit(): void {
    const input = userInput.value.trim();
    if (!input) return;
    
    switch (gameState.currentStep) {
        case GameStep.BUY_BOTTLES:
            processBuyBottles(input);
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
function initGame(): void {
    storyTextElement = document.getElementById('story-text')!;
    inputSection = document.getElementById('input-section')!;
    userInput = document.getElementById('user-input') as HTMLInputElement;
    submitButton = document.getElementById('submit-button')!;
    
    // Event listeners
    submitButton.addEventListener('click', handleSubmit);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    });
    
    // Start the game
    startIntro();
}

// Start game when page loads
window.addEventListener('DOMContentLoaded', initGame);