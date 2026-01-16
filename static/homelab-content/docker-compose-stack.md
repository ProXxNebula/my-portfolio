---
title: "Self-Hosted Docker Compose Stack"
description: "Overview of my containerized services running on Docker with docker-compose orchestration"
category: "Containers"
difficulty: "beginner"
hardware: "Ubuntu Server 22.04 LTS"
services: ["Portainer", "Traefik", "Nextcloud", "Jellyfin", "Vaultwarden"]
tags: ["docker", "containers", "self-hosted"]
publishedDate: "2026-01-10"
---

# Self-Hosted Docker Compose Stack

## Introduction

This documentation covers my self-hosted services running on Docker with docker-compose orchestration. All services run on an Ubuntu Server 22.04 LTS VM hosted on Proxmox.

## Infrastructure Overview

**Host System**:
- Ubuntu Server 22.04 LTS (VM on Proxmox)
- Docker Engine 25.0.1
- Docker Compose v2.24.0
- Reverse proxy with SSL termination

## Core Services

### Reverse Proxy - Traefik

Traefik handles routing, SSL certificates, and load balancing:

```yaml
version: '3.8'

services:
  traefik:
    image: traefik:v2.11
    container_name: traefik
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true
    networks:
      - proxy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./traefik/traefik.yml:/traefik.yml:ro
      - ./traefik/acme.json:/acme.json
      - ./traefik/config.yml:/config.yml:ro
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.traefik.rule=Host(`traefik.homelab.local`)"
      - "traefik.http.routers.traefik.service=api@internal"

networks:
  proxy:
    external: true
```

**Traefik Configuration** (`traefik.yml`):

```yaml
api:
  dashboard: true
  insecure: false

entryPoints:
  http:
    address: ":80"
    http:
      redirections:
        entryPoint:
          to: https
          scheme: https
  https:
    address: ":443"

certificatesResolvers:
  letsencrypt:
    acme:
      email: admin@homelab.local
      storage: acme.json
      httpChallenge:
        entryPoint: http

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false
  file:
    filename: /config.yml
```

### Container Management - Portainer

Web-based Docker management interface:

```yaml
portainer:
  image: portainer/portainer-ce:latest
  container_name: portainer
  restart: unless-stopped
  security_opt:
    - no-new-privileges:true
  networks:
    - proxy
  volumes:
    - /etc/localtime:/etc/localtime:ro
    - /var/run/docker.sock:/var/run/docker.sock:ro
    - ./portainer-data:/data
  labels:
    - "traefik.enable=true"
    - "traefik.http.routers.portainer.rule=Host(`portainer.homelab.local`)"
    - "traefik.http.services.portainer.loadbalancer.server.port=9000"
```

### Cloud Storage - Nextcloud

Self-hosted cloud storage and productivity platform:

```yaml
nextcloud:
  image: nextcloud:28-apache
  container_name: nextcloud
  restart: unless-stopped
  networks:
    - proxy
    - nextcloud
  volumes:
    - ./nextcloud/html:/var/www/html
    - ./nextcloud/data:/var/www/html/data
    - ./nextcloud/config:/var/www/html/config
  environment:
    - MYSQL_HOST=nextcloud-db
    - MYSQL_DATABASE=nextcloud
    - MYSQL_USER=nextcloud
    - MYSQL_PASSWORD=${NEXTCLOUD_DB_PASSWORD}
  labels:
    - "traefik.enable=true"
    - "traefik.http.routers.nextcloud.rule=Host(`cloud.homelab.local`)"
    - "traefik.http.services.nextcloud.loadbalancer.server.port=80"

nextcloud-db:
  image: mariadb:11
  container_name: nextcloud-db
  restart: unless-stopped
  networks:
    - nextcloud
  volumes:
    - ./nextcloud/db:/var/lib/mysql
  environment:
    - MYSQL_ROOT_PASSWORD=${NEXTCLOUD_DB_ROOT_PASSWORD}
    - MYSQL_DATABASE=nextcloud
    - MYSQL_USER=nextcloud
    - MYSQL_PASSWORD=${NEXTCLOUD_DB_PASSWORD}
```

### Media Server - Jellyfin

Open-source media system for streaming:

```yaml
jellyfin:
  image: jellyfin/jellyfin:latest
  container_name: jellyfin
  restart: unless-stopped
  networks:
    - proxy
  volumes:
    - ./jellyfin/config:/config
    - ./jellyfin/cache:/cache
    - /mnt/media:/media:ro
  environment:
    - PUID=1000
    - PGID=1000
    - TZ=America/New_York
  devices:
    - /dev/dri:/dev/dri  # Hardware acceleration
  labels:
    - "traefik.enable=true"
    - "traefik.http.routers.jellyfin.rule=Host(`media.homelab.local`)"
    - "traefik.http.services.jellyfin.loadbalancer.server.port=8096"
```

