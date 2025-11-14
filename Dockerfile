# Simple production image for NeuroFleet Command
# 
# REQUIREMENTS:
# 1. Build the application locally first: npm run build
# 2. Then build this Docker image: docker build -t neurofleet-command .
#
# For a full build-in-Docker solution, use Dockerfile.multistage instead
# (Note: multistage may have npm registry issues in some environments)

FROM nginx:alpine

# Copy built assets
COPY dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
