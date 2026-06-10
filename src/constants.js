'use strict';
// ---- global tuning constants ----
const GAME_W = 320;
const GAME_H = 200;
const FLOOR_Y = 178;          // y of the ground line (fighter feet)
const WALL_PAD = 14;          // min distance of fighter anchor from screen edge

const GRAVITY  = 0.25;
const WALK_F   = 1.35;        // forward walk speed px/frame
const WALK_B   = 1.0;         // backward walk speed
const JUMP_VY  = -5.1;
const JUMP_VX  = 1.7;

const MAX_HP     = 100;
const ROUND_TIME = 90;        // seconds
const WINS_NEEDED = 2;        // best 2 of 3

const INPUT_GAP = 18;         // max frames between steps of a special input
const HITSTOP_LIGHT = 4;
const HITSTOP_HEAVY = 7;

const JUGGLE_SCALE = 0.6;     // damage scale on airborne (juggled) opponents
const FROZEN_BONUS = 1.3;     // damage bonus when shattering a frozen opponent

let DEBUG = false;            // backquote toggles: hitboxes + frame data
