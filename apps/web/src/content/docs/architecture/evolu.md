---
title: Evolu Integration
description: How Snake Evolution uses Evolu for local-first data.
---

# Evolu Integration

Snake Evolution uses [Evolu](https://evolu.dev) for local-first data storage.

## Why Local-First?

- **Privacy** - Your data stays on your device
- **Offline** - Works without internet
- **Fast** - No network latency
- **Sync** - Optional encrypted sync across devices

## Schema

```typescript
import { table, database } from "evolu";
import * as S from "@effect/schema/Schema";

const GameSession = table({
  id: S.NonEmptyString1000,
  username: S.NonEmptyString1000,
  palette: S.String,
  createdAt: S.Date,
  completedAt: S.NullOr(S.Date),
});

const UserPreference = table({
  id: S.NonEmptyString1000,
  key: S.String,
  value: S.String,
});

export const Database = database({
  gameSession: GameSession,
  userPreference: UserPreference,
});
```

## Usage in Components

```tsx
import { useQuery, useMutation } from "../lib/evolu";

function RecentSessions() {
  const { rows } = useQuery((db) =>
    db.selectFrom("gameSession")
      .selectAll()
      .orderBy("createdAt", "desc")
      .limit(10)
  );

  return (
    <ul>
      {rows.map((session) => (
        <li key={session.id}>{session.username}</li>
      ))}
    </ul>
  );
}
```

## Sync Configuration

Enable optional sync with Evolu Relay:

```typescript
const evolu = createEvolu(Database, {
  syncUrl: "https://relay.evolu.dev",
  // Or self-hosted relay
});
```

## Migration from Previous Versions

Evolu handles schema evolution automatically:

```typescript
// Old schema
const _OldSession = table({
  id: S.String,
  username: S.String,
});

// New schema - Evolu migrates automatically
const NewSession = table({
  id: S.String,
  username: S.String,
  palette: S.optional(S.String), // New field
});
```

## Benefits

1. **No Backend Required** - SQLite in the browser
2. **Instant Updates** - No network round-trip
3. **Conflict-Free** - CRDT ensures consistency
4. **Encrypted** - End-to-end encryption available
