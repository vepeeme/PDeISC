import { useState } from "react";
import "./lista.css";

export function Lista() {
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [error, setError] = useState("");

  const agregarTarea = () => {
    if (nuevaTarea.trim() === "") {
      setError("La tarea no puede estar vacía");
      return;
    }
    setError("");
    const nueva = { texto: nuevaTarea, completada: false };
    setTareas([...tareas, nueva]);
    setNuevaTarea("");
  };

  const marcarComoCompletada = (index) => {
    const tareasActualizadas = [...tareas];
    tareasActualizadas[index].completada = !tareasActualizadas[index].completada;
    setTareas(tareasActualizadas);
  };

  return (
    <div className="tareas">
      <h2>Lista de Tareas</h2>
      <div className="formulario">
        <input
          type="text"
          placeholder="Escribí una tarea"
          value={nuevaTarea}
          onChange={(e) => setNuevaTarea(e.target.value)}
        />
        <button onClick={agregarTarea}>Agregar</button>
      </div>
      {error && <p className="error">{error}</p>}
      <ul>
        {tareas.map((tarea, index) => (
          <li
            key={index}
            onClick={() => marcarComoCompletada(index)}
            className={tarea.completada ? "completada" : ""}
          >
            {tarea.texto}
          </li>
        ))}
      </ul>
    </div>
  );
}
