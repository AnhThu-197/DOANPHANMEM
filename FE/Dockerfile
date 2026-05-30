FROM nginx:alpine
# Copy static frontend files to Nginx web root
COPY . /usr/share/nginx/html
# Clean up Docker config files from public directory
RUN rm -f /usr/share/nginx/html/Dockerfile /usr/share/nginx/html/nginx.conf
# Replace default config with our custom reverse proxy config
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
