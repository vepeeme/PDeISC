import React from 'react';
import { motion } from 'framer-motion';
import { Code } from 'lucide-react';
import CRUDSection from '../components/CRUDSection';

const SkillsPage = ({ skills, isAdmin, onCreateItem, onUpdateItem, onDeleteItem }) => {
  const renderSkill = (skill, index) => {
    const getColorByLevel = (level) => {
      if (level >= 80) return 'from-green-400 to-green-600';
      if (level >= 60) return 'from-yellow-400 to-yellow-600';
      return 'from-red-400 to-red-600';
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-800">{skill.name}</h3>
          <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
            {skill.category}
          </span>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Nivel de dominio</span>
            <span className="text-sm font-bold text-gray-800">{skill.level}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${skill.level}%` }}
              transition={{ delay: 0.5 + index * 0.1, duration: 1.2, ease: "easeOut" }}
              className={`h-full bg-gradient-to-r ${getColorByLevel(skill.level)} rounded-full relative`}
            >
              <div className="absolute inset-0 bg-white bg-opacity-20 animate-pulse rounded-full"></div>
            </motion.div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {skill.level >= 80 ? 'Experto' : skill.level >= 60 ? 'Intermedio' : 'Principiante'}
          </span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <div
                key={star}
                className={`w-3 h-3 rounded-full mx-0.5 ${
                  star <= Math.ceil(skill.level / 20)
                    ? 'bg-yellow-400'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="py-8">
      <CRUDSection
        title="Habilidades"
        type="skills"
        items={skills}
        icon={Code}
        renderItem={renderSkill}
        isAdmin={isAdmin}
        onCreateItem={onCreateItem}
        onUpdateItem={onUpdateItem}
        onDeleteItem={onDeleteItem}
      />
    </div>
  );
};

export default SkillsPage;