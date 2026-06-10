'use strict';
// Bakes pixel-string frames into offscreen canvases at 2x (one art pixel = 2x2).
const ART_SCALE = 2;

function bakeFrame(frame, palette) {
  const rows = frame.r;
  const h = rows.length;
  let w = 0;
  for (const r of rows) w = Math.max(w, r.length);
  const cv = document.createElement('canvas');
  cv.width = w * ART_SCALE;
  cv.height = h * ART_SCALE;
  const g = cv.getContext('2d');
  for (let y = 0; y < h; y++) {
    const row = rows[y];
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === '.' || ch === ' ') continue;
      g.fillStyle = palette[ch] || '#ff00ff';
      g.fillRect(x * ART_SCALE, y * ART_SCALE, ART_SCALE, ART_SCALE);
    }
  }
  return { cv, w: cv.width, h: cv.height, ax: frame.a * ART_SCALE };
}

function bakeSheet(frames, palette) {
  const out = {};
  for (const k in frames) out[k] = bakeFrame(frames[k], palette);
  return out;
}

// Draw a baked frame with its anchor (feet center) at x,y. flip = face left.
function drawFrame(g, f, x, y, flip) {
  g.save();
  g.translate(Math.round(x), Math.round(y));
  if (flip) g.scale(-1, 1);
  g.drawImage(f.cv, -f.ax, -f.h);
  g.restore();
}
