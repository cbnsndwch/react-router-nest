# Stage 1: Build the application
FROM node:22-alpine AS builder

# Enable pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copy the entire repository
COPY . .

# Install dependencies and build
RUN pnpm install --no-frozen-lockfile && \
    pnpm --filter @cbnsndwch/react-router-nest-server run build

# Stage 2: Production image
FROM node:22-alpine

# Add metadata labels
LABEL org.opencontainers.image.title="React Router Nest Server"
LABEL org.opencontainers.image.description="A demo server application built with React Router and NestJS"
LABEL org.opencontainers.image.source="https://github.com/cbnsndwch/react-router-nest"
LABEL org.opencontainers.image.licenses="MIT"

# Set environment
ENV NODE_ENV=production
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copy only what's needed for production
COPY --from=builder /app/apps/server/dist /app/dist
COPY --from=builder /app/apps/server/package.json /app/package.json

# Install production dependencies
RUN pnpm install --prod --no-frozen-lockfile

# Expose the application port
EXPOSE 3000

# Run the application
CMD ["node", "dist/main.js"]
