import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../services/scores';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await getLeaderboard();
        setLeaderboard(data);
        setError('');
      } catch (err) {
        setError('Error al cargar el leaderboard');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const handleGoBack = () => {
    const user = localStorage.getItem('user');
    if (user) {
      window.location.href = '/menu';
    } else {
      window.location.href = '/';
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="fullscreen-container">
      <div className="leaderboard-page-container">
        {/* Header */}
        <div className="leaderboard-header">
          <h1>Ranking de Jugadores</h1>
          <p className="leaderboard-subtitle">Los mejores puntajes del juego</p>
        </div>
        
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p className="loading-text">Cargando rankings...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error-emoji">⚠️</div>
            <p className="error-title">Oops!</p>
            <p className="error-description">{error}</p>
            <button onClick={() => window.location.reload()} className="btn btn-primary">
              Reintentar
            </button>
          </div>
        ) : (
          <div className="leaderboard-content">
            {leaderboard.length === 0 ? (
              <div className="empty-leaderboard">
                <div className="empty-emoji">🎮</div>
                <p className="empty-title">¡Aún no hay puntajes!</p>
                <p className="empty-description">Sé el primero en jugar y establecer un récord</p>
              </div>
            ) : (
              <div className="leaderboard-table-container">
                <table className="leaderboard-table">
                  <thead>
                    <tr>
                      <th className="position-col">Pos</th>
                      <th className="player-col">Jugador</th>
                      <th className="score-col">Puntaje</th>
                      <th className="date-col">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, index) => (
                      <tr 
                        key={index} 
                        className={`leaderboard-row ${index < 3 ? `top-${index + 1}` : ''}`}
                      >
                        <td className="position-cell">
                          <div className="position-content">
                            {index === 0 && <span className="trophy">🥇</span>}
                            {index === 1 && <span className="trophy">🥈</span>}
                            {index === 2 && <span className="trophy">🥉</span>}
                            {index + 1}
                          </div>
                        </td>
                        <td className="player-cell">
                          <div className="player-content">
                            <span className="player-name">{entry.username}</span>
                          </div>
                        </td>
                        <td className="score-cell">
                          <div className="score-content">
                            <span className="score-number">{entry.score.toLocaleString()}</span>
                            <span className="score-label">pts</span>
                          </div>
                        </td>
                        <td className="date-cell">
                          <span className="date-text">
                            {new Date(entry.timestamp).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="leaderboard-navigation">
          <button onClick={handleGoBack} className="btn btn-secondary">
            Volver al Menú
          </button>
          <button onClick={handleGoHome} className="btn btn-tertiary">
            Inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;