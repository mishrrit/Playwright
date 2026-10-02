const fs = require("fs");
const path = require("path");

function safeRm(p) {
  const repoRoot = path.resolve(process.cwd());
  const resolved = path.resolve(process.cwd(), p);
  if (
    !resolved.startsWith(repoRoot) ||
    resolved === path.parse(resolved).root
  ) {
    console.warn("[clean-ai] refusing to remove unsafe path:", resolved);
    return;
  }
  try {
    if (fs.existsSync(resolved)) {
      fs.rmSync(resolved, { recursive: true, force: true });
    }
    fs.mkdirSync(resolved, { recursive: true });
    console.log("[clean-ai] cleaned", resolved);
  } catch (e) {
    console.error("[clean-ai] error cleaning", resolved, e);
    process.exitCode = 1;
  }
}

function rotateAllureResults(
  srcDir = "allure-results",
  archiveDir = "allure-archive",
  keep = 3,
) {
  const repoRoot = path.resolve(process.cwd());
  const resolvedSrc = path.resolve(process.cwd(), srcDir);
  if (!resolvedSrc.startsWith(repoRoot)) {
    console.warn("[clean-ai] refusing to operate on unsafe path:", resolvedSrc);
    return;
  }

  if (!fs.existsSync(resolvedSrc)) {
    fs.mkdirSync(resolvedSrc, { recursive: true });
    console.log("[clean-ai] created", resolvedSrc);
    return;
  }

  // if directory is empty, just recreate and return
  const entries = fs.readdirSync(resolvedSrc);
  if (entries.length === 0) {
    console.log("[clean-ai] no previous allure-results to archive");
    return;
  }

  // prepare archive dir
  const resolvedArchive = path.resolve(process.cwd(), archiveDir);
  fs.mkdirSync(resolvedArchive, { recursive: true });

  // move current allure-results to timestamped archive folder
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const dest = path.join(resolvedArchive, `allure-results-${ts}`);
  try {
    fs.renameSync(resolvedSrc, dest);
    console.log(`[clean-ai] archived ${srcDir} -> ${dest}`);
  } catch (e) {
    console.error("[clean-ai] error archiving allure-results", e);
    process.exitCode = 1;
    return;
  }

  // recreate empty srcDir
  try {
    fs.mkdirSync(resolvedSrc, { recursive: true });
    console.log("[clean-ai] recreated", resolvedSrc);
  } catch (e) {
    console.error("[clean-ai] error recreating", resolvedSrc, e);
    process.exitCode = 1;
  }

  // prune old archives, keep the most recent `keep` folders
  const archives = fs
    .readdirSync(resolvedArchive)
    .map((name) => ({
      name,
      path: path.join(resolvedArchive, name),
      stat: fs.statSync(path.join(resolvedArchive, name)),
    }))
    .sort((a, b) => b.stat.mtimeMs - a.stat.mtimeMs);

  const toRemove = archives.slice(keep);
  for (const a of toRemove) {
    try {
      fs.rmSync(a.path, { recursive: true, force: true });
      console.log("[clean-ai] removed old archive", a.path);
    } catch (e) {
      console.error("[clean-ai] error removing old archive", a.path, e);
    }
  }
}

// directories to clean (except allure-results which we rotate)
const dirs = [
  "test-results",
  // 'allure-results' handled separately
  "ai/failure-summaries/raw",
  "ai/failure-summaries/artifacts",
];

for (const d of dirs) safeRm(d);

// rotate allure-results keeping 3 past runs
rotateAllureResults("allure-results", "allure-archive", 3);

console.log("clean-ai finished");
