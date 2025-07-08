# --- STAGE 1: Build Application (for compiling production assets) ---
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ARG VITE_API_URL

ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# --- STAGE 2: Serve Application with Nginx (for production/demo) ---
FROM nginx:alpine AS production-stage

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# --- STAGE 3: Environnement de Développement (for `docker-compose.dev.yml`) ---
FROM node:22-alpine AS development-stage

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]