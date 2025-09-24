import express from 'express';
import {
  getAllExperiences,
  createNewExperience,
  updateExistingExperience,
  deleteExperienceById
} from '../controllers/experienceController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllExperiences);
router.post('/', authenticate, createNewExperience);
router.put('/:id', authenticate, updateExistingExperience);
router.delete('/:id', authenticate, deleteExperienceById);

export default router;