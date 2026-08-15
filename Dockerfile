# Production Dockerfile for AgriVision AI Backend Service
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci --only=production

# Bundle app source
COPY . .

# Expose port
EXPOSE 5000

# Environment variables defaults
ENV PORT=5000
ENV NODE_ENV=production
ENV JWT_SECRET=agrivision_production_jwt_secret_key_2026_change_me
ENV CORS_ORIGIN=*

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

# Start the backend server
CMD [ "npm", "start" ]
