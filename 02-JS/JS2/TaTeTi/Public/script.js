// script.js

const setupForm = document.getElementById('setupForm');
const gameContainer = document.getElementById('game');
const turnoTexto = document.getElementById('turno');
const board = document.getElementById('board');
const resetBtn = document.getElementById('reset');
const gameModeSelect = document.getElementById('gameMode');
const player2Container = document.getElementById('player2Container');

let currentPlayer = 'X';
let boardState = Array(9).fill(null);
let player1Name = '';
let player2Name = '';
let gameMode = 'pve';
let gameActive = true;

// Mostrar/Ocultar input de Jugador 2
function updatePlayer2Visibility() {
  if (gameModeSelect.value === 'pve') {
    player2Container.style.display = 'none';
    document.getElementById('player2').removeAttribute('required');
  } else {
    player2Container.style.display = 'block';
    document.getElementById('player2').setAttribute('required', '');
  }
}

updatePlayer2Visibility();
gameModeSelect.addEventListener('change', updatePlayer2Visibility);

setupForm.addEventListener('submit', e => {
  e.preventDefault();

  player1Name = document.getElementById('player1').value.trim();
  player2Name = gameModeSelect.value === 'pvp' ? document.getElementById('player2').value.trim() : 'Computadora';
  gameMode = gameModeSelect.value;

  setupForm.classList.add('hidden');
  gameContainer.classList.remove('hidden');
  startGame();
});

function startGame() {
  board.innerHTML = '';
  boardState = Array(9).fill(null);
  currentPlayer = 'X';
  gameActive = true;
  renderTurno();

  boardState.forEach((_, index) => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = index;
    cell.addEventListener('click', handleCellClick);
    board.appendChild(cell);
  });
}

function renderTurno() {
  const name = currentPlayer === 'X' ? player1Name : player2Name;
  turnoTexto.textContent = `Turno de ${name} (${currentPlayer})`;
}

function handleCellClick(e) {
  const index = e.target.dataset.index;

  if (!gameActive || boardState[index]) return;

  boardState[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  if (checkWin()) {
    turnoTexto.textContent = `${currentPlayer === 'X' ? player1Name : player2Name} ganó!`;
    gameActive = false;
    return;
  }

  if (!boardState.includes(null)) {
    turnoTexto.textContent = 'Empate!';
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  renderTurno();

  if (gameMode === 'pve' && currentPlayer === 'O') {
    setTimeout(makeAIMove, 500);
  }
}

function makeAIMove() {
  const emptyIndices = boardState.map((val, idx) => val === null ? idx : null).filter(idx => idx !== null);
  const move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  const cell = document.querySelector(`.cell[data-index='${move}']`);
  if (cell) cell.click();
}

function checkWin() {
  const lines = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  return lines.some(([a,b,c]) => boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]);
}

resetBtn.addEventListener('click', () => {
  setupForm.classList.remove('hidden');
  gameContainer.classList.add('hidden');
  document.getElementById('player1').value = '';
  document.getElementById('player2').value = '';
  updatePlayer2Visibility();
});
