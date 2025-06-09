FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]

