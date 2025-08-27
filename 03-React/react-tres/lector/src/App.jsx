import { Routes, Route, Navigate } from 'react-router-dom';
import BarraNav from './components/BarraNav';
import ListaUsuarios from './pages/ListaUsuarios';
import DetalleUsuario from './pages/DetalleUsuario';
import FormularioUsuario from './pages/FormularioUsuario';

export default function App() {
  return (
    <>
      <BarraNav />
      <div className="container my-4">
        <Routes>
          <Route path="/" element={<Navigate to="/usuarios" replace />} />
          <Route path="/usuarios" element={<ListaUsuarios />} />
          <Route path="/usuarios/crear" element={<FormularioUsuario />} />
          <Route path="/usuarios/editar/:id" element={<FormularioUsuario />} />
          <Route path="/usuarios/:id" element={<DetalleUsuario />} />
        </Routes>
      </div>
    </>
  );
}
