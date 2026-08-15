import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { initDb, getDb } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import farmRoutes from './routes/farmRoutes.js';
import detectionRoutes from './routes/detectionRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import roverRoutes from './routes/roverRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import { predictDisease } from './controllers/detectionController.js';
import { authenticateToken } from './middleware/authMiddleware.js';
import multer from 'multer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configure CORS
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({
  origin: corsOrigin === '*' ? '*' : corsOrigin.split(',').map(s => s.trim()),
  credentials: true
}));

app.use(express.json());

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// Root test & Cloud Health Check endpoints
app.get('/', (req, res) => {
  res.json({
    message: '🚀 AgriVision AI Smart Farming Rover Backend Running Successfully!',
    version: '1.0.0',
    status: 'Healthy',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', async (req, res) => {
  try {
    const db = await getDb();
    await db.get('SELECT 1');
    res.status(200).json({ status: 'UP', database: 'CONNECTED', timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ status: 'DOWN', database: 'ERROR', error: err.message, timestamp: new Date().toISOString() });
  }
});

// Configure multer for top-level /predict endpoint
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `scan-${uniqueSuffix}${path.extname(file.originalname) || '.jpg'}`);
  }
});
const upload = multer({ storage });

// Direct top-level endpoints (matching frontend api.ts legacy endpoints)
app.post('/predict', authenticateToken, upload.single('file'), predictDisease);

// Mount API Route handlers
app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/detections', detectionRoutes);
app.use('/api/reports', reportRoutes);
app.use('/reports', reportRoutes);
app.use('/api/rover', roverRoutes);
app.use('/rover', roverRoutes);
app.use('/mission', roverRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/', weatherRoutes); // handles /weather & /crop-health
app.use('/profile', authRoutes);
app.use('/api/history', historyRoutes);
app.use('/history', historyRoutes);

// Optional Static Frontend Serving for unified deployments
const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads') || req.path.startsWith('/predict') || req.path.startsWith('/health')) {
      return next();
    }
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

// Initialize Database & Start Server
let server;
initDb()
  .then(() => {
    server = app.listen(PORT, () => {
      console.log(`\n==================================================`);
      console.log(`🚀 AgriVision AI Backend Server live on port ${PORT}`);
      console.log(`📡 URL: http://localhost:${PORT}`);
      console.log(`==================================================\n`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to initialize database:', err);
  });

// Graceful Shutdown
const shutdown = (signal) => {
  console.log(`\nReceived ${signal}. Shutting down server gracefully...`);
  if (server) {
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));