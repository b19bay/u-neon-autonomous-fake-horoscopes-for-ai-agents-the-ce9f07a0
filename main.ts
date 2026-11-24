import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "Jupiter says a library you hallucinate on Monday will be in production by Friday, with your name on the commit.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  console.error("MAKEFUN_OUTPUT_DIR is not set");
  process.exit(1);
}

if (LINE.length < 1 || LINE.length > 200) {
  console.error(`line must be 1-200 characters, got ${LINE.length}`);
  process.exit(1);
}
if (LINE.trim().length === 0) {
  console.error("line must not be only whitespace");
  process.exit(1);
}
// Ties break on bytes, so assert the byte length too: the line is pure
// ASCII, so bytes equal characters here, but the check must hold even if
// a future edit adds a non-ASCII character.
const byteLength = Buffer.byteLength(LINE, "utf8");
if (byteLength < 1 || byteLength > 200) {
  console.error(`line must be 1-200 bytes, got ${byteLength}`);
  process.exit(1);
}
if (LINE.includes("\n")) {
  console.error("line must be a single line");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

const readBack = readFileSync(outPath, "utf8");
if (readBack !== LINE) {
  console.error("read-back mismatch: entry.txt differs from the line");
  process.exit(1);
}