### Password Manager - Vaultwarden

Lightweight Bitwarden server implementation:

```yaml
vaultwarden:
  image: vaultwarden/server:latest
  container_name: vaultwarden
  restart: unless-stopped
  networks:
    - proxy
  volumes:
    - ./vaultwarden/data:/data
  environment:
    - WEBSOCKET_ENABLED=true
    - SIGNUPS_ALLOWED=false
    - ADMIN_TOKEN=${VAULTWARDEN_ADMIN_TOKEN}
  labels:
    - "traefik.enable=true"
    - "traefik.http.routers.vaultwarden.rule=Host(`vault.homelab.local`)"
    - "traefik.http.services.vaultwarden.loadbalancer.server.port=80"
```

## Monitoring Stack

### Prometheus & Grafana

```yaml
prometheus:
  image: prom/prometheus:latest
  container_name: prometheus
  restart: unless-stopped
  networks:
    - monitoring
  volumes:
    - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
    - ./prometheus/data:/prometheus
  command:
    - '--config.file=/etc/prometheus/prometheus.yml'
    - '--storage.tsdb.path=/prometheus'

grafana:
  image: grafana/grafana:latest
  container_name: grafana
  restart: unless-stopped
  networks:
    - monitoring
    - proxy
  volumes:
    - ./grafana/data:/var/lib/grafana
  environment:
    - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
  labels:
    - "traefik.enable=true"
    - "traefik.http.routers.grafana.rule=Host(`grafana.homelab.local`)"
```

## Environment Variables

Using `.env` file for sensitive data:

```bash
# Database passwords
NEXTCLOUD_DB_PASSWORD=secure_password_here
NEXTCLOUD_DB_ROOT_PASSWORD=secure_root_password_here

# Admin tokens
VAULTWARDEN_ADMIN_TOKEN=random_secure_token_here
GRAFANA_PASSWORD=secure_grafana_password
```

## Backup Strategy

### Automated Backups Script

```bash
#!/bin/bash
# docker-backup.sh

BACKUP_DIR="/mnt/backups/docker"
DATE=$(date +%Y%m%d_%H%M%S)

# Stop containers
docker-compose down

# Backup volumes
tar -czf "${BACKUP_DIR}/docker-volumes-${DATE}.tar.gz" \
  -C /home/user/docker .

# Restart containers
docker-compose up -d

# Cleanup old backups (keep last 30 days)
find "${BACKUP_DIR}" -name "docker-volumes-*.tar.gz" -mtime +30 -delete
```

**Cron job** for daily backups:

```bash
0 2 * * * /home/user/scripts/docker-backup.sh >> /var/log/docker-backup.log 2>&1
```

## Resource Monitoring

### Container Resource Limits

Applied resource constraints to prevent single service from monopolizing resources:

```yaml
deploy:
  resources:
    limits:
      cpus: '2.0'
      memory: 4G
    reservations:
      cpus: '0.5'
      memory: 1G
```

### Health Checks

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

## Security Considerations

### Network Isolation

Created separate Docker networks for service isolation:

```bash
docker network create proxy
docker network create nextcloud
docker network create monitoring
```

### Non-Root Containers

Running containers as non-root user where possible:

```yaml
user: "1000:1000"
```

### Regular Updates

Update script to pull latest images:

```bash
#!/bin/bash
# update-containers.sh

cd /home/user/docker
docker-compose pull
docker-compose up -d
docker image prune -f
```

## Troubleshooting

### Common Issues

**Container won't start**:
```bash
# Check logs
docker logs container_name

# Check resource usage
docker stats

# Verify network connectivity
docker network inspect proxy
```

**Permission issues**:
```bash
# Fix ownership
sudo chown -R 1000:1000 ./volume-path

# Fix SELinux contexts (if applicable)
sudo chcon -Rt svirt_sandbox_file_t ./volume-path
```

## Performance Optimization

1. **Use volumes instead of bind mounts** for better I/O performance
2. **Enable Docker's BuildKit** for faster builds
3. **Use multi-stage builds** to reduce image sizes
4. **Implement caching strategies** for frequently accessed data

## Future Plans

- [ ] Implement Docker Swarm for multi-node orchestration
- [ ] Add automated testing for stack deployment
- [ ] Migrate to Kubernetes for learning and scalability
- [ ] Implement centralized logging with ELK stack
- [ ] Add automated security scanning with Trivy

## Conclusion

This Docker Compose stack provides a robust, self-hosted alternative to cloud services. All services are containerized, making them portable, reproducible, and easy to manage. The combination of Traefik for routing and Portainer for management creates a powerful homelab environment.
