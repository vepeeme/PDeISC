import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Props:
 * - usuarios: array
 * - onSolicitarEliminar(id)
 * - onConfirmarEliminar(id)
 * - onCancelarEliminar()
 * - confirmId: id en confirmación o null
 */
export default function TablaUsuarios({ usuarios = [], onSolicitarEliminar, onConfirmarEliminar, onCancelarEliminar, confirmId }) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length === 0 ? (
            <tr><td colSpan="6" className="text-center">No hay usuarios</td></tr>
          ) : usuarios.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nombre}</td>
              <td>{u.apellido}</td>
              <td>{u.email}</td>
              <td>{u.telefono || u.celular || '—'}</td>
              <td className="text-end">
                <Link to={`/usuarios/${u.id}`} className="btn btn-sm btn-outline-primary me-2">Ver</Link>
                <Link to={`/usuarios/editar/${u.id}`} className="btn btn-sm btn-outline-warning me-2">Editar</Link>

                {confirmId === u.id ? (
                  <>
                    <button className="btn btn-sm btn-danger me-2" onClick={() => onConfirmarEliminar(u.id)}>Confirmar</button>
                    <button className="btn btn-sm btn-secondary" onClick={() => onCancelarEliminar()}>Cancelar</button>
                  </>
                ) : (
                  <button className="btn btn-sm btn-outline-danger" onClick={() => onSolicitarEliminar(u.id)}>Eliminar</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
