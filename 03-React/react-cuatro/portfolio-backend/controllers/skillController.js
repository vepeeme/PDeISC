import { getSkills, createSkill, updateSkill, deleteSkill } from '../models/skillModel.js';

export const getAllSkills = async (req, res) => {
  try {
    const skills = await getSkills();
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createNewSkill = async (req, res) => {
  try {
    const skill = req.body;
    const newSkill = await createSkill(skill);
    res.status(201).json(newSkill);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateExistingSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const skill = req.body;
    const updatedSkill = await updateSkill(id, skill);
    if (!updatedSkill) {
      return res.status(404).json({ message: 'Habilidad no encontrada' });
    }
    res.json(updatedSkill);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteSkillById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSkill = await deleteSkill(id);
    if (!deletedSkill) {
      return res.status(404).json({ message: 'Habilidad no encontrada' });
    }
    res.json(deletedSkill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};