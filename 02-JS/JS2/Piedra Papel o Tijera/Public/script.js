document.addEventListener('DOMContentLoaded', () => {
    // teclas de cada jugador
    const mapKeyP1 = { q: 'piedra', w: 'papel', e: 'tijera', a: 'lagarto', s: 'spock' };
    const mapKeyP2 = { i: 'piedra', o: 'papel', p: 'tijera', k: 'lagarto', l: 'spock' };

    // reglas del juego
    const wins = {
        piedra: ['tijera', 'lagarto'],
        papel: ['piedra', 'spock'],
        tijera: ['papel', 'lagarto'],
        lagarto: ['papel', 'spock'],
        spock: ['tijera', 'piedra']
    };

    // toma referencias a los elementos del DOM
    const loginScreen = document.getElementById('login-screen');
    const gameScreen = document.getElementById('game-screen');
    const startBtn = document.getElementById('start-button');
    const changeMode = document.getElementById('change-mode');
    const p1Input = document.getElementById('player1');
    const p2Input = document.getElementById('player2');
    const label1 = document.getElementById('label1');
    const label2 = document.getElementById('label2');
    const score1El = document.getElementById('score1');
    const score2El = document.getElementById('score2');
    const modeTitle = document.getElementById('mode-title');
    const timerEl = document.getElementById('timer');
    const resultEl = document.getElementById('result');
    const restartBtn = document.getElementById('restart-round');
    const mainLayoutContainer = document.getElementById('main-layout-container'); 

    // variables de estado del juego
    let p1, p2, mode;
    let choice1, choice2;
    let score1 = 0, score2 = 0;

    // inicia la partida al hacer clic en el boton
    startBtn.addEventListener('click', () => {
        // toma los nombres de los jugadores
        p1 = p1Input.value.trim() || 'Jugador 1';
        p2 = p2Input.value.trim() ? 'Jugador 2' : 'IA'; 
        mode = p2Input.value.trim() ? '2 Jugadores' : 'IA';

        initGame();
        startRound();
    });

    // vuelve al menu principal
    changeMode.addEventListener('click', () => {
        // reinicia puntajes
        score1 = score2 = 0;
        score1El.textContent = score1;
        score2El.textContent = score2;
        resultEl.textContent = '';

        // muestra la pantalla de login y el contenedor principal, oculta el juego
        mainLayoutContainer.classList.remove('hidden');
        loginScreen.classList.remove('hidden');
        gameScreen.classList.add('hidden');
    });

    // configura la pantalla del juego con nombres y modo
    function initGame() {
        label1.textContent = p1;
        label2.textContent = p2;
        mainLayoutContainer.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        modeTitle.textContent = mode === 'IA' ? 'Modo vs IA' : 'Modo 2 Jugadores';
    }

    // inicia una ronda 
    function startRound() {
        choice1 = choice2 = null;
        resultEl.textContent = '';
        restartBtn.style.display = 'none';
        runTimer();
    }

    // cuenta regresiva de 3 segundos y escucha teclas presionadas
    function runTimer() {
        let time = 3;
        timerEl.textContent = time;

        document.addEventListener('keydown', keyHandler);

        const countdown = setInterval(() => {
            time--;
            timerEl.textContent = time;

            // termina el conteo si ambos han elegido o si se acaba el tiempo
            if (((choice1 && (mode === 'IA' || choice2))) || time === 0) {
                clearInterval(countdown);
                document.removeEventListener('keydown', keyHandler);

                // la maquina genera eleccion aleatoria si se acaba el tiempo o si no hay eleccion del jugador 2
                if (mode === 'IA' && !choice2) {
                    const keys = Object.keys(mapKeyP1); 
                    choice2 = mapKeyP1[keys[Math.floor(Math.random() * keys.length)]];
                }

                finishRound();
            }
        }, 1000);
    }

    // detecta que tecla fue presionada por cada jugador
    function keyHandler(e) {
        const k = e.key.toLowerCase();
        if (mapKeyP1[k] && !choice1) {
            choice1 = mapKeyP1[k];
        } else if (mapKeyP2[k] && !choice2 && mode === '2 Jugadores') {
            choice2 = mapKeyP2[k];
        }
    }

    // toma las respuestas
    function finishRound() {
        const c1 = choice1 || 'sin elegir';
        const c2 = choice2 || 'sin elegir';
        let outcome;

        // analiza si alguien gano o hubo empate
        if (c1 === c2) {
            outcome = 'Empate';
        } else if (wins[c1]?.includes(c2)) {
            outcome = `${p1} gana`;
            score1++;
        } else {
            outcome = `${p2} gana`;
            score2++;
        }

        // actualiza los puntos
        score1El.textContent = score1;
        score2El.textContent = score2;

        // muestra los puntos
        resultEl.innerHTML = `
            <div><strong>${p1}:</strong> ${c1}</div>
            <div><strong>${p2}:</strong> ${c2}</div>
            <h3>${outcome}</h3>
        `;

        // muestra el boton para volver a jugar
        restartBtn.style.display = 'block';
        restartBtn.onclick = startRound;
    }
});