FROM node:18

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Prevent stray local .env from overriding platform-provided environment variables
RUN rm -f .env || true

# Expose the application port
EXPOSE 10000

# Start the application
CMD ["node", "index.js"]
