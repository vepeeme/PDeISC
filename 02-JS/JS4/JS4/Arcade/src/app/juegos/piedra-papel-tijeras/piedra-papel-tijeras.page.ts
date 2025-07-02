import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  standalone: true,
  selector: 'app-piedra-papel-tijeras',
  templateUrl: './piedra-papel-tijeras.page.html', // Asegúrate de que este archivo HTML exista en la misma carpeta
  styleUrls: ['./piedra-papel-tijeras.page.scss'], // ¡Esta es la línea que vincula tu SCSS!
  imports: [IonicModule, CommonModule, FormsModule],
})
export class PiedraPapelTijerasPage implements OnInit, OnDestroy {
  // Mapeo de teclas
  private mapKeyP1 = { q: 'piedra', w: 'papel', e: 'tijera', a: 'lagarto', s: 'spock' };
  private mapKeyP2 = { i: 'piedra', o: 'papel', p: 'tijera', k: 'lagarto', l: 'spock' };

  // Reglas del juego
  private wins = {
    piedra: ['tijera', 'lagarto'],
    papel: ['piedra', 'spock'],
    tijera: ['papel', 'lagarto'],
    lagarto: ['papel', 'spock'],
    spock: ['tijera', 'piedra']
  };

  // Variables del componente
  showLogin = true;
  player1Name = '';
  player2Name = '';
  
  // Variables del juego
  p1 = '';
  p2 = '';
  mode = '';
  choice1: string | null = null;
  choice2: string | null = null;
  score1 = 0;
  score2 = 0;
  label1 = '';
  label2 = '';
  modeTitle = '';
  timer = 3;
  result = '';
  showRestartButton = false;

  // Variables para el timer
  private timerInterval: any;
  private keyListener: (e: KeyboardEvent) => void;

  constructor() {
    // Configurar listener de teclas
    this.keyListener = (e: KeyboardEvent) => this.keyHandler(e);
  }

  ngOnInit() {
    // No necesitamos configurar nada aquí inicialmente
  }

  ngOnDestroy() {
    // Limpiar intervalos y listeners
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    document.removeEventListener('keydown', this.keyListener);
  }

  startGame() {
    // Tomar los nombres de los jugadores
    this.p1 = this.player1Name.trim() || 'Jugador 1';
    this.p2 = this.player2Name.trim() ? 'Jugador 2' : 'IA';
    this.mode = this.player2Name.trim() ? '2 Jugadores' : 'IA';

    this.initGame();
    this.startRound();
  }

  changeMode() {
    // Reiniciar puntajes
    this.score1 = 0;
    this.score2 = 0;
    this.result = '';
    
    // Volver a la pantalla de login
    this.showLogin = true;
    
    // Limpiar timer si existe
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    document.removeEventListener('keydown', this.keyListener);
  }

  private initGame() {
    this.label1 = this.p1;
    this.label2 = this.p2;
    this.showLogin = false;
    this.modeTitle = this.mode === 'IA' ? 'Modo vs IA' : 'Modo 2 Jugadores';
  }

  startRound() {
    this.choice1 = null;
    this.choice2 = null;
    this.result = '';
    this.showRestartButton = false;
    this.runTimer();
  }

  private runTimer() {
    let time = 3;
    this.timer = time;

    document.addEventListener('keydown', this.keyListener);

    this.timerInterval = setInterval(() => {
      time--;
      this.timer = time;

      // Terminar el conteo si ambos han elegido o si se acaba el tiempo
      if (((this.choice1 && (this.mode === 'IA' || this.choice2))) || time === 0) {
        clearInterval(this.timerInterval);
        document.removeEventListener('keydown', this.keyListener);

        // La máquina genera elección aleatoria si se acaba el tiempo o si no hay elección del jugador 2
        if (this.mode === 'IA' && !this.choice2) {
          const keys = Object.keys(this.mapKeyP1);
          this.choice2 = this.mapKeyP1[keys[Math.floor(Math.random() * keys.length)] as keyof typeof this.mapKeyP1];
        }

        this.finishRound();
      }
    }, 1000);
  }

  private keyHandler(e: KeyboardEvent) {
    const k = e.key.toLowerCase();
    if (this.mapKeyP1[k as keyof typeof this.mapKeyP1] && !this.choice1) {
      this.choice1 = this.mapKeyP1[k as keyof typeof this.mapKeyP1];
    } else if (this.mapKeyP2[k as keyof typeof this.mapKeyP2] && !this.choice2 && this.mode === '2 Jugadores') {
      this.choice2 = this.mapKeyP2[k as keyof typeof this.mapKeyP2];
    }
  }

  private finishRound() {
    const c1 = this.choice1 || 'sin elegir';
    const c2 = this.choice2 || 'sin elegir';
    let outcome;

    // Analizar si alguien ganó o hubo empate
    if (c1 === c2) {
      outcome = 'Empate';
    } else if (this.wins[c1 as keyof typeof this.wins]?.includes(c2)) {
      outcome = `${this.p1} gana`;
      this.score1++;
    } else {
      outcome = `${this.p2} gana`;
      this.score2++;
    }

    // Mostrar los resultados
    this.result = `
      <div><strong>${this.p1}:</strong> ${c1}</div>
      <div><strong>${this.p2}:</strong> ${c2}</div>
      <h3>${outcome}</h3>
    `;

    // Mostrar el botón para volver a jugar
    this.showRestartButton = true;
  }
}