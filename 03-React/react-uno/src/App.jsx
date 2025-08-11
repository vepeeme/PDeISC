import { Hola } from './hola.jsx';
import { Presentacion } from './presentacion.jsx';
import { Contador } from './contador.jsx';
import { Lista } from './lista.jsx';
import { Formulario } from './formulario.jsx';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Hola />
        <Presentacion
          nombre="Valentino"
          apellido="Palma Martorello"
          profesion="Desarrollador Web"
          imagen="https://thumbs.dreamstime.com/b/oficinista-feliz-33943460.jpg   "
        />
        <Contador />
        <Lista />
        <Formulario />
      </header>
    </div>
  );
}

export default App;
