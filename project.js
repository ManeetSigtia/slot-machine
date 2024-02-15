// 1. Deposit some money
// 2. Determine number of lines to bet on
// 3. Collect a bet amount
// 4. Spin the slot machine
// 5. Check if the user won
// 6. Give the user their money
// 7. Repeat

const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    A: 2,
    B: 4, 
    C: 6,
    D: 8
}

const SYMBOL_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2
}

/**
 * Function to prompt the user to enter a deposit amount.
 * @returns {number} The deposit amount entered by the user.
 */
const deposit = () => {
    while (true) {
        const depositAmount = prompt("Enter a deposit amount: ");
        const numberDepositAmount = parseFloat(depositAmount);

        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log("Invalid deposit amount, try again.")
        } else {
            return numberDepositAmount;
        }
    }
}

/**
 * Function to prompt the user to enter the number of lines to bet on.
 * @returns {number} The number of lines to bet on entered by the user.
 */
const getNumberOfLines = () => {
    while (true) {
        const lines = prompt("Enter the number of lines to bet on (1-3): ");
        const numberOfLines = parseFloat(lines);

        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log("Invalid number of lines, try again.")
        } else {
            return numberOfLines;
        }
    }
}

/**
 * Function to prompt the user to enter the bet per line.
 * @param {number} balance - The current balance of the player.
 * @param {number} lines - The number of lines the player is betting on.
 * @returns {number} The bet per line entered by the user.
 */
const getBet = (balance, lines) => {
    while (true) {
        const bet = prompt("Enter the bet per line: ");
        const numberBet = parseFloat(bet);

        if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
            console.log("Invalid bet, try again.")
        } else {
            return numberBet;
        }
    }
}

/**
 * Function to simulate the spinning of the reels.
 * @returns {string[][]} An array representing the symbols on the reels after spinning.
 */
const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }

    return reels;
}

/**
 * Function to transpose the reels array.
 * @param {string[][]} reels - An array representing the symbols on the reels.
 * @returns {string[][]} An array representing the symbols on the reels after transposing.
 */
const transpose = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }

    return rows;
}

/**
 * Function to print the rows of symbols.
 * @param {string[][]} rows - An array representing the rows of symbols.
 */
const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol;
            if (i != row.length - 1) {
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
}

/**
 * Function to calculate the player's winnings.
 * @param {string[][]} rows - An array representing the rows of symbols.
 * @param {number} bet - The bet per line.
 * @param {number} lines - The number of lines the player bet on.
 * @returns {number} The total winnings of the player.
 */
const getWinnings = (rows, bet, lines) => {
    let winnings = 0;
    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }

        if (allSame) {
            winnings += bet * SYMBOL_VALUES[symbols[0]];
        }
    }

    return winnings;
}

/**
 * Function to start the game.
 */
const game = () => {
    let balance = deposit();

    while (true) {
        console.log("You have a balance of $" + balance)
        const numberOfLines = getNumberOfLines();
        const bet = getBet(balance, numberOfLines);
        balance -= bet * numberOfLines;
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows, bet, numberOfLines);
        balance += winnings;
        console.log("You won, $ " + winnings.toString());

        if (balance <= 0) {
            console.log("You ran out of money");
            break;
        }

        const playAgain = prompt("Do you want to play again? (y/n)");

        if (playAgain!= "y") {
            break;
        }
    }
}

game();
