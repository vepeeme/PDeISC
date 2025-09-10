import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, Building } from 'lucide-react';
import CRUDSection from '../components/CRUDSection';

const ExperiencesPage = ({ experiences, isAdmin, onCreateItem, onUpdateItem, onDeleteItem }) => {
  const renderExperience = (experience, index) => {
    // ... (El resto del código de la función no cambia)
  };

  return (
    <div className="py-8">
      <CRUDSection
        title="Experiencias"
        singularTitle="Experiencia" // <--- Se añade el título en singular
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