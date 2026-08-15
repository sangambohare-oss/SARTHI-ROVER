import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const defaultDbPath = path.join(__dirname, '..', 'agrivision.sqlite');
const dbPath = process.env.DB_PATH ? path.resolve(process.env.DB_PATH) : defaultDbPath;

let dbInstance = null;

export async function getDb() {
  if (dbInstance) return dbInstance;

  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Enable foreign keys
  await dbInstance.run('PRAGMA foreign_keys = ON;');

  return dbInstance;
}

export async function initDb() {
  const db = await getDb();

  // Create tables
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      phone TEXT DEFAULT '',
      farm_location TEXT DEFAULT '',
      number_of_farms INTEGER DEFAULT 1,
      preferred_language TEXT DEFAULT 'en',
      dark_mode INTEGER DEFAULT 0,
      notifications INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS farms (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      crop_type TEXT DEFAULT '',
      boundary TEXT NOT NULL,
      area REAL DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS detections (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      farm_id TEXT,
      detected_crop TEXT NOT NULL,
      disease_name TEXT NOT NULL,
      confidence REAL DEFAULT 0,
      plant_health REAL DEFAULT 0,
      severity TEXT DEFAULT 'Low',
      symptoms TEXT NOT NULL,
      treatment_steps TEXT NOT NULL,
      prevention_tips TEXT NOT NULL,
      recommended_fertilizer TEXT DEFAULT '',
      recommended_fungicide TEXT DEFAULT '',
      recommended_pesticide TEXT DEFAULT '',
      expected_recovery TEXT DEFAULT '',
      image_url TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      detection_id TEXT,
      date TEXT NOT NULL,
      crop TEXT NOT NULL,
      disease TEXT NOT NULL,
      health REAL DEFAULT 0,
      treatment TEXT DEFAULT '',
      status TEXT DEFAULT 'Pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS missions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      farm_id TEXT,
      farm_name TEXT DEFAULT '',
      status TEXT DEFAULT 'Planned',
      started_at TEXT,
      completed_at TEXT,
      coverage REAL DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS rover_state (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      status TEXT DEFAULT 'Idle',
      battery INTEGER DEFAULT 87,
      water_tank INTEGER DEFAULT 64,
      motor_status TEXT DEFAULT 'Online',
      speed REAL DEFAULT 0,
      lat REAL DEFAULT 21.1458,
      lng REAL DEFAULT 79.0882,
      estimated_time INTEGER DEFAULT 0,
      coverage REAL DEFAULT 0,
      current_task TEXT DEFAULT 'Standby',
      signal_strength INTEGER DEFAULT 94,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS weather (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      temperature REAL DEFAULT 28,
      humidity REAL DEFAULT 65,
      condition TEXT DEFAULT 'Partly Cloudy',
      wind_speed REAL DEFAULT 12,
      soil_moisture REAL DEFAULT 42,
      air_quality REAL DEFAULT 45,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS history (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  await seedInitialData(db);
  console.log('✅ SQLite Database initialized successfully!');
}

async function seedInitialData(db) {
  // Check if default user exists
  const existingUser = await db.get('SELECT * FROM users WHERE email = ?', ['sangambohare@gmail.com']);
  
  let defaultUserId = 'usr-001';
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    await db.run(
      `INSERT INTO users (id, name, email, password_hash, phone, farm_location, number_of_farms, preferred_language, dark_mode, notifications)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        defaultUserId,
        'Sangam Bohare',
        'sangambohare@gmail.com',
        hashedPassword,
        '+91 9226295319',
        'TGPCET Nagpur, Maharashtra',
        5,
        'en',
        0,
        1
      ]
    );
  } else {
    defaultUserId = existingUser.id;
  }

  // Seed Rover State if empty
  const roverCount = await db.get('SELECT COUNT(*) as count FROM rover_state');
  if (roverCount.count === 0) {
    await db.run(
      `INSERT INTO rover_state (status, battery, water_tank, motor_status, speed, lat, lng, estimated_time, coverage, current_task, signal_strength)
       VALUES ('Idle', 87, 64, 'Online', 0, 21.1458, 79.0882, 0, 0, 'Standby', 94)`
    );
  }

  // Seed Weather if empty
  const weatherCount = await db.get('SELECT COUNT(*) as count FROM weather');
  if (weatherCount.count === 0) {
    await db.run(
      `INSERT INTO weather (temperature, humidity, condition, wind_speed, soil_moisture, air_quality)
       VALUES (28, 65, 'Partly Cloudy', 12, 42, 45)`
    );
  }

  // Seed Demo Farms if empty
  const farmsCount = await db.get('SELECT COUNT(*) as count FROM farms');
  if (farmsCount.count === 0) {
    const defaultBoundary = JSON.stringify([
      [21.1458, 79.0882],
      [21.1468, 79.0892],
      [21.1450, 79.0900],
      [21.1440, 79.0888]
    ]);
    await db.run(
      `INSERT INTO farms (id, user_id, name, crop_type, boundary, area)
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['farm-001', defaultUserId, 'North Field Wheat', 'Wheat', defaultBoundary, 4.2]
    );
    await db.run(
      `INSERT INTO farms (id, user_id, name, crop_type, boundary, area)
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['farm-002', defaultUserId, 'South Field Tomatoes', 'Tomato', defaultBoundary, 2.8]
    );
  }

  // Seed Demo Detections & Reports if empty
  const detectionsCount = await db.get('SELECT COUNT(*) as count FROM detections');
  if (detectionsCount.count === 0) {
    const symptoms = JSON.stringify(['Yellow halos on lower leaves', 'Dark brown concentric spots', 'Leaf wilting']);
    const treatment = JSON.stringify(['Apply Copper Oxychloride spray 0.2%', 'Remove infected leaves', 'Ensure proper spacing']);
    const prevention = JSON.stringify(['Rotate crops every season', 'Avoid overhead watering', 'Use resistant seed varieties']);

    await db.run(
      `INSERT INTO detections (
        id, user_id, farm_id, detected_crop, disease_name, confidence, plant_health, severity,
        symptoms, treatment_steps, prevention_tips, recommended_fertilizer, recommended_fungicide, recommended_pesticide, expected_recovery
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'det-001', defaultUserId, 'farm-001', 'Tomato', 'Early Blight', 94.5, 72, 'Moderate',
        symptoms, treatment, prevention, 'NPK 19-19-19', 'Copper Oxychloride', 'Imidacloprid', '7-10 Days'
      ]
    );

    await db.run(
      `INSERT INTO reports (id, user_id, detection_id, date, crop, disease, health, treatment, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['rep-001', defaultUserId, 'det-001', '2026-08-10', 'Tomato', 'Early Blight', 72, 'Fungicide Spray', 'Completed']
    );

    await db.run(
      `INSERT INTO history (id, user_id, type, title, description, timestamp)
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['hist-001', defaultUserId, 'detection', 'Early Blight Detected', 'AI scanner identified Early Blight in North Field Wheat with 94.5% confidence', new Date().toISOString()]
    );
  }
}
