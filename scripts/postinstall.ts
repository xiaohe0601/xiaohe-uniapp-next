import { ensureFile, outputFile, pathExists } from "fs-extra";

async function initFile(path: string, data: string) {
  if (await pathExists(path)) {
    return;
  }

  await ensureFile(path);
  await outputFile(path, data);
}

async function initManifestJson() {
  await initFile(
    "src/manifest.json",
    JSON.stringify({}, null, 2)
  );
}

async function initPagesJson() {
  await initFile(
    "src/pages.json",
    JSON.stringify({ pages: [{ path: "" }] }, null, 2)
  );
}

function main() {
  initManifestJson();
  initPagesJson();
}

main();