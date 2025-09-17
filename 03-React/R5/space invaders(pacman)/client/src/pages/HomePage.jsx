import React, { useState } from 'react';
import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';

const HomePage = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="fullscreen-container">
      <div className="app-container">
        <div className="text-center mb-4">
          <h1>Space Invaders</h1>
          <p className="text-space-white" style={{ opacity: 0.7, fontSize: '1.1rem', marginTop: '1rem' }}>
            Inicia sesión o regístrate para jugar
          </p>
        </div>
        
        <div className="tab-navigation">
          <button
            onClick={() => setShowLogin(true)}
            className={`tab-button ${showLogin ? 'active' : ''}`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => setShowLogin(false)}
            className={`tab-button ${!showLogin ? 'active' : ''}`}
          >
            Registrarse
          </button>
        </div>
        
        {showLogin ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
};

export default HomePage;