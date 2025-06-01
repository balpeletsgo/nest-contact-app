FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and prisma directory first
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

# Install dependencies
RUN npm install -g pnpm && \
  pnpm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN pnpm run build

FROM node:20-alpine AS production

WORKDIR /app

# Copy package files and prisma directory first
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

# Install production dependencies
RUN npm install -g pnpm && pnpm install

# Copy the built application from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/tsconfig.build.json ./tsconfig.build.json

# Copy the startup script
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Expose the application port
EXPOSE 3000

# Start the application with the entrypoint script
CMD ["./docker-entrypoint.sh"]