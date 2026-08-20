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

Credentials can be configured via environment variables or a `.env` file in the `docker` directory.

### Environment Variables

| Variable | Description | Default (development only) |
|----------|-------------|----------------------------|
| `APP_DB_USER` | MariaDB database user | `user` |
| `APP_DB_PASS` | MariaDB database password | `password` |
| `MYSQL_ROOT_PASSWORD` | MariaDB root user password | `rootpassword` |
| `APP_DB_SCHEMA` | Database schema name | `appwrite` |
| `APP_OPENSSL_KEY_V1` | Secret key for Appwrite encryption | `your-secret-key` |

> ⚠️ **Warning**: Default credentials are intended for local development only. Always override these environment variables for production or staging deployments!

## Related

- [`apps/api`](../apps/api) – API server
- [`scripts/setup-mac.sh`](../scripts) – Mac setup script
