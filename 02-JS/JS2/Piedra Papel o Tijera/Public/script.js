document.addEventListener('DOMContentLoaded', () => {
  const mapKeyP1 = { q: 'piedra', w: 'papel', e: 'tijera', a: 'lagarto', s: 'spock' };
  const mapKeyP2 = { i: 'piedra', o: 'papel', p: 'tijera', k: 'lagarto', l: 'spock' };

  const wins = {
    piedra: ['tijera', 'lagarto'],
    papel: ['piedra', 'spock'],
    tijera: ['papel', 'lagarto'],
    lagarto: ['papel', 'spock'],
    spock: ['tijera', 'piedra']
  };

  const loginScreen = document.getElementById('login-screen');
  const gameScreen  = document.getElementById('game-screen');
  const startBtn    = document.getElementById('start-button');
  const changeMode  = document.getElementById('change-mode');
  const p1Input     = document.getElementById('player1');
  const p2Input     = document.getElementById('player2');
  const label1      = document.getElementById('label1');
  const label2      = document.getElementById('label2');
  const score1El    = document.getElementById('score1');
  const score2El    = document.getElementById('score2');
  const modeTitle   = document.getElementById('mode-title');
  const timerEl     = document.getElementById('timer');
  const resultEl    = document.getElementById('result');
  const restartBtn  = document.getElementById('restart-round');

  let p1, p2, mode;
  let choice1, choice2;
  let score1 = 0, score2 = 0;

  startBtn.addEventListener('click', () => {
    p1    = p1Input.value.trim() || 'Jugador 1';
    p2    = p2Input.value.trim() || 'IA';
    mode  = p2Input.value.trim() ? '2 Jugadores' : 'IA';
    initGame();
    startRound();
  });

  changeMode.addEventListener('click', () => {
    score1 = score2 = 0;
    score1El.textContent = score1;
    score2El.textContent = score2;
    resultEl.textContent = '';
    loginScreen.classList.remove('hidden');
    gameScreen.classList.add('hidden');
  });

  function initGame() {
    label1.textContent = p1;
    label2.textContent = p2;
    loginScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    modeTitle.textContent = mode === 'IA' ? 'Modo vs IA' : 'Modo 2 Jugadores';
  }

  function startRound() {
    choice1 = choice2 = null;
    resultEl.textContent = '';
    restartBtn.style.display = 'none';
    runTimer();
  }

  function runTimer() {
    let time = 3;
    timerEl.textContent = time;
    document.addEventListener('keydown', keyHandler);

    const countdown = setInterval(() => {
      time--;
      timerEl.textContent = time;
      if (((choice1 && (mode === 'IA' || choice2))) || time === 0) {
        clearInterval(countdown);
        document.removeEventListener('keydown', keyHandler);
        if (mode === 'IA' && !choice2) {
          const keys = Object.keys(mapKeyP2);
          choice2 = mapKeyP2[keys[Math.floor(Math.random() * keys.length)]];
        }
        finishRound();
      }
    }, 1000);
  }

  function keyHandler(e) {
    const k = e.key.toLowerCase();
    if (mapKeyP1[k] && !choice1) choice1 = mapKeyP1[k];
    else if (mapKeyP2[k] && !choice2 && mode === '2 Jugadores') choice2 = mapKeyP2[k];
  }

  function finishRound() {
    const c1 = choice1 || 'sin elegir';
    const c2 = choice2 || 'sin elegir';
    let outcome;

    if (c1 === c2) outcome = 'Empate';
    else if (wins[c1]?.includes(c2)) { outcome = `${p1} gana`; score1++; }
    else { outcome = `${p2} gana`; score2++; }

    score1El.textContent = score1;
    score2El.textContent = score2;

    resultEl.innerHTML = `
      <div><strong>${p1}:</strong> ${c1}</div>
      <div><strong>${p2}:</strong> ${c2}</div>
      <h3>${outcome}</h3>
    `;

    restartBtn.style.display = 'block';
    restartBtn.onclick = startRound;
  }
});
