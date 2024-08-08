# Stage 1: Build
# Use the official Node.js 20 as a parent image
FROM node:20-alpine as builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application if needed
# RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine

# Set a non-root user and switch to it
RUN addgroup app && adduser -S -G app app
USER app

# Set the working directory
WORKDIR /app

# Copy the built node modules and other necessary files
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app .

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run your app
CMD ["node", "bot.js"]
