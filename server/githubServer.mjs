import { createServer } from "node:http";
import { randomBytes, createHash } from "node:crypto";
import { URL } from "node:url";

const port = Number(process.env.PORT || 8787);
const host = process.env.HOST || "0.0.0.0";
const appOrigin = process.env.APP_ORIGIN || "http://127.0.0.1:5173";
const clientId = process.env.GITHUB_CLIENT_ID || "";
const clientSecret = process.env.GITHUB_CLIENT_SECRET || "";
const callbackUrl =
  process.env.GITHUB_CALLBACK_URL || `${appOrigin}/api/auth/github/callback`;
const apiVersion = process.env.GITHUB_API_VERSION || "2026-03-10";
const isProduction = process.env.NODE_ENV === "production";
const githubApi = "https://api.github.com";
const githubWeb = "https://github.com";
const sessions = new Map();
const pendingOAuth = new Map();
const rateLimits = new Map();

const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

function randomId(bytes = 32) {
  return randomBytes(bytes).toString("base64url");
}

function pkceChallenge(verifier) {
  return createHash("sha256").update(verifier).digest("base64url");
}

function parseCookies(request) {
  return Object.fromEntries(
    (request.headers.cookie || "")
      .split(";")
      .map((part) => part.trim().split("="))
      .filter(([name, value]) => name && value)
      .map(([name, ...value]) => [name, decodeURIComponent(value.join("="))]),
  );
}

