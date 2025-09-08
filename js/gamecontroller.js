// Game Controller AKA the Main Function 
const GameController = (function() {
    const player1 = Player("Player 1", "X");
    const player2 = Player("Player 2", "O");
    let activePlayer = player1;

    function switchPlayer() {
        activePlayer = (activePlayer === player1) ? player2 : player1;
    }

    // find exact winning indices
    function findWinningIndices(boardArr) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
            [0, 4, 8], [2, 4, 6]              // diagonals
        ];

        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (boardArr[a] !== "" && boardArr[a] === boardArr[b] && boardArr[a] === boardArr[c]) {
                return pattern; // return the winning indices
            }
        }
        return null;
    }

    function checkTie(boardArr) {
        return !boardArr.includes("");
    }

    // main winner checker
    function checkWinner(boardArr) {
        const winningIndices = findWinningIndices(boardArr);
        if (winningIndices) return { winner: boardArr[winningIndices[0]], indices: winningIndices };
        if (checkTie(boardArr)) return { winner: "tie", indices: [] };
        return null;
    }

    function playRound(index) {
        const mark = activePlayer.getMark();
        const success = Gameboard.setMark(index, mark);
        if (!success) return { valid: false };

        const result = checkWinner(Gameboard.getBoard());
        if (result) {
            return { valid: true, result };
        }

        switchPlayer();
        return { valid: true, result: null };
    }

    function getActivePlayer() {
        return activePlayer;
    }

    function resetGame() {
        Gameboard.resetBoard();
        activePlayer = player1;
    }

    // expose
    return { playRound, getActivePlayer, resetGame, checkWinner };
})();
