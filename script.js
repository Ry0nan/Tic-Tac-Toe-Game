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

    // logic to check rows
    function checkRows(boardArr) {
        // i = 0, 3, 6 -> the three rows
        for (let i = 0; i < 9; i += 3) {
            const a = boardArr[i];
            if (a !== "" && a === boardArr[i + 1] && a === boardArr[i + 2]) {
                return a;
            }
        }
        return null // no row won
    } 

    // play a round
    function playRound(index) {
        if (Gameboard.setMark(index, activePlayer.getMark())) {
            console.log(`${activePlayer.getName()} placed 
            ${activePlayer.getMark()} 
            at position ${index}`);

            switchPlayer();
        } else {
            console.log("Spot already taken! Try again.");
        }
    }

    // get the Active Player
    function getActivePlayer() {
        return activePlayer;
    }

    // reset the board/game
    function resetGame() {
        Gameboard.resetBoard();
        activePlayer = player1;
    }

    // return all the necessary methods
    return {playRound, getActivePlayer,resetGame,checkRows}

})();


// <--- TESTS --->

// <--- Placing Mark Tests --->

console.log(Gameboard.getBoard()); 
console.log("Active Player:", GameController.getActivePlayer().getName());

// Player 1 places "X" at index 0
GameController.playRound(0);
console.log(Gameboard.getBoard());
console.log("Next Player:", GameController.getActivePlayer().getName());

// Player 2 places "O" at index 1
GameController.playRound(1);
console.log(Gameboard.getBoard());
console.log("Next Player:", GameController.getActivePlayer().getName());

// Try overwriting index 0 (should fail)
GameController.playRound(0);
console.log(Gameboard.getBoard());

// <--- Reset Tests --->
console.log("Resetting the game...");
GameController.resetGame();
console.log(Gameboard.getBoard()); // should be ["", "", "", "", "", "", "", "", ""]
console.log("Active Player after reset:", GameController.getActivePlayer().getName()); // should be Player 1

// -------- ROW CHECK TEST --------
console.log("\n--- Row Check Test ---");
GameController.resetGame();
// Sequence: X at 0, O at 3, X at 1, O at 4, X at 2 → X wins top row
GameController.playRound(0);
GameController.playRound(3);
GameController.playRound(1);
GameController.playRound(4);
GameController.playRound(2);

const rowWinner = GameController.checkRows(Gameboard.getBoard());
console.log("Row winner should be 'X':", rowWinner);
console.log("Board state:", Gameboard.getBoard());