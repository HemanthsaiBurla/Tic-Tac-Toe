const board = document.getElementById('board');
const resetButton = document.getElementById('reset');
const viewHistoryButton = document.getElementById('view-history');
const closeHistoryButton = document.getElementById('close-history');
const historyModal = document.getElementById('history-modal');
const historyList = document.getElementById('history-list');
const winnerMessage = document.getElementById('winner-message');
const gameContainer = document.getElementById('game-container');
const modeText = document.getElementById('current-mode');

let currentPlayer, gameMode, gameBoard, history;

document.getElementById('friend-mode').onclick = () => startGame('friend');
document.getElementById('computer-mode').onclick = () => startGame('computer');

function startGame(mode) {
    gameMode = mode;
    gameBoard = Array(9).fill('');
    currentPlayer = 'X';
    history = [];
    gameContainer.classList.remove('hidden');
    resetGame();
    modeText.textContent = mode === 'friend' ? 'Mode: User1 vs User2' : 'Mode: User vs Computer';
}

board.addEventListener('click', handleCellClick);
resetButton.addEventListener('click', resetGame);
viewHistoryButton.addEventListener('click', () => historyModal.classList.remove('hidden'));
closeHistoryButton.addEventListener('click', () => historyModal.classList.add('hidden'));

function handleCellClick(e) {
    const index = e.target.dataset.index;
    if (!gameBoard[index] && !checkWinner()) {
        makeMove(index);
        if (gameMode === 'computer' && !checkWinner() && gameBoard.includes('')) {
            setTimeout(computerMove, 500);
        }
    }
}

function makeMove(index) {
    gameBoard[index] = currentPlayer;
    const cell = document.querySelector(`.cell[data-index="${index}"]`);
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer === 'X' ? 'x' : 'o');
    
    const winningCombination = getWinningCombination();
    if (winningCombination) {
        winnerMessage.textContent = `${currentPlayer === 'X' ? 'User1' : (gameMode === 'computer' ? 'Computer' : 'User2')} Wins!`;
        winningCombination.forEach(idx => {
            document.querySelector(`.cell[data-index="${idx}"]`).classList.add('winner');
        });
        saveHistory(winnerMessage.textContent);
    } else if (!gameBoard.includes('')) {
        winnerMessage.textContent = 'Draw!';
        saveHistory('Draw');
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

function getWinningCombination() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]
    ];
    return winningCombinations.find(comb => comb.every(idx => gameBoard[idx] === currentPlayer));
}


function computerMove() {
    const emptyIndices = gameBoard.map((val, idx) => val === '' ? idx : null).filter(idx => idx !== null);
    makeMove(emptyIndices[Math.floor(Math.random() * emptyIndices.length)]);
}

function checkWinner() {
    const winningCombinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    return winningCombinations.some(comb => comb.every(idx => gameBoard[idx] === currentPlayer));
}

function resetGame() {
    gameBoard.fill('');
    winnerMessage.textContent = '';
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winner', 'x', 'o');
    });
}


function saveHistory(result) {
    const li = document.createElement('li');
    li.textContent = result;
    historyList.appendChild(li);
}
