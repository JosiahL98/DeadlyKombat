# DEADLY KOMBAT

A browser 2D fighting game: Mortal Kombat (1992) structure in the visual style of
Yie Ar Kung-Fu (1985). Vanilla JS + HTML5 canvas, no frameworks, no build step.

**Run it:** open `index.html` in a browser. That's it.

## Modes

- **TOURNAMENT** — the ladder: 12 opponents in random order (mirror matches
  possible), then GORRUK, the four-armed boss. Difficulty scales as you climb.
  Lose and you get an arcade continue countdown.
- **VS CPU** — single match, difficulty selectable (Q/E on the select screen).
- **2 PLAYERS** — local versus on one keyboard.

On the select screen move with A/D and hop rows with W/S (P1) or the arrow
keys (P2).

## Roster

| Fighter | Style | Specials |
|---|---|---|
| KIRO | ice ninja | Down, Forward + Low Punch — Ice Blast (freeze; next hit shatters for bonus)  /  Back, Forward + Low Kick — Ice Slide (low dash, knocks down) |
| ASHKAR | fire ninja | Back, Forward + Low Punch — Flame Spear (pulls the opponent in, stun)  /  Down, Back + High Punch — Phantom Strike (vanishes, strikes from behind) |
| VOLTAN | thunder god | Back, Forward + High Punch — Storm Torpedo (dash)  /  Down, Back + Low Punch — Thunder Step (teleport behind) |
| STRIKER | soldier | Down, Forward + Low Punch — Pulse Ring  /  Down, Back + Low Kick — Scissor Takedown |
| VIPRA | venom queen | Down, Forward + High Punch — Venom Orb (poisons: damage ticks after the hit)  /  Back, Forward + Low Punch — Leeching Lash (lunge that heals her for damage dealt) |
| NYX | silent shadow | Back, Forward + Low Punch — Dart Volley (two darts back to back)  /  Down, Back + Low Kick — Night Reprisal (counter stance: strike her and she blinks behind you and ripostes) |
| ROKKAN | the mountain | Down, Forward + Low Kick — Quake Wave (ground wave, must be blocked low)  /  Back, Forward + High Punch — Granite Ram (armored charge: absorbs one hit) |
| SURA | wind dancer | Down, Forward + Low Punch — Gale Fan (lifts the foe for a juggle)  /  Back, Forward + High Kick — Cyclone Kick (multi-hit carrying launcher) |
| KOGG | brass golem | Back, Forward + Low Punch — Gear Boomerang (returns; threatens twice)  /  Down, Back + High Kick — Steam Geyser (anti-air launcher that reflects projectiles) |
| SHULGA | bog witch | Down, Forward + High Punch — Hex Lob (arcs over other projectiles)  /  Down, Back + Low Punch — Bog Snare (plants a ground trap that pops when stepped on) |
| MAGRA | temple colossus | Back, Forward + High Punch — Sky Tomb (unblockable grab; whiffs on airborne foes)  /  Down, Back + High Kick — Fault Line (slow stomp that hits every grounded foe anywhere — jump it) |
| MIRAJ | faceless mirage | Down, Forward + Low Punch — Prism Volley (twin bolts, one high one low)  /  Down, Back + High Punch — Rift Swap (both fighters trade places) |
| GORRUK | boss, AI only | Crusher, Quake Slam, Rampage lunge — 1.35x damage, can't be launched |

KIRO's Ice Slide also ducks under high projectiles mid-slide.

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
| `src/sprites.js` | bake pipeline: flat 2x for fighters, EPX + auto-shading for stages/effects |
| `src/audio.js` | Web Audio synth: hits, whiffs, announcer voice, jingles |
| `src/particles.js` | blood / sparks / ice shards |
| `src/font.js` | 3x5 pixel font |
| `src/input.js` | keyboard + abstract pads |

## Dev tools

- `node test/smoke.js` — headless engine test (stubs the DOM; exercises every
  special, blocking, FINISH THEM/finisher, boss match, AI vs AI, input fuzz).
- `node test/render_sheet.js` — renders every sprite frame (through the real
  bake pipeline) to `test/art_preview.png` and the stage backdrops to
  `test/art_stages.png`.

## Graphics pipeline

Sprites are authored as chunky character grids. Fighters, portraits, and
projectiles bake flat — one art pixel becomes a solid 2x2 block in flat
palette colors — for the original Yie Ar Kung-Fu look. Fighters still animate
with 4-frame walks, 3-frame breathing idles, and followthrough frames on
attacks. Stages and effects get a refinement pass instead: EPX/Scale2x
doubles the resolution (rounding staircase diagonals), then top-lit
auto-shading adds highlight/shadow ramps. Seven stages are full-screen
pixel-art backdrops (80x50 grids) with animated decorations: brazier flames,
lantern glows, fireflies, lightning, twinkling stars. The Warlord's Pit is
reserved for the boss fight. Hits and blocks flash sprite-based sparks;
projectiles leave fading trails.
