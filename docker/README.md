# Docker Development Stack

Docker Compose configuration for local development with Appwrite backend.

## Quick Start

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| **Appwrite** | 80, 443 | Backend as a Service |
| **MariaDB** | – | Database for Appwrite |
| **Redis** | 6379 | Cache & queues |
| **MailDev** | 1080, 1025 | Email testing (Web UI + SMTP) |

## Access URLs

- **Appwrite Console**: http://localhost
- **MailDev UI**: http://localhost:1080
- **Redis**: `localhost:6379`

## Data Persistence

All data is stored in named Docker volumes:

- `appwrite-data`, `appwrite-config`, `appwrite-cache`
- `mariadb-data`
- `redis-data`

To reset all data:

```bash
docker compose down -v
```

## Configuration

Default credentials (development only):

| Service | User | Password |
|---------|------|----------|
| MariaDB | `user` | `password` |
| MariaDB Root | `root` | `rootpassword` |

> ⚠️ **Warning**: Change these credentials for any non-local deployment!

## Related

- [`apps/api`](../apps/api) – API server
- [`scripts/setup-mac.sh`](../scripts) – Mac setup script
