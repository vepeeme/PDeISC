import React from 'react';
import { motion } from 'framer-motion';
import { Code, ExternalLink, Github } from 'lucide-react';
import CRUDSection from '../components/CRUDSection';

const ProjectsPage = ({ projects, isAdmin, onCreateItem, onUpdateItem, onDeleteItem }) => {
  const renderProject = (project, index) => {
    const technologies = project.technologies ? project.technologies.split(',').map(tech => tech.trim()) : [];
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="h-full flex flex-col"
      >
        {/* Header del proyecto */}
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
            <Code size={24} className="text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-800 mb-2 break-words">
              {project.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {project.description}
            </p>
          </div>
        </div>

        {/* Tecnologías */}
        {technologies.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Tecnologías:</h4>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech, techIndex) => (
                <span
                  key={techIndex}
                  className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full border border-blue-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Espaciador flexible */}
        <div className="flex-1"></div>

        {/* Enlaces del proyecto */}
        <div className="pt-4 border-t border-gray-100">
          {project.url && project.url !== '#' ? (
            <motion.a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors group"
              whileHover={{ x: 5 }}
            >
              {project.url.includes('github.com') ? (
                <Github size={16} />
              ) : (
                <ExternalLink size={16} />
              )}
              <span className="group-hover:underline">
                {project.url.includes('github.com') ? 'Ver en GitHub' : 'Ver Proyecto'}
              </span>
            </motion.a>
          ) : (
            <span className="inline-flex items-center gap-2 text-gray-400 font-medium">
              <ExternalLink size={16} />
              Proyecto en desarrollo
            </span>
          )}
        </div>

        {/* Efecto hover decorativo */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 rounded-lg"
          whileHover={{ opacity: 0.5 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    );
  };

  return (
    <div className="py-8">
      <CRUDSection
        title="Proyectos"
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