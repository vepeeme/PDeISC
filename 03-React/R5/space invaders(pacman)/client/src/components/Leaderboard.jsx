import React from 'react';

const Leaderboard = ({ leaderboard }) => {
  return (
    <div className="overflow-x-auto">
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th className="text-space-white">Posición</th>
            <th className="text-space-white">Jugador</th>
            <th className="text-space-white">Puntaje</th>
            <th className="text-space-white">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr 
              key={index} 
              className={index % 2 === 0 ? "bg-space-blue-dark" : "bg-space-blue"}
            >
              <td className="text-space-white">{index + 1}</td>
              <td className="text-space-white">{entry.username}</td>
              <td className="text-space-white">{entry.score}</td>
              <td className="text-space-white/70">
                {new Date(entry.timestamp).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;