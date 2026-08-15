import express from 'express';
import { getReports, createReport, deleteReport } from '../controllers/reportController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, getReports);
router.post('/', authenticateToken, createReport);
router.delete('/:id', authenticateToken, deleteReport);

export default router;
