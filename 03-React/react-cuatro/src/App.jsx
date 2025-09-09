import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import LoginModal from './components/LoginModal';
import HomePage from './pages/HomePage';
import SkillsPage from './pages/SkillsPage';
import AchievementsPage from './pages/AchievementsPage';
import ProjectsPage from './pages/ProjectsPage';
import ExperiencesPage from './pages/ExperiencesPage';
import { 
  initializeDatabase, 
  createItem, 
  readItems, 
  updateItem, 
  deleteItem 
} from './supabase';

function App() {
  // Estados principales
  const [activeSection, setActiveSection] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Estados de datos
  const [skills, setSkills] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);

  // Inicializar la aplicación
  useEffect(() => {
    const initializeApp = async () => {
      console.log('Inicializando aplicación...');
      
      // Inicializar base de datos
      await initializeDatabase();
      
      // Cargar todos los datos
      await loadAllData();
      
      setLoading(false);
    };

    initializeApp();
  }, []);

  // Cargar todos los datos desde la base de datos
  const loadAllData = async () => {
    try {
      const [skillsResult, achievementsResult, projectsResult, experiencesResult] = await Promise.all([
        readItems('skills'),
        readItems('achievements'),
        readItems('projects'),
        readItems('experiences')
      ]);

      setSkills(skillsResult.data || []);
      setAchievements(achievementsResult.data || []);
      setProjects(projectsResult.data || []);
      setExperiences(experiencesResult.data || []);
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  // Función genérica para crear items
  const handleCreateItem = async (type, data) => {
    try {
      const result = await createItem(type, data);
      
      if (result.success) {
        // Actualizar el estado local
        switch (type) {
          case 'skills':
            setSkills(prev => [...prev, result.data]);
            break;
          case 'achievements':
            setAchievements(prev => [...prev, result.data]);
            break;
          case 'projects':
            setProjects(prev => [...prev, result.data]);
            break;
          case 'experiences':
            setExperiences(prev => [...prev, result.data]);
            break;
        }
        console.log(`${type} creado exitosamente`);
      } else {
        alert(`Error creando ${type}: ${result.error}`);
      }
    } catch (error) {
      console.error(`Error creando ${type}:`, error);
      alert(`Error creando ${type}`);
    }
  };

  // Función genérica para actualizar items
  const handleUpdateItem = async (type, id, data) => {
    try {
      const result = await updateItem(type, id, data);
      
      if (result.success) {
        // Actualizar el estado local
        const updateState = (setState) => {
          setState(prev => prev.map(item => 
            item.id === id ? { ...item, ...data } : item
          ));
        };

        switch (type) {
          case 'skills':
            updateState(setSkills);
            break;
          case 'achievements':
            updateState(setAchievements);
            break;
          case 'projects':
            updateState(setProjects);
            break;
          case 'experiences':
            updateState(setExperiences);
            break;
        }
        console.log(`${type} actualizado exitosamente`);
      } else {
        alert(`Error actualizando ${type}: ${result.error}`);
      }
    } catch (error) {
      console.error(`Error actualizando ${type}:`, error);
      alert(`Error actualizando ${type}`);
    }
  };

  // Función genérica para eliminar items
  const handleDeleteItem = async (type, id) => {
    try {
      const result = await deleteItem(type, id);
      
      if (result.success) {
        // Actualizar el estado local
        const updateState = (setState) => {
          setState(prev => prev.filter(item => item.id !== id));
        };

        switch (type) {
          case 'skills':
            updateState(setSkills);
            break;
          case 'achievements':
            updateState(setAchievements);
            break;
          case 'projects':
            updateState(setProjects);
            break;
          case 'experiences':
            updateState(setExperiences);
            break;
        }
        console.log(`${type} eliminado exitosamente`);
      } else {
        alert(`Error eliminando ${type}: ${result.error}`);
      }
    } catch (error) {
      console.error(`Error eliminando ${type}:`, error);
      alert(`Error eliminando ${type}`);
    }
  };

  // Renderizar contenido según la sección activa
  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <HomePage />;
      case 'skills':
        return (
          <SkillsPage 
            skills={skills}
            isAdmin={isAdmin}
            onCreateItem={handleCreateItem}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
          />
        );
      case 'achievements':
        return (
          <AchievementsPage 
            achievements={achievements}
            isAdmin={isAdmin}
            onCreateItem={handleCreateItem}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
          />
        );
      case 'projects':
        return (
          <ProjectsPage 
            projects={projects}
            isAdmin={isAdmin}
            onCreateItem={handleCreateItem}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
          />
        );
      case 'experiences':
        return (
          <ExperiencesPage 
            experiences={experiences}
            isAdmin={isAdmin}
            onCreateItem={handleCreateItem}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
          />
        );
      default:
        return <HomePage />;
    }
  };

  // Mostrar loading mientras se inicializa
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg"
        />
        <p className="ml-4 text-xl font-semibold text-gray-700">Cargando Portfolio...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <Header 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        setShowLogin={setShowLogin}
      />

      {/* Contenido principal */}
      <main className="container mx-auto px-4">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {renderContent()}
        </motion.div>
      </main>

      {/* Modal de login */}
      <LoginModal 
        showLogin={showLogin}
        setShowLogin={setShowLogin}
        setIsAdmin={setIsAdmin}
      />

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Portfolio Personal. Desarrollado con React y Supabase.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;