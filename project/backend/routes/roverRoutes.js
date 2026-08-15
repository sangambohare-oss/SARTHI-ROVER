import express from 'express';
import { getRoverStatus, controlRover, startMission, stopMission, getMissions } from '../controllers/roverController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/status', authenticateToken, getRoverStatus);
router.post('/control', authenticateToken, controlRover);
router.post('/mission/start', authenticateToken, startMission);
router.post('/mission/stop', authenticateToken, stopMission);
router.get('/missions', authenticateToken, getMissions);

export default router;
