FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build frontend
RUN npm run build

# Expose port
EXPOSE 3000

# Start Node.js server
CMD ["node", "server.js"]
