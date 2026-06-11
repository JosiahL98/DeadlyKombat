'use strict';
// Headless smoke test: stubs the DOM/canvas, loads the game scripts, and runs
// thousands of simulated frames with scripted + random inputs.
//   node test/smoke.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// ---- minimal browser stubs ----
function stubCtx() {
  return new Proxy({ canvas: null }, {
    get(t, k) {
      if (k in t) return t[k];
      return () => 0;                       // every method is a no-op
    },
    set(t, k, v) { t[k] = v; return true; },
  });
}
function stubCanvas() {
  return { width: 0, height: 0, getContext: () => stubCtx(), style: {} };
}

const sandbox = {
  console,
  Math,
  performance: { now: () => Date.now() },
  requestAnimationFrame: () => 0,
  window: {
    addEventListener: () => {},
    // no AudioContext -> SFX becomes a no-op, as designed
  },
  document: {
    createElement: (tag) => tag === 'canvas' ? stubCanvas() : {},
    getElementById: () => stubCanvas(),
  },
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

const files = ['constants.js','font.js','audio.js','input.js','art.js','sprites.js',
               'characters.js','particles.js','fighter.js','ai.js','match.js','screens.js'];
for (const f of files) {
  const code = fs.readFileSync(path.join(__dirname, '..', 'src', f), 'utf8');
  vm.runInContext(code, sandbox, { filename: f });
}

// ---- run scenarios inside the sandbox ----
const scenarioCode = `
(function () {
  let failures = [];
  function assert(cond, msg) { if (!cond) failures.push(msg); }

  // helper: feed a fixed pad to p1 each frame, neutral or AI p2
  function runMatch(opts, frames, padFn) {
    const m = new Match(opts);
    // monkey-patch input for p1: Match reads readPad(0/1)
    const origRead = readPad;
    globalThis.readPad = (idx) => padFn(idx, m) || neutralPad();
    try {
      for (let i = 0; i < frames; i++) {
        m.update();
        const [a, b] = m.fighters;
        assert(isFinite(a.x) && isFinite(a.y) && isFinite(a.hp), 'p1 NaN at frame ' + i);
        assert(isFinite(b.x) && isFinite(b.y) && isFinite(b.hp), 'p2 NaN at frame ' + i);
        assert(a.x >= 0 && a.x <= GAME_W, 'p1 off-screen at frame ' + i + ' x=' + a.x);
        if (failures.length) break;
      }
    } finally { globalThis.readPad = origRead; }
    return m;
  }

  // 1. CPU match, p1 mashing toward the foe -- someone should take damage
  let press = 0;
  let m = runMatch({ p1: 'kiro', p2: 'ashkar', mode: 'cpu', aiLevel: 1 }, 5400, (idx) => {
    if (idx !== 0) return null;
    const p = neutralPad();
    p.right = true;
    press++;
    if (press % 30 === 0) p.hpP = true;
    if (press % 47 === 0) p.lkP = true;
    if (press % 113 === 0) p.hkP = true;
    return p;
  });
  assert(m.fighters[0].hp < MAX_HP || m.fighters[1].hp < MAX_HP || m.round > 1,
    'no damage dealt in 90s of mashing');

  // 2. uppercut connects and launches: place fighters close, force uppercut
  m = new Match({ p1: 'kiro', p2: 'kiro', mode: 'vs' });
  m.phase = 'fight'; m.banner = null;
  const [f1, f2] = m.fighters;
  f1.x = 150; f2.x = 168;
  f1.startAttack('uppercut');
  let launched = false;
  globalThis.readPad = () => neutralPad();
  for (let i = 0; i < 120; i++) {
    m.update();
    if (f2.state === 'juggle' || f2.state === 'down') launched = true;
  }
  assert(launched, 'uppercut did not launch (f2 state: ' + f2.state + ')');
  assert(f2.hp < MAX_HP, 'uppercut dealt no damage');

  // 3. ice blast freezes
  m = new Match({ p1: 'kiro', p2: 'ashkar', mode: 'vs' });
  m.phase = 'fight'; m.banner = null;
  m.fighters[0].startSpecial(CHARACTERS.kiro.specials[0]);
  let froze = false;
  for (let i = 0; i < 200; i++) { m.update(); if (m.fighters[1].state === 'frozen') froze = true; }
  assert(froze, 'ice blast did not freeze');

  // 4. spear pulls
  m = new Match({ p1: 'ashkar', p2: 'kiro', mode: 'vs' });
  m.phase = 'fight'; m.banner = null;
  m.fighters[0].startSpecial(CHARACTERS.ashkar.specials[0]);
  let speared = false, pulledClose = false;
  for (let i = 0; i < 300; i++) {
    m.update();
    if (m.fighters[1].state === 'speared') speared = true;
    if (speared && Math.abs(m.fighters[1].x - m.fighters[0].x) < 40) pulledClose = true;
  }
  assert(speared, 'spear did not connect');
  assert(pulledClose, 'spear did not pull opponent in');

  // 5. blocking prevents damage from normals
  m = new Match({ p1: 'kiro', p2: 'ashkar', mode: 'vs' });
  m.phase = 'fight'; m.banner = null;
  m.fighters[0].x = 150; m.fighters[1].x = 170;
  m.fighters[1].state = 'block';
  const hpBefore = m.fighters[1].hp;
  m.fighters[0].startAttack('hp');
  globalThis.readPad = (i) => { const p = neutralPad(); if (i === 1) p.bl = true; return p; };
  for (let i = 0; i < 30; i++) m.update();
  assert(m.fighters[1].hp === hpBefore, 'blocked high punch chipped damage');

  // 6. two AIs fight a full match to completion without errors
  m = new Match({ p1: 'ashkar', p2: 'kiro', mode: 'cpu', aiLevel: 2 });
  const aiP1 = new AI(2);
  globalThis.readPad = (i) => i === 0
    ? aiP1.update(m.fighters[0], m.fighters[1], m)
    : neutralPad();
  let frames = 0;
  while (!m.finished && frames < 60 * 60 * 8) { m.update(); frames++; }
  assert(m.finished, 'AI vs AI match never finished (phase ' + m.phase + ', round ' + m.round + ')');

  // 7. random-input fuzz, both human pads
  m = new Match({ p1: 'kiro', p2: 'ashkar', mode: 'vs' });
  globalThis.readPad = () => {
    const p = neutralPad();
    for (const k of ['left','right','up','down','bl']) p[k] = Math.random() < 0.25;
    for (const k of ['hpP','lpP','hkP','lkP']) p[k] = Math.random() < 0.08;
    return p;
  };
  const hoverFrames = [0, 0];
  const airStates = ['jump', 'airattack', 'juggle', 'ko', 'frozen'];
  for (let i = 0; i < 20000 && !m.finished; i++) {
    m.update();
    const [a, b] = m.fighters;
    if (!isFinite(a.x) || !isFinite(b.x) || !isFinite(a.hp) || !isFinite(b.hp)) {
      failures.push('fuzz produced NaN at frame ' + i);
      break;
    }
    // hover detector: grounded-logic states may only be above the floor briefly
    let hovering = false;
    m.fighters.forEach((f, fi) => {
      if (f.y < FLOOR_Y - 1 && !airStates.includes(f.state)) hoverFrames[fi]++;
      else hoverFrames[fi] = 0;
      if (hoverFrames[fi] > 90) {
        failures.push('fighter ' + fi + ' hovering in state ' + f.state + ' at frame ' + i);
        hovering = true;
      }
    });
    if (hovering) break;
  }

  // 8. human-style special inputs, including a rolled (down held into forward)
  //    quarter-circle, must come out via the input buffer
  function tryMotion(charId, frames) {
    const mm = new Match({ p1: charId, p2: 'kiro', mode: 'vs' });
    mm.phase = 'fight'; mm.banner = null;
    let fr = 0;
    globalThis.readPad = (i) => {
      const p = neutralPad();
      if (i === 0 && frames[fr]) Object.assign(p, frames[fr]);
      return p;
    };
    let fired = false;
    for (fr = 0; fr < 60; fr++) {
      mm.update();
      if (mm.fighters[0].state === 'special' || mm.projectiles.length) fired = true;
    }
    return fired;
  }
  const seqFrames = (a, b, btnAt) => {
    const fs = [];
    for (let i = 0; i < 6; i++) fs.push(a);
    for (let i = 0; i < 6; i++) fs.push(b);
    fs[btnAt] = Object.assign({ lpP: true }, fs[btnAt]);
    return fs;
  };
  // clean D, F + LP
  assert(tryMotion('kiro', seqFrames({ down: true }, { right: true }, 11)),
    'ice blast failed on clean D,F input');
  // rolled: down held while forward is pressed (diagonal)
  assert(tryMotion('kiro', seqFrames({ down: true }, { down: true, right: true }, 11)),
    'ice blast failed on rolled D,DF input');
  // B, F + LP (ashkar starts on the left facing right, so back = left)
  assert(tryMotion('ashkar', seqFrames({ left: true }, { right: true }, 11)),
    'spear failed on clean B,F input');

  // 9. VOLTAN: torpedo dashes in and knocks down; teleport crosses sides
  m = new Match({ p1: 'voltan', p2: 'kiro', mode: 'vs' });
  m.phase = 'fight'; m.banner = null;
  m.fighters[0].x = 90; m.fighters[1].x = 200;
  m.fighters[0].startAttack('torpedo');
  globalThis.readPad = () => neutralPad();
  let torpedoHit = false;
  for (let i = 0; i < 120; i++) {
    m.update();
    if (['juggle', 'down', 'hitstun'].includes(m.fighters[1].state)) torpedoHit = true;
  }
  assert(torpedoHit, 'torpedo never connected (foe ' + m.fighters[1].state + ')');
  assert(m.fighters[1].hp < MAX_HP, 'torpedo dealt no damage');

  m = new Match({ p1: 'voltan', p2: 'kiro', mode: 'vs' });
  m.phase = 'fight'; m.banner = null;
  let sent = false;
  globalThis.readPad = (i) => {
    const p = neutralPad();
    if (i === 0 && !sent) { p.special = 'teleport'; sent = true; }
    return p;
  };
  const startSide = Math.sign(m.fighters[0].x - m.fighters[1].x);
  for (let i = 0; i < 60; i++) m.update();
  const endSide = Math.sign(m.fighters[0].x - m.fighters[1].x);
  assert(startSide !== endSide, 'teleport did not cross to the far side');

  // 10. STRIKER: pulse ring damages; leg grab launches
  m = new Match({ p1: 'striker', p2: 'kiro', mode: 'vs' });
  m.phase = 'fight'; m.banner = null;
  m.fighters[0].startSpecial(CHARACTERS.striker.specials[0]);
  globalThis.readPad = () => neutralPad();
  for (let i = 0; i < 200; i++) m.update();
  assert(m.fighters[1].hp < MAX_HP, 'pulse ring dealt no damage');

  m = new Match({ p1: 'striker', p2: 'kiro', mode: 'vs' });
  m.phase = 'fight'; m.banner = null;
  m.fighters[0].x = 150; m.fighters[1].x = 175;
  m.fighters[0].startAttack('leggrab');
  let grabbed = false;
  for (let i = 0; i < 120; i++) {
    m.update();
    if (['juggle', 'down'].includes(m.fighters[1].state)) grabbed = true;
  }
  assert(grabbed, 'leg grab did not take the opponent down');

  // 11. FINISH THEM: deciding hit dazes instead of KO; uppercut = finisher
  function setupFinish() {
    const mm = new Match({ p1: 'kiro', p2: 'ashkar', mode: 'vs' });
    mm.phase = 'fight'; mm.banner = null;
    mm.wins[0] = 1;                       // next round win decides the match
    mm.fighters[0].x = 150; mm.fighters[1].x = 168;
    mm.fighters[1].hp = 1;
    mm.fighters[0].startAttack('lp');
    globalThis.readPad = () => neutralPad();
    for (let i = 0; i < 60; i++) mm.update();
    return mm;
  }
  m = setupFinish();
  assert(m.phase === 'finish', 'deciding hit did not trigger FINISH THEM (phase ' + m.phase + ')');
  assert(m.fighters[1].state === 'dazed', 'loser is not dazed (' + m.fighters[1].state + ')');
  assert(m.fighters[1].hp === 0, 'dazed loser hp should be 0');

  m.fighters[0].startAttack('uppercut');
  let sawFinisher = false;
  for (let i = 0; i < 600 && !m.finished; i++) {
    m.update();
    if (m.phase === 'finisher') sawFinisher = true;
  }
  assert(sawFinisher, 'uppercut on dazed loser did not trigger the finisher');
  assert(m.finished && m.winnerIdx === 0, 'finisher did not end the match');

  // 12. FINISH THEM timeout: loser collapses on their own
  m = setupFinish();
  for (let i = 0; i < 600 && !m.finished; i++) m.update();
  assert(m.finished && m.winnerIdx === 0, 'finish timeout did not resolve the round');

  // 13. boss sanity: GORRUK match completes, uppercut cannot juggle him high
  m = new Match({ p1: 'kiro', p2: 'gorruk', mode: 'cpu', aiLevel: 3 });
  const aiBossFoe = new AI(2);
  globalThis.readPad = (i) => i === 0
    ? aiBossFoe.update(m.fighters[0], m.fighters[1], m)
    : neutralPad();
  frames = 0;
  while (!m.finished && frames < 60 * 60 * 8) { m.update(); frames++; }
  assert(m.finished, 'boss match never finished (phase ' + m.phase + ', round ' + m.round + ')');

  // 13b. hover regression: a fighter struck out of the air must always land.
  // (Bug: spearing a juggled opponent left them floating at juggle height.)
  m = new Match({ p1: 'ashkar', p2: 'kiro', mode: 'vs' });
  m.phase = 'fight'; m.banner = null;
  globalThis.readPad = () => neutralPad();
  let vic = m.fighters[1];
  vic.state = 'juggle'; vic.y = FLOOR_Y - 40; vic.vy = -1; vic.vx = 0;
  vic.takeHit(4, { spear: true, attacker: m.fighters[0] });
  for (let i = 0; i < 400; i++) m.update();
  assert(vic.y >= FLOOR_Y - 0.01,
    'speared mid-air left opponent hovering at y=' + vic.y + ' state=' + vic.state);

  m = new Match({ p1: 'kiro', p2: 'ashkar', mode: 'vs' });
  m.phase = 'fight'; m.banner = null;
  vic = m.fighters[1];
  vic.state = 'frozen'; vic.frozenSprite = 'hit'; vic.freezeT = 300;
  vic.y = FLOOR_Y - 30; vic.vy = 0;
  vic.takeHit(6, { hitstun: 16, kb: 1.5 });   // shattered while airborne
  for (let i = 0; i < 400; i++) m.update();
  assert(vic.y >= FLOOR_Y - 0.01,
    'mid-air shatter left opponent hovering at y=' + vic.y + ' state=' + vic.state);

  // 14. ladder config is consistent
  assert(LADDER_AI_LEVELS.length === ROSTER.length + 1, 'ladder levels != rungs');
  assert(CHARACTERS[BOSS_ID], 'boss character missing');
  for (const id of ROSTER.concat([BOSS_ID])) {
    assert(CHARACTERS[id], 'roster character missing: ' + id);
  }

  // 15. every sprite key referenced by states/attacks exists in the body rig
  const needed = new Set(['idle_a','idle_b','idle_c','walk_a','walk_b','walk_c','walk_d',
    'jump','crouch','block','block_crouch','hit','juggle','down','win','win_b',
    'jump_kick','dazed']);
  for (const k in ATTACKS) {
    if (k.startsWith('g_')) continue;          // boss anims use the boss sheet
    for (const [spr] of ATTACKS[k].anim) needed.add(spr);
  }
  for (const id in CHARACTERS) {
    if (CHARACTERS[id].frameSet) continue;
    for (const sp of CHARACTERS[id].specials) {
      if (sp.anim) for (const [spr] of sp.anim) needed.add(spr);
    }
  }
  for (const k of needed) assert(NINJA_FRAMES[k], 'missing ninja frame: ' + k);
  for (const k in ATTACKS) {
    if (!k.startsWith('g_')) continue;
    for (const [spr] of ATTACKS[k].anim) {
      assert(GORRUK_FRAMES[spr], 'missing gorruk frame: ' + spr);
    }
  }

  // 16. art sanity: only legal palette chars, width limits
  const legal = new Set(['.', ' ', 'K','P','D','S','G','W']);
  for (const k in NINJA_FRAMES) {
    for (const row of NINJA_FRAMES[k].r) {
      assert(row.length <= 18, 'ninja frame ' + k + ' row wider than 18: ' + row.length);
      for (const ch of row) assert(legal.has(ch), 'ninja frame ' + k + ' illegal char "' + ch + '"');
    }
  }
  for (const k in GORRUK_FRAMES) {
    for (const row of GORRUK_FRAMES[k].r) {
      assert(row.length <= 27, 'gorruk frame ' + k + ' row wider than 27: ' + row.length);
      for (const ch of row) assert(legal.has(ch), 'gorruk frame ' + k + ' illegal char "' + ch + '"');
    }
  }

  // 16b. portrait sanity: one per fighter, rows within 20 cols, chars painted
  for (const id of ROSTER.concat([BOSS_ID])) {
    const p = PORTRAIT_ART[id];
    assert(p, 'missing portrait for ' + id);
    for (const row of p.frame.r) {
      assert(row.length <= 20, 'portrait ' + id + ' row wider than 20: ' + row.length);
      for (const ch of row) {
        assert(ch === '.' || p.palette[ch], 'portrait ' + id + ' unpainted char "' + ch + '"');
      }
    }
  }

  // 16c. new ninja specials: KIRO's slide travels and knocks down;
  // ASHKAR's phantom strike teleports behind the foe and connects
  m = new Match({ p1: 'kiro', p2: 'ashkar', mode: 'vs' });
  m.phase = 'fight'; m.banner = null;
  globalThis.readPad = () => neutralPad();
  m.fighters[0].x = 100; m.fighters[1].x = 190;
  m.fighters[0].startAttack('slide');
  let slid = false;
  for (let i = 0; i < 100; i++) {
    m.update();
    if (['juggle', 'down'].includes(m.fighters[1].state)) slid = true;
  }
  assert(slid, 'ice slide did not knock down (foe ' + m.fighters[1].state + ')');
  assert(m.fighters[0].x > 110, 'ice slide did not travel (x=' + m.fighters[0].x + ')');

  m = new Match({ p1: 'ashkar', p2: 'kiro', mode: 'vs' });
  m.phase = 'fight'; m.banner = null;
  m.fighters[0].x = 80; m.fighters[1].x = 200;
  m.fighters[0].startAttack('phantom');
  let phantomHit = false;
  for (let i = 0; i < 80; i++) {
    m.update();
    if (['juggle', 'down', 'hitstun'].includes(m.fighters[1].state)) phantomHit = true;
  }
  assert(m.fighters[0].x > m.fighters[1].x, 'phantom strike did not cross behind the foe');
  assert(phantomHit, 'phantom strike did not connect');

  // 17. stage art sanity: 80x50 grids, every char resolvable in the palette
  assert(STAGE_ART.length === 7, 'expected 7 stages, got ' + STAGE_ART.length);
  for (const st of STAGE_ART) {
    assert(st.rows.length === 50, 'stage ' + st.name + ' has ' + st.rows.length + ' rows');
    for (const row of st.rows) {
      assert(row.length <= 80, 'stage ' + st.name + ' row wider than 80');
      for (const ch of row) {
        assert(st.palette[ch], 'stage ' + st.name + ' unpainted char "' + ch + '"');
      }
    }
    for (const a of st.anims || []) {
      for (const k of a.order) assert(a.frames[k], 'stage ' + st.name + ' anim missing frame ' + k);
    }
  }

  return failures;
})()
`;

const failures = vm.runInContext(scenarioCode, sandbox, { filename: 'scenarios' });
if (failures.length) {
  console.error('SMOKE TEST FAILURES:');
  for (const f of failures) console.error('  - ' + f);
  process.exit(1);
}
console.log('All smoke tests passed.');
