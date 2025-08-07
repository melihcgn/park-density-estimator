# ---- Stage 1: Build ----
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy and install dependencies (cacheable step)
COPY package.json package-lock.json ./
RUN npm ci

# Now copy the rest of the app
COPY . .

# Build the app
RUN npm run build

# ---- Stage 2: Run ----
FROM node:18-alpine AS runner

WORKDIR /app

# Copy only production build output and essentials
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json

# Install only production dependencies
RUN npm ci --omit=dev  # better than `npm install` for consistency

EXPOSE 3000

CMD ["npm", "start"]
