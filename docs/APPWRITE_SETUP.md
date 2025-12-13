# Appwrite Setup Guide

> Backend-as-a-Service configuration for Snake Evolution

## Overview

[Appwrite](https://appwrite.io) provides:

- Authentication
- File storage (for generated GIFs)
- Serverless functions
- Database (optional, Evolu is primary)

## Local Development Setup

### 1. Start Appwrite via Docker

```bash
cd docker
docker compose up -d
```

This starts:

- Appwrite at `http://localhost`
- MariaDB
- Redis
- Maildev at `http://localhost:1080`

### 2. Create Project

1. Open `http://localhost`
2. Create account
3. Create new project: `snake-evolution`
4. Note the Project ID

### 3. Create API Key

1. Go to Settings → API Keys
2. Create key with scopes:
   - `storage.read`
   - `storage.write`
   - `functions.read`
   - `functions.write`

### 4. Configure Environment

```bash
# .env.local
PUBLIC_APPWRITE_ENDPOINT=http://localhost/v1
PUBLIC_APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-api-key
```

## Storage Bucket Setup

Create bucket for GIF storage:

```typescript
// scripts/setup-appwrite.ts
import { Client, Storage } from "node-appwrite";

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT!)
  .setProject(process.env.APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const storage = new Storage(client);

await storage.createBucket(
  "gifs",
  "Generated GIFs",
  [Permission.read(Role.any())],
  false, // not file-level security
  true,  // enabled
  50000000, // 50MB max file size
  ["image/gif", "image/svg+xml"],
);
```

## ElysiaJS Integration

```typescript
// apps/api/src/services/appwrite.ts
import { Client, Storage } from "node-appwrite";

export class AppwriteService {
  private storage: Storage;

  constructor() {
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT!)
      .setProject(process.env.APPWRITE_PROJECT_ID!)
      .setKey(process.env.APPWRITE_API_KEY!);

    this.storage = new Storage(client);
  }

  async uploadGif(file: Blob, filename: string) {
    return this.storage.createFile("gifs", "unique()", file);
  }

  getFileUrl(fileId: string) {
    return `${process.env.APPWRITE_ENDPOINT}/storage/buckets/gifs/files/${fileId}/view`;
  }
}
```

---

*This document is auto-imported into Starlight at `/docs` route.*
