import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import ItemForm from './ItemForm';

const CRUDSection = ({ 
  title, 
  type, 
  items, 
  icon: Icon, 
  renderItem, 
  isAdmin,
  onCreateItem,
  onUpdateItem,
  onDeleteItem
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleCreate = (data) => {
    onCreateItem(type, data);
    setShowForm(false);
  };

  const handleUpdate = (data) => {
    onUpdateItem(type, editingItem.id, data);
    setEditingItem(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
      onDeleteItem(type, id);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(false); // Cerrar formulario de creación si está abierto
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold flex items-center gap-3 text-gray-800"
        >
          <Icon size={32} className="text-blue-600" />
          {title}
        </motion.h2>
        
        {isAdmin && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowForm(true);
              setEditingItem(null); // Cerrar edición si está abierta
            }}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2 shadow-lg transition-all"
          >
            <Plus size={16} /> Agregar {title.slice(0, -1)}
          </motion.button>
        )}
      </div>

      {/* Formulario de creación */}
      <AnimatePresence>
        {showForm && (
          <ItemForm
            type={type}
            onSave={handleCreate}
            onCancel={() => setShowForm(false)}
          />
        )}
      </AnimatePresence>

      {/* Formulario de edición */}
      <AnimatePresence>
        {editingItem && (
          <ItemForm
            type={type}
            item={editingItem}
            onSave={handleUpdate}
            onCancel={() => setEditingItem(null)}
          />
        )}
      </AnimatePresence>

      {/* Lista de elementos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Icon size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">
              No hay {title.toLowerCase()} para mostrar
            </p>
            {isAdmin && (
              <p className="text-gray-400">
                ¡Haz clic en "Agregar" para comenzar!
              </p>
            )}
          </div>
        ) : (
          items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-lg relative group hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              {isAdmin && (
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors shadow-md"
                    title="Editar"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors shadow-md"
                    title="Eliminar"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
              
              <div className={isAdmin ? 'pr-16' : ''}>
                {renderItem(item, index)}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default CRUDSection;