import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast'; // <--- IMPORTAR TOAST

const LoginModal = ({ showLogin, setShowLogin, setIsAdmin }) => {
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (password === 'admin123') {
      setIsAdmin(true);
      setShowLogin(false);
      setPassword('');
      toast.success('¡Sesión iniciada!');
    } else {
      toast.error('Contraseña incorrecta.'); // <--- CAMBIAR ALERT POR TOAST
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <AnimatePresence>
      {showLogin && (
        <motion.div
          // ... (props de motion)
        >
          <motion.div
            // ... (props de motion)
            className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Login de Administrador</h3>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleLogin}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => {
                  setShowLogin(false);
                  setPassword('');
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;