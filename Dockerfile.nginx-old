FROM node:20-alpine

WORKDIR /app

# Instalar Nginx y bash
RUN apk add --no-cache nginx bash

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci || npm install

# Copy all source code
COPY . .

# Build frontend
RUN npm run build

# Clean dev dependencies
RUN npm prune --production || true

# Setup Nginx
COPY nginx.conf /etc/nginx/http.d/default.conf

# Create startup script
RUN cat > /start.sh << 'EOF'
#!/bin/sh
echo "Starting Node.js backend..."
node /app/server.js &
echo "Starting Nginx..."
nginx -g "daemon off;"
EOF

RUN chmod +x /start.sh

EXPOSE 80

CMD ["/start.sh"]
