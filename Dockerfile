# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci || npm install

# Copy source code
COPY . .

# Create .env file with hardcoded values (Easypanel doesn't pass ARG correctly)
RUN echo "VITE_SUPABASE_URL=https://supabase.estudio56.cl" > .env && \
    echo "VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE" >> .env && \
    echo "VITE_GEMINI_API_KEY=AIzaSyA40oZ6hUsB4PaZ1emgzDLez06P4ZNmJfw" >> .env && \
    echo "VITE_GOOGLE_VERTEX_PROJECT=stratega-ai-x" >> .env && \
    echo "VITE_GOOGLE_VERTEX_LOCATION=us-central1" >> .env && \
    echo "REACT_APP_USE_VIDEO_WORKER=true" >> .env && \
    echo "REACT_APP_VIDEO_WORKER_URL=https://estudio56-video-worker.brifyaimaster.workers.dev" >> .env

# Debug: Show .env file
RUN echo "=== Contenido de .env ===" && cat .env

# Build frontend with Vite
RUN npm run build

# Verify build succeeded
RUN echo "=== Build completado ===" && \
    ls -la /app/dist && \
    echo "=== Archivos generados ===" && \
    find /app/dist -type f | head -20

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production || npm install --only=production

# Copy built frontend from builder stage
COPY --from=builder /app/dist ./dist

# Copy server files
COPY server.js ./
COPY server-minimal.js ./
COPY server ./server

# Verify dist exists in final image
RUN echo "=== Verificando dist en imagen final ===" && \
    ls -la /app/dist && \
    echo "=== Total archivos en dist ===" && \
    find /app/dist -type f | wc -l

EXPOSE 80

# Start with full server (includes API routes)
CMD ["node", "server.js"]
