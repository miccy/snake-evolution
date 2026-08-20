import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
// cspell:ignore elysiajs Elysia elysia
import { Elysia } from "elysia";

export const defaultAllowedOrigins = [
  "http://localhost:3000",
  "http://localhost:4321",
  "https://snake.miccy.dev",
];

export const getAllowedOrigins = (
  envOrigins: string | undefined = process.env.ALLOWED_ORIGINS ?? process.env.CORS_ORIGIN,
): boolean | string[] => {
  if (!envOrigins) {
    return defaultAllowedOrigins;
  }
  if (envOrigins === "*") {
    return true;
  }
  const origins = envOrigins
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  return origins.length > 0 ? origins : defaultAllowedOrigins;
};

export const createServer = (origin?: boolean | string[]) => {
  const allowedOrigins = origin ?? getAllowedOrigins();

  return new Elysia()
    .use(
      cors({
        origin: allowedOrigins,
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      }),
    )
    .use(
      swagger({
        documentation: {
          info: {
            title: "Snake Evolution API",
            version: "1.2.3",
            description: "API for generating GitHub contribution snake animations",
          },
        },
      }),
    )
    .get("/", () => ({
      name: "Snake Evolution API",
      version: "1.2.3",
      docs: "/swagger",
    }))
    .group("/api/v1", (app) =>
      app
        .get("/health", () => ({ status: "ok", timestamp: new Date().toISOString() }))
        .post("/generate", ({ body: _body }) => {
          // TODO: Implement snake generation
          return { message: "Generation queued", jobId: crypto.randomUUID() };
        })
        .get("/job/:id", ({ params: { id } }) => {
          // TODO: Implement job status
          return { jobId: id, status: "pending" };
        }),
    );
};

export const app = createServer();

if (process.env.NODE_ENV !== "test") {
  app.listen(3001);
  console.log(`🐍 Snake Evolution API running at ${app.server?.hostname}:${app.server?.port}`);
  console.log(`📚 Swagger docs at http://localhost:3001/swagger`);
}

export type App = typeof app;
