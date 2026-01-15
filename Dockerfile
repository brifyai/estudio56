# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Create .env file with all variables for Vite build
RUN cat > .env << 'EOF'
VITE_GEMINI_API_KEY=AIzaSyA40oZ6hUsB4PaZ1emgzDLez06P4ZNmJfw
VITE_SUPABASE_URL=https://supabase.estudio56.cl
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE
REACT_APP_SUPABASE_URL=https://supabase.estudio56.cl
REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE
REACT_APP_USE_VIDEO_WORKER=true
REACT_APP_VIDEO_WORKER_URL=https://estudio56-video-worker.brifyaimaster.workers.dev
VITE_GOOGLE_VERTEX_PROJECT=stratega-ai-x
VITE_GOOGLE_VERTEX_LOCATION=us-central1
FAL_AI_API_KEY=53f17bdf-d098-44d0-af18-5c7cc1984203:4ae450f687dd2d6b04b75fcdc8fe7d28
MERCADOPAGO_PUBLIC_KEY=APP_USR-63af4295-1d02-4c5a-9705-706d295da708
EOF

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

# Create startup script that generates .env from environment variables
RUN cat > /app/start.sh << 'EOF'
#!/bin/sh
# Generate .env file from environment variables
cat > /app/.env << ENVEOF
NODE_ENV=${NODE_ENV:-production}
PORT=${PORT:-3000}
VITE_GEMINI_API_KEY=${VITE_GEMINI_API_KEY}
VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
REACT_APP_SUPABASE_URL=${REACT_APP_SUPABASE_URL}
REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY=${REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY}
REACT_APP_USE_VIDEO_WORKER=${REACT_APP_USE_VIDEO_WORKER}
REACT_APP_VIDEO_WORKER_URL=${REACT_APP_VIDEO_WORKER_URL}
VITE_GOOGLE_VERTEX_PROJECT=${VITE_GOOGLE_VERTEX_PROJECT}
VITE_GOOGLE_VERTEX_LOCATION=${VITE_GOOGLE_VERTEX_LOCATION}
FAL_AI_API_KEY=${FAL_AI_API_KEY}
GEMINI_API_KEY=${GEMINI_API_KEY}
GOOGLE_VERTEX_PROJECT=${GOOGLE_VERTEX_PROJECT}
GOOGLE_VERTEX_LOCATION=${GOOGLE_VERTEX_LOCATION}
MERCADOPAGO_ACCESS_TOKEN=${MERCADOPAGO_ACCESS_TOKEN}
MERCADOPAGO_PUBLIC_KEY=${MERCADOPAGO_PUBLIC_KEY}
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
SECRETS_SCAN_SMART_DETECTION_ENABLED=${SECRETS_SCAN_SMART_DETECTION_ENABLED}
ENVEOF

echo "✅ .env file generated successfully"
cat /app/.env
echo ""
echo "🚀 Starting server..."
exec node /app/server.js
EOF

RUN chmod +x /app/start.sh

EXPOSE 3000

CMD ["/app/start.sh"]
