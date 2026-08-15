import express from 'express';
import { getWeather, getCropHealth } from '../controllers/weatherController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/weather', authenticateToken, getWeather);
router.get('/crop-health', authenticateToken, getCropHealth);

export default router;
