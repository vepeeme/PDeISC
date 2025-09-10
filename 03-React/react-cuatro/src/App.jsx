import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import LoginModal from './components/LoginModal';
import HomePage from './pages/HomePage';
import SkillsPage from './pages/SkillsPage';
import AchievementsPage from './pages/AchievementsPage';
import ProjectsPage from './pages/ProjectsPage';
import ExperiencesPage from './pages/ExperiencesPage';
import { createItem, readItems, updateItem, deleteItem } from './supabase';
import toast, { Toaster } from 'react-hot-toast'; // <--- 1. IMPORTAR TOAST

function App() {
  console.log("URL de Supabase leída:", import.meta.env.VITE_SUPABASE_URL);
console.log("¿Existe la Key de Supabase?:", !!import.meta.env.VITE_SUPABASE_KEY);
  const [activeSection, setActiveSection] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  const [skills, setSkills] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    const initializeApp = async () => {
      console.log('Cargando datos...');
      await loadAllData();
      setLoading(false);
    };
    initializeApp();
  }, []);

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
      toast.error('No se pudieron cargar los datos.');
    }
  };

  const handleCreateItem = async (type, data) => {
    const promise = createItem(type, data);
    toast.promise(promise, {
      loading: 'Guardando...',
      success: (result) => {
        if (result.success) {
          switch (type) {
            case 'skills': setSkills(prev => [...prev, result.data]); break;
            case 'achievements': setAchievements(prev => [...prev, result.data]); break;
            case 'projects': setProjects(prev => [...prev, result.data]); break;
            case 'experiences': setExperiences(prev => [...prev, result.data]); break;
          }
          return `Elemento creado exitosamente!`;
        } else {
          throw new Error(result.error);
        }
      },
      error: `Error al crear el elemento: ${promise.error}`
    });
  };

  const handleUpdateItem = async (type, id, data) => {
    const promise = updateItem(type, id, data);
    toast.promise(promise, {
      loading: 'Actualizando...',
      success: (result) => {
        if (result.success) {
          const updateState = (setState) => {
            setState(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));
          };
          switch (type) {
            case 'skills': updateState(setSkills); break;
            case 'achievements': updateState(setAchievements); break;
            case 'projects': updateState(setProjects); break;
            case 'experiences': updateState(setExperiences); break;
          }
          return 'Elemento actualizado exitosamente!';
        } else {
          throw new Error(result.error);
        }
      },
      error: `Error al actualizar el elemento.`
    });
  };

  const handleDeleteItem = async (type, id) => {
    const promise = deleteItem(type, id);
    toast.promise(promise, {
      loading: 'Eliminando...',
      success: (result) => {
        if (result.success) {
          const updateState = (setState) => {
            setState(prev => prev.filter(item => item.id !== id));
          };
          switch (type) {
            case 'skills': updateState(setSkills); break;
            case 'achievements': updateState(setAchievements); break;
            case 'projects': updateState(setProjects); break;
            case 'experiences': updateState(setExperiences); break;
          }
          return 'Elemento eliminado exitosamente!';
        } else {
          throw new Error(result.error);
        }
      },
      error: `Error al eliminar el elemento.`
    });
  };

  const renderContent = () => {
    // ... (El contenido de esta función no cambia)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        {/* ... Contenido del loader ... */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Toaster position="top-center" reverseOrder={false} /> {/* <--- 2. AÑADIR EL CONTENEDOR DE TOASTS */}
      <Header 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        setShowLogin={setShowLogin}
      />
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
      <LoginModal 
        showLogin={showLogin}
        setShowLogin={setShowLogin}
        setIsAdmin={setIsAdmin}
      />
      <footer className="bg-gray-800 text-white py-6 mt-12">
        {/* ... Contenido del footer ... */}
      </footer>
    </div>
  );
}

export default App;