import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, Building } from 'lucide-react';
import CRUDSection from '../components/CRUDSection';

const ExperiencesPage = ({ experiences, isAdmin, onCreateItem, onUpdateItem, onDeleteItem }) => {
  const renderExperience = (experience, index) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="relative overflow-hidden h-full flex flex-col"
    >
      {/* Icono decorativo de fondo */}
      <div className="absolute top-0 right-0 text-6xl text-blue-100 opacity-30">
        <Building />
      </div>
      
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header de la experiencia */}
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
            <Briefcase size={24} className="text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              {experience.position}
            </h3>
            <h4 className="text-lg text-blue-600 font-semibold mb-2">
              {experience.company}
            </h4>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={16} />
              <span className="font-medium">{experience.duration}</span>
            </div>
          </div>
        </div>
        
        {/* Descripción */}
        <div className="flex-1">
          <p className="text-gray-600 leading-relaxed">
            {experience.description}
          </p>
        </div>
        
        {/* Badge decorativo */}
        <div className="mt-4 flex justify-between items-end">
          <div className="flex-1"></div>
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            💼 EXPERIENCIA
          </span>
        </div>
      </div>
      
      {/* Línea temporal decorativa */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-purple-400 rounded-r"></div>
    </motion.div>
  );

  return (
    <div className="py-8">
      <CRUDSection
        title="Experiencias"
        type="experiences"
        items={experiences}
        icon={Briefcase}
        renderItem={renderExperience}
        isAdmin={isAdmin}
        onCreateItem={onCreateItem}
        onUpdateItem={onUpdateItem}
        onDeleteItem={onDeleteItem}
      />
    </div>
  );
};

export default ExperiencesPage;