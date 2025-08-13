import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Crear({ agregarTarea }) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validarTexto = (texto) => /[a-zA-Z]/.test(texto) && !/^\d+$/.test(texto.trim());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validarTexto(titulo)) { setError('Título inválido'); return; }
    if (!validarTexto(descripcion)) { setError('Descripción inválida'); return; }
    agregarTarea(titulo, descripcion);
    navigate('/');
  };

  return (
    <div className="container my-4">
      <h1>Crear Tarea</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input className="form-control" placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} />
        </div>
        <div className="mb-3">
          <textarea className="form-control" placeholder="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">Guardar</button>
      </form>
    </div>
  );
}
