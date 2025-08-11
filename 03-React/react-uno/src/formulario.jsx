import { useState } from "react";
import "./formulario.css";

export function Formulario() {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const manejarSubmit = (e) => {
    e.preventDefault();
    if (nombre.trim() === "") {
      setError("Por favor ingrese su nombre.");
      setMensaje("");
      return;
    }
    setError("");
    setMensaje(`¡Bienvenido, ${nombre}!`);
    setNombre("");
  };

  return (
    <div className="form-container">
      <h2>Formulario</h2>
      <form onSubmit={manejarSubmit}>
        <input
          type="text"
          placeholder="Escribe tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>
      {error && <p className="error">{error}</p>}
      {mensaje && <p className="mensaje">{mensaje}</p>}
    </div>
  );
}
