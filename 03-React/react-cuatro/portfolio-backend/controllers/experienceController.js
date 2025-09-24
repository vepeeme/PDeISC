import { getExperiences, createExperience, updateExperience, deleteExperience } from '../models/experienceModel.js';

export const getAllExperiences = async (req, res) => {
  try {
    const experiences = await getExperiences();
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createNewExperience = async (req, res) => {
  try {
    const experience = req.body;
    const newExperience = await createExperience(experience);
    res.status(201).json(newExperience);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateExistingExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const experience = req.body;
    const updatedExperience = await updateExperience(id, experience);
    if (!updatedExperience) {
      return res.status(404).json({ message: 'Experiencia no encontrada' });
    }
    res.json(updatedExperience);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteExperienceById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedExperience = await deleteExperience(id);
    if (!deletedExperience) {
      return res.status(404).json({ message: 'Experiencia no encontrada' });
    }
    res.json(deletedExperience);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};