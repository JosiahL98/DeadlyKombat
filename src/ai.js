'use strict';
// AI: a decision state machine with built-in reaction delay -- never
// frame-perfect. It emits the same abstract pad a human produces.
// Difficulty presets scale up the ladder in phase 2.

const AI_LEVELS = [
  // 0: passive and punishable (ladder opener)
  { reaction: 30, aggression: 0.35, blockChance: 0.18, specialChance: 0.10,
    antiAir: 0.15, jumpiness: 0.05 },
  // 1: default sparring partner
  { reaction: 20, aggression: 0.55, blockChance: 0.40, specialChance: 0.25,
    antiAir: 0.40, jumpiness: 0.08 },
  // 2: counters and zones intelligently
  { reaction: 13, aggression: 0.70, blockChance: 0.60, specialChance: 0.38,
    antiAir: 0.65, jumpiness: 0.10 },
  // 3: GORRUK -- relentless, never jumps, walls you out with reach
  { reaction: 14, aggression: 0.80, blockChance: 0.35, specialChance: 0.30,
    antiAir: 0.55, jumpiness: 0 },
];

class AI {
  constructor(level) {
    this.cfg = AI_LEVELS[Math.max(0, Math.min(AI_LEVELS.length - 1, level))];
    this.think = 30;          // frames until next decision
    this.plan = null;         // {type, t, ...}
  }

  rnd() { return Math.random(); }

  pickSpecial(me, match) {
    const ok = me.char.specials.filter(sp =>
      sp.proj ? !match.hasProjectile(me) : true);
    if (!ok.length) return null;
    return ok[(this.rnd() * ok.length) | 0].id;
  }

  update(me, foe, match) {
    const pad = neutralPad();
    if (!me.isActionable()) { this.plan = null; return pad; }

    const dist = Math.abs(foe.x - me.x);
    const fwdKey = foe.x > me.x ? 'right' : 'left';
    const backKey = foe.x > me.x ? 'left' : 'right';
    const cfg = this.cfg;

    // execute current plan
    if (this.plan) {
      const p = this.plan;
      p.t--;
      if (p.t <= 0) { this.plan = null; }
      else {
        if (p.type === 'advance') pad[fwdKey] = true;
        else if (p.type === 'retreat') pad[backKey] = true;
        else if (p.type === 'block') { pad.bl = true; if (p.low) pad.down = true; }
        else if (p.type === 'crouch') pad.down = true;
        else if (p.type === 'jumpin') { pad.up = true; pad[fwdKey] = true;
          if (p.t === ((p.kickAt | 0))) pad.hkP = true; }
        return pad;
      }
    }

    if (--this.think > 0) return pad;
    this.think = cfg.reaction + (this.rnd() * cfg.reaction) | 0;

    // --- reactions (still rate-limited by think timer) ---
    const foeProj = match.projectiles.find(pr => pr.owner !== me &&
      Math.abs(pr.x - me.x) < 90 && Math.sign(pr.vx) === Math.sign(me.x - pr.x));
    if (foeProj) {
      const tp = me.char.specials.find(sp => sp.teleport);
      if (tp && this.rnd() < 0.5) pad.special = tp.id;            // blink behind it
      else if (this.rnd() < 0.5 && cfg.jumpiness > 0) this.plan = { type: 'jumpin', t: 20, kickAt: -1 };
      else this.plan = { type: 'block', t: 30, low: false };
      return pad;
    }

    const foeAttacking = foe.attack && !foe.attack.hasHit;
    if (foeAttacking && dist < 60 && this.rnd() < cfg.blockChance) {
      this.plan = { type: 'block', t: 22 + this.rnd() * 14,
                    low: !!(foe.attack.def.low) || this.rnd() < 0.4 };
      return pad;
    }

    // anti-air: foe jumping toward us
    if (foe.airborne && dist < 70 && this.rnd() < cfg.antiAir) {
      if (this.rnd() < 0.6) { pad.down = true; pad.hpP = true; }   // uppercut
      else this.plan = { type: 'retreat', t: 16 };
      return pad;
    }

    // --- positioning / offense by range ---
    if (dist > 130) {
      const sp = this.pickSpecial(me, match);
      if (sp && this.rnd() < cfg.specialChance) {
        pad.special = sp;
      } else if (this.rnd() < cfg.jumpiness) {
        this.plan = { type: 'jumpin', t: 34, kickAt: 12 + this.rnd() * 8 };
      } else {
        this.plan = { type: 'advance', t: 14 + this.rnd() * 18 };
      }
      return pad;
    }

    if (dist > 55) {
      const r = this.rnd();
      const sp = this.pickSpecial(me, match);
      if (sp && r < cfg.specialChance * 0.6) {
        pad.special = sp;
      } else if (r < cfg.aggression) {
        this.plan = { type: 'advance', t: 10 + this.rnd() * 12 };
      } else if (cfg.jumpiness > 0 && r < cfg.aggression + 0.15) {
        this.plan = { type: 'jumpin', t: 34, kickAt: 12 + this.rnd() * 8 };
      } else {
        this.plan = { type: 'retreat', t: 10 + this.rnd() * 10 };
      }
      return pad;
    }

    // close range: pick a poke
    const r = this.rnd();
    if (r < cfg.aggression) {
      const moves = [
        () => { pad.hpP = true; },
        () => { pad.lpP = true; },
        () => { pad.hkP = true; },
        () => { pad.lkP = true; },
        () => { pad[backKey] = true; pad.lkP = true; },          // sweep
        () => { pad.down = true; pad.lkP = true; },              // crouch kick
        () => { if (foe.inStun()) { pad.down = true; pad.hpP = true; } else pad.lpP = true; },
      ];
      moves[(this.rnd() * moves.length) | 0]();
    } else if (r < cfg.aggression + cfg.blockChance * 0.5) {
      this.plan = { type: 'block', t: 20, low: this.rnd() < 0.5 };
    } else {
      this.plan = { type: 'retreat', t: 12 + this.rnd() * 12 };
    }
    return pad;
  }
}
