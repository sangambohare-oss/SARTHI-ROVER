# Stage 1: Build Frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app/project
COPY project/package*.json ./
RUN npm install --no-audit
COPY project/ ./
RUN npm run build

# Stage 2: Runtime Backend
FROM node:20-slim
WORKDIR /usr/src/app

# Install root dependencies
COPY package*.json ./
RUN npm install --omit=dev --no-audit

# Copy backend source
COPY . .

# Copy built frontend from Stage 1 into project/dist
COPY --from=frontend-builder /app/project/dist ./project/dist

# Expose port
EXPOSE 5000

# Environment variables defaults
ENV PORT=5000
ENV NODE_ENV=production
ENV JWT_SECRET=agrivision_production_jwt_secret_key_2026_change_me
ENV CORS_ORIGIN=*

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); })" || exit 1

# Start the unified backend and frontend server
CMD [ "npm", "start" ]

