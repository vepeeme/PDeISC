import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ErrorDisplay from '../components/ErrorDisplay';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  if (user) {
    return null;
  }

  return (
    <main>
      <div className="form-container">
        <div className="login-form fade-in">
          <div className="form-header">
            <h2>Panel de Administración</h2>
            <p>Ingresa tus credenciales para acceder</p>
          </div>
          
          <LoginForm onError={setError} />
          {error && <ErrorDisplay message={error} />}
          
        </div>
      </div>
    </main>
  );
};

export default LoginPage;