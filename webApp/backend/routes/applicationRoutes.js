import express from 'express';
import {
    createApplication,
    getApplications,
    updateApplicationStatus,
    //deleteApplication,
} from '../controllers/applicationController.js';

const router = express.Router();

// NOTE: This router is mounted at /api/applications in server setup.
// Using root (/) here avoids creating /api/applications/applications accidentally.
router.post('/', createApplication);
router.get('/', getApplications);
router.patch('/status/update', updateApplicationStatus);
router.patch('/:id', updateApplicationStatus);
//router.delete('/applications/:id', deleteApplication);

export default router;