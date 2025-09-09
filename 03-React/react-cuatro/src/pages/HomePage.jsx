import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Github, Linkedin, MapPin } from 'lucide-react';

const HomePage = () => {
  const profile = {
    name: 'La pepona',
    title: 'Catador de Helados profesional',
    description: 'Me gusta el arte, todo tipo de arte, me gusta dibujar, a veces armo cosas. Bueno, he hecho algunos juguetes para mi hermano y para mi, una vez hice un avion con palitos de helado y clavos. ',
    email: 'catahelados2000@gmail.com',
    phone: '+54 123 456 7890',
    github: 'https://github.com/heladero',
    linkedin: 'https://linkedin.com/in/catahelados',
    location: 'Lima, Peru'
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const contactLinks = [
    { icon: Mail, href: `mailto:${profile.email}`, text: profile.email, label: 'Email' },
    { icon: Phone, href: `tel:${profile.phone}`, text: profile.phone, label: 'Teléfono' },
    { icon: Github, href: profile.github, text: 'GitHub', label: 'GitHub' },
    { icon: Linkedin, href: profile.linkedin, text: 'LinkedIn', label: 'LinkedIn' },
    { icon: MapPin, href: '#', text: profile.location, label: 'Ubicación' }
  ];

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center py-12 px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-4xl w-full text-center">
        {/* Avatar */}
        <motion.div
          variants={itemVariants}
          className="relative inline-block mb-8"
        >
          <div className="w-40 h-40 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center text-white text-6xl font-bold shadow-2xl">
            {profile.name.charAt(0)}
          </div>
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-full"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Nombre */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-6xl font-bold text-gray-800 mb-4"
        >
          {profile.name}
        </motion.h1>

        {/* Título */}
        <motion.h2
          variants={itemVariants}
          className="text-2xl md:text-3xl text-blue-600 font-semibold mb-6"
        >
          {profile.title}
        </motion.h2>

        {/* Descripción */}
        <motion.p
          variants={itemVariants}
          className="text-lg text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          {profile.description}
        </motion.p>

        {/* Información de contacto */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 max-w-4xl mx-auto"
        >
          {contactLinks.map(({ icon: Icon, href, text, label }, index) => (
            <motion.a
              key={index}
              href={href}
              target={href.startsWith('http') ? '_blank' : '_self'}
              rel={href.startsWith('http') ? 'noopener noreferrer' : ''}
              className="group flex flex-col items-center p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-300"
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon 
                size={32} 
                className="text-blue-600 mb-2 group-hover:text-blue-700 transition-colors" 
              />
              <span className="text-sm font-medium text-gray-700 mb-1">{label}</span>
              <span className="text-xs text-gray-500 text-center group-hover:text-gray-700 transition-colors">
                {text}
              </span>
            </motion.a>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={itemVariants}
          className="mt-12"
        >
          <motion.button
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explorar Portfolio
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HomePage;