#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { execSync } = require("child_process");

function findFailureDirs(resultsDir) {
  if (!fs.existsSync(resultsDir)) return [];
  const entries = fs.readdirSync(resultsDir, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory())
    .map((d) => path.join(resultsDir, d.name))
    .filter(
      (dir) =>
        fs.existsSync(path.join(dir, "error-context.md")) ||
        fs.readdirSync(dir).some((f) => /failed|error|trace/i.test(f)),
    );
}

function summarize(dirs) {
  return dirs.map((d) => ({
    path: d,
    files: fs.readdirSync(d),
  }));
}

function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(question, (ans) => {
      rl.close();
      resolve(ans.trim());
    }),
  );
}

(async function main() {
  const argv = require("minimist")(process.argv.slice(2));
  const resultsDir = argv["results-dir"] || argv.d || "test-results";
  const failureDirs = findFailureDirs(resultsDir);
  if (!failureDirs.length) {
    console.log("No failure artifacts found in", resultsDir);
    process.exit(0);
  }
  console.log("\nDetected failing test runs:");
  summarize(failureDirs).forEach((s, i) => {
    console.log(`${i + 1}. ${s.path} — contains ${s.files.length} files`);
  });
  console.log(
    "\nThe runner will ask for explicit consent before invoking any healer agent.",
  );
  const consent = (
    await ask(
      "Proceed to invoke playwright-healer for these failures? (yes/no) ",
    )
  ).toLowerCase();
  if (consent !== "yes" && consent !== "y") {
    console.log("Aborting — no agent was invoked.");
    process.exit(0);
  }
  const needClarify = (
    await ask("Any ambiguity to clarify before running healer? (yes/no) ")
  ).toLowerCase();
  let clarification = "";
  if (needClarify === "yes" || needClarify === "y") {
    clarification = await ask(
      "Please describe what to clarify (single-line): ",
    );
  }
  const request = {
    timestamp: new Date().toISOString(),
    resultsDir,
    failures: failureDirs,
    clarification: clarification || null,
    invokedBy: process.env.USER || process.env.USERNAME || null,
  };
  const out = path.resolve("healer-request.json");
  fs.writeFileSync(out, JSON.stringify(request, null, 2));
  console.log(`\nWrote ${out} with invocation details.`);

  const runCmd = process.env.HEALER_RUN_CMD;
  if (runCmd) {
    const runConfirm = (
      await ask(`HEALER_RUN_CMD is set. Execute it now? (yes/no) `)
    ).toLowerCase();
    if (runConfirm === "yes" || runConfirm === "y") {
      console.log("Executing:", runCmd);
      try {
        const outBuf = execSync(runCmd, { stdio: "inherit" });
        console.log("\nHealer command completed.");
      } catch (e) {
        console.error("\nHealer command failed:", e.message);
        process.exit(1);
      }
    } else {
      console.log("Skipped executing HEALER_RUN_CMD. To run manually:");
      console.log(runCmd);
    }
  } else {
    console.log(
      "No HEALER_RUN_CMD configured. To invoke the agent manually, run:",
    );
    console.log(
      "npx copilot runSubagent --agent=playwright-healer --payload=healer-request.json",
    );
  }
})();
