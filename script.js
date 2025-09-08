// Gameboard IIFE function
const Gameboard = (function() {

    // 1D private array
    let board = ["", "", "", "", "", "", "", "", ""];

    // return the board array
    function getBoard() {
        return [...board];
    };

    // puts "X" or "O" at a given spot if it is empty
    // checks first if there is a 'mark' already in the index
    // if none then put the mark in the index and return true
    // if there is, return false
    function setMark(index, mark) {
        if (board[index] === "") {
            board[index] = mark;
            return true;
        }
        return false;
    };

    // empty out the board
    function resetBoard() {
        board = ["", "", "", "", "", "", "", "", ""];
    };


    return {getBoard, setMark, resetBoard};

})();


// Player Factory Function
function Player(name, mark){

    const playerName = name;
    const playerMark = mark;

    const getName = () => playerName;
    const getMark = () => playerMark;

    return { getName, getMark };

}

// Game Controller AKA the Main Function 
const GameController = (function() {

    // players hardcoded for now
    const player1 = Player("Player 1", "X");
    const player2 = Player("Player 2", "O");

    // player 1 gets first turn
    let activePlayer = player1;

    // switch players every turn
    function switchPlayer() {
        activePlayer = (activePlayer === player1) ? player2 : player1;
    }

    // logic to check rows for winning combinations
    function checkRows(boardArr) {
        // i = 0, 3, 6 -> the three rows
        for (let i = 0; i < 9; i += 3) {
            const a = boardArr[i];
            if (a !== "" && a === boardArr[i + 1] && a === boardArr[i + 2]) {
                return a;
            }
        }
        // no row win
        return null 
    }
    
    // logic to check each col for winning combinations
    function checkCols(boardArr) {
        // i = 0, 1, 2 -> the three columns
        for (let i = 0; i < 3; i++) {
            const a = boardArr[i];
            if (a !== "" && a === boardArr[i + 3] && a === boardArr[i + 6]) {
                return a;
            }
        }
        // no column win
        return null;
    } 

    // logic to check diagonals for winning combinations
    function checkDiagonals(boardArr) {

        // left to right diagonal
        if (boardArr[0] !== "" && boardArr[0] === boardArr[4] && boardArr[0] === boardArr[8]) {
            return boardArr[0];
        }

        // right to left diagonal
        if (boardArr[2] !== "" && boardArr[2] === boardArr[4] && boardArr[2] === boardArr[6]) {
            return boardArr[2];
        }
        // no diagonal win
        return null; 
    }

    // tie detection logic
    function checkTie(boardArr) {
        
        if (!boardArr.includes("")) {
            return true;
        }
        return false
    }

    // put all the check functions into one logic; declaring the winner
    function checkWinner(boardArr) {

        const rowWinner = checkRows(boardArr);
        if (rowWinner) return rowWinner;

        const colWinner = checkCols(boardArr);
        if (colWinner) return colWinner;

        const diagWinner = checkDiagonals(boardArr);
        if (diagWinner) return diagWinner;

        if (checkTie(boardArr)) return "tie";

        return null; // if there are no winner yet, keep going

    }

    // play a round
    function playRound(index) {
    if (Gameboard.setMark(index, activePlayer.getMark())) {
        console.log(`${activePlayer.getName()} placed ${activePlayer.getMark()} at position ${index}`);

        // Check if the game ended
        const winner = checkWinner(Gameboard.getBoard());
        if (winner) {
            if (winner === "tie") {
                console.log("It's a tie!");
            } else {
                console.log(`${winner} wins!`);
            }
            return winner; // return result so external code can use it
        }

        // If no winner yet, switch players
        switchPlayer();
        return null; // keep going
        } else {
            console.log("Spot already taken! Try again.");
            return null;
        }
    }

    // get the active player
    function getActivePlayer() {
        return activePlayer;
    }

    // reset the board
    function resetGame() {
        Gameboard.resetBoard();
        activePlayer = player1;
    }


    // return all the necessary methods
    return {
    playRound,
    getActivePlayer,
    resetGame,
    checkRows,
    checkCols,
    checkDiagonals,
    checkTie,
    checkWinner
    };


})();

