const fs = require("fs");
const path = require("path");

const TEST_PLANS_DIR = path.resolve(__dirname, "..", "test-plans");
const IGNORE = ["README.md", "README_API.md"];
// Ignore UI and practice plans; only enforce naming for API test plans
const FILENAME_REGEX = /^[a-z0-9]+-[a-z0-9]+-test-plan\.md$/; // e.g. fakerest-books-test-plan.md

function findMdFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
}

function isIgnored(file) {
  if (IGNORE.includes(file)) return true;
  if (file.startsWith("ui-")) return true; // UI test plans are exempt
  if (file.toLowerCase().includes("practice")) return true;
  return false;
}

function main() {
  const files = findMdFiles(TEST_PLANS_DIR);
  const invalid = files.filter((f) =>
    isIgnored(f) ? false : !FILENAME_REGEX.test(f),
  );

  if (invalid.length) {
    console.error("Invalid test-plan filenames found:");
    invalid.forEach((f) => console.error(" - " + f));
    console.error(
      "\nExpected pattern: <api>-<resource>-test-plan.md (lowercase, hyphen-separated)",
    );
    process.exitCode = 2;
    throw new Error("Invalid test-plan filenames");
  }

  console.log("All API test-plan filenames valid");
}

main();