function cookie(name, value, options = {}) {
  const isHttps = isProduction || appOrigin.startsWith("https://");
  const sameSite = isHttps ? "None" : "Lax";
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    `SameSite=${sameSite}`,
  ];
  if (options.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`);
  if (isHttps) parts.push("Secure");
  return parts.join("; ");
}

function getCorsHeaders(request) {
  const origin = request?.headers?.origin || appOrigin;
  return {
    "access-control-allow-origin": origin,
    "access-control-allow-credentials": "true",
    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    "access-control-allow-headers":
      "Content-Type, Authorization, Accept, X-GitHub-Api-Version",
  };
}

function sendJson(response, status, body, extraHeaders = {}, request = null) {
  const cors = request ? getCorsHeaders(request) : {};
  response.writeHead(status, { ...jsonHeaders, ...cors, ...extraHeaders });
  response.end(JSON.stringify(body));
}

function sendError(response, status, message, code = "request_failed", request = null) {
  sendJson(response, status, { error: { code, message } }, {}, request);
}

function redirect(response, location, extraHeaders = {}) {
  response.writeHead(302, {
    location,
    "cache-control": "no-store",
    ...extraHeaders,
  });
  response.end();
}

function parseJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 2_000_000) {
        reject(new Error("Request body is too large."));
        request.destroy();
      }
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Request body must be valid JSON."));
      }
    });
    request.on("error", reject);
  });
}

function clientIp(request) {
  return (
    request.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    request.socket.remoteAddress ||
    "unknown"
  );
}

function checkRateLimit(request, response) {
  const now = Date.now();
  const key = clientIp(request);
  const current = rateLimits.get(key) || { count: 0, resetAt: now + 60_000 };
  if (current.resetAt <= now) {
    current.count = 0;
    current.resetAt = now + 60_000;
  }
  current.count += 1;
  rateLimits.set(key, current);
  if (current.count > 120) {
    sendError(
      response,
      429,
      "Too many requests. Please try again shortly.",
      "rate_limited",
    );
    return false;
  }
  return true;
}

function githubHeaders(token) {
  return {
    accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": apiVersion,
    ...(token ? { authorization: `Bearer ${token}` } : {}),
  };
}

async function githubRequest(path, options = {}, token) {
  const response = await fetch(`${githubApi}${path}`, {
    ...options,
    headers: { ...githubHeaders(token), ...(options.headers || {}) },
  });
  let data = null;
  try {
    data = await response.json();
  } catch {
    // Some GitHub errors have no JSON body.
  }
  return { response, data };
}

function sessionFromRequest(request) {
  const sessionId = parseCookies(request).readme_session;
  if (!sessionId) return null;
  const session = sessions.get(sessionId);
  if (!session || session.expiresAt <= Date.now()) {
    if (sessionId) sessions.delete(sessionId);
    return null;
  }
  return { id: sessionId, ...session };
}

function requireSession(request, response) {
  const session = sessionFromRequest(request);
  if (!session) {
    sendError(
      response,
      401,
      "Connect GitHub before using this action.",
      "not_authenticated",
    );
    return null;
  }
  return session;
}

function safePath(value) {
  const path = typeof value === "string" ? value.trim() : "";
  if (!path || path.startsWith("/") || path.includes("..") || path.length > 500)
    return null;
  return path;
}

function safeRepoPart(value) {
  return typeof value === "string" && /^[A-Za-z0-9_.-]+$/.test(value)
    ? value
    : null;
}

function decodeGitHubContent(data) {
  if (!data || data.type !== "file" || typeof data.content !== "string")
    return null;
  return Buffer.from(data.content.replace(/\s/g, ""), "base64").toString(
    "utf8",
  );
}

async function handleOAuthStart(request, response) {
  if (!clientId || !clientSecret) {
    redirect(response, `${appOrigin}/?github_error=not_configured`);
    return;
  }

  const state = randomId(24);
  const verifier = randomId(48);
  pendingOAuth.set(state, { verifier, expiresAt: Date.now() + 10 * 60_000 });
  const authorizeUrl = new URL(`${githubWeb}/login/oauth/authorize`);
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", callbackUrl);
  authorizeUrl.searchParams.set("scope", "read:user repo");
  authorizeUrl.searchParams.set("state", state);
  authorizeUrl.searchParams.set("code_challenge", pkceChallenge(verifier));
  authorizeUrl.searchParams.set("code_challenge_method", "S256");
  authorizeUrl.searchParams.set("allow_signup", "true");

  redirect(response, authorizeUrl.toString(), {
    "set-cookie": cookie("github_oauth_state", state, { maxAge: 600 }),
  });
}

async function handleOAuthCallback(url, request, response) {
  const error = url.searchParams.get("error");
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");
  const storedState = parseCookies(request).github_oauth_state;
  const pending = state ? pendingOAuth.get(state) : null;
  if (
    !state ||
    !storedState ||
    storedState !== state ||
    !pending ||
    pending.expiresAt <= Date.now() ||
    (!error && !code)
  ) {
    if (state) pendingOAuth.delete(state);
    redirect(response, `${appOrigin}/?github_error=invalid_oauth_state`);
    return;
  }
  pendingOAuth.delete(state);

  if (error) {
    redirect(
      response,
      `${appOrigin}/?github_error=${encodeURIComponent(error)}`,
    );
    return;
  }

  try {
    const tokenResponse = await fetch(`${githubWeb}/login/oauth/access_token`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: callbackUrl,
        code_verifier: pending.verifier,
      }),
    });
    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || typeof tokenData.access_token !== "string") {
      redirect(response, `${appOrigin}/?github_error=token_exchange_failed`);
      return;
    }

    const userResult = await githubRequest("/user", {}, tokenData.access_token);
    if (!userResult.response.ok || !userResult.data?.login) {
      redirect(
        response,
        `${appOrigin}/?github_error=identity_validation_failed`,
      );
      return;
    }

    const sessionId = randomId(32);
    sessions.set(sessionId, {
      token: tokenData.access_token,
      user: {
        login: userResult.data.login,
        avatarUrl: userResult.data.avatar_url || "",
        name: userResult.data.name || "",
      },
      expiresAt: Date.now() + 8 * 60 * 60_000,
    });
    redirect(response, `${appOrigin}/?github=connected`, {
      "set-cookie": [
        cookie("readme_session", sessionId, { maxAge: 8 * 60 * 60 }),
        cookie("github_oauth_state", "", { maxAge: 0 }),
      ],
    });
  } catch {
    redirect(response, `${appOrigin}/?github_error=authentication_failed`);
  }
}

async function handleApi(request, response, url) {
  if (!checkRateLimit(request, response)) return;

  if (request.method === "GET" && url.pathname === "/api/auth/session") {
    const session = sessionFromRequest(request);
    sendJson(response, 200, {
      authenticated: Boolean(session),
      user: session?.user || null,
    });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/auth/github/start") {
    await handleOAuthStart(request, response);
    return;
  }

  if (
    request.method === "GET" &&
    url.pathname === "/api/auth/github/callback"
  ) {
    await handleOAuthCallback(url, request, response);
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/auth/disconnect") {
    const sessionId = parseCookies(request).readme_session;
    if (sessionId) sessions.delete(sessionId);
    sendJson(
      response,
      200,
      { authenticated: false },
      { "set-cookie": cookie("readme_session", "", { maxAge: 0 }) },
    );
    return;
  }

  const session = requireSession(request, response);
  if (!session) return;

  if (request.method === "GET" && url.pathname === "/api/github/repos") {
    const page = Math.max(
      1,
      Math.min(1000, Number(url.searchParams.get("page") || 1)),
    );
    const perPage = Math.max(
      1,
      Math.min(100, Number(url.searchParams.get("per_page") || 50)),
    );
    const apiUrl = `/user/repos?visibility=all&affiliation=owner%2Ccollaborator%2Corganization_member&sort=full_name&direction=asc&per_page=${perPage}&page=${page}`;
    const result = await githubRequest(apiUrl, {}, session.token);
    if (!result.response.ok) {
      sendError(
        response,
        result.response.status,
        result.data?.message || "Unable to list repositories.",
        result.response.status === 401 ? "session_expired" : "github_error",
      );
      return;
    }
    const repositories = Array.isArray(result.data)
      ? result.data.map((repo) => ({
          id: repo.id,
          name: repo.name,
          fullName: repo.full_name,
          owner: repo.owner?.login || "",
          avatarUrl: repo.owner?.avatar_url || "",
          private: Boolean(repo.private),
          visibility: repo.visibility || (repo.private ? "private" : "public"),
          defaultBranch: repo.default_branch || "main",
          permissions: repo.permissions || {},
          htmlUrl: repo.html_url || "",
        }))
      : [];
    sendJson(response, 200, {
      repositories,
      page,
      perPage,
      hasNextPage: repositories.length === perPage,
    });
    return;
  }

  const repositoryMatch = url.pathname.match(
    /^\/api\/github\/repos\/([^/]+)\/([^/]+)$/,
  );
  if (request.method === "GET" && repositoryMatch) {
    const owner = safeRepoPart(decodeURIComponent(repositoryMatch[1]));
    const repo = safeRepoPart(decodeURIComponent(repositoryMatch[2]));
    if (!owner || !repo)
      return sendError(
        response,
        400,
        "Invalid repository.",
        "invalid_repository",
      );
    const result = await githubRequest(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
      {},
      session.token,
    );
    if (!result.response.ok)
      return sendError(
        response,
        result.response.status,
        result.data?.message || "Unable to read repository metadata.",
        "github_error",
      );
    sendJson(response, 200, {
      name: result.data.name || repo,
      fullName: result.data.full_name || `${owner}/${repo}`,
      description: result.data.description || "",
      repositoryUrl:
        result.data.html_url || `https://github.com/${owner}/${repo}`,
      homepage: result.data.homepage || "",
      owner: {
        username: result.data.owner?.login || owner,
        profileUrl:
          result.data.owner?.html_url || `https://github.com/${owner}`,
        avatarUrl: result.data.owner?.avatar_url || "",
      },
      primaryLanguage: result.data.language || null,
      license: result.data.license
        ? {
            spdxId: result.data.license.spdx_id || "",
            name: result.data.license.name || "",
          }
        : null,
      defaultBranch: result.data.default_branch || "main",
    });
    return;
  }

  const branchesMatch = url.pathname.match(
    /^\/api\/github\/repos\/([^/]+)\/([^/]+)\/branches$/,
  );
  if (request.method === "GET" && branchesMatch) {
    const owner = safeRepoPart(decodeURIComponent(branchesMatch[1]));
    const repo = safeRepoPart(decodeURIComponent(branchesMatch[2]));
    if (!owner || !repo)
      return sendError(
        response,
        400,
        "Invalid repository.",
        "invalid_repository",
      );
    const result = await githubRequest(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/branches?per_page=100`,
      {},
      session.token,
    );
    if (!result.response.ok)
      return sendError(
        response,
        result.response.status,
        result.data?.message || "Unable to list branches.",
        "github_error",
      );
    sendJson(response, 200, {
      branches: Array.isArray(result.data)
        ? result.data.map((branch) => branch.name).filter(Boolean)
        : [],
    });
    return;
  }

  const contentMatch = url.pathname.match(
    /^\/api\/github\/repos\/([^/]+)\/([^/]+)\/content$/,
  );
  if (request.method === "GET" && contentMatch) {
    const owner = safeRepoPart(decodeURIComponent(contentMatch[1]));
    const repo = safeRepoPart(decodeURIComponent(contentMatch[2]));
    const path = safePath(url.searchParams.get("path") || "README.md");
    const branch = url.searchParams.get("branch");
    if (!owner || !repo || !path || !branch)
      return sendError(
        response,
        400,
        "Repository, branch, and path are required.",
        "invalid_content_request",
      );
    const encodedPath = path.split("/").map(encodeURIComponent).join("/");
    const result = await githubRequest(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${encodedPath}?ref=${encodeURIComponent(branch)}`,
      {},
      session.token,
    );
    if (result.response.status === 404) {
      sendJson(response, 200, {
        exists: false,
        content: null,
        sha: null,
        path,
      });
      return;
    }
    if (!result.response.ok)
      return sendError(
        response,
        result.response.status,
        result.data?.message || "Unable to inspect the target file.",
        "github_error",
      );
    if (result.data?.type !== "file")
      return sendError(
        response,
        409,
        "The target path is not a file.",
        "target_not_file",
      );
    sendJson(response, 200, {
      exists: true,
      content: decodeGitHubContent(result.data),
      sha: result.data.sha,
      path: result.data.path,
      htmlUrl: result.data.html_url || "",
    });
    return;
  }

  const readmeMatch = url.pathname.match(
    /^\/api\/github\/repos\/([^/]+)\/([^/]+)\/readme$/,
  );
  if (request.method === "GET" && readmeMatch) {
    const owner = safeRepoPart(decodeURIComponent(readmeMatch[1]));
    const repo = safeRepoPart(decodeURIComponent(readmeMatch[2]));
    const branch = url.searchParams.get("branch");
    if (!owner || !repo)
      return sendError(
        response,
        400,
        "Invalid repository.",
        "invalid_repository",
      );
    const query = branch ? `?ref=${encodeURIComponent(branch)}` : "";
    const result = await githubRequest(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme${query}`,
      {},
      session.token,
    );
    if (result.response.status === 404)
      return sendError(
        response,
        404,
        "This repository does not contain a readable README.md.",
        "readme_not_found",
      );
    if (!result.response.ok)
      return sendError(
        response,
        result.response.status,
        result.data?.message || "Unable to read README.md.",
        "github_error",
      );
    const content = decodeGitHubContent(result.data);
    if (content === null)
      return sendError(
        response,
        422,
        "The selected README format is not supported.",
        "unsupported_readme",
      );
    sendJson(response, 200, {
      content,
      sha: result.data.sha,
      path: result.data.path,
      htmlUrl: result.data.html_url || "",
    });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/github/save") {
    let body;
    try {
      body = await parseJsonBody(request);
    } catch (error) {
      return sendError(response, 400, error.message, "invalid_json");
    }
    const owner = safeRepoPart(body.owner);
    const repo = safeRepoPart(body.repo);
    const branch =
      typeof body.branch === "string" && body.branch.trim()
        ? body.branch.trim()
        : null;
    const path = safePath(body.path || "README.md");
    const markdown = typeof body.markdown === "string" ? body.markdown : "";
    const sha = typeof body.sha === "string" && body.sha ? body.sha : null;
    if (
      !owner ||
      !repo ||
      !branch ||
      !path ||
      !markdown ||
      markdown.length > 5_000_000
    ) {
      return sendError(
        response,
        400,
        "Repository, branch, path, and Markdown content are required.",
        "invalid_save_request",
      );
    }

    const existing = await githubRequest(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${path.split("/").map(encodeURIComponent).join("/")}?ref=${encodeURIComponent(branch)}`,
      {},
      session.token,
    );
    if (existing.response.ok && existing.data?.type !== "file")
      return sendError(
        response,
        409,
        "The target path is not a file.",
        "target_not_file",
      );
    if (!existing.response.ok && existing.response.status !== 404)
      return sendError(
        response,
        existing.response.status,
        existing.data?.message || "Unable to inspect the target file.",
        "github_error",
      );
    if (existing.response.ok && !sha)
      return sendError(
        response,
        409,
        "The target file already exists. Refresh it and confirm the replacement before saving.",
        "confirmation_required",
      );
    if (existing.response.ok && sha !== existing.data.sha)
      return sendError(
        response,
        409,
        "The target file changed on GitHub. Refresh it before saving again.",
        "sha_conflict",
      );
    if (!existing.response.ok && sha)
      return sendError(
        response,
        409,
        "The target file no longer exists. Refresh the repository state before saving.",
        "file_state_changed",
      );

    const saveResult = await githubRequest(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${path.split("/").map(encodeURIComponent).join("/")}`,
      {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          message: `docs: update ${path}`,
          content: Buffer.from(markdown, "utf8").toString("base64"),
          branch,
          ...(sha ? { sha } : {}),
        }),
      },
      session.token,
    );
    if (!saveResult.response.ok)
      return sendError(
        response,
        saveResult.response.status,
        saveResult.data?.message || "GitHub rejected the README update.",
        saveResult.response.status === 409 ? "sha_conflict" : "github_error",
      );
    sendJson(response, 200, {
      repository: `${owner}/${repo}`,
      branch,
      path,
      htmlUrl:
        saveResult.data?.content?.html_url ||
        `https://github.com/${owner}/${repo}/blob/${encodeURIComponent(branch)}/${path}`,
      updated: Boolean(sha),
    });
    return;
  }

  sendError(response, 404, "API route not found.", "not_found");
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", appOrigin);

    // Preflight CORS handler
    if (request.method === "OPTIONS") {
      response.writeHead(204, getCorsHeaders(request));
      response.end();
      return;
    }

    // Root status & health check endpoint for Render / monitoring
    if (url.pathname === "/" || url.pathname === "/health") {
      sendJson(
        response,
        200,
        {
          name: "README Studio GitHub API Server",
          status: "healthy",
          uptimeSeconds: Math.floor(process.uptime()),
          timestamp: new Date().toISOString(),
        },
        {},
        request,
      );
      return;
    }

    if (url.pathname.startsWith("/api/")) {
      await handleApi(request, response, url);
      return;
    }
    sendJson(
      response,
      404,
      {
        error: { code: "not_found", message: "Route not found." },
      },
      {},
      request,
    );
  } catch {
    if (!response.headersSent)
      sendError(response, 500, "Unexpected server error.", "server_error", request);
    else response.end();
  }
});

setInterval(() => {
  const now = Date.now();
  for (const [key, value] of pendingOAuth)
    if (value.expiresAt <= now) pendingOAuth.delete(key);
  for (const [key, value] of sessions)
    if (value.expiresAt <= now) sessions.delete(key);
  for (const [key, value] of rateLimits)
    if (value.resetAt <= now) rateLimits.delete(key);
}, 60_000).unref();

server.listen(port, host, () => {
  console.log(`README Studio GitHub API listening on http://${host}:${port}`);
});
