# Stage 1: Build React app
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# Copy build output to nginx's default directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 (default nginx port)
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]
