import React, { useState, useEffect } from 'react';
import GameCanvas from '../components/Game/GameCanvas';

const TwoPlayerPage = () => {
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  const handlePlayerDeath = (score) => {
    if (currentPlayer === 1) {
      setScores(prev => ({ ...prev, player1: score }));
      setCurrentPlayer(2);
    } else {
      setScores(prev => ({ ...prev, player2: score }));
      setGameOver(true);
      
      // Determinar ganador
      const finalScores = { ...scores, player2: score };
      if (finalScores.player1 > score) {
        setWinner(1);
      } else if (score > finalScores.player1) {
        setWinner(2);
      } else {
        setWinner(0); // Empate
      }
    }
  };

  const resetGame = () => {
    setCurrentPlayer(1);
    setScores({ player1: 0, player2: 0 });
    setGameOver(false);
    setWinner(null);
    setGameStarted(true);
  };

  const handleGoBack = () => {
    const user = localStorage.getItem('user');
    if (user) {
      window.location.href = '/menu';
    } else {
      window.location.href = '/';
    }
  };

  // Pantalla inicial
  if (!gameStarted) {
    return (
      <div className="fullscreen-container">
        <div className="two-player-intro">
          <h1>Modo 2 Jugadores</h1>
          <div className="game-rules">
            <div className="rule-item">
              <div className="rule-icon">👤</div>
              <div className="rule-text">
                <h3>Jugador 1</h3>
                <p>Juega primero y establece el puntaje a superar</p>
              </div>
            </div>
            <div className="rule-item">
              <div className="rule-icon">🎯</div>
              <div className="rule-text">
                <h3>Jugador 2</h3>
                <p>Intenta superar el puntaje del Jugador 1</p>
              </div>
            </div>
            <div className="rule-item">
              <div className="rule-icon">🏆</div>
              <div className="rule-text">
                <h3>Ganador</h3>
                <p>El jugador con mayor puntaje gana</p>
              </div>
            </div>
          </div>
          <div className="intro-buttons">
            <button onClick={resetGame} className="btn btn-primary">
              Comenzar Partida
            </button>
            <button onClick={handleGoBack} className="btn btn-secondary">
              Volver al Menú
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de Game Over
  if (gameOver) {
    return (
      <div className="fullscreen-container">
        <div className="two-player-results">
          <h1>¡Partida Terminada!</h1>
          
          {/* Resultado */}
          <div className="winner-announcement">
            {winner === 1 && (
              <>
                <div className="winner-emoji">🎉</div>
                <p className="winner-text">¡Jugador 1 Gana!</p>
              </>
            )}
            {winner === 2 && (
              <>
                <div className="winner-emoji">🎊</div>
                <p className="winner-text">¡Jugador 2 Gana!</p>
              </>
            )}
            {winner === 0 && (
              <>
                <div className="winner-emoji">🤝</div>
                <p className="winner-text">¡Es un Empate!</p>
              </>
            )}
          </div>
          
          {/* Puntajes */}
          <div className="final-scores">
            <div className="score-card player1">
              <h3>Jugador 1</h3>
              <p className="score-number">{scores.player1.toLocaleString()}</p>
              <p className="score-label">puntos</p>
            </div>
            <div className="vs-divider">VS</div>
            <div className="score-card player2">
              <h3>Jugador 2</h3>
              <p className="score-number">{scores.player2.toLocaleString()}</p>
              <p className="score-label">puntos</p>
            </div>
          </div>
          
          {/* Botones */}
          <div className="results-buttons">
            <button onClick={resetGame} className="btn btn-primary">
              Jugar de Nuevo
            </button>
            <button onClick={handleGoBack} className="btn btn-secondary">
              Volver al Menú
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de juego
  return (
    <div className="two-player-game-container">
      {/* Header del juego */}
      <div className="two-player-header">
        <div className="player-info">
          <div className="current-player">
            <span className="player-label">Turno:</span>
            <span className="player-number">Jugador {currentPlayer}</span>
          </div>
          <div className="scores-display">
            <div className="score-item">
              <span className="score-label">J1:</span>
              <span className="score-value">{scores.player1}</span>
            </div>
            <div className="score-item">
              <span className="score-label">J2:</span>
              <span className="score-value">{scores.player2}</span>
            </div>
          </div>
        </div>
        <button onClick={handleGoBack} className="back-btn">
          ← Menú
        </button>
      </div>
      
      {/* Canvas del juego */}
      <div className="game-canvas-wrapper">
        <GameCanvas 
          isTwoPlayerMode={true}
          currentPlayer={currentPlayer}
          onPlayerDeath={handlePlayerDeath}
        />
      </div>
    </div>
  );
};

export default TwoPlayerPage;