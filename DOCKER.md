# Docker Setup Guide

Complete guide for running the Vibe Survey platform using Docker Compose.

---

## Prerequisites

Before you begin, ensure you have the following installed:

| Requirement | Version | Download |
|-------------|---------|----------|
| **Docker Engine** | 20.10+ | [Get Docker](https://docs.docker.com/get-docker/) |
| **Docker Compose** | v2.0+ | [Install Compose](https://docs.docker.com/compose/install/) |

Verify your installation:

```bash
docker --version
docker compose version
```

---

## Quick Start

Get the entire Vibe Survey platform running in minutes:

### 1. Build and Start All Services

```bash
docker-compose up --build -d
```

**What this does:**
- Builds Docker images for all services (backend + 3 frontends)
- Creates a Docker network for inter-service communication
- Starts containers in detached mode (`-d`)
- Backend starts first (healthcheck), then frontends start once backend is ready

### 2. View Logs

```bash
docker-compose logs -f
```

**Filter by specific service:**
```bash
docker-compose logs -f backend
docker-compose logs -f survey-creator
docker-compose logs -f survey-taker
docker-compose logs -f admin
```

### 3. Stop All Services

```bash
docker-compose down
```

---

## Service URLs

Once running, access each service at:

| Service | Description | URL |
|---------|-------------|-----|
| **Backend API** | NestJS REST API | http://localhost:3000 |
| **Survey Creator** | Advertiser campaign portal | http://localhost:3001 |
| **Survey Taker** | User survey app | http://localhost:3002 |
| **Admin Dashboard** | Platform administration | http://localhost:3003 |

**API Documentation:** Visit http://localhost:3000/api for Swagger UI (if enabled)

---

## Individual Service Commands

### Build Specific Service

```bash
docker-compose build <service-name>
```

**Examples:**
```bash
docker-compose build backend
docker-compose build survey-creator
docker-compose build survey-taker
docker-compose build admin
```

### Start Specific Service

```bash
docker-compose up -d <service-name>
```

**Examples:**
```bash
docker-compose up -d backend
docker-compose up -d survey-creator
```

### View Specific Service Logs

```bash
docker-compose logs -f <service-name>
```

**Examples:**
```bash
docker-compose logs -f backend
docker-compose logs -f survey-creator
docker-compose logs -f survey-taker
docker-compose logs -f admin
```

### Restart a Service

```bash
docker-compose restart <service-name>
```

---

## Service Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Network                            │
│              vibe-survey-network (bridge)                  │
└─────────────────────────────────────────────────────────────┘
         │            │            │            │
    ┌────▼────┐  ┌────▼────┐  ┌────▼────┐  ┌────▼────┐
    │ Backend │  │ Creator │  │ Taker   │  │ Admin   │
    │  :3000  │  │  :3001  │  │  :3002  │  │  :3003  │
    └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘
         │            │            │            │
    ┌────┴────────────────────────────────────────┐
    │         Health Check Dependency              │
    │  Backend must be healthy before frontends    │
    └─────────────────────────────────────────────┘
```

---

## Environment Variables

Each service has its own environment configuration:

### Backend (`backend`)

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Runtime environment |
| `PORT` | `3000` | Service port |

> **Note:** Additional environment variables (database URLs, JWT secrets, etc.) should be configured in `backend/.env` before building.

### Frontends (`survey-creator`, `survey-taker`, `admin`)

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Runtime environment |
| `PORT` | `3001-3003` | Service-specific port |
| `API_URL` | `http://backend:3000` | Internal backend URL (Docker network) |

> **Important:** Frontends communicate with the backend using the internal Docker network hostname (`backend`), not `localhost`.

---

## Development vs Production

### Current Configuration

The Docker setup is **configured for production builds**:

- Multi-stage Dockerfiles (optimized image size)
- Production `NODE_ENV`
- No volume mounts for hot reload
- Next.js standalone output for frontends
- Health checks enabled
- Non-root user for security

### Development Mode

For active development with hot reload, you would need:

1. **Volume mounts** for live code changes
2. **Development `NODE_ENV`** for Next.js hot reload
3. **Override `command`** to use development servers

**Example development override** (create `docker-compose.override.yml`):

```yaml
services:
  survey-creator:
    volumes:
      - ./survey_creator_frontend:/app
      - /app/node_modules
    command: npm run dev
```

---

## Troubleshooting

### Port Conflicts

**Problem:** `bind: address already in use`

**Solution:** Check if ports 3000-3003 are in use:

```bash
# Check what's using the ports
sudo lsof -i :3000-3003

# Or stop any running Node.js processes
pkill -f "node"

# Change ports in docker-compose.yml if needed
```

### Permission Issues

**Problem:** `permission denied` when running Docker commands

**Solution:** Add your user to the docker group or use `sudo`:

```bash
# Option 1: Use sudo
sudo docker-compose up --build -d

# Option 2: Add user to docker group (recommended, requires logout/login)
sudo usermod -aG docker $USER
```

### Clean Rebuild

**Problem:** Stale images or build cache issues

**Solution:** Complete rebuild with no cache:

```bash
# Stop and remove all containers and volumes
docker-compose down -v

# Remove all related images
docker rmi vibe-survey-backend vibe-survey-creator vibe-survey-taker vibe-survey-admin

# Rebuild from scratch
docker-compose up --build -d
```

### Container Won't Start

**Problem:** Service exits immediately

**Solution:** Check logs for specific errors:

```bash
docker-compose logs <service-name>
```

**Common causes:**
- Backend requires database connection (configure `backend/.env`)
- Frontend build errors (check `docker-compose build <service> --no-cache`)
- Port conflicts (see above)

### Health Check Failures

**Problem:** Frontends won't start, waiting for backend

**Solution:** Check backend health:

```bash
# Check if backend is running
docker ps | grep backend

# Check backend logs
docker-compose logs -f backend

# Test health endpoint manually
curl http://localhost:3000/health
```

### Slow Build Times

**Problem:** Builds take too long

**Solution:** Use Docker BuildKit for faster builds:

```bash
export DOCKER_BUILDKIT=1
docker-compose build --parallel
```

---

## Clean Up

### Remove All Containers

```bash
docker-compose down
```

### Remove All Containers and Volumes

```bash
docker-compose down -v
```

**What gets removed:**
- All service containers
- Named volumes (node_modules for each service)
- Network

### Remove All Images

```bash
# Remove only Vibe Survey images
docker rmi vibe-survey-backend vibe-survey-creator vibe-survey-taker vibe-survey-admin

# Or remove ALL unused images
docker image prune -a

# Nuclear option: remove all images
docker rmi $(docker images -q)
```

### Complete System Clean

```bash
# Stop and remove everything
docker-compose down -v

# Remove images
docker rmi vibe-survey-backend vibe-survey-creator vibe-survey-taker vibe-survey-admin

# Remove any dangling volumes
docker volume prune

# Remove unused networks
docker network prune
```

---

## Useful Commands

### Container Management

```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Exec into a running container
docker exec -it vibe-survey-backend sh

# Stop a specific container
docker stop vibe-survey-backend

# Remove a specific container
docker rm vibe-survey-backend
```

### Image Management

```bash
# List all images
docker images

# List build cache
docker buildx du

# Prune build cache
docker builder prune
```

### Network Debugging

```bash
# List networks
docker network ls

# Inspect the vibe-survey network
docker network inspect vibe-survey-network

# Test connectivity between containers
docker exec -it vibe-survey-creator ping backend
```

---

## Project Structure

```
vibe_survey/
├── docker-compose.yml           # Main compose file
├── DOCKER.md                    # This file
├── backend/
│   ├── Dockerfile
│   └── .env                     # Backend environment variables
├── survey_creator_frontend/
│   └── Dockerfile
├── survey_taker_frontend/
│   └── Dockerfile
└── admin_frontend/
    └── Dockerfile
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Start all services | `docker-compose up --build -d` |
| Stop all services | `docker-compose down` |
| View all logs | `docker-compose logs -f` |
| Rebuild specific | `docker-compose build <service>` |
| Clean everything | `docker-compose down -v && docker rmi $(docker images -q)` |
| Check status | `docker ps` |
| Backend shell | `docker exec -it vibe-survey-backend sh` |

---

## Support

For issues related to:
- **Application bugs**: Check the service logs
- **Docker issues**: Verify prerequisites and ports
- **Build errors**: Try clean rebuild (`docker-compose down -v && docker-compose up --build`)
