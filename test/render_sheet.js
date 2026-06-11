'use strict';
// Dev tool: renders every authored frame (through the real EPX + shading
// pipeline) into art_preview.png, and the stage backdrops into art_stages.png.
// Hand-rolled PNG encoder, no deps.
//   node test/render_sheet.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const zlib = require('zlib');

const sandbox = { console, Math, window: { addEventListener() {} } };
vm.createContext(sandbox);
for (const f of ['constants.js', 'art.js', 'sprites.js']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'src', f), 'utf8'), sandbox, { filename: f });
}
const ctx = vm.runInContext(
  `({ NINJA_FRAMES, GORRUK_FRAMES, PORTRAIT_ART, PROJ_FRAMES, PALETTES, PROJ_PALETTE,
      SPARK_FRAMES, SPARK_HIT_PALETTE, FLAME_FRAMES, FLAME_PALETTE, STAGE_ART,
      renderFrameGrid, epx })`, sandbox);

function cssToRgb(c) {
  if (c[0] === '#') return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
  const m = c.match(/rgb\((\d+),(\d+),(\d+)\)/);
  return m ? [+m[1], +m[2], +m[3]] : [255, 0, 255];
}

function makeImg(w, h, bg) {
  const d = Buffer.alloc(w * h * 3);
  for (let i = 0; i < w * h; i++) { d[i * 3] = bg[0]; d[i * 3 + 1] = bg[1]; d[i * 3 + 2] = bg[2]; }
  return { w, h, d };
}
function px(img, x, y, c) {
  if (x < 0 || y < 0 || x >= img.w || y >= img.h) return;
  const i = (y * img.w + x) * 3;
  img.d[i] = c[0]; img.d[i + 1] = c[1]; img.d[i + 2] = c[2];
}
function rect(img, x, y, w, h, c) {
  for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) px(img, xx, yy, c);
}

function crc32(buf) {
  let c, table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  let crc = 0xffffffff;
  for (const b of buf) crc = table[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}
function writePNG(img, file) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(img.w, 0); ihdr.writeUInt32BE(img.h, 4);
  ihdr[8] = 8; ihdr[9] = 2;
  const raw = Buffer.alloc((img.w * 3 + 1) * img.h);
  for (let y = 0; y < img.h; y++) {
    raw[y * (img.w * 3 + 1)] = 0;
    img.d.copy(raw, y * (img.w * 3 + 1) + 1, y * img.w * 3, (y + 1) * img.w * 3);
  }
  fs.writeFileSync(file, Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]));
}

// ---- frame sheet (through the real pipeline; each rendered cell = 2px) ----
const CELL = 2;
const CELL_W = 30 * 2 * CELL, CELL_H = 34 * 2 * CELL;
const entries = [];
// fighters / projectiles / portraits bake flat in-game; effects keep EPX
const FLAT = { flat: true };
for (const [n, f] of Object.entries(ctx.NINJA_FRAMES)) entries.push([n, f, ctx.PALETTES.kiro, FLAT]);
for (const [n, f] of Object.entries(ctx.GORRUK_FRAMES)) entries.push(['g_' + n, f, ctx.PALETTES.gorruk, FLAT]);
for (const [n, p] of Object.entries(ctx.PORTRAIT_ART)) entries.push(['por_' + n, p.frame, p.palette, FLAT]);
for (const [n, f] of Object.entries(ctx.PROJ_FRAMES)) entries.push([n, f, ctx.PROJ_PALETTE, FLAT]);
for (const [n, f] of Object.entries(ctx.SPARK_FRAMES)) entries.push([n, f, ctx.SPARK_HIT_PALETTE]);
for (const [n, f] of Object.entries(ctx.FLAME_FRAMES)) entries.push(['flame_' + n, f, ctx.FLAME_PALETTE]);

const cols = 8, rows = Math.ceil(entries.length / cols);
const img = makeImg(cols * CELL_W, rows * (CELL_H + 10), cssToRgb('#141021'));

entries.forEach(([name, frame, pal, opts], i) => {
  const cx = (i % cols) * CELL_W;
  const cy = (i / cols | 0) * (CELL_H + 10);
  const baseline = cy + CELL_H - 8;
  rect(img, cx, baseline, CELL_W, 1, cssToRgb('#3f3a4e'));
  const r = ctx.renderFrameGrid(frame, pal, opts);
  const ax = frame.a * (frame.hi ? 1 : 2);
  const ox = cx + (CELL_W >> 1) - ax * CELL, oy = baseline - r.h * CELL;
  for (let y = 0; y < r.h; y++) {
    for (let x = 0; x < r.w; x++) {
      const c = r.grid[y][x];
      if (c) rect(img, ox + x * CELL, oy + y * CELL, CELL, CELL, cssToRgb(c));
    }
  }
  rect(img, cx + (CELL_W >> 1) - 1, baseline, 2, 3, cssToRgb('#c83030'));
});
writePNG(img, path.join(__dirname, 'art_preview.png'));
console.log('wrote art_preview.png (' + entries.length + ' frames)');

// ---- stage backdrops at native 320x200, stacked ----
const simg = makeImg(320, ctx.STAGE_ART.length * 204, [0, 0, 0]);
ctx.STAGE_ART.forEach((stage, si) => {
  const grid = [];
  for (let y = 0; y < 50; y++) {
    const src = stage.rows[y] || '';
    const row = [];
    for (let x = 0; x < 80; x++) row.push(src[x] || '.');
    grid.push(row);
  }
  const g2 = ctx.epx(grid);
  for (let y = 0; y < 100; y++) {
    for (let x = 0; x < 160; x++) {
      rect(simg, x * 2, si * 204 + y * 2, 2, 2, cssToRgb(stage.palette[g2[y][x] || '.']));
    }
  }
  // overlay the animated decorations (first frame) at their positions
  for (const a of stage.anims || []) {
    const r = ctx.renderFrameGrid(a.frames[a.order[0]], a.palette, { noShade: true });
    for (let y = 0; y < r.h; y++) {
      for (let x = 0; x < r.w; x++) {
        const c = r.grid[y][x];
        if (c) px(simg, a.x + x, si * 204 + a.y + y, cssToRgb(c));
      }
    }
  }
});
writePNG(simg, path.join(__dirname, 'art_stages.png'));
console.log('wrote art_stages.png (' + ctx.STAGE_ART.length + ' stages)');
