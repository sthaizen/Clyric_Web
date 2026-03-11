# Use an official Node runtime as a parent image
# We use bullseye (Debian 11) or bookworm (Debian 12) because it makes installing gcc, python, and java trivial
FROM node:20-bookworm-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Install build tools, python, and java
#   - build-essential: provides gcc and g++
#   - python3: provides python runner
#   - default-jre default-jdk: provides javac and java
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    default-jre \
    default-jdk \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json to the workspace
COPY package*.json ./

# Install application dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Set environment to production
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 5000

# The command to run your application
CMD [ "node", "src/server.js" ]