// === UI Controller ===
const DisplayController = (function () {
    const cells = document.querySelectorAll(".cell");
    const message = document.querySelector(".message");
    const resetBtn = document.getElementById("resetBtn");

    // Render board to the DOM
    function renderBoard(board) {
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
            cell.classList.remove("x", "o", "winner"); // reset styles
            if (board[index] === "X") cell.classList.add("x");
            if (board[index] === "O") cell.classList.add("o");
        });
    }

    // Update the message text
    function setMessage(text, type = "") {
        message.textContent = text;
        message.className = `message ${type}`;
    }

    // Highlight winning cells
    function highlightWinners(indices) {
        indices.forEach(i => cells[i].classList.add("winner"));
    }

    // Bind events
    function bindEvents(game) {
        cells.forEach((cell, index) => {
            cell.addEventListener("click", () => {
                if (!game.playRound(index)) return; // invalid move
                renderBoard(game.getBoard());
                setMessage(`Player ${game.getActivePlayer().getName()}'s Turn`);
                if (game.isGameOver()) {
                    const winner = game.getWinner();
                    if (winner) {
                        setMessage(`${winner.getName()} Wins! 🎉`, "win");
                        highlightWinners(game.getWinningIndices());
                    } else {
                        setMessage("It's a Tie!", "tie");
                    }
                }
            });
        });

        resetBtn.addEventListener("click", () => {
            game.resetGame();
            renderBoard(game.getBoard());
            setMessage(`Player ${game.getActivePlayer().getName()}'s Turn`);
        });
    }

    return { renderBoard, setMessage, bindEvents, highlightWinners };
})();


// <--- HELPER FUNCTION FOR TESTING --->
function printBoard(board) {
    let display = "";
    for (let i = 0; i < 9; i += 3) {
        display += board.slice(i, i + 3).map(cell => cell || "-").join(" | ") + "\n";
    }
    console.log(display);
}

// <--- TESTS --->

console.group("Placing Mark Tests");
console.log(Gameboard.getBoard()); 
console.log("Active Player:", GameController.getActivePlayer().getName());

let result = GameController.playRound(0); // Player 1 places "X"
console.log(Gameboard.getBoard());
console.log("Next Player:", GameController.getActivePlayer().getName());
console.log("Result:", result);

result = GameController.playRound(1); // Player 2 places "O"
console.log(Gameboard.getBoard());
console.log("Next Player:", GameController.getActivePlayer().getName());
console.log("Result:", result);

result = GameController.playRound(0); // Try overwriting index 0
console.log(Gameboard.getBoard());
console.log("Result:", result);
console.groupEnd();


console.group("Reset Tests");
GameController.resetGame();
console.log(Gameboard.getBoard()); 
console.log("Active Player after reset:", GameController.getActivePlayer().getName());
console.groupEnd();


console.group("Row Check Test");
GameController.resetGame();
GameController.playRound(0); // X
GameController.playRound(3); // O
GameController.playRound(1); // X
GameController.playRound(4); // O
result = GameController.playRound(2); // X wins row
console.log("Winner should be 'X':", result);
console.log("Board state:", Gameboard.getBoard());
console.groupEnd();


console.group("Column Check Test");
GameController.resetGame();
GameController.playRound(0); // X
GameController.playRound(1); // O
GameController.playRound(3); // X
GameController.playRound(2); // O
result = GameController.playRound(6); // X wins column
console.log("Winner should be 'X':", result);
console.log("Board state:", Gameboard.getBoard());
console.groupEnd();


console.group("Diagonal Check Test (0,4,8)");
GameController.resetGame();
GameController.playRound(0); // X
GameController.playRound(1); // O
GameController.playRound(4); // X
GameController.playRound(2); // O
result = GameController.playRound(8); // X wins diagonal
console.log("Winner should be 'X':", result);
console.log("Board state:", Gameboard.getBoard());
console.groupEnd();

console.group("Diagonal Check Test (2,4,6)");
GameController.resetGame();
GameController.playRound(2); // X
GameController.playRound(0); // O
GameController.playRound(4); // X
GameController.playRound(1); // O
result = GameController.playRound(6); // X wins diagonal
console.log("Winner should be 'X':", result);
console.log("Board state:", Gameboard.getBoard());
console.groupEnd();


console.group("Tie Check Test");
GameController.resetGame();
const tieMoves = [0,1,2,4,3,5,6,8,7]; 
let tieResult;
tieMoves.forEach(index => {
    tieResult = GameController.playRound(index);
});
console.log("Should be 'tie':", tieResult);
console.log("Board state:", Gameboard.getBoard());
console.groupEnd();

// === Bootstrapping ===
const game = GameController(Player("Player 1", "X"), Player("Player 2", "O"));
DisplayController.renderBoard(game.getBoard());
DisplayController.setMessage(`Player ${game.getActivePlayer().getName()}'s Turn`);
DisplayController.bindEvents(game);