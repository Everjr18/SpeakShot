#!/usr/bin/env node
const { spawnSync } = require("child_process");

const skip =
  process.env.PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD === "1" ||
  process.env.SKIP_PLAYWRIGHT_INSTALL === "1" ||
  process.env.CI === "true" ||
  process.env.CI === "1";

if (skip) {
  console.log("[prepare] Skipping Playwright browser install (PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1).");
  process.exit(0);
}

const result = spawnSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["playwright", "install", "--with-deps"],
  { stdio: "inherit" }
);

process.exit(result.status ?? 0);
