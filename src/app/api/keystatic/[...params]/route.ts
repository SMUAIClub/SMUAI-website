import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../../keystatic.config";

const isGithubConfigured = Boolean(
  process.env.KEYSTATIC_GITHUB_CLIENT_ID && process.env.KEYSTATIC_GITHUB_CLIENT_SECRET && process.env.KEYSTATIC_SECRET,
);

// Without GitHub credentials, `makeRouteHandler` throws at import time in
// production, which would fail the whole build. Fall back to a clear error instead so
// the public site always deploys even if the CMS isn't set up yet.
const notConfigured = () =>
  new Response("Keystatic is not configured. Set KEYSTATIC_GITHUB_CLIENT_ID, KEYSTATIC_GITHUB_CLIENT_SECRET and KEYSTATIC_SECRET.", {
    status: 503,
  });

// In development Keystatic doesn't throw; it serves the one-time GitHub App
// setup flow instead, which is how those credentials get created.
const handlers =
  config.storage.kind === "local" || isGithubConfigured || process.env.NODE_ENV === "development"
    ? makeRouteHandler({ config })
    : { GET: notConfigured, POST: notConfigured };

export const { GET, POST } = handlers;
