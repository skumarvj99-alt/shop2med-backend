# Use Node.js 23
FROM node:23-alpine

# Install Python, build tools, and canvas dependencies
RUN apk add --no-cache python3 make g++ curl pkgconf cairo-dev pango-dev libjpeg-turbo-dev giflib-dev

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies for production
RUN npm prune --production

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["npm", "run", "start:prod"]
