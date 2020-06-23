# Pull the base image
FROM node:12.18.1-alpine as kepler_build

# Set working directory
WORKDIR /app
COPY . ./

# Install all dependencies
RUN npm install --silent

# Build react code
RUN npm run build

# NGINX
FROM nginx:alpine
COPY --from=kepler_build /app/build /usr/share/nginx/html
