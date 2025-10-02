# Build static assets using Node
FROM node:18-alpine AS builder
WORKDIR /app
COPY scripts ./scripts
COPY index.html styles.css script.js ./
RUN node scripts/build.mjs

# Serve with nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
