import express from 'express';
import { uploadMiddleware, handleUpload, startAgentMission } from '../controllers/uploadController.js'

const router = express.Router();

// Step 1: Upload Route (Multipart/Form-Data)
router.post('/upload', uploadMiddleware, handleUpload);

// Step 2: Start Mission Route (JSON)
// No middleware needed because we aren't uploading a file here anymore
router.post('/mission/start', startAgentMission);

export default router;