import express from 'express';
import { generateCoverLetter } from '../controllers/coverLetterController.js';

const router = express.Router();

// POST /api/coverletter/generate
router.post('/generate', generateCoverLetter);

export default router;
