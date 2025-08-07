# ---- Stage 1: Build ----
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev  # only install production dependencies

# Copy all source files
COPY . .

# Build the Next.js app
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
