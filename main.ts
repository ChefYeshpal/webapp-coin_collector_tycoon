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
}