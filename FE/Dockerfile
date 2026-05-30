FROM nginx:alpine
# Copy static frontend files to Nginx web root
COPY . /usr/share/nginx/html
# Replace default config with our custom reverse proxy config
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
