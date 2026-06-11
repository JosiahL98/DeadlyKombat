'use strict';
// Frame data. All timings in 60fps logic frames. Hitboxes are {x,y,w,h} in
// screen px relative to the fighter's feet anchor, facing right (y up = neg).
// An attack is active during frames [startup, startup + active).

const ATTACKS = {
  lp: {
    name: 'LOW PUNCH',
    anim: [['punch_wind', 3], ['lpunch', 4], ['punch_follow', 2], ['punch_wind', 2]],
    startup: 3, active: 3,
    dmg: 5, hitstun: 14, blockstun: 7, kb: 1.4,
    hitbox: { x: 6, y: -30, w: 22, h: 8 },
    heavy: false,
  },
  hp: {
    name: 'HIGH PUNCH',
    anim: [['punch_wind', 4], ['hpunch', 5], ['punch_follow', 3], ['punch_wind', 2]],
    startup: 4, active: 4,
    dmg: 8, hitstun: 18, blockstun: 9, kb: 2.0,
    hitbox: { x: 6, y: -36, w: 24, h: 8 },
    heavy: false,
  },
  lk: {
    name: 'LOW KICK',
    anim: [['kick_wind', 5], ['lkick', 5], ['kick_follow', 3], ['kick_wind', 2]],
    startup: 5, active: 4,
    dmg: 7, hitstun: 16, blockstun: 8, kb: 1.8,
    hitbox: { x: 6, y: -22, w: 24, h: 8 },
    heavy: false,
  },
  hk: {
    name: 'HIGH KICK',
    anim: [['kick_wind', 6], ['hkick', 6], ['kick_follow', 4], ['kick_wind', 2]],
    startup: 6, active: 5,
    dmg: 11, hitstun: 22, blockstun: 11, kb: 3.0,
    hitbox: { x: 6, y: -38, w: 26, h: 12 },
    heavy: true,
  },
  sweep: {
    name: 'SWEEP',
    anim: [['crouch', 6], ['sweep', 7], ['crouch', 9]],
    startup: 6, active: 6,
    dmg: 8, hitstun: 0, blockstun: 12, kb: 1.0,
    hitbox: { x: 4, y: -8, w: 28, h: 8 },
    low: true, knockdown: true, heavy: true,
  },
  uppercut: {
    name: 'UPPERCUT',
    anim: [['upc_wind', 7], ['upc_hit', 6], ['upc_hit', 8], ['upc_follow', 8]],
    startup: 7, active: 5,
    dmg: 15, hitstun: 0, blockstun: 12, kb: 2.0,
    hitbox: { x: 2, y: -52, w: 16, h: 34 },
    launch: { vx: 1.6, vy: -6.4 }, heavy: true,
  },
  clp: {
    name: 'CROUCH PUNCH',
    anim: [['crouch', 3], ['crouch_punch', 5], ['crouch', 4]],
    startup: 3, active: 3,
    dmg: 4, hitstun: 12, blockstun: 6, kb: 1.2,
    hitbox: { x: 6, y: -24, w: 22, h: 8 },
    crouching: true, heavy: false,
  },
  clk: {
    name: 'CROUCH KICK',
    anim: [['crouch', 4], ['crouch_kick', 6], ['crouch', 5]],
    startup: 4, active: 4,
    dmg: 6, hitstun: 14, blockstun: 8, kb: 1.5,
    hitbox: { x: 6, y: -10, w: 26, h: 8 },
    low: true, crouching: true, heavy: false,
  },
  jumpkick: {
    name: 'JUMP KICK',
    anim: [['jump_kick', 999]],          // holds until landing
    startup: 4, active: 10,
    dmg: 9, hitstun: 18, blockstun: 9, kb: 2.2,
    hitbox: { x: 2, y: -20, w: 22, h: 16 },
    air: true, heavy: false,
  },

  // ---- special-move attacks (dash moves; blocked dash = big bounce-back) ----
  torpedo: {
    name: 'TORPEDO',
    anim: [['torpedo', 26]],
    startup: 4, active: 18,
    dmg: 10, hitstun: 0, blockstun: 12, kb: 3.2,
    hitbox: { x: 0, y: -34, w: 24, h: 18 },
    dash: { vx: 5, from: 4, to: 22 },
    knockdown: true, heavy: true,
  },
  slide: {
    name: 'ICE SLIDE',
    anim: [['crouch', 4], ['crouch_kick', 18], ['crouch', 6]],
    startup: 4, active: 16,
    dmg: 8, hitstun: 0, blockstun: 12, kb: 2.0,
    hitbox: { x: 2, y: -14, w: 24, h: 14 },
    dash: { vx: 4.2, from: 4, to: 20 },
    low: true, knockdown: true, heavy: true,
  },
  phantom: {
    name: 'PHANTOM STRIKE',
    anim: [['punch_wind', 8], ['hpunch', 5], ['punch_follow', 4], ['punch_wind', 4]],
    startup: 9, active: 4,
    teleportAt: 8, vanish: [2, 8],     // disappears, reappears behind the foe
    dmg: 10, hitstun: 0, blockstun: 10, kb: 2.4,
    hitbox: { x: 0, y: -42, w: 26, h: 16 },
    knockdown: true, heavy: true,
  },
  leggrab: {
    name: 'LEG GRAB',
    anim: [['crouch', 5], ['sweep', 8], ['crouch', 9]],
    startup: 5, active: 8,
    dmg: 12, hitstun: 0, blockstun: 10, kb: 1.5,
    hitbox: { x: 4, y: -12, w: 26, h: 12 },
    dash: { vx: 2.4, from: 5, to: 13 },
    low: true, launch: { vx: 2.2, vy: -5.2 }, heavy: true,
  },
  lash: {
    name: 'VIPER LASH',
    anim: [['punch_wind', 4], ['torpedo', 14], ['punch_wind', 6]],
    startup: 4, active: 12,
    dmg: 9, hitstun: 0, blockstun: 11, kb: 2.6,
    hitbox: { x: 2, y: -32, w: 24, h: 14 },
    dash: { vx: 4.6, from: 4, to: 16 },
    knockdown: true, heavy: true,
  },
  ram: {
    name: 'GRANITE RAM',
    anim: [['punch_wind', 8], ['torpedo', 22], ['punch_wind', 8]],
    startup: 8, active: 20,
    dmg: 13, hitstun: 0, blockstun: 14, kb: 3.4,
    hitbox: { x: 0, y: -36, w: 26, h: 20 },
    dash: { vx: 3.4, from: 8, to: 28 },
    knockdown: true, heavy: true,
  },
  cyclone: {
    name: 'CYCLONE KICK',
    anim: [['kick_wind', 5], ['hkick', 17], ['kick_follow', 4]],
    startup: 5, active: 16,
    dmg: 9, hitstun: 0, blockstun: 11, kb: 2.0,
    hitbox: { x: 2, y: -36, w: 24, h: 16 },
    dash: { vx: 4.0, from: 5, to: 21 },
    launch: { vx: 1.6, vy: -5.8 }, heavy: true,
  },

  // ---- GORRUK (boss) moves: slow, huge reach, brutal damage ----
  g_punch: {
    name: 'CRUSHER',
    anim: [['punch_wind', 7], ['punch', 6], ['punch_wind', 8]],
    startup: 7, active: 5,
    dmg: 13, hitstun: 24, blockstun: 12, kb: 3.6,
    hitbox: { x: 8, y: -44, w: 30, h: 12 },
    heavy: true,
  },
  g_slam: {
    name: 'QUAKE SLAM',
    anim: [['slam_wind', 10], ['slam', 7], ['slam_wind', 9]],
    startup: 10, active: 6,
    dmg: 16, hitstun: 0, blockstun: 14, kb: 2.2,
    hitbox: { x: 4, y: -32, w: 28, h: 28 },
    knockdown: true, heavy: true,
  },
  g_lunge: {
    name: 'RAMPAGE',
    anim: [['punch_wind', 5], ['punch', 16], ['punch_wind', 8]],
    startup: 5, active: 15,
    dmg: 12, hitstun: 0, blockstun: 13, kb: 3.0,
    hitbox: { x: 6, y: -42, w: 28, h: 18 },
    dash: { vx: 3.6, from: 5, to: 20 },
    knockdown: true, heavy: true,
  },
};
for (const k in ATTACKS) ATTACKS[k].key = k;   // self-name for finisher checks

