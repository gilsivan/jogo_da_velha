const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset');
const themeToggle = document.getElementById('theme-toggle');

let currentPlayer = 'X';
let gameActive = true;
let boardState = Array(9).fill(null);

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Jogada do jogador humano
function handleCellClick(e) {
  const cell = e.target;
  const index = cell.dataset.index;

  if (boardState[index] || !gameActive || currentPlayer !== 'X') return;

  clickSound.play(); 
  makeMove(index, 'X');

  if (gameActive) {
    setTimeout(computerMove, 1000); // Máquina joga após 1s
  }
}




function minimax(board, depth, isMaximizing) {
  if (checkWinner('O', false)) return 10 - depth; // Não aplica destaque
  if (checkWinner('X', false)) return depth - 10; // Não aplica destaque
  if (board.every(cell => cell !== null)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;

    board.forEach((cell, index) => {
      if (cell === null) {
        board[index] = 'O';
        let score = minimax(board, depth + 1, false);
        board[index] = null;
        bestScore = Math.max(score, bestScore);
      }
    });

    return bestScore;
  } else {
    let bestScore = Infinity;

    board.forEach((cell, index) => {
      if (cell === null) {
        board[index] = 'X';
        let score = minimax(board, depth + 1, true);
        board[index] = null;
        bestScore = Math.min(score, bestScore);
      }
    });

    return bestScore;
  }
}


// Faz um movimento
function computerMove() {
  if (!gameActive) return;

  let bestScore = -Infinity;
  let bestMove;

  boardState.forEach((cell, index) => {
    if (cell === null) {
      boardState[index] = 'O';
      let score = minimax(boardState, 0, false);
      boardState[index] = null;

      if (score > bestScore) {
        bestScore = score;
        bestMove = index;
      }
    }
  });

  clickSound.play();
  makeMove(bestMove, 'O'); // Jogada real da máquina
}

function makeMove(index, player) {
  if (boardState[index] !== null || !gameActive) return;

  boardState[index] = player;
  cells[index].textContent = player;  // Atualiza o conteúdo da célula
  
  if (checkWinner(player)) {
    gameActive = false;  // Finaliza o jogo se houver vencedor
    winSound.play();  // Toca o som de vitória
    statusText.textContent = `${player} venceu!`;
  } else if (boardState.every(cell => cell !== null)) {
    gameActive = false;  // Se todas as células estiverem preenchidas, é empate
    drawSound.play();  // Toca o som de empate
    statusText.textContent = 'Empate!';
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';  // Alterna o jogador
    statusText.textContent = `Vez de ${currentPlayer}`;
  }
}


// Verifica se há um vencedor
function checkWinner(player, applyHighlight = true) {
  const winningCombination = winningCombinations.find(combination =>
    combination.every(index => boardState[index] === player)
  );

  if (winningCombination) {
    if (applyHighlight && gameActive) {
      winningCombination.forEach(index => {
        cells[index].classList.add('highlight');
      });
    }
    return true;
  }
  return false;
}


// Reinicia o jogo
function resetGame() {
  currentPlayer = 'X';
  gameActive = true;
  boardState.fill(null);
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('highlight'); // Remove destaque
  });
  statusText.textContent = 'Jogador X começa!';
}

// Alterna entre modo claro e escuro
function toggleTheme() {
  document.body.classList.toggle('dark');
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
themeToggle.addEventListener('click', toggleTheme);

// Sons
const clickSound = new Audio('assets/click.mp3');
const winSound = new Audio('assets/win.mp3');
const loseSound = new Audio('assets/lose.mp3');
const drawSound = new Audio('assets/draw.mp3');