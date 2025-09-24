import express from 'express';
import {
  getAllSkills,
  createNewSkill,
  updateExistingSkill,
  deleteSkillById
} from '../controllers/skillController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllSkills);
router.post('/', authenticate, createNewSkill);
router.put('/:id', authenticate, updateExistingSkill);
router.delete('/:id', authenticate, deleteSkillById);

export default router;