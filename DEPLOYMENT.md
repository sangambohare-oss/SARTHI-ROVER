# AgriVision AI Backend Deployment Guide

This guide provides instructions for hosting and deploying the **AgriVision AI Backend** REST API service to cloud platforms (Render, Railway, Docker, AWS, Heroku, or Linux VPS).

---

## 🚀 Quick Start (Local Production Test)

```bash
# 1. Install dependencies
npm install

# 2. Start the backend server
npm start
```

The server will initialize SQLite database tables and seed demo data automatically. Access:
- API Root: `http://localhost:5000/`
- Health Check: `http://localhost:5000/health`

---

## ☁️ Deployment Options

### Option 1: Render.com (Recommended Free/Low-Cost Cloud Hosting)

1. Create a new account on [Render.com](https://render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub / GitLab repository containing this code.
4. Configure the Web Service settings:
   - **Name**: `agrivision-backend`
   - **Environment**: `Node`
   - **Region**: Select closest region (e.g. Oregon / Frankfurt / Singapore)
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: `your_secure_random_jwt_secret_key`
   - `CORS_ORIGIN`: `*` (or your frontend deployment URL, e.g. `https://your-app.vercel.app`)
6. Click **Create Web Service**. Your API will be live at `https://agrivision-backend.onrender.com`.

---

### Option 2: Railway.app

1. Log in to [Railway.app](https://railway.app).
2. Click **New Project** -> **Deploy from GitHub Repo**.
3. Select your repository.
4. Railway auto-detects Node.js from `package.json`.
5. Under **Variables**, add:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: `your_secure_random_jwt_secret_key`
   - `CORS_ORIGIN`: `*`
6. Click **Generate Domain** in Settings.

---

### Option 3: Docker Container Deployment (AWS ECS / Cloud Run / VPS)

#### Build & Run locally with Docker:
```bash
# Build the Docker image
docker build -t agrivision-backend .

# Run container on port 5000
docker run -d -p 5000:5000 --name agrivision-server -e JWT_SECRET="your_secret" agrivision-backend
```

---

## 🔐 Environment Variables Summary

| Variable | Default Value | Description |
|---|---|---|
| `PORT` | `5000` | Port for the Express backend server |
| `NODE_ENV` | `production` | Node environment (`development` / `production`) |
| `JWT_SECRET` | `agrivision_secret_key_2026` | Secret key used for signing JWT authentication tokens |
| `CORS_ORIGIN` | `*` | Allowed CORS origin URLs (comma-separated or `*`) |
| `DB_PATH` | `./project/backend/agrivision.sqlite` | Absolute or relative path to SQLite database file |

---

## 📡 Key API Endpoints Reference

- `GET /health` - Server & Database health status check
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user & receive JWT token
- `POST /predict` - Upload image for AI crop disease prediction & analysis
- `GET /rover/status` - Retrieve telemetric state of smart farming rover
- `POST /rover/control` - Send action commands to rover (`start`, `spray`, `dock`, `pause`)
- `POST /mission/start` - Initiate automated farm scanning mission
- `GET /weather` - Current weather and field sensors telemetry
- `GET /api/farms` - List user farms
