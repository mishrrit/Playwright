const fs = require("node:fs");
const path = require("node:path");
const { randomUUID } = require("node:crypto");

const ARCHIVE_NAME = /^allure-results-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z(?:-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})?$/;

function existingStat(file) {
  try {
    return fs.lstatSync(file);
  } catch (error) {
    if (error.code === "ENOENT") return undefined;
    throw error;
  }
}

function assertDirectoryPath(root, directory) {
  const relative = path.relative(root, directory);
  if (!relative || relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error(`Refusing unsafe cleanup path: ${directory}`);
  }
  let current = root;
  for (const part of relative.split(path.sep)) {
    current = path.join(current, part);
    const stat = existingStat(current);
    if (!stat) continue;
    if (stat.isSymbolicLink()) throw new Error(`Refusing cleanup through a symlink: ${current}`);
    if (!stat.isDirectory()) throw new Error(`Expected cleanup directory: ${current}`);
  }
}

function assertNoLinks(directory) {
  if (!existingStat(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const child = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Refusing cleanup of a symlink: ${child}`);
    if (entry.isDirectory()) assertNoLinks(child);
  }
}

/** @param {import('./clean-ai').CleanupOptions} [options] */
function cleanRunArtifacts(options = {}) {
  const root = path.resolve(options.rootDir ?? process.cwd());
  if (root === path.parse(root).root) throw new Error("Refusing cleanup at a filesystem root");
  // Check the root and its ancestors as well as managed paths (junctions count as links).
  let ancestor = root;
  while (ancestor !== path.parse(ancestor).root) {
    const stat = fs.lstatSync(ancestor);
    if (stat.isSymbolicLink()) throw new Error(`Refusing cleanup through a symlink: ${ancestor}`);
    if (!stat.isDirectory()) throw new Error(`Expected root directory: ${ancestor}`);
    ancestor = path.dirname(ancestor);
  }

  const warnings = [];
  const configuredKeep = options.keepRuns ?? process.env.ALLURE_KEEP_RUNS;
  let keepRuns = 3;
  if (configuredKeep !== undefined && configuredKeep !== "") {
    const value = String(configuredKeep).trim();
    if (/^\d+$/.test(value) && Number.isSafeInteger(Number(value))) {
      keepRuns = Number(value);
    } else {
      warnings.push(`Invalid ALLURE_KEEP_RUNS='${configuredKeep}', using default 3`);
    }
  }

  const directories = ["ai/failure-summaries/raw", "ai/failure-summaries/artifacts"];
  if (options.includeTestResults !== false) directories.push("test-results");
  const cleaned = directories.map((directory) => path.resolve(root, directory));
  const results = path.join(root, "allure-results");
  const archiveRoot = path.join(root, "allure-archive");
  for (const directory of [...cleaned, results, archiveRoot]) assertDirectoryPath(root, directory);
  for (const directory of [...cleaned, results]) assertNoLinks(directory);

  const archives = [];
  if (existingStat(archiveRoot)) {
    for (const entry of fs.readdirSync(archiveRoot, { withFileTypes: true })) {
      if (!ARCHIVE_NAME.test(entry.name)) continue;
      const directory = path.join(archiveRoot, entry.name);
      if (entry.isSymbolicLink()) throw new Error(`Refusing archive symlink: ${directory}`);
      if (!entry.isDirectory()) continue;
      assertDirectoryPath(root, directory);
      assertNoLinks(directory);
      archives.push(directory);
    }
  }
  archives.sort((a, b) => path.basename(b).localeCompare(path.basename(a)));

  // Preserve previous results before deleting any current-run artifacts.
  let archivedTo;
  if (existingStat(results) && fs.readdirSync(results).length) {
    fs.mkdirSync(archiveRoot, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    archivedTo = path.join(archiveRoot, `allure-results-${stamp}-${randomUUID()}`);
    fs.renameSync(results, archivedTo);
    archives.unshift(archivedTo);
  }
  fs.mkdirSync(results, { recursive: true });
  for (const directory of cleaned) {
    fs.rmSync(directory, { recursive: true, force: true });
    fs.mkdirSync(directory, { recursive: true });
  }
  const removedArchives = archives.slice(keepRuns);
  for (const directory of removedArchives) fs.rmSync(directory, { recursive: true });

  return { cleaned, archivedTo, removedArchives, keepRuns, warnings };
}

module.exports = { cleanRunArtifacts };

if (require.main === module) {
  try {
    const result = cleanRunArtifacts();
    for (const warning of result.warnings) console.warn(`[clean-ai] ${warning}`);
    if (result.archivedTo) console.log("[clean-ai] archived previous results:", result.archivedTo);
    console.log(`[clean-ai] cleaned ${result.cleaned.length} directories; retained at most ${result.keepRuns} Allure archives`);
  } catch (error) {
    console.error("[clean-ai] cleanup failed:", error);
    process.exitCode = 1;
  }
}
