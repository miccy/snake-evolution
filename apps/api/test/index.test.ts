import { describe, expect, it } from "bun:test";
import { app, createServer, getAllowedOrigins } from "../src/index";

describe("CORS Security Tests", () => {
  it("should allow requests from default allowed origins", async () => {
    const response = await app.handle(
      new Request("http://localhost:3001/api/v1/health", {
        headers: { Origin: "https://snake.miccy.dev" },
      }),
    );

    expect(response.headers.get("access-control-allow-origin")).toBe("https://snake.miccy.dev");
  });

  it("should allow requests from localhost dev origins", async () => {
    const response = await app.handle(
      new Request("http://localhost:3001/api/v1/health", {
        headers: { Origin: "http://localhost:3000" },
      }),
    );

    expect(response.headers.get("access-control-allow-origin")).toBe("http://localhost:3000");
  });

  it("should omit access-control-allow-origin for unauthorized origins", async () => {
    const response = await app.handle(
      new Request("http://localhost:3001/api/v1/health", {
        headers: { Origin: "https://evil.com" },
      }),
    );

    expect(response.headers.get("access-control-allow-origin")).toBeNull();
  });

  it("should parse custom ALLOWED_ORIGINS environment variable correctly", () => {
    const customOrigins = getAllowedOrigins("https://app.example.com, https://admin.example.com");
    expect(customOrigins).toEqual(["https://app.example.com", "https://admin.example.com"]);
  });

  it("should allow wildcard '*' when explicitly set in ALLOWED_ORIGINS", () => {
    const wildcard = getAllowedOrigins("*");
    expect(wildcard).toBe(true);
  });

  it("should apply custom server CORS setup from environment variables", async () => {
    const customApp = createServer(getAllowedOrigins("https://custom.domain.com"));

    const allowedRes = await customApp.handle(
      new Request("http://localhost:3001/api/v1/health", {
        headers: { Origin: "https://custom.domain.com" },
      }),
    );
    expect(allowedRes.headers.get("access-control-allow-origin")).toBe("https://custom.domain.com");

    const deniedRes = await customApp.handle(
      new Request("http://localhost:3001/api/v1/health", {
        headers: { Origin: "https://snake.miccy.dev" },
      }),
    );
    expect(deniedRes.headers.get("access-control-allow-origin")).toBeNull();
  });
});
