# Evolu Integration Guide

> Local-first database setup for Snake Evolution

## Overview

[Evolu](https://evolu.dev) provides local-first data storage with:

- SQLite-based local storage
- CRDT-based conflict resolution
- End-to-end encrypted sync
- Works offline

## Installation

```bash
bun add evolu @evolu/react
```

## Schema Definition

```typescript
// packages/types/src/evolu-schema.ts
import * as S from "@effect/schema/Schema";
import { table, database, NonEmptyString1000 } from "evolu";

// Define branded types for type safety
export const GameSessionId = NonEmptyString1000.pipe(S.brand("GameSessionId"));
export type GameSessionId = S.Schema.Type<typeof GameSessionId>;

// Define tables
const GameSession = table({
  id: GameSessionId,
  username: NonEmptyString1000,
  score: S.Number,
  maxSnakeLength: S.Number,
  palette: S.parseJson(ColorPaletteSchema),
  gifUrl: S.NullOr(NonEmptyString1000),
  completedAt: S.NullOr(S.Date),
});

// Create database
export const Database = database({
  gameSession: GameSession,
});

export type Database = typeof Database;
```

## React Integration

```typescript
// apps/web/src/lib/evolu.ts
import { createEvolu } from "@evolu/react";
import { Database } from "@snake-evolution/types";

export const { useEvolu, useQuery, useMutation } = createEvolu(Database);
```

## Usage in Components

```tsx
// apps/web/src/components/GameHistory.tsx
import { useQuery } from "../lib/evolu";

export function GameHistory() {
  const { rows } = useQuery((db) =>
    db.selectFrom("gameSession")
      .selectAll()
      .orderBy("completedAt", "desc")
      .limit(10)
  );

  return (
    <ul>
      {rows.map((session) => (
        <li key={session.id}>
          {session.username}: {session.score} points
        </li>
      ))}
    </ul>
  );
}
```

## Sync Configuration

Evolu supports optional sync via relay server:

```typescript
const evolu = createEvolu(Database, {
  // Optional: Enable sync
  syncUrl: "https://your-relay.example.com",
});
```

---

*This document is auto-imported into Starlight at `/docs` route.*
