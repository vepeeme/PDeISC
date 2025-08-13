import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Inicio from './pages/Inicio';
import Crear from './pages/Crear';
import Detalles from './pages/Detalles';

export default function App() {
  const [tareas, setTareas] = useState([]);

  const agregarTarea = (titulo, descripcion) => {
    setTareas([...tareas, { id: Date.now(), titulo, descripcion, completada: false }]);
  };

  const actualizarTarea = (id, nuevosDatos) => {
    setTareas(tareas.map(t => t.id === id ? { ...t, ...nuevosDatos } : t));
  };

  const borrarTarea = (id) => {
    setTareas(tareas.filter(t => t.id !== id));
  };

  const toggleCompleta = (id) => {
    setTareas(tareas.map(t => t.id === id ? { ...t, completada: !t.completada } : t));
  };

  return (
    <Routes>
      <Route path="/" element={<Inicio tareas={tareas} toggleCompleta={toggleCompleta} borrarTarea={borrarTarea} />} />
      <Route path="/crear" element={<Crear agregarTarea={agregarTarea} />} />
      <Route path="/detalles/:id" element={<Detalles tareas={tareas} actualizarTarea={actualizarTarea} />} />
    </Routes>
  );
}
