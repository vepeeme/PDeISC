import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ErrorDisplay from '../components/ErrorDisplay';
import ProjectForm from '../components/ProjectForm';
import SkillForm from '../components/SkillForm';
import ExperienceForm from '../components/ExperienceForm';
import AboutForm from '../components/AboutForm';

const AdminPage = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('projects');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <main>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>Cargando...</h2>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const tabs = [
    { id: 'projects', label: 'Proyectos'},
    { id: 'skills', label: 'Habilidades'},
    { id: 'experiences', label: 'Experiencias'},
    { id: 'about', label: 'Sobre Mí'}
  ];

  return (
    <main>
      <div className="admin-header fade-in">
        <div>
          <h1 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
            Panel de Administración
          </h1>
          <p style={{ color: 'var(--text-light)' }}>
            Gestiona tu contenido del portfolio
          </p>
        </div>
      </div>

      <div className="card fade-in">
        <div className="tabs">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              className={activeTab === tab.id ? 'active' : ''} 
              onClick={() => setActiveTab(tab.id)}
            >
              <span style={{ marginRight: '0.5rem' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="tab-content">
          {activeTab === 'projects' && (
            <div className="fade-in">
              <ProjectForm />
            </div>
          )}
          {activeTab === 'skills' && (
            <div className="fade-in">
              <SkillForm />
            </div>
          )}
          {activeTab === 'experiences' && (
            <div className="fade-in">
              <ExperienceForm />
            </div>
          )}
          {activeTab === 'about' && (
            <div className="fade-in">
              <AboutForm />
            </div>
          )}
        </div>
        
        {error && <ErrorDisplay message={error} />}
      </div>
    </main>
  );
};

export default AdminPage;