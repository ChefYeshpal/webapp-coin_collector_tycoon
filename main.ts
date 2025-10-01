// Costs
const bottle_cost = 0.2;
const filter_cost = 0.08;
const transport_cost = 40;
const cost_per_bottle = bottle_cost + filter_cost;

// Globals for day
let moneyToday: number;
let maxBottles: number;

// Helper: to get random integer from a min and max number
function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Initilise day and max bottles info
function startDay() {
    moneyToday = getRandomInt(3, 50);
    maxBottles = Math.floor(moneyToday / bottle_cost);

    const moneyTodayE1 = document.getElementById("money-today")!;
    moneyTodayE1.textContent = `You have ₹${moneyToday} today.`;

    const maxInfoE1 = document.getElementById("max-bottles-info")!;
    maxInfoE1.textContent = `You can buy a maximum of ${maxBottles} bottles.`;

    // Reset inputs and results
    (document.getElementById("bottles-made") as HTMLInputElement).value = "";
    (document.getElementById("selling-price") as HTMLInputElement).value = "";
    hideResults();
}

// Show results container
function showResults() {
    document.getElementById("results")!.classList.remove("hidden");
}

// Hide results container
function hideResults() {
    document.getElementById("results")!.classList.add("hidden");
}

// Run simulation on button click
function runSimulation() {
    const bottlesMadeInput = document.getElementById("bottles-made") as HTMLInputElement;
    const sellingPriceInput = document.getElementById("selling-price") as HTMLInputElement

    const bottlesMade = parseInt(bottlesMadeInput.value);
    const sellingPrice = parseFloat(sellingPriceInput.value);

    if (isNaN(bottlesMade) || bottlesMade <= 0) {
        alert("Please enter a valid number of bottles made (>0)");
        return;
    }

    if (bottlesMade > maxBottles) {
        alert (`You cannot make more than ${maxBottles} bottles today.`);
        return;
    }

    if (isNaN(sellingPrice) || sellingPrice <= 2) {
        alert("Please enter a selling price greater than ₹2");
        return;
    }

    // Randomly determine how many bottles are sold (0 to bottlesMade)
    const bottlesSold = getRandomInt(0, bottlesMade);

    // Calculate inventory leftover
    const inventory = bottlesMade - bottlesSold;

    // Calculate money earned
    const moneyBox = bottlesSold * sellingPrice;

    // Calculate profit or loss
    // Cost per bottle includes bottle + filter cost
    // Transportation cost not yet included
    const costPerBottle = cost_per_bottle;
    const totalCost = bottlesMade * costPerBottle + transport_cost;

    const profitOrLoss = moneyBox - totalCost;
    const profitOrLossPercent = (profitOrLoss / totalCost) * 100;

    // Show results on the page
    document.getElementById("bottles-made-result")!.textContent = `You made ${bottlesMade} bottles.`;
    (document.getElementById("bottles-sold-result")!).textContent =
        bottlesSold === 1 ? `You sold 1 bottle.` : `You sold ${bottlesSold} bottles.`;
    (document.getElementById("inventory-result")!).textContent = `Inventory leftover: ${inventory} bottle(s).`;
    (document.getElementById("money-box-result")!).textContent = `Money box has ₹${moneyBox.toFixed(2)} INR.`;

    if (profitOrLoss > 0) {
        (document.getElementById("profit-loss-result")!).textContent = `You made a profit of ₹${profitOrLoss.toFixed(2)} (${profitOrLossPercent.toFixed(2)}%).`;
        (document.getElementById("profit-loss-result")!).style.color = "green";
    } else if (profitOrLoss < 0) {
        (document.getElementById("profit-loss-result")!).textContent = `You had a loss of ₹${(-profitOrLoss).toFixed(2)} (${profitOrLossPercent.toFixed(2)}%).`;
        (document.getElementById("profit-loss-result")!).style.color = "red";
    } else {
        (document.getElementById("profit-loss-result")!).textContent = "You broke even with no profit or loss.";
        (document.getElementById("profit-loss-result")!).style.color = "black";
    }

    showResults();
}

// Setup event listeners after pade loades
window.onload = () => {
    startDay();

    document.getElementById("start-day")!.addEventListener("click", () => {
        runSimulation();
    });
};