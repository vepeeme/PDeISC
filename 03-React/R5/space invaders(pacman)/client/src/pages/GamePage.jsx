import React from 'react';
import GameCanvas from '../components/Game/GameCanvas';

const GamePage = () => {
  const handleGoBack = () => {
    const user = localStorage.getItem('user');
    if (user) {
      window.location.href = '/menu';
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="game-page-container">
      {/* Header compacto */}
      <div className="game-page-header">
        <div className="game-title-section">
          <h1 className="game-title-small">SPACE INVADERS</h1>
          <button onClick={handleGoBack} className="back-btn">
            ← Menú
          </button>
        </div>
        <div className="game-controls-compact">
          <span className="control-hint">← → Mover</span>
          <span className="control-hint">ESPACIO Disparar</span>
        </div>
      </div>
      
      {/* Canvas del juego */}
      <div className="game-canvas-wrapper">
        <GameCanvas />
      </div>
    </div>
  );
};

export default GamePage;