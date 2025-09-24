import { getProjects, createProject, updateProject, deleteProject } from '../models/projectModel.js';

export const getAllProjects = async (req, res) => {
  try {
    const projects = await getProjects();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createNewProject = async (req, res) => {
  try {
    const project = req.body;
    const newProject = await createProject(project);
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateExistingProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = req.body;
    const updatedProject = await updateProject(id, project);
    if (!updatedProject) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProject = await deleteProject(id);
    if (!deletedProject) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    res.json(deletedProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};