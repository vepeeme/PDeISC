import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function BarraNav() {
  const location = useLocation();
  const [abierta, setAbierta] = useState(false);

  // Cerrar el menú al cambiar de ruta (útil en mobile)
  useEffect(() => {
    setAbierta(false);
  }, [location.pathname]);

  // Si estamos exactamente en /usuarios (listado) mostramos "Agregar".
  // En cualquier otra ruta mostramos "Listado".
  const mostrarAgregar = location.pathname === '/usuarios' || location.pathname === '/';
  const enlace = mostrarAgregar ? { to: '/usuarios/crear', texto: 'Agregar' } : { to: '/usuarios', texto: 'Listado' };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">ABMLC Usuarios</Link>

        {/* Toggler controlado por React (no depende del JS de Bootstrap) */}
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="nav"
          aria-expanded={abierta}
          aria-label="Toggle navigation"
          onClick={() => setAbierta(prev => !prev)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${abierta ? 'show' : ''}`} id="nav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to={enlace.to}>{enlace.texto}</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
