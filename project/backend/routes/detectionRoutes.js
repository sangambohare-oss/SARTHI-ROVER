import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { predictDisease, getDetections, getDetectionById } from '../controllers/detectionController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `scan-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ storage });

const router = express.Router();

router.post('/predict', authenticateToken, upload.single('file'), predictDisease);
router.get('/', authenticateToken, getDetections);
router.get('/:id', authenticateToken, getDetectionById);

export default router;
