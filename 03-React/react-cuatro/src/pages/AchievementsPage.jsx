import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, Award } from 'lucide-react';
import CRUDSection from '../components/CRUDSection';

const AchievementsPage = ({ achievements, isAdmin, onCreateItem, onUpdateItem, onDeleteItem }) => {
  const renderAchievement = (achievement, index) => {
    // ... (El resto del código de la función no cambia)
  };

  return (
    <div className="py-8">
      <CRUDSection
        title="Logros"
        singularTitle="Logro" // <--- Se añade el título en singular
        type="achievements"
        items={achievements}
        icon={Trophy}
        renderItem={renderAchievement}
        isAdmin={isAdmin}
        onCreateItem={onCreateItem}
        onUpdateItem={onUpdateItem}
        onDeleteItem={onDeleteItem}
      />
    </div>
  );
};

export default AchievementsPage;