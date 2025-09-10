import React from 'react';
import { motion } from 'framer-motion';
import { Code } from 'lucide-react';
import CRUDSection from '../components/CRUDSection';

const SkillsPage = ({ skills, isAdmin, onCreateItem, onUpdateItem, onDeleteItem }) => {
  const renderSkill = (skill, index) => {
    // ... (El resto del código de la función no cambia)
  };

  return (
    <div className="py-8">
      <CRUDSection
        title="Habilidades"
        singularTitle="Habilidad" // <--- Se añade el título en singular
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