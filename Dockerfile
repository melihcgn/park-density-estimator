# ---- Stage 1: Build ----
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the code (including /src)
COPY . .

# Build the app
RUN npm run build

# ---- Stage 2: Run ----
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Copy only necessary files from the builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json

# Install production dependencies
RUN npm install --omit=dev

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
