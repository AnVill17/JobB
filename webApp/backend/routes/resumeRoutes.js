import express from 'express';
import multer from 'multer';
import { analyzeResume } from '../controllers/resumeAnalysisController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// POST /api/resume/analyze (accepts file or resumePath)
router.post('/analyze', upload.single('resume'), analyzeResume);

export default router;