// Characters. Phase 1 roster: KIRO and ASHKAR (the other two come later).
const CHARACTERS = {
  kiro: {
    id: 'kiro', name: 'KIRO',
    tagline: 'THE COLD WIND',
    palette: 'kiro', altPalette: 'kiro_alt',
    specials: [
      {
        id: 'iceblast', name: 'ICE BLAST',
        seq: ['D', 'F'], btn: 'lp',
        anim: [['throw_proj', 10], ['throw_proj', 16]],
        spawnFrame: 8,
        proj: {
          kind: 'iceball', speed: 2.4, dmg: 0, chip: 2,
          y: -30, frames: ['iceball_a', 'iceball_b'],
          freeze: 100,
        },
      },
      {
        id: 'slide', name: 'ICE SLIDE',
        seq: ['B', 'F'], btn: 'lk',
        type: 'attack', attack: 'slide',
      },
    ],
    moveHint: ['DOWN, FORWARD + LOW PUNCH = ICE BLAST',
               'BACK, FORWARD + LOW KICK = ICE SLIDE'],
  },
  ashkar: {
    id: 'ashkar', name: 'ASHKAR',
    tagline: 'THE BURNING SPEAR',
    palette: 'ashkar', altPalette: 'ashkar_alt',
    specials: [
      {
        id: 'spear', name: 'FLAME SPEAR',
        seq: ['B', 'F'], btn: 'lp',
        anim: [['throw_proj', 10], ['throw_proj', 20]],
        spawnFrame: 8,
        proj: {
          kind: 'spear', speed: 3.2, dmg: 6, chip: 2,
          y: -30, frames: ['spear'],
          pull: true, rope: true,
        },
      },
      {
        id: 'phantom', name: 'PHANTOM STRIKE',
        seq: ['D', 'B'], btn: 'hp',
        type: 'attack', attack: 'phantom',
      },
    ],
    moveHint: ['BACK, FORWARD + LOW PUNCH = FLAME SPEAR',
               'DOWN, BACK + HIGH PUNCH = PHANTOM STRIKE'],
  },
  voltan: {
    id: 'voltan', name: 'VOLTAN',
    tagline: 'GOD OF THE STORM',
    palette: 'voltan', altPalette: 'voltan_alt',
    specials: [
      {
        id: 'torpedo', name: 'STORM TORPEDO',
        seq: ['B', 'F'], btn: 'hp',
        type: 'attack', attack: 'torpedo',
      },
      {
        id: 'teleport', name: 'THUNDER STEP',
        seq: ['D', 'B'], btn: 'lp',
        anim: [['jump', 6], ['jump', 10], ['idle_a', 8]],
        spawnFrame: 6,
        teleport: true, vanish: [6, 16],
      },
    ],
    moveHint: ['BACK, FORWARD + HIGH PUNCH = TORPEDO',
               'DOWN, BACK + LOW PUNCH = TELEPORT'],
  },
  striker: {
    id: 'striker', name: 'STRIKER',
    tagline: 'THE LAST SOLDIER',
    palette: 'striker', altPalette: 'striker_alt',
    specials: [
      {
        id: 'ring', name: 'PULSE RING',
        seq: ['D', 'F'], btn: 'lp',
        anim: [['throw_proj', 10], ['throw_proj', 16]],
        spawnFrame: 8,
        proj: {
          kind: 'ring', speed: 2.8, dmg: 8, chip: 2,
          y: -30, frames: ['ring_a', 'ring_b'],
          hitstun: 20, kb: 2.4,
        },
      },
      {
        id: 'leggrab', name: 'SCISSOR TAKEDOWN',
        seq: ['D', 'B'], btn: 'lk',
        type: 'attack', attack: 'leggrab',
      },
    ],
    moveHint: ['DOWN, FORWARD + LOW PUNCH = PULSE RING',
               'DOWN, BACK + LOW KICK = LEG GRAB'],
  },
  vipra: {
    id: 'vipra', name: 'VIPRA',
    tagline: 'THE VENOM QUEEN',
    palette: 'vipra', altPalette: 'vipra_alt',
    specials: [
      {
        id: 'venom', name: 'VENOM ORB',
        seq: ['D', 'F'], btn: 'hp',
        anim: [['throw_proj', 10], ['throw_proj', 16]],
        spawnFrame: 8,
        proj: {
          kind: 'venom', speed: 2.6, dmg: 4, chip: 4,
          y: -30, frames: ['venom_a', 'venom_b'],
          hitstun: 18, kb: 1.8,
        },
      },
      {
        id: 'lash', name: 'VIPER LASH',
        seq: ['B', 'F'], btn: 'lp',
        type: 'attack', attack: 'lash',
      },
    ],
    moveHint: ['DOWN, FORWARD + HIGH PUNCH = VENOM ORB',
               'BACK, FORWARD + LOW PUNCH = VIPER LASH'],
  },
  nyx: {
    id: 'nyx', name: 'NYX',
    tagline: 'THE SILENT SHADOW',
    palette: 'nyx', altPalette: 'nyx_alt',
    specials: [
      {
        id: 'dart', name: 'SHADOW DART',
        seq: ['B', 'F'], btn: 'lp',
        anim: [['throw_proj', 8], ['throw_proj', 14]],
        spawnFrame: 6,
        proj: {
          kind: 'dart', speed: 4.2, dmg: 5, chip: 1,
          y: -30, frames: ['dart_a', 'dart_b'],
          hitstun: 16, kb: 1.6,
        },
      },
      {
        id: 'veil', name: 'VEIL STEP',
        seq: ['D', 'B'], btn: 'lk',
        anim: [['jump', 6], ['jump', 10], ['idle_a', 8]],
        spawnFrame: 6,
        teleport: true, vanish: [6, 16],
      },
    ],
    moveHint: ['BACK, FORWARD + LOW PUNCH = SHADOW DART',
               'DOWN, BACK + LOW KICK = VEIL STEP'],
  },
  rokkan: {
    id: 'rokkan', name: 'ROKKAN',
    tagline: 'THE MOUNTAIN',
    palette: 'rokkan', altPalette: 'rokkan_alt',
    specials: [
      {
        id: 'quake', name: 'QUAKE WAVE',
        seq: ['D', 'F'], btn: 'lk',
        anim: [['throw_proj', 12], ['throw_proj', 18]],
        spawnFrame: 10,
        proj: {
          kind: 'wave', speed: 2.0, dmg: 8, chip: 3,
          y: -8, frames: ['wave_a', 'wave_b'],
          hitstun: 20, kb: 2.2,
        },
      },
      {
        id: 'ram', name: 'GRANITE RAM',
        seq: ['B', 'F'], btn: 'hp',
        type: 'attack', attack: 'ram',
      },
    ],
    moveHint: ['DOWN, FORWARD + LOW KICK = QUAKE WAVE',
               'BACK, FORWARD + HIGH PUNCH = GRANITE RAM'],
  },
  sura: {
    id: 'sura', name: 'SURA',
    tagline: 'THE WIND DANCER',
    palette: 'sura', altPalette: 'sura_alt',
    specials: [
      {
        id: 'fan', name: 'GALE FAN',
        seq: ['D', 'F'], btn: 'lp',
        anim: [['throw_proj', 10], ['throw_proj', 14]],
        spawnFrame: 8,
        proj: {
          kind: 'fan', speed: 3.4, dmg: 6, chip: 2,
          y: -30, frames: ['fan_a', 'fan_b'],
          hitstun: 16, kb: 2.0,
        },
      },
      {
        id: 'cyclone', name: 'CYCLONE KICK',
        seq: ['B', 'F'], btn: 'hk',
        type: 'attack', attack: 'cyclone',
      },
    ],
    moveHint: ['DOWN, FORWARD + LOW PUNCH = GALE FAN',
               'BACK, FORWARD + HIGH KICK = CYCLONE KICK'],
  },
  gorruk: {
    id: 'gorruk', name: 'GORRUK',
    tagline: 'WARLORD OF THE PIT',
    palette: 'gorruk', altPalette: 'gorruk',
    frameSet: 'gorruk',               // uses GORRUK_FRAMES instead of the ninja set
    dmgMul: 1.35,                     // boss hits harder
    noLaunch: true,                   // too massive to be uppercut-juggled
    walkMul: 0.7,
    pokeRange: 48,                    // longer arms: the AI swings from farther out
    // every standard input maps onto one of his three moves
    moveMap: {
      hp: 'g_punch', lp: 'g_punch', hk: 'g_slam', lk: 'g_punch',
      clp: 'g_punch', clk: 'g_slam', sweep: 'g_lunge', uppercut: 'g_slam',
      jumpkick: 'g_punch',
    },
    boxes: {
      stand:  { hurt: { x: -13, y: -50, w: 26, h: 50 }, push: { hw: 12, h: 48 } },
      crouch: { hurt: { x: -13, y: -50, w: 26, h: 50 }, push: { hw: 12, h: 48 } },
      air:    { hurt: { x: -13, y: -50, w: 26, h: 50 }, push: { hw: 12, h: 48 } },
      down:   { hurt: { x: -20, y: -10, w: 40, h: 10 }, push: { hw: 12, h: 8 } },
    },
    // boss sheet lacks ninja-only poses; alias them to the closest boss frame
    aliases: {
      crouch: 'block', block_crouch: 'block', jump: 'idle_a',
      jump_kick: 'punch', juggle: 'hit', dazed: 'hit', getup: 'block',
      throw_proj: 'punch', kick_wind: 'punch_wind', sweep: 'punch',
      walk_c: 'walk_a', walk_d: 'walk_b', idle_c: 'idle_a',
      punch_follow: 'punch_wind', kick_follow: 'punch_wind',
      upc_follow: 'slam_wind', win_b: 'win',
    },
    specials: [{
      id: 'g_lunge', name: 'RAMPAGE',
      seq: ['B', 'F'], btn: 'hp',
      type: 'attack', attack: 'g_lunge',
    }],
    moveHint: [],
  },
};

const ROSTER = ['kiro', 'ashkar', 'voltan', 'striker',
                'vipra', 'nyx', 'rokkan', 'sura'];        // selectable fighters
const BOSS_ID = 'gorruk';
const LADDER_AI_LEVELS = [0, 0, 1, 1, 1, 2, 2, 2, 3];     // difficulty per rung

// Hurt/push boxes by posture (relative to feet anchor, facing-agnostic).
const BOXES = {
  stand:  { hurt: { x: -10, y: -42, w: 20, h: 42 }, push: { hw: 9, h: 40 } },
  crouch: { hurt: { x: -10, y: -26, w: 20, h: 26 }, push: { hw: 9, h: 24 } },
  air:    { hurt: { x: -9,  y: -36, w: 18, h: 28 }, push: { hw: 8, h: 28 } },
  down:   { hurt: { x: -16, y: -8,  w: 32, h: 8  }, push: { hw: 9, h: 6  } },
};

function totalAttackFrames(def) {
  let t = 0;
  for (const [, d] of def.anim) t += d;
  return t;
}
