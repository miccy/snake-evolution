import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import yaml from "yaml";

describe("Docker Compose Configuration", () => {
  const composePath = resolve(__dirname, "../docker/docker-compose.yml");
  const composeContent = readFileSync(composePath, "utf-8");

  test("should be valid YAML", () => {
    const parsed = yaml.parse(composeContent);
    expect(parsed).toBeDefined();
    expect(parsed.services).toBeDefined();
    expect(parsed.services.appwrite).toBeDefined();
    expect(parsed.services.mariadb).toBeDefined();
  });

  test("should use environment variable interpolation for database credentials", () => {
    // Verify hardcoded credentials are not present without env var fallback notation
    expect(composeContent).not.toContain("- _APP_DB_USER=user");
    expect(composeContent).not.toContain("- _APP_DB_PASS=password");
    expect(composeContent).not.toContain("- MYSQL_ROOT_PASSWORD=rootpassword");
    expect(composeContent).not.toContain("- MYSQL_USER=user");
    expect(composeContent).not.toContain("- MYSQL_PASSWORD=password");

    // Verify env var syntax (${VAR:-default}) is used
    expect(composeContent).toContain("${APP_DB_USER:-user}");
    expect(composeContent).toContain("${APP_DB_PASS:-password}");
    expect(composeContent).toContain("${MYSQL_ROOT_PASSWORD:-rootpassword}");
    expect(composeContent).toContain("${APP_DB_SCHEMA:-appwrite}");
  });

  test("should synchronize DB user/pass/schema between Appwrite and MariaDB services", () => {
    const parsed = yaml.parse(composeContent);
    const appwriteEnv: string[] = parsed.services.appwrite.environment;
    const mariadbEnv: string[] = parsed.services.mariadb.environment;

    const findEnvVal = (envList: string[], key: string) => {
      const entry = envList.find((item) => item.startsWith(`${key}=`));
      return entry ? entry.split("=")[1] : undefined;
    };

    expect(findEnvVal(appwriteEnv, "_APP_DB_USER")).toBe("${APP_DB_USER:-user}");
    expect(findEnvVal(mariadbEnv, "MYSQL_USER")).toBe("${APP_DB_USER:-user}");

    expect(findEnvVal(appwriteEnv, "_APP_DB_PASS")).toBe("${APP_DB_PASS:-password}");
    expect(findEnvVal(mariadbEnv, "MYSQL_PASSWORD")).toBe("${APP_DB_PASS:-password}");

    expect(findEnvVal(appwriteEnv, "_APP_DB_SCHEMA")).toBe("${APP_DB_SCHEMA:-appwrite}");
    expect(findEnvVal(mariadbEnv, "MYSQL_DATABASE")).toBe("${APP_DB_SCHEMA:-appwrite}");
  });
});
