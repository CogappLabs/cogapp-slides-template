// Render the built deck to a single landscape PDF, one slide per page.
// Usage: npm run pdf   (or: node scripts/build-pdf.ts)
// Requires: `npm run build` first (reads from dist/), and Playwright chromium.
//
// Run directly as TypeScript on Node 22.18+ / 23+ via built-in type stripping.
// slideOrder and base are imported from the real sources, so there's nothing
// to keep in sync by hand.

import { chromium } from "playwright";
import { preview } from "astro";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { PDFDocument } from "pdf-lib";
import { writeFile } from "node:fs/promises";
import config from "../astro.config.mjs";
import { slideOrder } from "../src/content/order.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const BASE = (config.base ?? "").replace(/\/$/, "");
const W = 1280;
const H = 720;

console.log("Starting preview server...");
const server = await preview({ root, logLevel: "error" });
const origin = `http://${server.host ?? "localhost"}:${server.port}`;
console.log(`Preview at ${origin}`);

console.log("Launching chromium...");
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: W, height: H },
  deviceScaleFactor: 2,
});

const pdfBuffers: Uint8Array[] = [];
for (let i = 0; i < slideOrder.length; i++) {
  const slug = slideOrder[i];
  const url = `${origin}${BASE}/slide/${slug}`;
  await page.goto(url, { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "screen" });
  // Hide nav chrome / progress bar for print.
  await page.addStyleTag({
    content: `nav[aria-label="Slide navigation"],[role="progressbar"]{display:none!important}
              *{transition:none!important;animation:none!important}`,
  });
  // A PDF reader can't open a <details>, so show the References inline.
  await page.evaluate(() => {
    for (const d of document.querySelectorAll("details")) d.open = true;
  });
  // Wait for webfonts to settle.
  await page.evaluate(() => document.fonts.ready);
  const buf = await page.pdf({
    width: `${W}px`,
    height: `${H}px`,
    printBackground: true,
    pageRanges: "1",
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });
  pdfBuffers.push(buf);
  console.log(`  [${i + 1}/${slideOrder.length}] ${slug}`);
}

await browser.close();
await server.stop();

console.log("Merging pages...");
const out = await PDFDocument.create();
for (const buf of pdfBuffers) {
  const doc = await PDFDocument.load(buf);
  const [pg] = await out.copyPages(doc, [0]);
  out.addPage(pg);
}
const bytes = await out.save();
const outPath = resolve(root, "deck.pdf");
await writeFile(outPath, bytes);
console.log(`Wrote ${outPath} (${slideOrder.length} pages)`);
