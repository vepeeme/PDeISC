import { useState, useEffect } from 'react';
import api from '../services/api';
import ErrorDisplay from './ErrorDisplay';

const AboutForm = () => {
  const [aboutData, setAboutData] = useState(null);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await api.get('/about');
        const data = response.data[0];
        setAboutData(data);
        setContent(data?.content || '');
      } catch (err) {
        setError('No se pudo cargar la información de "Sobre mí"');
      }
    };
    fetchAbout();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('El contenido no puede estar vacío');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (aboutData && aboutData.id) {
        await api.put(`/about/${aboutData.id}`, { content });
      } else {
        await api.post('/about', { content });
      }
      
      // Recargar datos actualizados
      const response = await api.get('/about');
      const data = response.data[0];
      setAboutData(data);
      setContent(data?.content || '');
      
      setError('');
    } catch (err) {
      setError('Error al guardar la información');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h2 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
             Sobre Mí
          </h2>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
            Actualiza tu información personal
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="input-group">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Cuéntanos sobre ti, tu experiencia, intereses y objetivos profesionales..."
            rows="8"
            required
            disabled={loading}
            style={{
              minHeight: '200px',
              resize: 'vertical',
              fontFamily: 'inherit',
              fontSize: '1rem',
              lineHeight: '1.6'
            }}
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading || !content.trim()}
          style={{ alignSelf: 'flex-start' }}
        >
          <span>{loading ? 'Guardando...' : 'Guardar Información'}</span>
        </button>
      </form>

      {error && <ErrorDisplay message={error} />}
      
      {content && (
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ color: 'var(--text-dark)', marginBottom: '1rem' }}>Vista Previa:</h3>
          <div style={{
            padding: '1.5rem',
            background: 'var(--bg-light)',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap'
          }}>
            {content}
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutForm;