import React, { useState, useEffect } from 'react';

const MenuPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verificar si hay usuario logueado
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      // Si no hay usuario, redirigir al login
      window.location.href = '/';
    }
  }, []);

  const handleNavigation = (path) => {
    if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (!user) {
    return (
      <div className="fullscreen-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p className="text-space-white">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fullscreen-container">
      <div className="menu-container">
        {/* Header */}
        <div className="menu-header">
          <h1>Space Invaders</h1>
          <div className="welcome-message">
            <p className="welcome-text">¡Bienvenido, {user.username}!</p>
            <button 
              onClick={handleLogout}
              className="logout-btn"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Menu Options */}
        <div className="menu-options">
          <button
            onClick={() => handleNavigation('/game')}
            className="menu-option-btn primary"
          >
            <div className="menu-option-icon">🎮</div>
            <div className="menu-option-content">
              <h3>Un Jugador</h3>
              <p>Juego clásico individual</p>
            </div>
          </button>

          <button
            onClick={() => handleNavigation('/two-player')}
            className="menu-option-btn secondary"
          >
            <div className="menu-option-icon">👥</div>
            <div className="menu-option-content">
              <h3>Dos Jugadores</h3>
              <p>Competir con un amigo</p>
            </div>
          </button>

          <button
            onClick={() => handleNavigation('/leaderboard')}
            className="menu-option-btn tertiary"
          >
            <div className="menu-option-icon">🏆</div>
            <div className="menu-option-content">
              <h3>Ranking</h3>
              <p>Ver mejores puntajes</p>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="menu-footer">
          <p className="game-info">
            Controla a Pacman y destruye a todos los fantasmas
          </p>
          <p className="controls-info">
            Usa ← → para moverte y ESPACIO para disparar
          </p>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;