import { beforeAll, describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "yaml";

describe("Docker Compose Configuration", () => {
  const dockerComposePath = resolve(__dirname, "../docker/docker-compose.yml");
  let content: string;
  let parsed: Record<string, unknown>;

  beforeAll(() => {
    content = readFileSync(dockerComposePath, "utf-8");
    parsed = parse(content);
  });

  test("should not contain hardcoded secret 'your-secret-key'", () => {
    expect(content).not.toContain("your-secret-key");
  });

  test("should reference APPWRITE_SECRET_KEY environment variable for _APP_OPENSSL_KEY_V1", () => {
    // biome-ignore lint/suspicious/noTemplateCurlyInString: checking literal env var string in compose file
    const expectedEnv = "_APP_OPENSSL_KEY_V1=${APPWRITE_SECRET_KEY}";
    expect(content).toContain(expectedEnv);

    const services = parsed.services as Record<string, { environment?: string[] }>;
    expect(services?.appwrite?.environment).toBeDefined();

    const envList = services.appwrite.environment ?? [];
    const keyEnv = envList.find((e) => e.startsWith("_APP_OPENSSL_KEY_V1="));

    expect(keyEnv).toBeDefined();
    expect(keyEnv).toBe(expectedEnv);
  });
});
