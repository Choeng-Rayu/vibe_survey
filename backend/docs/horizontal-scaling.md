# Horizontal Scaling

The API is stateless: authentication uses JWT, token blacklist/cache state lives in Redis, background jobs use shared Bull queues, and durable data lives in PostgreSQL.

## Load Balancer

Route all instances behind an L7 load balancer with health checks against `/api/v1/health`. During rolling deployments, remove an instance from rotation, send `SIGTERM`, wait for graceful shutdown, then replace it.

## Shared State

- Redis: cache, rate limiting, token blacklist, auto-save progress, queue coordination
- PostgreSQL: source of truth for users, surveys, campaigns, responses, payments
- Object storage: uploaded files for S3/R2 deployments

## WebSockets

Use the Redis Socket.IO adapter in production so broadcasts reach clients connected to any instance. Keep sticky sessions enabled at the load balancer unless the adapter is fully configured.

## Autoscaling Signals

Scale API instances on CPU, p95 latency, and request queue depth. Scale workers separately on Bull queue depth and job age.
