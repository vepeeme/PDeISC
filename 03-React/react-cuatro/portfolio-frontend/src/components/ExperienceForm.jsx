import { useState, useEffect } from 'react';
import api from '../services/api';
import ErrorDisplay from './ErrorDisplay';

const ExperienceForm = () => {
  const [experiences, setExperiences] = useState([]);
  const [newExperience, setNewExperience] = useState({
    title: '',
    company: '',
    start_date: '',
    end_date: '',
    description: ''
  });
  const [editingExperience, setEditingExperience] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Obtener la fecha actual en formato YYYY-MM-DD
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await api.get('/experiences');
        setExperiences(response.data);
      } catch (err) {
        setError('No se pudieron cargar las experiencias');
      }
    };
    fetchExperiences();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newExperience.title.trim()) {
      setError('El título del puesto es obligatorio');
      return;
    }
    
    if (!newExperience.company.trim()) {
      setError('El nombre de la empresa es obligatorio');
      return;
    }

    if (!newExperience.start_date) {
      setError('La fecha de inicio es obligatoria');
      return;
    }

    if (!newExperience.end_date) {
      setError('La fecha de finalización es obligatoria');
      return;
    }

    // Validar que las fechas no sean futuras
    if (new Date(newExperience.start_date) > new Date()) {
      setError('La fecha de inicio no puede ser posterior a hoy');
      return;
    }

    if (new Date(newExperience.end_date) > new Date()) {
      setError('La fecha de finalización no puede ser posterior a hoy');
      return;
    }

    // Validar que fecha de inicio sea anterior a fecha de fin
    if (new Date(newExperience.start_date) >= new Date(newExperience.end_date)) {
      setError('La fecha de inicio debe ser anterior a la fecha de finalización');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (editingExperience) {
        await api.put(`/experiences/${editingExperience.id}`, newExperience);
        setEditingExperience(null);
      } else {
        await api.post('/experiences', newExperience);
      }
      
      setNewExperience({
        title: '',
        company: '',
        start_date: '',
        end_date: '',
        description: ''
      });
      const response = await api.get('/experiences');
      setExperiences(response.data);
    } catch (err) {
      setError('Error al guardar la experiencia');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (experience) => {
    setEditingExperience(experience);
    setNewExperience({
      title: experience.title,
      company: experience.company,
      start_date: experience.start_date || '',
      end_date: experience.end_date || '',
      description: experience.description || ''
    });
    setError('');
  };

  const handleCancel = () => {
    setEditingExperience(null);
    setNewExperience({
      title: '',
      company: '',
      start_date: '',
      end_date: '',
      description: ''
    });
    setError('');
  };

  const handleDelete = async (id, title, company) => {
    if (!confirm(`¿Estás seguro que deseas eliminar la experiencia "${title}" en ${company}?`)) {
      return;
    }

    try {
      await api.delete(`/experiences/${id}`);
      const response = await api.get('/experiences');
      setExperiences(response.data);
    } catch (err) {
      setError('Error al eliminar la experiencia');
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
            💼 Experiencia Profesional
          </h2>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
            {editingExperience ? 'Editando experiencia laboral' : 'Agrega una nueva experiencia'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div className="input-group">
              <input
                type="text"
                value={newExperience.title}
                onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
                placeholder="Título del puesto"
                required
                disabled={loading}
              />
            </div>
            
            <div className="input-group">
              <input
                type="text"
                value={newExperience.company}
                onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                placeholder="Nombre de la empresa"
                required
                disabled={loading}
              />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="input-group">
              <label style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.5rem', display: 'block' }}>
                Fecha de inicio
              </label>
              <input
                type="date"
                value={newExperience.start_date}
                onChange={(e) => setNewExperience({ ...newExperience, start_date: e.target.value })}
                max={getCurrentDate()}
                required
                disabled={loading}
              />
            </div>
            
            <div className="input-group">
              <label style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.5rem', display: 'block' }}>
                Fecha de finalización
              </label>
              <input
                type="date"
                value={newExperience.end_date}
                onChange={(e) => setNewExperience({ ...newExperience, end_date: e.target.value })}
                max={getCurrentDate()}
                min={newExperience.start_date || undefined}
                required
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="input-group">
            <textarea
              value={newExperience.description}
              onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
              placeholder="Descripción de responsabilidades, logros y tareas principales..."
              rows="4"
              disabled={loading}
              style={{ resize: 'vertical', minHeight: '100px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            <span>{loading ? 'Guardando...' : editingExperience ? 'Actualizar Experiencia' : 'Agregar Experiencia'}</span>
          </button>
          
          {editingExperience && (
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {error && <ErrorDisplay message={error} />}

      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ color: 'var(--text-dark)', marginBottom: '1rem' }}>
          Experiencias Registradas ({experiences.length})
        </h3>
      </div>

      {/* Grid responsive mejorado */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth > 768 ? 'repeat(auto-fit, minmax(400px, 1fr))' : '1fr',
        gap: '1.5rem'
      }}>
        {experiences.length > 0 ? experiences.map(exp => (
          <div key={exp.id} className="admin-item fade-in" style={{
            background: 'var(--bg-card)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            borderLeft: '4px solid var(--primary-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            width: '100%',
            boxSizing: 'border-box',
            wordWrap: 'break-word',
            overflow: 'hidden'
          }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ 
                color: 'var(--text-dark)', 
                marginBottom: '0.5rem', 
                fontSize: '1.2rem',
                wordWrap: 'break-word'
              }}>
                {exp.title}
              </h4>
              <p style={{ 
                color: 'var(--primary-color)', 
                fontWeight: '600',
                marginBottom: '0.5rem',
                fontSize: '1rem',
                wordWrap: 'break-word'
              }}>
                {exp.company}
              </p>
              <div style={{ marginBottom: '1rem' }}>
                <small style={{ 
                  color: 'var(--text-light)',
                  background: 'var(--bg-light)',
                  padding: '0.25rem 0.8rem',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  display: 'inline-block'
                }}>
                  📅 {new Date(exp.start_date).toLocaleDateString('es-ES')} - {new Date(exp.end_date).toLocaleDateString('es-ES')}
                </small>
              </div>
              
              {exp.description && (
                <p style={{ 
                  marginBottom: '1rem',
                  lineHeight: '1.5',
                  color: 'var(--text-dark)',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word'
                }}>
                  {exp.description}
                </p>
              )}
            </div>

            <div className="admin-actions" style={{ 
              marginTop: 'auto',
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap'
            }}>
              <button 
                onClick={() => handleEdit(exp)}
                className="btn btn-secondary"
                style={{ 
                  fontSize: '0.8rem', 
                  padding: '0.4rem 0.8rem',
                  flex: window.innerWidth <= 768 ? '1' : 'none'
                }}
              >
                Editar
              </button>
              <button 
                onClick={() => handleDelete(exp.id, exp.title, exp.company)}
                className="btn btn-danger"
                style={{ 
                  fontSize: '0.8rem', 
                  padding: '0.4rem 0.8rem',
                  flex: window.innerWidth <= 768 ? '1' : 'none'
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        )) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem', 
            color: 'var(--text-light)',
            gridColumn: '1 / -1'
          }}>
            <p>No hay experiencias registradas</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceForm;