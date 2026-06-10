# DEADLY KOMBAT

A browser 2D fighting game: Mortal Kombat (1992) structure in the visual style of
Yie Ar Kung-Fu (1985). Vanilla JS + HTML5 canvas, no frameworks, no build step.

**Run it:** open `index.html` in a browser. That's it.

## Modes

- **TOURNAMENT** — the ladder: 4 opponents in random order (mirror matches
  possible), then GORRUK, the four-armed boss. Difficulty scales as you climb.
  Lose and you get an arcade continue countdown.
- **VS CPU** — single match, difficulty selectable (W/S on the select screen).
- **2 PLAYERS** — local versus on one keyboard.

## Roster

| Fighter | Style | Specials |
|---|---|---|
| KIRO | ice ninja | Down, Forward + Low Punch — Ice Blast (freeze; next hit shatters for bonus) |
| ASHKAR | fire ninja | Back, Forward + Low Punch — Flame Spear (pulls the opponent in, stun) |
| VOLTAN | thunder god | Back, Forward + High Punch — Storm Torpedo (dash)  /  Down, Back + Low Punch — Thunder Step (teleport behind) |
| STRIKER | soldier | Down, Forward + Low Punch — Pulse Ring  /  Down, Back + Low Kick — Scissor Takedown |
| GORRUK | boss, AI only | Crusher, Quake Slam, Rampage lunge — 1.35x damage, can't be launched |

## Controls

|  | P1 | P2 |
|---|---|---|
| Move / Jump / Crouch | A D / W / S | Arrows |
| High Punch / High Kick | R / T | U / I |
| Low Punch / Low Kick | F / G | J / K |
| Block | H | L |

Universal moves: **Down + High Punch** = uppercut (launcher), **Back + Low Kick** =
sweep (block it low). Any button in the air = jump kick. Special inputs are
relative to facing (F = toward opponent) with an ~18-frame buffer per step;
rolled motions (holding down into forward) count.

## FINISH THEM

When you land the match-deciding blow, the loser doesn't fall — they stand
dazed for 4 seconds while **FINISH THEM** flashes. Land an **uppercut** for the
finisher; any other knockdown (or the timeout) and they simply collapse.

`P` pauses. `` ` `` (backquote) toggles the debug overlay: hitboxes (red),
hurtboxes (green), pushboxes (blue), state + frame data.

## Code layout

| File | Role |
|---|---|
| `src/main.js` | fixed-timestep 60fps loop, boot |
| `src/screens.js` | title / select / ladder / fight / continue / ending flow |
| `src/match.js` | round flow, hit resolution, hitstop, FINISH THEM, projectiles, HUD, stages |
| `src/fighter.js` | fighter state machine, input buffer, dash/teleport, reactions |
| `src/characters.js` | frame data, hit/hurt/push boxes, roster + boss defs |
| `src/ai.js` | CPU opponents (reaction-delayed, 4 presets incl. boss) |
| `src/art.js` | all sprites as pixel strings (ninja set + boss set + portraits + 3 stage backdrops) |
| `src/sprites.js` | bake pipeline: EPX 2x upscale + top-lit auto-shading, then offscreen canvases |
| `src/audio.js` | Web Audio synth: hits, whiffs, announcer voice, jingles |
| `src/particles.js` | blood / sparks / ice shards |
| `src/font.js` | 3x5 pixel font |
| `src/input.js` | keyboard + abstract pads |

## Dev tools

- `node test/smoke.js` — headless engine test (stubs the DOM; exercises every
  special, blocking, FINISH THEM/finisher, boss match, AI vs AI, input fuzz).
- `node test/render_sheet.js` — renders every sprite frame (through the real
  EPX + shading pipeline) to `test/art_preview.png` and the stage backdrops to
  `test/art_stages.png`.

## Graphics pipeline

Sprites are authored as chunky character grids and refined at bake time:
EPX/Scale2x doubles the resolution (rounding staircase diagonals), then a
top-lit auto-shading pass adds highlight/shadow ramps per palette color
(~18 effective tones per fighter). Fighters animate with 4-frame walks,
3-frame breathing idles, and followthrough frames on attacks. Stages are
full-screen pixel-art backdrops (80x50 grids, same pipeline) with animated
decorations: brazier flames, lantern glows, twinkling stars. Hits and blocks
flash sprite-based sparks; projectiles leave fading trails.
