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

# Copy production dependencies from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy only what is needed to run the app
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

EXPOSE 3000

CMD ["npm", "start"]