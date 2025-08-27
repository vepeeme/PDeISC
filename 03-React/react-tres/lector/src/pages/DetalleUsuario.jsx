import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function DetalleUsuario() {
  const { id } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const API = 'http://localhost:5000/usuarios';

  useEffect(() => {
    (async () => {
      setError(null);
      setCargando(true);
      try {
        const res = await fetch(`${API}/${id}`);
        if (!res.ok) {
          const body = await res.json().catch(()=>({}));
          throw new Error(body?.error || 'Usuario no encontrado');
        }
        const data = await res.json();
        setUsuario(data);
      } catch (err) {
        setError(err.message || 'Error al cargar usuario');
        console.error(err);
      } finally {
        setCargando(false);
      }
    })();
  }, [id]);

  return (
    <div>
      <h3>Detalle usuario</h3>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      {cargando ? (
        <div className="text-center py-4">Cargando...</div>
      ) : usuario ? (
        <div className="card">
          <div className="card-body">
            <p><strong>ID:</strong> {usuario.id}</p>
            <p><strong>Nombre:</strong> {usuario.nombre} {usuario.apellido}</p>
            <p><strong>Email:</strong> {usuario.email || '—'}</p>
            <p><strong>Dirección:</strong> {usuario.direccion || '—'}</p>
            <p><strong>Teléfono:</strong> {usuario.telefono || '—'}</p>
            <p><strong>Celular:</strong> {usuario.celular || '—'}</p>
            <p><strong>Fecha de Nacimiento:</strong> {usuario.fecha_nacimiento || '—'}</p>
            <Link to="/usuarios" className="btn btn-secondary">Volver al listado</Link>
          </div>
        </div>
      ) : (
        <div className="text-muted">Usuario no disponible.</div>
      )}
    </div>
  );
}
