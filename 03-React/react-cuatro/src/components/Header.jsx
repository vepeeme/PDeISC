import React from 'react';
import { motion } from 'framer-motion';
import { LogIn, LogOut } from 'lucide-react';

const Header = ({ activeSection, setActiveSection, isAdmin, setIsAdmin, setShowLogin }) => {
  const sections = [
    { id: 'home', name: 'Inicio' },
    { id: 'skills', name: 'Habilidades' },
    { id: 'achievements', name: 'Logros' },
    { id: 'projects', name: 'Proyectos' },
    { id: 'experiences', name: 'Experiencia' }
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-gray-800"
        >
          Portfolio
        </motion.h1>
        
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-6">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`transition-colors ${
                  activeSection === section.id 
                    ? 'text-blue-600 font-semibold' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {section.name}
              </button>
            ))}
          </nav>
          
          {isAdmin ? (
            <button
              onClick={() => setIsAdmin(false)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center gap-2"
            >
              <LogOut size={16} /> Salir
            </button>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
            >
              <LogIn size={16} /> Admin
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;