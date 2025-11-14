# 🐳 Docker Guide for NeuroFleet Command

This guide provides detailed information about running NeuroFleet Command in Docker containers.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Docker Files Overview](#docker-files-overview)
- [Deployment Options](#deployment-options)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Prerequisites

- **Docker**: version 20.x or higher
- **Docker Compose**: version 2.x or higher (optional but recommended)
- **Node.js & npm**: version 18.x or higher (for local build)

## Quick Start

The fastest way to run NeuroFleet Command with Docker:

```bash
# Clone and navigate to the repository
git clone https://github.com/xmarano/NeuroFleet-Command-moktar.git
cd NeuroFleet-Command-moktar

# Build the application
npm install
npm run build

# Start with Docker Compose
docker compose up -d

# Access the application
open http://localhost:8080
```

## Docker Files Overview

### Dockerfile (Default)

The main `Dockerfile` is optimized for simplicity and reliability:

- **Base Image**: `nginx:alpine` (lightweight, ~23MB)
- **Build Strategy**: Copies pre-built `dist/` folder
- **Requirements**: Application must be built locally first
- **Use Case**: Production deployments, CI/CD pipelines

**Advantages:**
- Simple and fast (no npm issues)
- Predictable builds
- Smaller attack surface
- Works in all network environments

**Disadvantages:**
- Requires local Node.js installation
- Two-step process (build + dockerize)

### Dockerfile.multistage (Alternative)

Alternative Dockerfile for complete in-Docker builds:

- **Base Image**: `node:20-slim` for building, `nginx:alpine` for serving
- **Build Strategy**: Complete build inside Docker
- **Requirements**: None (fully self-contained)
- **Use Case**: Environments without Node.js, automated builds

**Advantages:**
- Self-contained (no local Node.js needed)
- True multi-stage build
- Clean separation of build and runtime

**Disadvantages:**
- May encounter npm registry/SSL issues in restricted networks
- Longer build times
- Larger build context

**Usage:**
```bash
docker build -f Dockerfile.multistage -t neurofleet-command .
```

### docker-compose.yml

Orchestration configuration for easy container management:

- Service name: `neurofleet-command`
- Port mapping: `8080:80`
- Health checks: Built-in with 30s interval
- Restart policy: `unless-stopped`

### nginx.conf

Production-ready nginx configuration:

- **SPA Support**: All routes redirect to `index.html`
- **Compression**: gzip enabled for text assets
- **Caching**: 1-year cache for static assets, no-cache for HTML
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection

### .dockerignore

Optimizes build context by excluding:
- `node_modules/`
- Development files
- Git history
- IDE configurations
- Documentation (except README)

## Deployment Options

### Option 1: Docker Compose (Recommended)

Perfect for development, testing, and simple production deployments.

```bash
# Start in foreground (with logs)
docker compose up

# Start in background
docker compose up -d

# View logs
docker compose logs -f

# Stop and remove containers
docker compose down

# Rebuild and restart
npm run build
docker compose up -d --build
```

### Option 2: Docker CLI

More control for advanced deployments.

```bash
# Build the image
docker build -t neurofleet-command:latest .

# Run with custom options
docker run -d \
  --name neurofleet-command \
  -p 8080:80 \
  --restart unless-stopped \
  --health-cmd="wget --quiet --tries=1 --spider http://localhost/ || exit 1" \
  --health-interval=30s \
  neurofleet-command:latest

# View logs
docker logs -f neurofleet-command

# Stop and remove
docker stop neurofleet-command
docker rm neurofleet-command
```

### Option 3: Multi-Stage Build

For environments where you can't or don't want to build locally.

```bash
# Build using multistage Dockerfile
docker build -f Dockerfile.multistage -t neurofleet-command:latest .

# Run normally
docker run -d -p 8080:80 neurofleet-command:latest
```

**Note**: If you encounter SSL/certificate errors during the build, you may need to:
- Use a corporate proxy
- Configure npm to use different registries
- Use the default Dockerfile instead

## Configuration

### Port Mapping

Change the exposed port by modifying `docker-compose.yml`:

```yaml
ports:
  - "3000:80"  # Access on port 3000 instead of 8080
```

Or with Docker CLI:

```bash
docker run -d -p 3000:80 neurofleet-command
```

### Environment Variables

While the current application doesn't require environment variables, you can add them:

```yaml
# docker-compose.yml
environment:
  - NODE_ENV=production
  - API_URL=https://api.example.com
```

### Custom Nginx Configuration

To use a custom nginx configuration:

1. Modify `nginx.conf`
2. Rebuild the container:

```bash
npm run build
docker compose up -d --build
```

### Health Checks

Health checks are configured to:
- Check every 30 seconds
- Timeout after 10 seconds
- Retry 3 times before marking unhealthy
- Wait 40 seconds before first check

Check health status:

```bash
docker ps
docker inspect neurofleet-command | grep -A 10 Health
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs neurofleet-command

# Check if port is already in use
sudo lsof -i :8080
netstat -an | grep 8080

# Try a different port
docker run -d -p 8081:80 neurofleet-command
```

### Application Not Loading

```bash
# Verify nginx is running
docker exec neurofleet-command ps aux | grep nginx

# Check nginx configuration
docker exec neurofleet-command nginx -t

# Verify dist files exist
docker exec neurofleet-command ls -la /usr/share/nginx/html
```

### Build Failures (Multistage)

If `Dockerfile.multistage` fails with npm errors:

```bash
# Option 1: Use the default Dockerfile instead
npm install && npm run build
docker build -t neurofleet-command .

# Option 2: Configure npm for your network
# Edit Dockerfile.multistage to add:
# RUN npm config set registry https://your-registry.com
# RUN npm config set strict-ssl false
```

### Permission Issues

If you encounter permission errors:

```bash
# Check file ownership in container
docker exec neurofleet-command ls -la /usr/share/nginx/html

# Files should be readable by nginx user
docker exec neurofleet-command id nginx
```

## Best Practices

### Production Deployments

1. **Use specific tags**: Avoid `latest`, use version tags
   ```bash
   docker build -t neurofleet-command:1.0.0 .
   ```

2. **Enable health checks**: Already configured in docker-compose.yml

3. **Set resource limits**:
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '0.5'
         memory: 256M
   ```

4. **Use secrets for sensitive data**: Mount configuration files as secrets

5. **Regular updates**: Keep base images updated
   ```bash
   docker pull nginx:alpine
   docker compose build --pull
   ```

### Development Workflow

1. **Hot reload**: Use `npm run dev` locally for development
2. **Docker for testing**: Use Docker to test production builds
3. **Separate environments**: Use different compose files for dev/prod

### Security

1. **Scan images**: Use tools like Trivy or Snyk
   ```bash
   docker scan neurofleet-command
   ```

2. **Minimize attack surface**: The default Dockerfile uses minimal alpine image

3. **Update regularly**: Keep nginx and base images updated

4. **Review nginx config**: Security headers are already included

### Performance

1. **Enable caching**: Already configured in nginx.conf

2. **Use CDN**: For static assets in production

3. **Monitor resources**:
   ```bash
   docker stats neurofleet-command
   ```

4. **Optimize build context**: .dockerignore already excludes unnecessary files

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Alpine Linux](https://alpinelinux.org/)

## Support

For issues specific to Docker deployment:
1. Check this guide first
2. Review [GitHub Issues](https://github.com/xmarano/NeuroFleet-Command-moktar/issues)
3. Create a new issue with:
   - Docker version: `docker --version`
   - Docker Compose version: `docker compose version`
   - Error logs: `docker logs neurofleet-command`
   - Build output if applicable

---

**Made with 🐳 for the NeuroFleet Team**
