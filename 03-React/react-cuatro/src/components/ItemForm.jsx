import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, X } from 'lucide-react';
import toast from 'react-hot-toast'; // <--- IMPORTAR TOAST

const ItemForm = ({ type, item, onSave, onCancel }) => {
  const [formData, setFormData] = useState(item || {});

  const getFields = () => {
    // ... (El contenido de esta función no cambia)
    switch (type) {
      case 'skills':
        return [
          { key: 'name', label: 'Nombre de la Habilidad', type: 'text', required: true },
          { key: 'level', label: 'Nivel (0-100)', type: 'number', min: 0, max: 100, required: true },
          { key: 'category', label: 'Categoría', type: 'text', required: true, placeholder: 'Frontend, Backend, etc.' }
        ];
      case 'achievements':
        return [
          { key: 'title', label: 'Título del Logro', type: 'text', required: true },
          { key: 'description', label: 'Descripción', type: 'textarea', required: true },
          { key: 'date', label: 'Fecha', type: 'text', required: true, placeholder: '2024, Enero 2024, etc.' }
        ];
      case 'projects':
        return [
          { key: 'title', label: 'Título del Proyecto', type: 'text', required: true },
          { key: 'description', label: 'Descripción', type: 'textarea', required: true },
          { key: 'technologies', label: 'Tecnologías Usadas', type: 'text', required: true, placeholder: 'React, Node.js, PostgreSQL' },
          { key: 'url', label: 'URL del Proyecto', type: 'url', placeholder: 'https://github.com/usuario/proyecto' }
        ];
      case 'experiences':
        return [
          { key: 'company', label: 'Empresa', type: 'text', required: true },
          { key: 'position', label: 'Posición', type: 'text', required: true },
          { key: 'duration', label: 'Duración', type: 'text', required: true, placeholder: '2023 - Presente' },
          { key: 'description', label: 'Descripción', type: 'textarea', required: true }
        ];
      default:
        return [];
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fields = getFields();
    for (let field of fields) {
      if (field.required && !formData[field.key]?.trim()) {
        toast.error(`El campo "${field.label}" es requerido.`); // <--- CAMBIAR ALERT POR TOAST
        return;
      }
    }
    onSave(formData);
  };

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const getTypeLabel = () => {
    // ... (El contenido de esta función no cambia)
    const labels = {
      skills: 'Habilidad',
      achievements: 'Logro',
      projects: 'Proyecto',
      experiences: 'Experiencia'
    };
    return labels[type] || 'Item';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white p-6 rounded-lg shadow-lg mb-6 border border-gray-200"
    >
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        {item ? `Editar ${getTypeLabel()}` : `Crear ${getTypeLabel()}`}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ... (El contenido del formulario no cambia) ... */}
         {getFields().map(field => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            
            {field.type === 'textarea' ? (
              <textarea
                value={formData[field.key] || ''}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
                required={field.required}
              />
            ) : (
              <input
                type={field.type}
                value={formData[field.key] || ''}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                min={field.min}
                max={field.max}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required={field.required}
              />
            )}
          </div>
        ))}
        
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Save size={16} /> Guardar
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <X size={16} /> Cancelar
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ItemForm;