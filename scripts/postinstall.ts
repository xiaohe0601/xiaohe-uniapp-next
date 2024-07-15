import fs from "fs-extra";

async function initSomeFile(file: string, data: string): Promise<void> {
  const exists: boolean = await fs.pathExists(file);

  if (exists) {
    return;
  }

  await fs.ensureFile(file);

  await fs.outputFile(file, data);
}

async function initManifestJsonFile(): Promise<void> {
  await initSomeFile("src/manifest.json", JSON.stringify({}, null, 2));
}

async function initPagesJsonFile(): Promise<void> {
  await initSomeFile("src/pages.json", JSON.stringify({
    pages: [{
      path: ""
    }]
  }, null, 2));
}

initManifestJsonFile();
initPagesJsonFile();