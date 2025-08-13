import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function Detalles({ tareas, actualizarTarea }) {
  const { id } = useParams();
  const tarea = tareas.find(t => t.id === Number(id));
  const [titulo, setTitulo] = useState(tarea?.titulo || '');
  const [descripcion, setDescripcion] = useState(tarea?.descripcion || '');

  if (!tarea) return <div className="container my-4"><p>Tarea no encontrada</p><Link to="/" className="btn btn-secondary mt-2">Volver</Link></div>;

  const handleActualizar = () => {
    if (titulo.trim() && descripcion.trim()) {
      actualizarTarea(tarea.id, { titulo, descripcion });
    }
  };

  return (
    <div className="container my-4">
      <h1>Detalles de la Tarea</h1>
      <div className="mb-3">
        <input className="form-control mb-2" value={titulo} onChange={e => setTitulo(e.target.value)} />
        <textarea className="form-control" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
      </div>
      <p>Estado: <strong>{tarea.completada ? 'Completada' : 'Incompleta'}</strong></p>
      <button className="btn btn-success me-2" onClick={handleActualizar}>Actualizar</button>
      <Link to="/" className="btn btn-secondary">⬅ Volver</Link>
    </div>
  );
}
