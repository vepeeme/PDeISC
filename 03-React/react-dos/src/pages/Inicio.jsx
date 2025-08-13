import React from 'react';
import { Link } from 'react-router-dom';

export default function Inicio({ tareas, toggleCompleta, borrarTarea }) {
  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Lista de Tareas</h1>
        <Link to="/crear" className="btn btn-primary">Crear Tarea</Link>
      </div>

      {tareas.length === 0 ? (
        <p>No hay tareas</p>
      ) : (
        <ul className="list-group">
          {tareas.map(t => (
            <li key={t.id} className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
              <div>
                <strong>{t.titulo}</strong> - {t.descripcion.slice(0, 30)}...
              </div>
              <div className="mt-2 mt-sm-0">
                <Link to={`/detalles/${t.id}`} className="btn btn-outline-info btn-sm me-2">Detalles</Link>
                <button className="btn btn-outline-success btn-sm me-2" onClick={() => toggleCompleta(t.id)}>
                  {t.completada ? 'Marcar incompleta' : 'Completar'}
                </button>
                {t.completada && (
                  <button className="btn btn-outline-danger btn-sm" onClick={() => borrarTarea(t.id)}>Borrar</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
