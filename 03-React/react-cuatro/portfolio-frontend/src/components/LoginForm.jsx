import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onError }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    onError('');

    try {
      await login(username, password);
      navigate('/admin');
    } catch (err) {
      console.error('Error de login:', err);
      if (err.response?.status === 404) {
        onError('No se puede conectar con el servidor. Verifica que el backend esté ejecutándose.');
      } else if (err.response?.status === 401) {
        onError('Credenciales inválidas. Usa: vepeeme / vepeeme1234');
      } else {
        onError('Error de conexión. Verifica que el backend esté funcionando.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-group">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nombre de usuario"
          required
          disabled={loading}
        />
      </div>
      
      <div className="input-group">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
          disabled={loading}
        />
      </div>
      
      <button 
        type="submit" 
        className="btn btn-primary" 
        disabled={loading}
        style={{ width: '100%' }}
      >
        {loading ? 'Ingresando...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
};

export default LoginForm;