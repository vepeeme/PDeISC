import React, { useEffect, useState } from 'react';
import TablaUsuarios from '../components/TablaUsuarios';

/**
 * ListaUsuarios: hace fetch directo a http://localhost:5000/usuarios
 * - No usa alerts; muestra mensajes con Bootstrap alert.
 * - Flujo de eliminación con confirmación inline.
 */

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const API = 'http://localhost:5000/usuarios';

  const cargarUsuarios = async () => {
    setError(null);
    setExito(null);
    setCargando(true);
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error('Error al obtener usuarios');
      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      setError('No se pudo cargar la lista de usuarios.');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarUsuarios(); }, []);

  const solicitarEliminar = (id) => {
    setExito(null);
    setError(null);
    setConfirmId(id);
  };

  const cancelarEliminar = () => {
    setConfirmId(null);
  };

  const confirmarEliminar = async (id) => {
    setError(null);
    setExito(null);
    try {
      const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const body = await res.json().catch(()=>({}));
        throw new Error(body?.error || 'Error al eliminar usuario');
      }
      setExito('Usuario eliminado correctamente.');
      setConfirmId(null);
      await cargarUsuarios();
    } catch (err) {
      setError(err.message || 'Error al eliminar usuario');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Usuarios</h2>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {exito && <div className="alert alert-success" role="alert">{exito}</div>}

      {cargando ? (
        <div className="text-center py-4">Cargando...</div>
      ) : (
        <TablaUsuarios
          usuarios={usuarios}
          onSolicitarEliminar={solicitarEliminar}
          onConfirmarEliminar={confirmarEliminar}
          onCancelarEliminar={cancelarEliminar}
          confirmId={confirmId}
        />
      )}
    </div>
  );
}
