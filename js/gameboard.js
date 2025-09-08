// Gameboard IIFE function
const Gameboard = (function() {
    let board = ["", "", "", "", "", "", "", "", ""];

    function getBoard() {
        return [...board];
    }

    function setMark(index, mark) {
        if (board[index] === "") {
            board[index] = mark;
            return true;
        }
        return false;
    }

    function resetBoard() {
        board = ["", "", "", "", "", "", "", "", ""];
    }

    return { getBoard, setMark, resetBoard };
})();
