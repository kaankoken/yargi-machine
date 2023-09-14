# --- Build Stage ---
# Use an official Node.js Alpine image as the base
FROM node:20.5-alpine as builder

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src/
COPY index.ts ./

# Install production dependencies
RUN npm ci \
  && npm run build

# --- Production Stage ---
FROM node:20.5-alpine as prod

WORKDIR /usr/src/app

COPY --from=builder ./usr/src/app/dist ./dist
COPY package*.json ./

RUN npm ci --omit=dev

# The ENTRYPOINT to run the application
ENTRYPOINT [ "node", "./dist/index.js" ]
