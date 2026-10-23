import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = join(root, "public", "vendor");
mkdirSync(target, { recursive: true });
copyFileSync(join(root, "node_modules/mediainfo.js/dist/MediaInfoModule.wasm"), join(target, "MediaInfoModule.wasm"));
copyFileSync(join(root, "node_modules/mediainfo.js/dist/esm-bundle/index.min.js"), join(target, "mediainfo.js"));
