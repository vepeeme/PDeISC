import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function FormularioUsuario() {
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    direccion: '',
    telefono: '',
    celular: '',
    fecha_nacimiento: '',
    email: ''
  });

  const [errores, setErrores] = useState({});
  const [touched, setTouched] = useState({});
  const [cargando, setCargando] = useState(false);
  const [mensajeError, setMensajeError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);

  const API = 'http://localhost:5000/usuarios';

  useEffect(() => {
    if (!esEdicion) return;
    (async () => {
      setMensajeError(null);
      try {
        const res = await fetch(`${API}/${id}`);
        if (!res.ok) {
          const b = await res.json().catch(()=>({}));
          throw new Error(b?.error || 'No se encontró el usuario');
        }
        const data = await res.json();
        setForm({
          nombre: data.nombre || '',
          apellido: data.apellido || '',
          direccion: data.direccion || '',
          telefono: data.telefono || '',
          celular: data.celular || '',
          fecha_nacimiento: data.fecha_nacimiento || '',
          email: data.email || ''
        });
      } catch (err) {
        setMensajeError(err.message || 'Error al cargar usuario');
        console.error(err);
      }
    })();
  }, [id]);

  // Validadores
  const reNombre = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'\-]+$/u;
  const reTelefono = /^[0-9+\s()\-]*$/;

  function validarCampo(name, value) {
    if (name === 'nombre' || name === 'apellido') {
      if (!value || value.trim() === '') return 'Requerido';
      if (!reNombre.test(value.trim())) return 'No puede contener números ni símbolos inválidos';
      return null;
    }
    if (name === 'telefono' || name === 'celular') {
      if (!value) return null;
      if (!reTelefono.test(value)) return 'Sólo dígitos, espacios, +, ( ) y guiones';
      return null;
    }
    if (name === 'email') {
      if (!value) return null;
      const reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!reEmail.test(value)) return 'Email inválido';
      return null;
    }
    return null;
  }

  const cambiar = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrores(prev => ({ ...prev, [name]: validarCampo(name, value) }));
  };

  const manejarBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrores(prev => ({ ...prev, [name]: validarCampo(name, value) }));
  };

  const validarTodo = () => {
    const nuevosErrores = {};
    Object.entries(form).forEach(([k, v]) => {
      const err = validarCampo(k, v);
      if (err) nuevosErrores[k] = err;
    });
    setErrores(nuevosErrores);
    const todosTouched = {};
    Object.keys(form).forEach(k => todosTouched[k] = true);
    setTouched(todosTouched);
    return Object.keys(nuevosErrores).length === 0;
  };

  const enviar = async (e) => {
    e.preventDefault();
    setMensajeError(null);
    setMensajeExito(null);

    if (!validarTodo()) {
      setMensajeError('Por favor corregí los errores del formulario.');
      return;
    }

    setCargando(true);
    try {
      const opciones = {
        method: esEdicion ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      };
      const url = esEdicion ? `${API}/${id}` : API;
      const res = await fetch(url, opciones);
      const cuerpo = await res.json().catch(()=>({}));
      if (!res.ok) throw new Error(cuerpo?.error || 'Error en el servidor');

      setMensajeExito(esEdicion ? 'Usuario actualizado correctamente.' : 'Usuario creado correctamente.');
      setTimeout(() => navigate('/usuarios'), 900);
    } catch (err) {
      setMensajeError(err.message || 'Error al guardar usuario');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const claseInput = (campo) => {
    if (!touched[campo]) return 'form-control';
    return errores[campo] ? 'form-control is-invalid' : 'form-control is-valid';
  };

  return (
    <div>
      <h3>{esEdicion ? 'Editar Usuario' : 'Crear Usuario'}</h3>

      {mensajeError && <div className="alert alert-danger" role="alert">{mensajeError}</div>}
      {mensajeExito && <div className="alert alert-success" role="alert">{mensajeExito}</div>}

      <form onSubmit={enviar} className="row g-3" noValidate>
        <div className="col-md-6">
          <label className="form-label">Nombre</label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={cambiar}
            onBlur={manejarBlur}
            className={claseInput('nombre')}
            required
          />
          {touched.nombre && errores.nombre && <div className="invalid-feedback d-block">{errores.nombre}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label">Apellido</label>
          <input
            name="apellido"
            value={form.apellido}
            onChange={cambiar}
            onBlur={manejarBlur}
            className={claseInput('apellido')}
            required
          />
          {touched.apellido && errores.apellido && <div className="invalid-feedback d-block">{errores.apellido}</div>}
        </div>

        <div className="col-12">
          <label className="form-label">Dirección</label>
          <input name="direccion" value={form.direccion} onChange={cambiar} className="form-control" />
        </div>

        <div className="col-md-4">
          <label className="form-label">Teléfono</label>
          <input
            name="telefono"
            value={form.telefono}
            onChange={cambiar}
            onBlur={manejarBlur}
            className={claseInput('telefono')}
          />
          {touched.telefono && errores.telefono && <div className="invalid-feedback d-block">{errores.telefono}</div>}
        </div>

        <div className="col-md-4">
          <label className="form-label">Celular</label>
          <input
            name="celular"
            value={form.celular}
            onChange={cambiar}
            onBlur={manejarBlur}
            className={claseInput('celular')}
          />
          {touched.celular && errores.celular && <div className="invalid-feedback d-block">{errores.celular}</div>}
        </div>

        <div className="col-md-4">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={cambiar}
            onBlur={manejarBlur}
            className={claseInput('email')}
          />
          {touched.email && errores.email && <div className="invalid-feedback d-block">{errores.email}</div>}
        </div>

        <div className="col-md-4">
          <label className="form-label">Fecha de Nacimiento</label>
          <input type="date" name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={cambiar} className="form-control" />
        </div>

        <div className="col-12">
          <button className="btn btn-primary" disabled={cargando}>
            {cargando ? (esEdicion ? 'Guardando...' : 'Creando...') : (esEdicion ? 'Guardar cambios' : 'Crear usuario')}
          </button>
        </div>
      </form>
    </div>
  );
}
