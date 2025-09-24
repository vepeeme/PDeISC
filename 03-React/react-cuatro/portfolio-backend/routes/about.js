import express from 'express';
import {
  getAllAbout,
  createNewAbout,
  updateExistingAbout,
  deleteAboutById
} from '../controllers/aboutController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllAbout);
router.post('/', authenticate, createNewAbout);
router.put('/:id', authenticate, updateExistingAbout);
router.delete('/:id', authenticate, deleteAboutById);

export default router;