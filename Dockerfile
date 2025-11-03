# --- Tahap 1: Build ---
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Tahap 2: Serve ---
FROM nginx:stable-alpine

RUN rm -rf /usr/share/nginx.html/
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80