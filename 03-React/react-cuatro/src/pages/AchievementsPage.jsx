import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, Award } from 'lucide-react';
import CRUDSection from '../components/CRUDSection';

const AchievementsPage = ({ achievements, isAdmin, onCreateItem, onUpdateItem, onDeleteItem }) => {
  const renderAchievement = (achievement, index) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="relative overflow-hidden"
    >
      {/* Icono decorativo */}
      <div className="absolute top-0 right-0 text-6xl text-yellow-100 opacity-50">
        <Award />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Trophy size={24} className="text-yellow-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              {achievement.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-blue-600 mb-3">
              <Calendar size={16} />
              <span className="font-semibold">{achievement.date}</span>
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 leading-relaxed">
          {achievement.description}
        </p>
        
        {/* Badge decorativo */}
        <div className="mt-4 flex justify-end">
          <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            🏆 LOGRO
          </span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="py-8">
      <CRUDSection
        title="Logros"
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