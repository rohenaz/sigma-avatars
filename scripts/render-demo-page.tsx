/**
 * Renders the bigblocks.dev "Variant Styles" demo scenario (10 variants
 * seeded from 3 addresses) to a standalone HTML page for visual checks.
 * Run: bun scripts/render-demo-page.tsx > /tmp/out.html
 */
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Avatar, { defaultColors } from "../packages/sigma-avatars/src";

const SATOSHI = "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa";
const SECOND = "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2";
const THIRD = "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy";

const variants = [
  { address: SATOSHI, variant: "marble" },
  { address: SECOND, variant: "pixel" },
  { address: THIRD, variant: "beam" },
  { address: SATOSHI, variant: "ring" },
  { address: SECOND, variant: "sunset" },
  { address: THIRD, variant: "bauhaus" },
  { address: SATOSHI, variant: "fractal" },
  { address: SECOND, variant: "mage" },
  { address: THIRD, variant: "barcode" },
  { address: SATOSHI, variant: "pepe" },
] as const;

const cells = variants
  .map(({ address, variant }) => {
    const svg = renderToStaticMarkup(
      React.createElement(Avatar, {
        className: "rounded-full",
        colors: defaultColors,
        name: address,
        size: 80,
        variant,
      })
    );
    return `<div style="display:flex;flex-direction:column;align-items:center;gap:8px">${svg}<span style="color:#888;font:12px sans-serif">${variant}</span></div>`;
  })
  .join("\n");

console.log(`<!doctype html><html><head><style>.rounded-full{border-radius:9999px}</style></head>
<body style="background:#0a0a0a;display:flex;gap:16px;align-items:center;justify-content:center;min-height:100vh;flex-wrap:wrap">
${cells}
</body></html>`);
