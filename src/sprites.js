'use strict';
// Sprite baking pipeline. Frames are authored as chunky pixel strings (art.js)
// and refined at bake time:
//   1. EPX/Scale2x upscale - doubles resolution, rounding staircase diagonals
//   2. top-lit auto-shading - silhouette top edges get a highlight ramp,
//      bottom edges a shadow ramp (so each palette color yields 3 tones)
// One authored art pixel therefore becomes a 2x2 cell of shaded detail.

function frameGrid(frame) {
  const rows = frame.r;
  let w = 0;
  for (const r of rows) w = Math.max(w, r.length);
  return rows.map(r => {
    const out = [];
    for (let x = 0; x < w; x++) {
      const ch = r[x];
      out.push(!ch || ch === '.' || ch === ' ' ? null : ch);
    }
    return out;
  });
}

// EPX (Scale2x): each cell becomes 2x2; diagonal neighbors fill corners so
// 45-degree edges render as smooth steps instead of blocks.
function epx(grid) {
  const h = grid.length, w = h ? grid[0].length : 0;
  const at = (x, y) => (y < 0 || y >= h || x < 0 || x >= w) ? null : grid[y][x];
  const out = [];
  for (let i = 0; i < h * 2; i++) out.push(new Array(w * 2).fill(null));
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const P = at(x, y), A = at(x, y - 1), B = at(x + 1, y),
            C = at(x - 1, y), D = at(x, y + 1);
      out[y * 2][x * 2]         = (C === A && C !== D && A !== B) ? A : P;
      out[y * 2][x * 2 + 1]     = (A === B && A !== C && B !== D) ? B : P;
      out[y * 2 + 1][x * 2]     = (D === C && D !== B && C !== A) ? C : P;
      out[y * 2 + 1][x * 2 + 1] = (B === D && B !== A && D !== C) ? D : P;
    }
  }
  return out;
}

// lighten (f > 0, toward white) or darken (f < 0, toward black) a #rrggbb
function shadeColor(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  if (f >= 0) { r += (255 - r) * f; g += (255 - g) * f; b += (255 - b) * f; }
  else { r *= 1 + f; g *= 1 + f; b *= 1 + f; }
  return 'rgb(' + (r | 0) + ',' + (g | 0) + ',' + (b | 0) + ')';
}

// pure renderer: frame + palette -> 2D array of CSS colors (null = clear).
// Shared by the in-game bake and the node-side preview tool.
function renderFrameGrid(frame, palette, opts) {
  opts = opts || {};
  const g2 = epx(frameGrid(frame));
  const h = g2.length, w = h ? g2[0].length : 0;
  const ramps = {};
  for (const ch in palette) {
    ramps[ch] = {
      base: palette[ch],
      light: shadeColor(palette[ch], 0.35),
      dark: shadeColor(palette[ch], -0.3),
    };
  }
  const out = [];
  for (let y = 0; y < h; y++) {
    const row = [];
    for (let x = 0; x < w; x++) {
      const ch = g2[y][x];
      if (!ch) { row.push(null); continue; }
      const ramp = ramps[ch] || { base: '#ff00ff', light: '#ff00ff', dark: '#ff00ff' };
      if (opts.noShade) { row.push(ramp.base); continue; }
      const above = y > 0 ? g2[y - 1][x] : null;
      const below = y < h - 1 ? g2[y + 1][x] : null;
      if (!above) row.push(ramp.light);        // top rim catches the light
      else if (!below) row.push(ramp.dark);    // underside falls into shadow
      else row.push(ramp.base);
    }
    out.push(row);
  }
  return { grid: out, w, h };
}

function bakeFrame(frame, palette, opts) {
  const r = renderFrameGrid(frame, palette, opts);
  const cv = document.createElement('canvas');
  cv.width = Math.max(1, r.w);
  cv.height = Math.max(1, r.h);
  const g = cv.getContext('2d');
  for (let y = 0; y < r.h; y++) {
    for (let x = 0; x < r.w; x++) {
      const c = r.grid[y][x];
      if (!c) continue;
      g.fillStyle = c;
      g.fillRect(x, y, 1, 1);
    }
  }
  // EPX doubled the grid, so the anchor doubles with it
  return { cv, w: cv.width, h: cv.height, ax: frame.a * 2 };
}

function bakeSheet(frames, palette, opts) {
  const out = {};
  for (const k in frames) out[k] = bakeFrame(frames[k], palette, opts);
  return out;
}

// ---- stage backdrops ----
// Stages are authored as 80x50 grids where every char (including '.') is a
// painted color. EPX to 160x100, then 2px cells fill the 320x200 screen.
function bakeStage(stage) {
  const W = 80, H = 50;
  const grid = [];
  for (let y = 0; y < H; y++) {
    const src = stage.rows[y] || '';
    const row = [];
    for (let x = 0; x < W; x++) row.push(src[x] || '.');
    grid.push(row);
  }
  const g2 = epx(grid);
  const cv = document.createElement('canvas');
  cv.width = GAME_W;
  cv.height = GAME_H;
  const g = cv.getContext('2d');
  for (let y = 0; y < H * 2; y++) {
    for (let x = 0; x < W * 2; x++) {
      // EPX can emit null at the grid border; fall back to the sky color
      g.fillStyle = stage.palette[g2[y][x] || '.'];
      g.fillRect(x * 2, y * 2, 2, 2);
    }
  }
  return cv;
}

// Draw a baked frame with its anchor (feet center) at x,y. flip = face left.
function drawFrame(g, f, x, y, flip) {
  g.save();
  g.translate(Math.round(x), Math.round(y));
  if (flip) g.scale(-1, 1);
  g.drawImage(f.cv, -f.ax, -f.h);
  g.restore();
}
