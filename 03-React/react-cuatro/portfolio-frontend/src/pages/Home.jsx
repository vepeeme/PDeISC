import { useState, useEffect } from 'react';
import api from '../services/api';
import ErrorDisplay from '../components/ErrorDisplay';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [about, setAbout] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectsRes, skillsRes, experiencesRes, aboutRes] = await Promise.all([
          api.get('/projects'),
          api.get('/skills'),
          api.get('/experiences'),
          api.get('/about')
        ]);
        setProjects(projectsRes.data.slice(0, 3));
        setSkills(skillsRes.data.slice(0, 2));
        setExperiences(experiencesRes.data.slice(0, 2));
        setAbout(aboutRes.data[0]?.content || 'Bienvenido a mi portfolio profesional donde muestro mis habilidades, proyectos y experiencia en desarrollo web.');
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar los datos del portfolio');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
          <h2 style={{ color: 'var(--text-light)' }}>Cargando portfolio...</h2>
        </div>
      </main>
    );
  }

  return (
    <main>
      {/* Hero Section */}
      <section className="fade-in" style={{
        background: 'var(--gradient)',
        margin: '-2rem -1rem 3rem -1rem',
        padding: '4rem 1rem',
        borderRadius: '0 0 24px 24px',
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.1) 75%, rgba(255,255,255,0.1)), linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.1) 75%, rgba(255,255,255,0.1))',
          backgroundSize: '30px 30px',
          backgroundPosition: '0 0, 15px 15px',
          opacity: 0.1
        }}></div>
        
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '800',
            marginBottom: '1.5rem',
            textShadow: '0 2px 20px rgba(0,0,0,0.3)'
          }}>
            Hola, Soy <span style={{ color: 'var(--accent-color)' }}>La pepona</span>
          </h1>
          <p style={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
            opacity: 0.9,
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            Soy un catador de helados profesional
          </p>
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <a href="/projects" className="btn" style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.3)'
            }}>
              Ver Proyectos
            </a>
            <a href="/experiences" className="btn" style={{
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.3)'
            }}>
              Mi Experiencia
            </a>
          </div>
        </div>
      </section>

      {error && <ErrorDisplay message={error} />}
      
      {/* About Section */}
      <section className="fade-in" style={{ marginBottom: '4rem' }}>
        <div className="card" style={{
          background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(102, 126, 234, 0.05) 100%)',
          border: '1px solid rgba(102, 126, 234, 0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{ 
            color: 'var(--primary-color)', 
            marginBottom: '1.5rem',
            fontSize: '2.2rem'
          }}>
             Sobre Mí
          </h2>
          <p style={{ 
            fontSize: '1.15rem', 
            lineHeight: '1.8',
            color: 'var(--text-dark)',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            {about}
          </p>
        </div>
      </section>
      
      {/* Skills Section */}
      <section className="fade-in" style={{ marginBottom: '4rem' }}>
        <div style={{ 
          marginBottom: '2.5rem'
        }}>
          <h2 style={{ color: 'var(--primary-color)', fontSize: '2.2rem', marginBottom: '0.5rem' }}>
             Habilidades Desarrolladas
          </h2>
          <p style={{ color: 'var(--text-light)' }}>Tecnologías que domino</p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {skills.length > 0 ? skills.map(skill => (
            <div key={skill.id} style={{
              background: 'var(--bg-card)',
              padding: '1.5rem',
              borderRadius: '16px',
              boxShadow: 'var(--shadow)',
              border: '1px solid var(--border-color)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow)';
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <strong style={{ fontSize: '1.1rem', color: 'var(--text-dark)' }}>
                  {skill.name}
                </strong>
                <span style={{
                  background: 'var(--gradient)',
                  color: 'white',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '600'
                }}>
                  {skill.level}%
                </span>
              </div>
              
              <div style={{
                width: '100%',
                height: '8px',
                background: 'var(--border-color)',
                borderRadius: '10px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${skill.level}%`,
                  height: '100%',
                  background: 'var(--gradient)',
                  borderRadius: '10px',
                  transition: 'width 1s ease'
                }}></div>
              </div>
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
              <p>No hay habilidades disponibles</p>
            </div>
          )}
        </div>

        {/* Botón Ver Todas - Habilidades */}
        <div style={{ textAlign: 'center' }}>
          <a href="/skills" className="btn btn-secondary">Ver Todas las Habilidades</a>
        </div>
      </section>
      
      {/* Projects Section */}
      <section className="fade-in" style={{ marginBottom: '4rem' }}>
        <div style={{ 
          marginBottom: '2.5rem'
        }}>
          <h2 style={{ color: 'var(--primary-color)', fontSize: '2.2rem', marginBottom: '0.5rem' }}>
             Algunos de mis Proyectos 
          </h2>
          <p style={{ color: 'var(--text-light)' }}>Mis trabajos más recientes</p>
        </div>
        
        <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
          {projects.length > 0 ? projects.map(project => (
            <div key={project.id} style={{
              background: 'var(--bg-card)',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow)',
              border: '1px solid var(--border-color)',
              transition: 'all 0.3s ease',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow)';
            }}>
              {project.image_url && (
                <div style={{ position: 'relative', paddingBottom: '56.25%', overflow: 'hidden' }}>
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
              
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ 
                  color: 'var(--primary-color)', 
                  marginBottom: '0.8rem',
                  fontSize: '1.3rem'
                }}>
                  {project.title}
                </h3>
                <p style={{ 
                  color: 'var(--text-light)', 
                  lineHeight: '1.6',
                  marginBottom: '1rem'
                }}>
                  {project.description}
                </p>
                {project.date && (
                  <small style={{ 
                    color: 'var(--text-light)',
                    fontSize: '0.85rem',
                    background: 'var(--bg-light)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '6px'
                  }}>
                    📅 {new Date(project.date).toLocaleDateString('es-ES')}
                  </small>
                )}
              </div>
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
              <p>No hay proyectos disponibles</p>
            </div>
          )}
        </div>

        {/* Botón Ver Todos - Proyectos */}
        <div style={{ textAlign: 'center' }}>
          <a href="/projects" className="btn btn-secondary">Ver Todos los Proyectos</a>
        </div>
      </section>
      
      {/* Experience Section */}
      <section className="fade-in">
        <div style={{ 
          marginBottom: '2.5rem'
        }}>
          <h2 style={{ color: 'var(--primary-color)', fontSize: '2.2rem', marginBottom: '0.5rem' }}>
             Experiencia Laboral
          </h2>
          <p style={{ color: 'var(--text-light)' }}>Mi trayectoria laboral</p>
        </div>
        
        <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
          {experiences.length > 0 ? experiences.map(exp => (
            <div key={exp.id} style={{
              background: 'var(--bg-card)',
              padding: '2rem',
              borderRadius: '16px',
              boxShadow: 'var(--shadow)',
              border: '1px solid var(--border-color)',
              borderLeft: '4px solid var(--primary-color)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(4px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow)';
            }}>
              <h3 style={{ color: 'var(--text-dark)', marginBottom: '0.5rem', fontSize: '1.3rem' }}>
                {exp.title}
              </h3>
              <p style={{ 
                color: 'var(--primary-color)', 
                fontWeight: '600',
                marginBottom: '0.5rem',
                fontSize: '1.1rem'
              }}>
                {exp.company}
              </p>
              <small style={{ 
                color: 'var(--text-light)',
                background: 'var(--bg-light)',
                padding: '0.25rem 0.8rem',
                borderRadius: '12px',
                fontSize: '0.85rem'
              }}>
                📅 {new Date(exp.start_date).toLocaleDateString('es-ES')} - {new Date(exp.end_date).toLocaleDateString('es-ES')}
              </small>
              <p style={{ 
                marginTop: '1rem',
                lineHeight: '1.6',
                color: 'var(--text-dark)'
              }}>
                {exp.description}
              </p>
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
              <p>No hay experiencias disponibles</p>
            </div>
          )}
        </div>

        {/* Botón Ver Todas - Experiencias */}
        <div style={{ textAlign: 'center' }}>
          <a href="/experiences" className="btn btn-secondary">Ver Todas las Experiencias</a>
        </div>
      </section>
    </main>
  );
};

export default Home;