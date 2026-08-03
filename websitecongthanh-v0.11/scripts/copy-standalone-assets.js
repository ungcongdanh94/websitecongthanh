// scripts/copy-standalone-assets.js
// Next.js "output: standalone" khong tu dong chep .next/static va public/
// vao trong .next/standalone. Script nay chay ngay sau "next build" de bo sung.

const fs = require("fs");
const path = require("path");

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`[copy-standalone-assets] Bo qua, khong ton tai: ${src}`);
    return;
  }
  fs.mkdirSync(dest, { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
  console.log(`[copy-standalone-assets] Da chep: ${src} -> ${dest}`);
}

const root = process.cwd();

copyDir(
  path.join(root, ".next", "static"),
  path.join(root, ".next", "standalone", ".next", "static")
);

copyDir(
  path.join(root, "public"),
  path.join(root, ".next", "standalone", "public")
);

console.log("[copy-standalone-assets] Hoan tat.");
