import React, { useState } from 'react';
import { login } from '../../services/auth';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Validaciones
  const validateForm = () => {
    const newErrors = {};

    // Validar username
    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    } else if (formData.username.length < 3) {
      newErrors.username = 'El nombre debe tener al menos 3 caracteres';
    } else if (formData.username.length > 20) {
      newErrors.username = 'El nombre no puede tener más de 20 caracteres';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.username)) {
      newErrors.username = 'El nombre solo puede contener letras y espacios';
    }

    // Validar password
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Para username, filtrar números en tiempo real
    if (name === 'username') {
      const filteredValue = value.replace(/[0-9]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: filteredValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Limpiar error específico cuando el usuario empieza a corregir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await login(formData.username, formData.password);
      
      // Guardar datos del usuario en localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify({
          id: response.user.id,
          username: response.user.username
        }));

        // Ir al menú principal en lugar de directo al juego
        window.location.href = '/menu';
      }
    } catch (error) {
      setErrors({
        general: error.response?.data?.error || 'Error al iniciar sesión. Verifica tus credenciales.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (path) => {
    if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };

  return (
    <div className="auth-form">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error general */}
        {errors.general && (
          <div className="error-message">
            {errors.general}
          </div>
        )}

        {/* Username */}
        <div className="form-control">
          <label htmlFor="username" className="form-label">
            Nombre de Usuario
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className={`form-input ${errors.username ? 'error' : ''}`}
            placeholder="Ingresa tu nombre de usuario"
            autoComplete="username"
          />
          {errors.username && (
            <p className="error-text">{errors.username}</p>
          )}
        </div>

        {/* Password */}
        <div className="form-control">
          <label htmlFor="password" className="form-label">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`form-input ${errors.password ? 'error' : ''}`}
            placeholder="Ingresa tu contraseña"
            autoComplete="current-password"
          />
          {errors.password && (
            <p className="error-text">{errors.password}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary"
        >
          {isLoading ? (
            <div className="btn-loading">
              <div className="loading-spinner-small"></div>
              Iniciando sesión...
            </div>
          ) : (
            'Iniciar Sesión'
          )}
        </button>
      </form>

      {/* Links adicionales */}
      <div className="auth-links">
        <button
          type="button"
          onClick={() => handleNavigate('/leaderboard')}
          className="link-button"
        >
          Ver Ranking de Jugadores
        </button>
        <button
          type="button"
          onClick={() => handleNavigate('/two-player')}
          className="link-button"
        >
          Modo 2 Jugadores
        </button>
      </div>
    </div>
  );
};

export default LoginForm;