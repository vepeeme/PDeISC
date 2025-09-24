import { getAbout, createAbout, updateAbout, deleteAbout } from '../models/aboutModel.js';

export const getAllAbout = async (req, res) => {
  try {
    const about = await getAbout();
    res.json(about);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createNewAbout = async (req, res) => {
  try {
    const about = req.body;
    const newAbout = await createAbout(about);
    res.status(201).json(newAbout);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateExistingAbout = async (req, res) => {
  try {
    const { id } = req.params;
    const about = req.body;
    const updatedAbout = await updateAbout(id, about);
    if (!updatedAbout) {
      return res.status(404).json({ message: 'Sobre mí no encontrado' });
    }
    res.json(updatedAbout);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteAboutById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAbout = await deleteAbout(id);
    if (!deletedAbout) {
      return res.status(404).json({ message: 'Sobre mí no encontrado' });
    }
    res.json(deletedAbout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};