// toma referencias de los elementos del HTML
const setupForm = document.getElementById('setupForm');
const gameContainer = document.getElementById('game');
const turnoTexto = document.getElementById('turno');
const board = document.getElementById('board');
const resetBtn = document.getElementById('reset');
const goToRegisterBtn = document.getElementById('goToRegister');
const gameModeSelect = document.getElementById('gameMode');
const player2Container = document.getElementById('player2Container');
const registrationDiv = document.getElementById('registration');

// vcariables de control del juego
let currentPlayer = 'X'; 
let boardState = Array(9).fill(null); 
let player1Name = '';
let player2Name = '';
let gameMode = 'pve';
let gameActive = true;

// muestra u oculta el campo del jugador 2 dependiendo del modo de juego
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

// muestra el formulario de registro 
registrationDiv.classList.remove('hidden');

// envia del formulario
setupForm.addEventListener('submit', e => {
  e.preventDefault(); 

  // toma los nombres de los jugadores
  player1Name = document.getElementById('player1').value.trim();
  player2Name = gameModeSelect.value === 'pvp' ? document.getElementById('player2').value.trim() : 'Computadora';
  gameMode = gameModeSelect.value;

  // muestra el tablero, oculta el registro y los botones
  registrationDiv.classList.add('hidden');
  gameContainer.classList.remove('hidden');
  resetBtn.classList.add('hidden');
  goToRegisterBtn.classList.add('hidden');

  startGame();
});

// inicia el juego
function startGame() {
  board.innerHTML = ''; 
  boardState = Array(9).fill(null); 
  currentPlayer = 'X';
  gameActive = true;
  renderTurno(); 

  // crea las celdas del tablero
  boardState.forEach((_, index) => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = index;
    cell.addEventListener('click', handleCellClick); 
    board.appendChild(cell);
  });
}

// muestra el nombre del jugador que tiene el turno
function renderTurno() {
  const name = currentPlayer === 'X' ? player1Name : player2Name;
  turnoTexto.textContent = `Turno de ${name} (${currentPlayer})`;
}

function handleCellClick(e) {
  const index = parseInt(e.target.dataset.index);

  // si el juego esta inactivo o ya se jugo esa celda, no hacer nada
  if (!gameActive || boardState[index] !== null) return;

  // marca la celda y actualizar su estado
  boardState[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  e.target.classList.add('highlight');

  // verifica si hay ganador
  if (checkWin()) {
    turnoTexto.textContent = `${currentPlayer === 'X' ? player1Name : player2Name} ganó!`;
    gameActive = false;
    showEndGameButtons();
    return;
  }

  // verifica si es empate
  if (!boardState.includes(null)) {
    turnoTexto.textContent = 'Empate!';
    gameActive = false;
    showEndGameButtons();
    return;
  }

  // cambia el turno
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  renderTurno();

  // si es turno de la computadora, hacer movimiento automatico
  if (gameMode === 'pve' && currentPlayer === 'O' && gameActive) {
    setTimeout(makeAIMove, 700); 
  }
}

// turno automatico de la computadora
function makeAIMove() {
  const emptyIndices = boardState.map((val, idx) => val === null ? idx : null).filter(idx => idx !== null);

  // intenta ganar si hay una jugada ganadora
  let bestMove = findWinningMove('O');
  if (bestMove !== null) {
    clickCell(bestMove);
    return;
  }

  // bloquea al jugador si puede ganar en el proximo turno
  bestMove = findWinningMove('X');
  if (bestMove !== null) {
    clickCell(bestMove);
    return;
  }

  // si no hay amenaza ni victoria inmediata, jugar al azar
  if (emptyIndices.length > 0) {
    const move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    clickCell(move);
  }
}

// busca un movimiento que gane o bloquee al jugador
function findWinningMove(player) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]            
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    const currentLine = [boardState[a], boardState[b], boardState[c]];

    // si hay dos del mismo jugador y una celda vacia, devuelve esa celda
    if (currentLine.filter(val => val === player).length === 2 && currentLine.includes(null)) {
      if (boardState[a] === null) return a;
      if (boardState[b] === null) return b;
      if (boardState[c] === null) return c;
    }
  }
  return null; 
}

// simula un clic en una celda elegida por la maquina
function clickCell(index) {
  const cell = document.querySelector(`.cell[data-index='${index}']`);
  if (cell) cell.click();
}

// verifica si hay una linea ganadora
function checkWin() {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  return lines.some(([a, b, c]) => boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]);
}

// muestra los botones cuando el juego termina
function showEndGameButtons() {
  resetBtn.classList.remove('hidden');
  goToRegisterBtn.classList.remove('hidden');
}

// reinicia el juego 
resetBtn.addEventListener('click', () => {
  startGame();
  resetBtn.classList.add('hidden');
  goToRegisterBtn.classList.add('hidden');
});

// vuelve al registro
goToRegisterBtn.addEventListener('click', () => {
  gameContainer.classList.add('hidden');
  registrationDiv.classList.remove('hidden');
  updatePlayer2Visibility(); 
});
