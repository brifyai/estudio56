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

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Create nginx config with proper MIME types
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # Proper MIME types for JavaScript modules \
    location ~* \.js$ { \
        types { \
            application/javascript js; \
        } \
        add_header Content-Type application/javascript; \
        try_files $uri =404; \
    } \
    \
    # CSS files \
    location ~* \.css$ { \
        types { \
            text/css css; \
        } \
        add_header Content-Type text/css; \
        try_files $uri =404; \
    } \
    \
    # All other routes fallback to index.html for SPA \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
