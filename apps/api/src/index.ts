import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
// cspell:ignore elysiajs Elysia elysia
import { Elysia } from "elysia";

const app = new Elysia()
  .use(cors())
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
  )
  .listen(3001);

console.log(`🐍 Snake Evolution API running at ${app.server?.hostname}:${app.server?.port}`);
console.log(`📚 Swagger docs at http://localhost:3001/swagger`);

export type App = typeof app;
