import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase con los datos proporcionados
const supabaseUrl = 'https://vnplcertgjvycsvsbitl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZucGxjZXJ0Z2p2eWNzdnNiaXRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NTY5MzEsImV4cCI6MjA3MjMzMjkzMX0.SqmeXqWtLG1T_N9x-LMVNxdBvO8g5k5Z-Cm5y0AFSaQ';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Función para crear las tablas automáticamente
export const initializeDatabase = async () => {
  try {
    console.log('Inicializando base de datos...');
    
    // Crear tabla de habilidades
    const { error: skillsError } = await supabase.rpc('create_skills_table');
    if (skillsError && !skillsError.message.includes('already exists')) {
      console.log('Creando tabla skills...');
    }
    
    // Crear tabla de logros
    const { error: achievementsError } = await supabase.rpc('create_achievements_table');
    if (achievementsError && !achievementsError.message.includes('already exists')) {
      console.log('Creando tabla achievements...');
    }
    
    // Crear tabla de proyectos
    const { error: projectsError } = await supabase.rpc('create_projects_table');
    if (projectsError && !projectsError.message.includes('already exists')) {
      console.log('Creando tabla projects...');
    }
    
    // Crear tabla de experiencias
    const { error: experiencesError } = await supabase.rpc('create_experiences_table');
    if (experiencesError && !experiencesError.message.includes('already exists')) {
      console.log('Creando tabla experiences...');
    }

    // Verificar si las tablas existen e insertar datos iniciales
    await insertInitialData();
    
    console.log('Base de datos inicializada correctamente');
    return true;
  } catch (error) {
    console.log('Error inicializando base de datos:', error);
    return false;
  }
};

// Insertar datos iniciales si las tablas están vacías
const insertInitialData = async () => {
  try {
    // Verificar y llenar skills
    const { data: skills, error: skillsError } = await supabase
      .from('skills')
      .select('*')
      .limit(1);
    
    if (!skillsError && (!skills || skills.length === 0)) {
      await supabase.from('skills').insert([
        { name: 'React', level: 90, category: 'Frontend' },
        { name: 'Node.js', level: 85, category: 'Backend' },
        { name: 'PostgreSQL', level: 80, category: 'Database' },
        { name: 'JavaScript', level: 95, category: 'Programming' }
      ]);
    }

    // Verificar y llenar achievements
    const { data: achievements, error: achievementsError } = await supabase
      .from('achievements')
      .select('*')
      .limit(1);
    
    if (!achievementsError && (!achievements || achievements.length === 0)) {
      await supabase.from('achievements').insert([
        { 
          title: 'Proyecto Destacado', 
          description: 'Desarrollo de aplicación web completa con React y Node.js', 
          date: '2024' 
        },
        { 
          title: 'Certificación React', 
          description: 'Certificación oficial de Meta en React', 
          date: '2023' 
        }
      ]);
    }

    // Verificar y llenar projects
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .limit(1);
    
    if (!projectsError && (!projects || projects.length === 0)) {
      await supabase.from('projects').insert([
        {
          title: 'E-commerce React',
          description: 'Tienda online completa con carrito de compras y pagos',
          technologies: 'React, Node.js, PostgreSQL, Stripe',
          url: 'https://github.com/usuario/ecommerce'
        },
        {
          title: 'Dashboard Analytics',
          description: 'Panel de control para análisis de datos',
          technologies: 'React, Chart.js, Express',
          url: 'https://github.com/usuario/dashboard'
        }
      ]);
    }

    // Verificar y llenar experiences
    const { data: experiences, error: experiencesError } = await supabase
      .from('experiences')
      .select('*')
      .limit(1);
    
    if (!experiencesError && (!experiences || experiences.length === 0)) {
      await supabase.from('experiences').insert([
        {
          company: 'Tech Solutions',
          position: 'Desarrollador Frontend',
          duration: '2023 - Presente',
          description: 'Desarrollo de interfaces web modernas con React'
        },
        {
          company: 'StartupCorp',
          position: 'Desarrollador Full Stack',
          duration: '2022 - 2023',
          description: 'Desarrollo completo de aplicaciones web'
        }
      ]);
    }
  } catch (error) {
    console.log('Error insertando datos iniciales:', error);
  }
};

// Funciones CRUD genéricas
export const createItem = async (table, data) => {
  try {
    const { data: newData, error } = await supabase
      .from(table)
      .insert([data])
      .select();
    
    if (error) throw error;
    return { success: true, data: newData[0] };
  } catch (error) {
    console.log(`Error creando en ${table}:`, error);
    return { success: false, error: error.message };
  }
};

export const readItems = async (table) => {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('id');
    
    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.log(`Error leyendo ${table}:`, error);
    return { success: false, error: error.message, data: [] };
  }
};

export const updateItem = async (table, id, data) => {
  try {
    const { error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.log(`Error actualizando ${table}:`, error);
    return { success: false, error: error.message };
  }
};

export const deleteItem = async (table, id) => {
  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.log(`Error eliminando de ${table}:`, error);
    return { success: false, error: error.message };
  }
};