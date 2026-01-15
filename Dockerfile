FROM node:20-alpine

WORKDIR /app

# Instalar Nginx
RUN apk add --no-cache nginx

# Cache bust para forzar rebuild en Easypanel
ARG CACHEBUST=1

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build frontend
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# Copy Nginx config
COPY nginx.conf /etc/nginx/http.d/default.conf

# Create startup script usando printf (más seguro y portable)
RUN printf '#!/bin/sh\n\
node /app/server.js &\n\
nginx -g "daemon off;"\n' > /start.sh && \
    chmod +x /start.sh

# Expose port
EXPOSE 80

# Start both Node.js and Nginx
CMD ["/start.sh"]
