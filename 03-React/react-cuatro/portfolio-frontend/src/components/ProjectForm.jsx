import { useState, useEffect } from 'react';
import api from '../services/api';
import ErrorDisplay from './ErrorDisplay';

const ProjectForm = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    image_url: '',
    date: ''
  });
  const [editingProject, setEditingProject] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Obtener la fecha actual en formato YYYY-MM-DD
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
        setProjects(response.data);
      } catch (err) {
        setError('No se pudieron cargar los proyectos');
      }
    };
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newProject.title.trim()) {
      setError('El título del proyecto es obligatorio');
      return;
    }
    
    if (!newProject.description.trim()) {
      setError('La descripción del proyecto es obligatoria');
      return;
    }

    if (!newProject.date) {
      setError('La fecha del proyecto es obligatoria');
      return;
    }

    // Validar que la fecha no sea futura
    if (new Date(newProject.date) > new Date()) {
      setError('La fecha del proyecto no puede ser posterior a hoy');
      return;
    }

    // Validar URL de imagen si se proporciona
    if (newProject.image_url && !isValidUrl(newProject.image_url)) {
      setError('Por favor ingresa una URL válida para la imagen');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (editingProject) {
        await api.put(`/projects/${editingProject.id}`, newProject);
        setEditingProject(null);
      } else {
        await api.post('/projects', newProject);
      }
      
      setNewProject({ title: '', description: '', image_url: '', date: '' });
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (err) {
      setError('Error al guardar el proyecto');
    } finally {
      setLoading(false);
    }
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setNewProject({
      title: project.title,
      description: project.description,
      image_url: project.image_url || '',
      date: project.date || ''
    });
    setError('');
  };

  const handleCancel = () => {
    setEditingProject(null);
    setNewProject({ title: '', description: '', image_url: '', date: '' });
    setError('');
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`¿Estás seguro que deseas eliminar el proyecto "${title}"?`)) {
      return;
    }

    try {
      await api.delete(`/projects/${id}`);
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (err) {
      setError('Error al eliminar el proyecto');
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
             Proyectos
          </h2>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
            {editingProject ? 'Editando proyecto' : 'Agrega un nuevo proyecto'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div className="input-group">
              <input
                type="text"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                placeholder="Título del proyecto"
                required
                disabled={loading}
              />
            </div>
            
            <div className="input-group">
              <label style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.5rem', display: 'block' }}>
                Fecha del proyecto
              </label>
              <input
                type="date"
                value={newProject.date}
                onChange={(e) => setNewProject({ ...newProject, date: e.target.value })}
                max={getCurrentDate()}
                required
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="input-group">
            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              placeholder="Descripción detallada del proyecto, tecnologías utilizadas, objetivos y resultados..."
              rows="4"
              required
              disabled={loading}
              style={{ resize: 'vertical', minHeight: '120px' }}
            />
          </div>
          
          <div className="input-group">
            <input
              type="url"
              value={newProject.image_url}
              onChange={(e) => setNewProject({ ...newProject, image_url: e.target.value })}
              placeholder="URL de la imagen del proyecto (opcional)"
              disabled={loading}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            <span>{loading ? 'Guardando...' : editingProject ? 'Actualizar Proyecto' : 'Agregar Proyecto'}</span>
          </button>
          
          {editingProject && (
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
          Proyectos Registrados ({projects.length})
        </h3>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '1.5rem'
      }}>
        {projects.length > 0 ? projects.map(project => (
          <div key={project.id} className="admin-item fade-in" style={{
            background: 'var(--bg-card)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            borderLeft: '4px solid var(--primary-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {project.image_url && (
              <div style={{
                width: '100%',
                height: '200px',
                borderRadius: '8px',
                overflow: 'hidden',
                background: 'var(--bg-light)'
              }}>
                <img 
                  src={project.image_url} 
                  alt={project.title}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover' 
                  }}
                />
              </div>
            )}
            
            <div style={{ flex: 1 }}>
              <h4 style={{ color: 'var(--text-dark)', marginBottom: '0.5rem', fontSize: '1.2rem' }}>
                {project.title}
              </h4>
              
              {project.date && (
                <div style={{ marginBottom: '1rem' }}>
                  <small style={{ 
                    color: 'var(--text-light)',
                    background: 'var(--bg-light)',
                    padding: '0.25rem 0.8rem',
                    borderRadius: '12px',
                    fontSize: '0.85rem'
                  }}>
                    📅 {new Date(project.date).toLocaleDateString('es-ES')}
                  </small>
                </div>
              )}
              
              <p style={{ 
                lineHeight: '1.5',
                color: 'var(--text-dark)',
                marginBottom: '1rem'
              }}>
                {project.description}
              </p>
            </div>

            <div className="admin-actions">
              <button 
                onClick={() => handleEdit(project)}
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
              >
                Editar
              </button>
              <button 
                onClick={() => handleDelete(project.id, project.title)}
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
            <p>No hay proyectos registrados</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectForm;