import './presentacion.css';

export function Presentacion({ nombre, apellido, profesion, imagen }) {
  return (
    <div className="card">
      <img src={imagen} alt="Imagen de perfil" />
      <h2>{nombre} {apellido}</h2>
      <p>{profesion}</p>
    </div>
  );
}
