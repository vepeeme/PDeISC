import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  standalone: true,
  selector: 'app-tateti',
  templateUrl: './tateti.page.html',
  styleUrls: ['./tateti.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class TatetiPage implements OnInit {
  
  // Variables de control del juego
  currentPlayer: string = 'X';
  boardState: (string | null)[] = Array(9).fill(null);
  player1Name: string = '';
  player2Name: string = '';
  gameMode: string = 'pve';
  gameActive: boolean = true;
  showRegistration: boolean = true;
  showGame: boolean = false;
  showEndGameButtons: boolean = false;
  turnoText: string = '';
  
  constructor() {}
  
  ngOnInit() {
    this.resetGame();
  }

  // Actualiza la visibilidad del campo jugador 2
  onGameModeChange() {
    if (this.gameMode === 'pve') {
      this.player2Name = 'Computadora';
    } else {
      this.player2Name = '';
    }
  }

  // Inicia el juego
  startGame() {
    if (!this.player1Name.trim()) return;
    
    if (this.gameMode === 'pvp' && !this.player2Name.trim()) return;
    
    if (this.gameMode === 'pve') {
      this.player2Name = 'Computadora';
    }

    this.showRegistration = false;
    this.showGame = true;
    this.showEndGameButtons = false;
    this.resetGameState();
  }

  // Resetea el estado del juego
  resetGameState() {
    this.boardState = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.gameActive = true;
    this.updateTurnoText();
  }

  // Actualiza el texto del turno
  updateTurnoText() {
    const name = this.currentPlayer === 'X' ? this.player1Name : this.player2Name;
    this.turnoText = `Turno de ${name} (${this.currentPlayer})`;
  }

  // Maneja el clic en una celda
  onCellClick(index: number) {
    if (!this.gameActive || this.boardState[index] !== null) return;

    // Marca la celda
    this.boardState[index] = this.currentPlayer;

    // Verifica si hay ganador
    if (this.checkWin()) {
      const winner = this.currentPlayer === 'X' ? this.player1Name : this.player2Name;
      this.turnoText = `${winner} ganó!`;
      this.gameActive = false;
      this.showEndGameButtons = true;
      return;
    }

    // Verifica empate
    if (!this.boardState.includes(null)) {
      this.turnoText = 'Empate!';
      this.gameActive = false;
      this.showEndGameButtons = true;
      return;
    }

    // Cambia turno
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    this.updateTurnoText();

    // Turno de la computadora
    if (this.gameMode === 'pve' && this.currentPlayer === 'O' && this.gameActive) {
      setTimeout(() => this.makeAIMove(), 700);
    }
  }

  // Movimiento de la IA
  makeAIMove() {
    if (!this.gameActive) return;

    const emptyIndices = this.boardState
      .map((val, idx) => val === null ? idx : null)
      .filter(idx => idx !== null) as number[];

    // Intenta ganar
    let bestMove = this.findWinningMove('O');
    if (bestMove !== null) {
      this.onCellClick(bestMove);
      return;
    }

    // Bloquea al jugador
    bestMove = this.findWinningMove('X');
    if (bestMove !== null) {
      this.onCellClick(bestMove);
      return;
    }

    // Movimiento aleatorio
    if (emptyIndices.length > 0) {
      const move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      this.onCellClick(move);
    }
  }

  // Encuentra movimiento ganador o de bloqueo
  findWinningMove(player: string): number | null {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (const line of lines) {
      const [a, b, c] = line;
      const currentLine = [this.boardState[a], this.boardState[b], this.boardState[c]];

      if (currentLine.filter(val => val === player).length === 2 && currentLine.includes(null)) {
        if (this.boardState[a] === null) return a;
        if (this.boardState[b] === null) return b;
        if (this.boardState[c] === null) return c;
      }
    }
    return null;
  }

  // Verifica si hay ganador
  checkWin(): boolean {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    
    return lines.some(([a, b, c]) => 
      this.boardState[a] && 
      this.boardState[a] === this.boardState[b] && 
      this.boardState[a] === this.boardState[c]
    );
  }

  // Reinicia el juego
  resetGame() {
    this.resetGameState();
    this.showEndGameButtons = false;
  }

  // Vuelve al registro
  goToRegister() {
    this.showGame = false;
    this.showRegistration = true;
    this.showEndGameButtons = false;
    this.player1Name = '';
    this.player2Name = '';
    this.gameMode = 'pve';
  }

  // Obtiene las clases CSS para cada celda
  getCellClass(index: number): string {
    let classes = 'cell';
    if (this.boardState[index]) {
      classes += ' highlight';
    }
    return classes;
  }
}