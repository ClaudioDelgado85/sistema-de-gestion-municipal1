FROM node:18-alpine

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies and rebuild bcrypt
RUN npm install
RUN npm rebuild bcrypt --build-from-source

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]