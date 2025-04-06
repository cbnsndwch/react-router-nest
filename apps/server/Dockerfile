# Stage 1: Build the application
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copy dependency definition files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json ./apps/server/
COPY tsconfig.json ./
COPY apps/server/tsconfig.json ./apps/server/
COPY apps/server/tsconfig.nest.json ./apps/server/
COPY apps/server/nest-cli.json ./apps/server/

# Install dependencies for the server app and its workspace dependencies
# The '...' includes workspace dependencies
RUN pnpm install --frozen-lockfile --filter @cbnsndwch/react-router-nest-server...

# Copy the rest of the source code
COPY . .

# Build the server application
RUN pnpm --filter @cbnsndwch/react-router-nest-server run build

# Stage 2: Production image
FROM node:22-alpine AS production
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV=production
RUN corepack enable

WORKDIR /app

# Copy necessary files from the base stage for production dependencies
COPY --from=base /app/apps/server/package.json ./package.json
COPY --from=base /app/pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy the built application from the base stage
COPY --from=base /app/apps/server/dist ./dist

# Expose the application port (default NestJS port is 3000)
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main.js"]
