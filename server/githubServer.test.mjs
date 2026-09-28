import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { test, before, after } from "node:test";

const port = 8799;
let server;

before(async () => {
  server = spawn(process.execPath, ["server/githubServer.mjs"], {
    env: {
      ...process.env,
      PORT: String(port),
      APP_ORIGIN: `http://127.0.0.1:${port}`,
      GITHUB_CLIENT_ID: "test-client",
      GITHUB_CLIENT_SECRET: "test-secret",
    },
    stdio: "ignore",
  });

  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/api/auth/session`);
      if (response.ok) return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 25));
    }
  }
  throw new Error("GitHub API test server did not start.");
});

after(() => server?.kill());

test("reports an anonymous session without exposing credentials", async () => {
  const response = await fetch(`http://127.0.0.1:${port}/api/auth/session`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { authenticated: false, user: null });
});

test("protects repository APIs without a session", async () => {
  const response = await fetch(`http://127.0.0.1:${port}/api/github/repos`);
  assert.equal(response.status, 401);
  const body = await response.json();
  assert.equal(body.error.code, "not_authenticated");
});

test("rejects an OAuth callback with an invalid state", async () => {
  const response = await fetch(
    `http://127.0.0.1:${port}/api/auth/github/callback?code=not-real&state=not-valid`,
    { redirect: "manual" },
  );
  assert.equal(response.status, 302);
  assert.match(
    response.headers.get("location"),
    /github_error=invalid_oauth_state/,
  );
});
