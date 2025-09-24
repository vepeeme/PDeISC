import { useState, useEffect } from 'react';
import api from '../services/api';
import ErrorDisplay from '../components/ErrorDisplay';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await api.get('/projects');
        setProjects(response.data);
      } catch (err) {
        setError('Error al cargar los proyectos');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <main>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '60vh',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid var(--border-color)',
            borderTop: '4px solid var(--primary-color)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <h2 style={{ color: 'var(--text-light)' }}>Cargando proyectos...</h2>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="page-header fade-in" style={{ marginTop: '2rem', marginBottom: '3rem' }}>
        <h1> Mis Proyectos</h1>
        <p>Una colección de mis trabajos más destacados y proyectos personales</p>
      </div>

      {error && <ErrorDisplay message={error} />}
      
      <section className="fade-in">
        {projects.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2.5rem',
            marginTop: '2rem'
          }}>
            {projects.map((project, index) => (
              <div 
                key={project.id}
                className="project fade-in"
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow)',
                  border: '1px solid var(--border-color)',
                  transition: 'all 0.3s ease',
                  animationDelay: `${index * 0.1}s`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-12px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow)';
                }}
              >
                {project.image_url && (
                  <div style={{ 
                    position: 'relative', 
                    paddingBottom: '56.25%', 
                    overflow: 'hidden',
                    background: 'var(--bg-light)'
                  }}>
                    <img 
                      src={project.image_url} 
                      alt={project.title}
                      style={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%', 
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 100%)'
                    }}></div>
                  </div>
                )}
                
                <div style={{ padding: '2rem' }}>
                  <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ 
                      color: 'var(--primary-color)', 
                      marginBottom: '1rem',
                      fontSize: '1.5rem',
                      fontWeight: '700'
                    }}>
                      {project.title}
                    </h2>
                    
                    {project.date && (
                      <div style={{ marginBottom: '1rem' }}>
                        <span style={{ 
                          color: 'var(--text-light)',
                          background: 'var(--bg-light)',
                          padding: '0.4rem 1rem',
                          borderRadius: '20px',
                          fontSize: '0.85rem',
                          fontWeight: '500'
                        }}>
                          📅 {new Date(project.date).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  <div style={{
                    background: 'var(--bg-light)',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)'
                  }}>
                    <p style={{ 
                      color: 'var(--text-dark)', 
                      lineHeight: '1.7',
                      fontSize: '1rem',
                      margin: 0,
                      textAlign: 'justify'
                    }}>
                      {project.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            color: 'var(--text-light)'
          }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: '1rem',
              opacity: 0.3
            }}>
              🚀
            </div>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-dark)' }}>
              No hay proyectos disponibles
            </h3>
            <p>Los proyectos aparecerán aquí cuando se agreguen desde el panel de administración.</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default ProjectsPage;