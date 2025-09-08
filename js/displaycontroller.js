// Display Controller
const DisplayController = (function() {
    const cells = document.querySelectorAll(".cell");
    const messageDiv = document.querySelector(".message");
    const resetBtn = document.getElementById("resetBtn");

    function renderBoard(board) {
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
            cell.classList.remove("winner"); 
        });
    }

    function setMessage(msg, type) {
        messageDiv.textContent = msg;
        messageDiv.className = "message"; 
        if (type) messageDiv.classList.add(type);
    }

    function highlightWinners(indices) {
        indices.forEach(i => {
            cells[i].classList.add("winner");
        });
    }

    function handleCellClick(e) {
        const index = e.target.dataset.index;
        const move = GameController.playRound(index);

        if (!move.valid) return;

        renderBoard(Gameboard.getBoard());

        if (move.result) {
            if (move.result.winner === "tie") {
                setMessage("It's a tie!", "tie");
            } else {
                setMessage(`${move.result.winner} wins!`, "win");
                highlightWinners(move.result.indices);
            }
            cells.forEach(c => c.style.pointerEvents = "none"); // disable clicks
        } else {
            setMessage(`${GameController.getActivePlayer().getName()}'s Turn`);
        }
    }

    function resetGame() {
        GameController.resetGame();
        renderBoard(Gameboard.getBoard());
        setMessage(`${GameController.getActivePlayer().getName()}'s Turn`);
        cells.forEach(c => c.style.pointerEvents = "auto"); // enable clicks
    }

    // attach events
    cells.forEach(cell => cell.addEventListener("click", handleCellClick));
    resetBtn.addEventListener("click", resetGame);

    // init
    renderBoard(Gameboard.getBoard());
    setMessage(`${GameController.getActivePlayer().getName()}'s Turn`);

    return { renderBoard, setMessage };
})();
