/**
 * Regression check: two avatars with the same seed name but different
 * variants must never emit the same SVG def id. If they do, url(#id)
 * resolves document-wide to the first match and one avatar's mask/filter
 * clips the other (e.g. beam's 36x36 mask clipping bauhaus/barcode).
 *
 * Run: bun scripts/check-id-collisions.tsx
 */
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Avatar, { defaultColors } from "../packages/sigma-avatars/src";

const VARIANTS = [
  "marble",
  "pixel",
  "beam",
  "ring",
  "sunset",
  "bauhaus",
  "fractal",
  "mage",
  "barcode",
  "pepe",
] as const;

const NAME = "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy";

const seen = new Map<string, string>();
let collisions = 0;

for (const variant of VARIANTS) {
  const html = renderToStaticMarkup(
    React.createElement(Avatar, {
      colors: defaultColors,
      name: NAME,
      size: 80,
      variant,
    })
  );
  const ids = [...html.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]);
  for (const id of ids) {
    const owner = seen.get(id);
    if (owner && owner !== variant) {
      console.error(
        `COLLISION: id "${id}" used by both "${owner}" and "${variant}"`
      );
      collisions += 1;
    }
    seen.set(id, variant);
  }
}

if (collisions > 0) {
  console.error(`\n${collisions} cross-variant id collision(s) found`);
  process.exit(1);
}
console.log(
  `OK: ${seen.size} unique ids across ${VARIANTS.length} variants, no collisions`
);
