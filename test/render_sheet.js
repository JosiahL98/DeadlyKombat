'use strict';
// Dev tool: renders every authored frame into art_preview.png (no deps,
// hand-rolled PNG encoder) so the pixel art can be reviewed.
//   node test/render_sheet.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const zlib = require('zlib');

const sandbox = { console, Math, window: { addEventListener() {} } };
vm.createContext(sandbox);
for (const f of ['constants.js', 'art.js']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'src', f), 'utf8'), sandbox, { filename: f });
}
const { NINJA_FRAMES, GORRUK_FRAMES, PORTRAIT_ART, PROJ_FRAMES, PALETTES, PROJ_PALETTE } =
  vm.runInContext('({ NINJA_FRAMES, GORRUK_FRAMES, PORTRAIT_ART, PROJ_FRAMES, PALETTES, PROJ_PALETTE })', sandbox);

function hex(c) { return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]; }

// simple RGB raster
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
  ihdr[8] = 8; ihdr[9] = 2;     // 8-bit RGB
  const raw = Buffer.alloc((img.w * 3 + 1) * img.h);
  for (let y = 0; y < img.h; y++) {
    raw[y * (img.w * 3 + 1)] = 0;
    img.d.copy(raw, y * (img.w * 3 + 1) + 1, y * img.w * 3, (y + 1) * img.w * 3);
  }
  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
  fs.writeFileSync(file, png);
}

// layout: grid of cells, each frame drawn at 4x with a baseline marker.
// Entries carry their own palette so boss/portrait colors render correctly.
const SCALE = 4;
const CELL_W = 30 * SCALE, CELL_H = 34 * SCALE;
const ninjaPal = Object.assign({}, PALETTES.kiro, PROJ_PALETTE);
const entries = Object.entries(NINJA_FRAMES).map(([n, f]) => [n, f, ninjaPal])
  .concat(Object.entries(GORRUK_FRAMES).map(([n, f]) => ['g_' + n, f, PALETTES.gorruk]))
  .concat(Object.entries(PORTRAIT_ART).map(([n, f]) =>
    ['por_' + n, f, PALETTES[n === 'default' ? 'kiro' : n]]))
  .concat(Object.entries(PROJ_FRAMES).map(([n, f]) => [n, f, PROJ_PALETTE]));
const cols = 6, rows = Math.ceil(entries.length / cols);
const img = makeImg(cols * CELL_W, rows * (CELL_H + 10), hex('#141021'));

entries.forEach(([name, frame, pal], i) => {
  const cx = (i % cols) * CELL_W;
  const cy = (i / cols | 0) * (CELL_H + 10);
  const baseline = cy + CELL_H - 8;
  rect(img, cx, baseline, CELL_W, 1, hex('#3f3a4e'));               // floor line
  const ax = frame.a * SCALE;
  const h = frame.r.length * SCALE;
  const ox = cx + CELL_W / 2 - ax, oy = baseline - h;
  frame.r.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === '.' || ch === ' ') continue;
      rect(img, ox + x * SCALE, oy + y * SCALE, SCALE, SCALE, hex(pal[ch] || '#ff00ff'));
    }
  });
  rect(img, cx + CELL_W / 2 - 1, baseline, 2, 3, hex('#c83030'));   // anchor marker
});

const out = path.join(__dirname, 'art_preview.png');
writePNG(img, out);
console.log('wrote ' + out + ' (' + img.w + 'x' + img.h + ', ' + entries.length + ' frames)');
