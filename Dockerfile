# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Create .env file with all variables for Vite build
RUN echo "VITE_GEMINI_API_KEY=AIzaSyCjYfdiXyAJHHhpNn2FnSiZSA-xn5oqeLU" > .env && \
    echo "VITE_SUPABASE_URL=https://zskunemvffyqyxtfqyzm.supabase.co" >> .env && \
    echo "VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpza3VuZW12ZmZ5cXl4dGZxeXptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5ODI0MjcsImV4cCI6MjA4MjU1ODQyN30.fnBdIUv--_UhIg_843aSAKEHSdVtRCcAKdLGawRGTaw" >> .env && \
    echo "REACT_APP_SUPABASE_URL=https://zskunemvffyqyxtfqyzm.supabase.co" >> .env && \
    echo "REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpza3VuZW12ZmZ5cXl4dGZxeXptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5ODI0MjcsImV4cCI6MjA4MjU1ODQyN30.fnBdIUv--_UhIg_843aSAKEHSdVtRCcAKdLGawRGTaw" >> .env && \
    echo "REACT_APP_USE_VIDEO_WORKER=true" >> .env && \
    echo "REACT_APP_VIDEO_WORKER_URL=https://estudio56-video-worker.brifyaimaster.workers.dev" >> .env

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
RUN echo 'server { listen 80; root /usr/share/nginx/html; index index.html; location / { try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
