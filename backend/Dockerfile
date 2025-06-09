# 1. Build stage - use full Node image to install deps and build app
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# 2. Production stage - copy from build and use distroless Node image
FROM gcr.io/distroless/nodejs:18

WORKDIR /app
COPY --from=build /app ./

EXPOSE 3000
CMD ["index.js", "start"]
