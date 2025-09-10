import React from 'react';
import { motion } from 'framer-motion';
import { Code, ExternalLink, Github } from 'lucide-react';
import CRUDSection from '../components/CRUDSection';

const ProjectsPage = ({ projects, isAdmin, onCreateItem, onUpdateItem, onDeleteItem }) => {
  const renderProject = (project, index) => {
    // ... (El resto del código de la función no cambia)
  };

  return (
    <div className="py-8">
      <CRUDSection
        title="Proyectos"
        singularTitle="Proyecto" // <--- Se añade el título en singular
        type="projects"
        items={projects}
        icon={Code}
        renderItem={renderProject}
        isAdmin={isAdmin}
        onCreateItem={onCreateItem}
        onUpdateItem={onUpdateItem}
        onDeleteItem={onDeleteItem}
      />
    </div>
  );
};

export default ProjectsPage;