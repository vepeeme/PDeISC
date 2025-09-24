import { useState, useEffect } from 'react';
import api from '../services/api';
import ErrorDisplay from '../components/ErrorDisplay';

const SkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const response = await api.get('/skills');
        setSkills(response.data);
      } catch (err) {
        setError('Error al cargar las habilidades');
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
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
          <h2 style={{ color: 'var(--text-light)' }}>Cargando habilidades...</h2>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="page-header fade-in" style={{ marginTop: '2rem' }}>
        <h1> Habilidades Técnicas</h1>
        <p>Tecnologías y herramientas que domino en mi desarrollo profesional</p>
      </div>

      {error && <ErrorDisplay message={error} />}
      
      <section className="fade-in" style={{ marginBottom: '3rem' }}>
        {skills.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            marginTop: '3rem'
          }}>
            {skills.map((skill, index) => (
              <div 
                key={skill.id} 
                className="skill-item fade-in" 
                style={{
                  background: 'var(--bg-card)',
                  padding: '2rem',
                  borderRadius: '16px',
                  boxShadow: 'var(--shadow)',
                  border: '1px solid var(--border-color)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  animationDelay: `${index * 0.1}s`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow)';
                }}
              >
                <div style={{ marginBottom: '1.5rem' }}>
                  {/* Header con nombre y porcentaje alineado a la derecha */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                    width: '100%'
                  }}>
                    <h3 style={{ 
                      fontSize: '1.3rem',
                      fontWeight: '600',
                      color: 'var(--text-dark)',
                      margin: 0,
                      flex: 1
                    }}>
                      {skill.name}
                    </h3>
                    <span style={{
                      background: 'var(--gradient)',
                      color: 'white',
                      padding: '0.4rem 1rem',
                      borderRadius: '25px',
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                      marginLeft: '1rem',
                      flexShrink: 0
                    }}>
                      {skill.level}%
                    </span>
                  </div>
                  
                  <div style={{ marginBottom: '0.5rem' }}>
                    <span style={{ 
                      color: 'var(--text-light)', 
                      fontSize: '0.9rem',
                      fontWeight: '500'
                    }}>
                      Porcentaje dominado
                    </span>
                  </div>
                  
                  <div style={{
                    width: '100%',
                    height: '12px',
                    background: 'var(--border-color)',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <div 
                      style={{
                        width: `${skill.level}%`,
                        height: '100%',
                        background: 'var(--gradient)',
                        borderRadius: '15px',
                        transition: 'width 1.5s ease-out',
                        position: 'relative'
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                        animation: 'shimmer 2s infinite'
                      }}></div>
                    </div>
                  </div>
                </div>

                {/* Indicador de nivel */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '1rem'
                }}>
                  <span style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    background: skill.level >= 80 ? '#c6f6d5' : skill.level >= 60 ? '#fed7c7' : '#fed7d7',
                    color: skill.level >= 80 ? '#2f855a' : skill.level >= 60 ? '#c05621' : '#c53030'
                  }}>
                    {skill.level >= 80 ? '🚀 Experto' : skill.level >= 60 ? '💪 Avanzado' : skill.level >= 40 ? '📚 Intermedio' : '🌱 Principiante'}
                  </span>
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
              ⚡
            </div>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-dark)' }}>
              No hay habilidades registradas
            </h3>
            <p>Las habilidades aparecerán aquí cuando se agreguen desde el panel de administración.</p>
          </div>
        )}
      </section>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </main>
  );
};

export default SkillsPage;