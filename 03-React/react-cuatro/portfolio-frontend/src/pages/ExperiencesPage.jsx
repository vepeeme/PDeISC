import { useState, useEffect } from 'react';
import api from '../services/api';
import ErrorDisplay from '../components/ErrorDisplay';

const ExperiencesPage = () => {
  const [experiences, setExperiences] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const response = await api.get('/experiences');
        // Ordenar por fecha de inicio (más reciente primero)
        const sortedExperiences = response.data.sort((a, b) => 
          new Date(b.start_date) - new Date(a.start_date)
        );
        setExperiences(sortedExperiences);
      } catch (err) {
        setError('Error al cargar las experiencias');
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    
    if (diffInMonths < 1) return "Menos de 1 mes";
    if (diffInMonths < 12) return `${diffInMonths} ${diffInMonths === 1 ? 'mes' : 'meses'}`;
    
    const years = Math.floor(diffInMonths / 12);
    const months = diffInMonths % 12;
    
    if (months === 0) return `${years} ${years === 1 ? 'año' : 'años'}`;
    return `${years} ${years === 1 ? 'año' : 'años'} y ${months} ${months === 1 ? 'mes' : 'meses'}`;
  };

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
          <h2 style={{ color: 'var(--text-light)' }}>Cargando experiencias...</h2>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="page-header fade-in" style={{ marginTop: '2rem', marginBottom: '3rem' }}>
        <h1> Mi Trayectoria Profesional</h1>
        <p>Un recorrido cronológico por mi experiencia laboral y crecimiento profesional</p>
        {experiences.length > 0 && (
          <div style={{ 
            marginTop: '1.5rem',
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap'
          }}>
            <div style={{
              background: 'var(--bg-card)',
              padding: '0.8rem 1.5rem',
              borderRadius: '25px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow)'
            }}>
              <strong style={{ color: 'var(--primary-color)' }}>{experiences.length}</strong>
              <span style={{ color: 'var(--text-light)', marginLeft: '0.5rem' }}>
                {experiences.length === 1 ? 'Experiencia' : 'Experiencias'}
              </span>
            </div>
            <div style={{
              background: 'var(--bg-card)',
              padding: '0.8rem 1.5rem',
              borderRadius: '25px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow)'
            }}>
              <strong style={{ color: 'var(--primary-color)' }}>
                {new Set(experiences.map(exp => exp.company)).size}
              </strong>
              <span style={{ color: 'var(--text-light)', marginLeft: '0.5rem' }}>
                {new Set(experiences.map(exp => exp.company)).size === 1 ? 'Empresa' : 'Empresas'}
              </span>
            </div>
          </div>
        )}
      </div>

      {error && <ErrorDisplay message={error} />}
      
      <section className="fade-in">
        {experiences.length > 0 ? (
          <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
            {/* Línea vertical del timeline */}
            <div style={{
              position: 'absolute',
              left: '30px',
              top: '0',
              bottom: '0',
              width: '3px',
              background: 'linear-gradient(to bottom, var(--primary-color), var(--secondary-color))',
              borderRadius: '2px',
              zIndex: 1
            }}></div>

            {experiences.map((exp, index) => (
              <div 
                key={exp.id}
                className="fade-in"
                style={{
                  position: 'relative',
                  marginBottom: '3rem',
                  paddingLeft: '80px',
                  animationDelay: `${index * 0.2}s`
                }}
              >
                {/* Punto del timeline */}
                <div style={{
                  position: 'absolute',
                  left: '18px',
                  top: '20px',
                  width: '24px',
                  height: '24px',
                  background: 'var(--gradient)',
                  borderRadius: '50%',
                  border: '4px solid white',
                  boxShadow: '0 0 0 3px var(--primary-color)',
                  zIndex: 2
                }}></div>

                {/* Tarjeta de experiencia */}
                <div 
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: '16px',
                    padding: '2rem',
                    boxShadow: 'var(--shadow)',
                    border: '1px solid var(--border-color)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(8px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow)';
                  }}
                >
                  {/* Decoración de fondo */}
                  <div style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    width: '80px',
                    height: '80px',
                    background: `linear-gradient(45deg, ${index % 2 === 0 ? 'var(--primary-color)' : 'var(--secondary-color)'}, transparent)`,
                    borderRadius: '50%',
                    opacity: 0.1
                  }}></div>

                  <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Header de la tarjeta */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h2 style={{ 
                        color: 'var(--text-dark)', 
                        marginBottom: '0.5rem',
                        fontSize: '1.4rem',
                        fontWeight: '700'
                      }}>
                        {exp.title}
                      </h2>
                      
                      <h3 style={{ 
                        color: 'var(--primary-color)', 
                        fontWeight: '600',
                        marginBottom: '1rem',
                        fontSize: '1.2rem'
                      }}>
                        {exp.company}
                      </h3>

                      {/* Información de fechas */}
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        alignItems: 'center'
                      }}>
                        <div style={{
                          background: 'var(--bg-light)',
                          padding: '0.5rem 1rem',
                          borderRadius: '20px',
                          border: '1px solid var(--border-color)',
                          fontSize: '0.9rem'
                        }}>
                          <span style={{ color: 'var(--text-light)' }}>📅 </span>
                          <span style={{ fontWeight: '500', color: 'var(--text-dark)' }}>
                            {new Date(exp.start_date).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long'
                            })} - {new Date(exp.end_date).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long'
                            })}
                          </span>
                        </div>
                        
                        <div style={{
                          background: 'var(--gradient)',
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: '20px',
                          fontSize: '0.85rem',
                          fontWeight: '600'
                        }}>
                          ⏱️ {calculateDuration(exp.start_date, exp.end_date)}
                        </div>
                      </div>
                    </div>

                    {/* Descripción */}
                    {exp.description && (
                      <div style={{
                        background: 'var(--bg-light)',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)',
                        position: 'relative'
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: '-8px',
                          left: '16px',
                          background: 'var(--bg-card)',
                          padding: '0 0.8rem',
                          fontSize: '0.75rem',
                          color: 'var(--text-light)',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Responsabilidades y Logros
                        </div>
                        
                        <div style={{ marginTop: '0.5rem' }}>
                          <p style={{ 
                            lineHeight: '1.7',
                            color: 'var(--text-dark)',
                            fontSize: '1rem',
                            textAlign: 'justify',
                            margin: 0
                          }}>
                            {exp.description}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Punto final del timeline */}
            <div style={{
              position: 'absolute',
              left: '24px',
              bottom: '-20px',
              width: '12px',
              height: '12px',
              background: 'var(--text-light)',
              borderRadius: '50%',
              zIndex: 2
            }}></div>
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
              💼
            </div>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-dark)' }}>
              No hay experiencias registradas
            </h3>
            <p>Las experiencias profesionales aparecerán aquí cuando se agreguen desde el panel de administración.</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default ExperiencesPage;