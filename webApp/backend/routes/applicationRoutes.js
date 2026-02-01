import express from 'express';
import {
    createApplication,
    getApplications,
    updateApplicationStatus,
    //deleteApplication,
} from '../controllers/applicationController.js';

const router = express.Router();

router.post('/applications', createApplication);
router.get('/applications', getApplications);
router.patch('/applications/:id', updateApplicationStatus);
//router.delete('/applications/:id', deleteApplication);

export default router;