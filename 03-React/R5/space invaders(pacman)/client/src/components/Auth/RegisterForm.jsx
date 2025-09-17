import React, { useState } from 'react';
import { register } from '../../services/auth';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

    // Validar email
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no tiene un formato válido';
    }

    // Validar password
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener al menos una mayúscula, una minúscula y un número';
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
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
      await register(formData.username, formData.email, formData.password);
      setSuccess(true);
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      
      // Mostrar éxito por 3 segundos y luego ir al login
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.reload(); // Para cambiar al modo login en HomePage
        }
      }, 3000);

    } catch (error) {
      setErrors({
        general: error.response?.data?.error || 'Error al crear la cuenta. Inténtalo de nuevo.'
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

  // Si el registro fue exitoso, mostrar mensaje de éxito
  if (success) {
    return (
      <div className="success-message">
        <div className="success-content">
          <div className="success-emoji">✅</div>
          <h3 className="success-title">¡Cuenta creada exitosamente!</h3>
          <p className="success-description">Tu cuenta ha sido registrada correctamente.</p>
          <p className="success-redirect">Serás redirigido automáticamente para iniciar sesión...</p>
        </div>
      </div>
    );
  }

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
            Nombre de Usuario *
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className={`form-input ${errors.username ? 'error' : ''}`}
            placeholder="Solo letras y espacios"
            autoComplete="username"
          />
          {errors.username && (
            <p className="error-text">{errors.username}</p>
          )}
          <p className="input-hint">Los números no están permitidos en el nombre</p>
        </div>

        {/* Email */}
        <div className="form-control">
          <label htmlFor="email" className="form-label">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`form-input ${errors.email ? 'error' : ''}`}
            placeholder="tu@email.com"
            autoComplete="email"
          />
          {errors.email && (
            <p className="error-text">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="form-control">
          <label htmlFor="password" className="form-label">
            Contraseña *
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`form-input ${errors.password ? 'error' : ''}`}
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
          />
          {errors.password && (
            <p className="error-text">{errors.password}</p>
          )}
          <p className="input-hint">Debe contener mayúscula, minúscula y número</p>
        </div>

        {/* Confirm Password */}
        <div className="form-control">
          <label htmlFor="confirmPassword" className="form-label">
            Confirmar Contraseña *
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
            placeholder="Repite tu contraseña"
            autoComplete="new-password"
          />
          {errors.confirmPassword && (
            <p className="error-text">{errors.confirmPassword}</p>
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
              Creando cuenta...
            </div>
          ) : (
            'Crear Cuenta'
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

      {/* Nota sobre campos requeridos */}
      <p className="required-note">* Campos requeridos</p>
    </div>
  );
};

export default RegisterForm;