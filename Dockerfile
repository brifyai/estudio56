# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Create .env file with all variables for Vite build
RUN echo "VITE_GEMINI_API_KEY=AIzaSyA40oZ6hUsB4PaZ1emgzDLez06P4ZNmJfw" > .env && \
    echo "VITE_SUPABASE_URL=https://estudio56supabase.brifyai.com" >> .env && \
    echo "VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE" >> .env && \
    echo "REACT_APP_SUPABASE_URL=https://estudio56supabase.brifyai.com" >> .env && \
    echo "REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE" >> .env && \
    echo "REACT_APP_USE_VIDEO_WORKER=true" >> .env && \
    echo "REACT_APP_VIDEO_WORKER_URL=https://estudio56-video-worker.brifyaimaster.workers.dev" >> .env && \
    echo "VITE_GOOGLE_VERTEX_PROJECT=stratega-ai-x" >> .env && \
    echo "VITE_GOOGLE_VERTEX_LOCATION=us-central1" >> .env && \
    echo "FAL_AI_API_KEY=53f17bdf-d098-44d0-af18-5c7cc1984203:4ae450f687dd2d6b04b75fcdc8fe7d28" >> .env && \
    echo "MERCADOPAGO_PUBLIC_KEY=APP_USR-63af4295-1d02-4c5a-9705-706d295da708" >> .env

# Verify .env file was created
RUN echo "🔍 Verificando archivo .env..." && \
    cat .env && \
    echo "✅ Variables configuradas en .env"

# Build the application with production mode
RUN npm run build

# Verify build output
RUN ls -la dist/ && echo "✅ Build completado"

# Production stage
FROM node:20-alpine
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built frontend from builder
COPY --from=builder /app/dist ./dist

# Copy server files
COPY server ./server
COPY server.js .

# Create .env for runtime
RUN echo "NODE_ENV=production" > .env && \
    echo "PORT=3000" >> .env && \
    echo "VITE_SUPABASE_URL=https://estudio56supabase.brifyai.com" >> .env && \
    echo "VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE" >> .env && \
    echo "VITE_GOOGLE_VERTEX_PROJECT=stratega-ai-x" >> .env && \
    echo "VITE_GOOGLE_VERTEX_LOCATION=us-central1" >> .env && \
    echo "FAL_AI_API_KEY=53f17bdf-d098-44d0-af18-5c7cc1984203:4ae450f687dd2d6b04b75fcdc8fe7d28" >> .env && \
    echo "MERCADOPAGO_ACCESS_TOKEN=APP_USR-5737650046044163-010717-c671110b021996141c7378d0fa3743f3-2485402971" >> .env && \
    echo "SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpza3VuZW12ZmZ5cXl4dGZxeXptIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Njk4MjQyNywiZXhwIjoyMDgyNTU4NDI3fQ.ttKR7Bp4u8sMnet8Y5u-AkW9u7by7aV6CAIstdtPtbM" >> .env

EXPOSE 3000

CMD ["node", "server.js"]
