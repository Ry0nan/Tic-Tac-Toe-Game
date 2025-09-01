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
    return { name, mark };
}

const player1 = Player("Player 1", "X");
const player2 = Player("Player 2", "O");


// test codes

// testing to see if the player returns properly
console.log(player1.name, player1.mark);
console.log(player2.name, player2.mark);

// testing to see if the board returns properly
console.log(Gameboard.getBoard());

// testing to see if the board properly checks if the spot is filled 
Gameboard.setMark(0, "X"); 
console.log(Gameboard.getBoard()); // ["X", "", "", "", "", "", "", "", ""]
