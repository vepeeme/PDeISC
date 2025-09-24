import { useState, useEffect } from 'react';
import api from '../services/api';
import ErrorDisplay from './ErrorDisplay';

const SkillForm = () => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: '', level: '' });
  const [editingSkill, setEditingSkill] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await api.get('/skills');
        setSkills(response.data);
      } catch (err) {
        setError('No se pudieron cargar las habilidades');
      }
    };
    fetchSkills();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newSkill.name.trim()) {
      setError('El nombre de la habilidad es obligatorio');
      return;
    }
    
    if (!newSkill.level || newSkill.level < 1 || newSkill.level > 100) {
      setError('El porcentaje debe estar entre 1 y 100');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (editingSkill) {
        await api.put(`/skills/${editingSkill.id}`, newSkill);
        setEditingSkill(null);
      } else {
        await api.post('/skills', newSkill);
      }
      
      setNewSkill({ name: '', level: '' });
      const response = await api.get('/skills');
      setSkills(response.data);
    } catch (err) {
      setError('Error al guardar la habilidad');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setNewSkill({ name: skill.name, level: skill.level.toString() });
    setError('');
  };

  const handleCancel = () => {
    setEditingSkill(null);
    setNewSkill({ name: '', level: '' });
    setError('');
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`¿Estás seguro que deseas eliminar la habilidad "${name}"?`)) {
      return;
    }

    try {
      await api.delete(`/skills/${id}`);
      const response = await api.get('/skills');
      setSkills(response.data);
    } catch (err) {
      setError('Error al eliminar la habilidad');
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
             Habilidades Técnicas
          </h2>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
            {editingSkill ? 'Editando habilidad' : 'Agrega una nueva habilidad'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="input-group">
            <input
              type="text"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              placeholder="Nombre de la habilidad (ej: JavaScript, React)"
              required
              disabled={loading}
            />
          </div>
          
          <div className="input-group">
            <input
              type="number"
              value={newSkill.level}
              onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
              placeholder="Porcentaje dominado (1-100)"
              min="1"
              max="100"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            <span>{loading ? 'Guardando...' : editingSkill ? 'Actualizar Habilidad' : 'Agregar Habilidad'}</span>
          </button>
          
          {editingSkill && (
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

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: 'var(--text-dark)', marginBottom: '1rem' }}>
          Habilidades Registradas ({skills.length})
        </h3>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem'
      }}>
        {skills.length > 0 ? skills.map(skill => (
          <div key={skill.id} className="admin-item fade-in" style={{
            background: 'var(--bg-card)',
            padding: '1.8rem',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            position: 'relative',
            minHeight: '160px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <h4 style={{ 
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: 'var(--text-dark)',
                  margin: 0
                }}>
                  {skill.name}
                </h4>
                <span style={{
                  background: 'var(--gradient)',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
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
                overflow: 'hidden',
                marginBottom: '0.5rem'
              }}>
                <div style={{
                  width: `${skill.level}%`,
                  height: '100%',
                  background: 'var(--gradient)',
                  borderRadius: '10px',
                  transition: 'width 0.5s ease'
                }}></div>
              </div>
              
              <span style={{ 
                color: 'var(--text-light)', 
                fontSize: '0.85rem'
              }}>
                Porcentaje dominado
              </span>
            </div>

            <div className="admin-actions" style={{ marginTop: 'auto' }}>
              <button 
                onClick={() => handleEdit(skill)}
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
              >
                Editar
              </button>
              <button 
                onClick={() => handleDelete(skill.id, skill.name)}
                className="btn btn-danger"
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
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
            <p>No hay habilidades registradas</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillForm;