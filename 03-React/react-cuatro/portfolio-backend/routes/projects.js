import express from 'express';
import {
  getAllProjects,
  createNewProject,
  updateExistingProject,
  deleteProjectById
} from '../controllers/projectController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllProjects);
router.post('/', authenticate, createNewProject);
router.put('/:id', authenticate, updateExistingProject);
router.delete('/:id', authenticate, deleteProjectById);

export default router;