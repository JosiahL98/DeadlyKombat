'use strict';
// Fighter state machine. States:
//   idle walk crouch block blockcrouch jump attack airattack special
//   hitstun blockstun juggle down getup frozen speared ko dead win
// The fighter consumes an abstract pad (see input.js); the Match resolves hits.

class Fighter {
  constructor(charId, side, paletteKey) {
    this.char = CHARACTERS[charId];
    this.side = side;                  // 0 = left start, 1 = right start
    const frames = this.char.frameSet === 'gorruk' ? GORRUK_FRAMES : NINJA_FRAMES;
    this.sheet = bakeSheet(frames, PALETTES[paletteKey]);
    this.iceSheet = bakeSheet(frames, PALETTES.ice);
    this.flashSheet = bakeSheet(frames, PALETTES.flash, { noShade: true });
    // characters with their own frame set alias the poses they lack
    for (const sheet of [this.sheet, this.iceSheet, this.flashSheet]) {
      for (const key in NINJA_FRAMES) {
        if (!sheet[key]) sheet[key] = sheet[(this.char.aliases || {})[key]] || sheet.idle_a;
      }
    }
    this.dmgMul = this.char.dmgMul || 1;
    this.noLaunch = !!this.char.noLaunch;
    this.walkMul = this.char.walkMul || 1;
    this.resetRound();
  }

  resetRound() {
    this.x = this.side === 0 ? 92 : GAME_W - 92;
    this.y = FLOOR_Y;
    this.finishDazed = false;
    this.vx = 0; this.vy = 0;
    this.facing = this.side === 0 ? 1 : -1;
    this.hp = MAX_HP;
    this.state = 'idle';
    this.stateT = 0;            // frames remaining in timed states
    this.animT = 0;             // free-running anim clock for idle/walk
    this.attack = null;         // {def, t, hasHit}
    this.special = null;        // {def, t, spawned}
    this.dirEvents = [];        // [{d:'F'|'B'|'D'|'U', t:frame}] for input buffer
    this.frame = 0;             // local frame counter
    this.airAttacked = false;
    this.flash = 0;             // hit-flash frames remaining
    this.freezeT = 0;
    this.spearStun = 0;
    this.pulledBy = null;
    this.holdingDown = false;
    this.koFalling = false;
  }

  get foeDir() { return this.facing; }
  get grounded() { return this.y >= FLOOR_Y - 0.01 && this.state !== 'jump' && this.state !== 'airattack'; }
  get airborne() { return this.state === 'jump' || this.state === 'airattack' || this.state === 'juggle' || this.state === 'ko'; }

  posture() {
    if (this.state === 'down' || this.state === 'dead') return 'down';
    if (this.airborne) return 'air';
    if (['crouch', 'blockcrouch'].includes(this.state) ||
        (this.state === 'attack' && this.attack && this.attack.def.crouching) ||
        (this.state === 'hitstun' && this.wasCrouched) ||
        (this.state === 'blockstun' && this.wasCrouched)) return 'crouch';
    return 'stand';
  }

  hurtbox() {
    if (this.state === 'getup') return null;             // brief invulnerability
    const b = (this.char.boxes || BOXES)[this.posture()].hurt;
    return { x: this.x + b.x, y: this.y + b.y, w: b.w, h: b.h };
  }

  pushbox() {
    const b = (this.char.boxes || BOXES)[this.posture()].push;
    return { x: this.x - b.hw, y: this.y - b.h, w: b.hw * 2, h: b.h };
  }

  // Active hitbox in world space, or null.
  hitbox() {
    const atk = this.attack;
    if (!atk) return null;
    if (atk.hasHit) return null;
    if (atk.t < atk.def.startup || atk.t >= atk.def.startup + atk.def.active) return null;
    const hb = atk.def.hitbox;
    const x = this.facing > 0 ? this.x + hb.x : this.x - hb.x - hb.w;
    return { x, y: this.y + hb.y, w: hb.w, h: hb.h, def: atk.def };
  }

  isBlocking()    { return ['block', 'blockcrouch', 'blockstun'].includes(this.state); }
  isCrouchBlock() { return this.state === 'blockcrouch' || (this.state === 'blockstun' && this.wasCrouched); }
  isVulnerable()  { return !['down', 'getup', 'dead', 'win'].includes(this.state); }
  isActionable()  { return ['idle', 'walk', 'crouch', 'block', 'blockcrouch'].includes(this.state); }
  inStun()        { return ['hitstun', 'juggle', 'frozen', 'speared', 'blockstun', 'dazed'].includes(this.state); }

  // ---- input-buffer special detection ----
  recordDirs(pad) {
    // horizontal wins over down so a rolled motion (still holding down while
    // pressing forward) registers D then F, like a real quarter-circle
    let d = null;
    if ((pad.right && this.facing > 0) || (pad.left && this.facing < 0)) d = 'F';
    else if ((pad.left && this.facing > 0) || (pad.right && this.facing < 0)) d = 'B';
    else if (pad.down) d = 'D';
    else if (pad.up) d = 'U';
    const last = this.dirEvents[this.dirEvents.length - 1];
    if (d && (!last || last.d !== d || this.frame - last.t > INPUT_GAP * 2)) {
      this.dirEvents.push({ d, t: this.frame });
      if (this.dirEvents.length > 12) this.dirEvents.shift();
    }
  }

  matchSequence(seq) {
    // walk dirEvents backwards: last entry must be seq end, gaps <= INPUT_GAP
    let i = this.dirEvents.length - 1;
    let need = seq.length - 1;
    let lastT = this.frame;
    while (i >= 0 && need >= 0) {
      const ev = this.dirEvents[i];
      if (lastT - ev.t > INPUT_GAP) return false;
      if (ev.d === seq[need]) { need--; lastT = ev.t; }
      i--;
    }
    return need < 0;
  }

  trySpecial(pad) {
    for (const sp of this.char.specials) {
      const btnHit = (sp.btn === 'lp' && pad.lpP) || (sp.btn === 'hp' && pad.hpP) ||
                     (sp.btn === 'lk' && pad.lkP) || (sp.btn === 'hk' && pad.hkP);
      const wanted = pad.special === sp.id;        // AI shortcut path
      if (wanted || (btnHit && this.matchSequence(sp.seq))) {
        if (sp.type === 'attack') this.startAttack(sp.attack);
        else this.startSpecial(sp);
        SFX.special();
        return true;
      }
    }
    return false;
  }

  startSpecial(sp) {
    this.state = 'special';
    this.special = { def: sp, t: 0, spawned: false };
    this.attack = null;
  }

  startAttack(key) {
    const map = this.char.moveMap;
    if (map && key in map) key = map[key];
    const def = ATTACKS[key];
    if (!def) return;
    this.attack = { def, t: 0, hasHit: false, total: totalAttackFrames(def) };
    this.state = def.air ? 'airattack' : 'attack';
  }

  // ---- per-frame update; match = owning Match (for projectile checks) ----
  update(pad, foe, match) {
    this.frame++;
    this.animT++;
    if (this.flash > 0) this.flash--;

    // auto-face the opponent when free to act on the ground
    if (['idle', 'walk', 'crouch'].includes(this.state)) {
      this.facing = foe.x >= this.x ? 1 : -1;
    }

    this.recordDirs(pad);
    const fwd = (pad.right && this.facing > 0) || (pad.left && this.facing < 0);
    const back = (pad.left && this.facing > 0) || (pad.right && this.facing < 0);
    this.holdingDown = pad.down;

    switch (this.state) {
      case 'idle':
      case 'walk':
      case 'crouch':
      case 'block':
      case 'blockcrouch': {
        if (this.tryAct(pad, fwd, back, match)) break;
        // stance resolution
        if (pad.bl) {
          this.state = pad.down ? 'blockcrouch' : 'block';
        } else if (pad.down) {
          this.state = 'crouch';
        } else if (pad.up) {
          this.startJump(pad);
        } else if (fwd || back) {
          this.state = 'walk';
          this.x += (fwd ? WALK_F : -WALK_B) * this.facing * this.walkMul;
        } else {
          this.state = 'idle';
        }
        break;
      }

      case 'jump':
      case 'airattack': {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += GRAVITY;
        if (this.state === 'jump' && !this.airAttacked &&
            (pad.lpP || pad.hpP || pad.lkP || pad.hkP)) {
          this.airAttacked = true;
          this.startAttack('jumpkick');
        }
        if (this.attack) this.attack.t++;
        if (this.y >= FLOOR_Y) {
          this.y = FLOOR_Y;
          this.vy = 0; this.vx = 0;
          this.attack = null;
          this.state = 'idle';
        }
        break;
      }

      case 'attack': {
        const atk = this.attack;
        atk.t++;
        if (atk.t === atk.def.startup) SFX.whiff();
        const dd = atk.def.dash;
        if (dd && atk.t >= dd.from && atk.t < dd.to && !atk.hasHit) {
          this.x += dd.vx * this.facing;
          // slammed into the wall: skip straight to recovery
          if (this.x <= WALL_PAD || this.x >= GAME_W - WALL_PAD) {
            atk.t = Math.max(atk.t, atk.total - 8);
          }
        }
        if (atk.t >= atk.total) {
          this.attack = null;
          this.state = pad.down ? 'crouch' : 'idle';
        }
        break;
      }

      case 'special': {
        const sp = this.special;
        sp.t++;
        if (sp.t >= sp.def.spawnFrame && !sp.spawned) {
          sp.spawned = true;
          if (sp.def.teleport) match.teleportFighter(this);
          else match.spawnProjectile(this, sp.def);
        }
        if (sp.t >= totalAttackFrames(sp.def)) {
          this.special = null;
          this.state = 'idle';
        }
        break;
      }

      case 'hitstun': {
        this.x += this.vx;
        this.vx *= 0.82;
        if (--this.stateT <= 0) {
          this.state = this.finishDazed ? 'dazed'
                     : this.wasCrouched && pad.down ? 'crouch' : 'idle';
        }
        break;
      }

      case 'blockstun': {
        this.x += this.vx;
        this.vx *= 0.8;
        if (--this.stateT <= 0) {
          this.state = this.finishDazed ? 'dazed'
                     : pad.bl ? (pad.down ? 'blockcrouch' : 'block') : 'idle';
        }
        break;
      }

      case 'juggle':
      case 'ko': {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += GRAVITY;
        if (this.y >= FLOOR_Y) {
          this.y = FLOOR_Y;
          this.vx = 0; this.vy = 0;
          if (this.state === 'ko') {
            this.state = 'dead';
            SFX.thud();
            match.particles.blood(this.x, this.y - 6, -this.facing, 8, 1);
          } else {
            this.state = 'down';
            this.stateT = 45;
            SFX.thud();
          }
        }
        break;
      }

      case 'down': {
        if (--this.stateT <= 0) { this.state = 'getup'; this.stateT = 14; }
        break;
      }

      case 'getup': {
        if (--this.stateT <= 0) this.state = this.finishDazed ? 'dazed' : 'idle';
        break;
      }

      case 'frozen': {
        if (this.y < FLOOR_Y) { this.y += this.vy; this.vy += GRAVITY; if (this.y >= FLOOR_Y) { this.y = FLOOR_Y; this.vy = 0; } }
        if (--this.freezeT <= 0) {
          this.state = this.finishDazed ? 'dazed' : 'idle';
          match.particles.ice(this.x, this.y - 20);
        }
        break;
      }

      case 'speared': {
        // pulled toward the spear's owner, then held stunned
        const owner = this.pulledBy;
        if (owner && Math.abs(owner.x - this.x) > 30) {
          this.x += Math.sign(owner.x - this.x) * 4;
        } else if (this.spearStun > 0) {
          if (--this.spearStun <= 0) {
            this.state = this.finishDazed ? 'dazed' : 'idle';
            this.pulledBy = null;
          }
        }
        break;
      }

      case 'dazed':       // FINISH THEM: helpless, wobbling on the spot
      case 'dead':
      case 'win':
        break;
    }

    // gravity safety net: states that don't manage their own physics must
    // never hover (e.g. speared or struck out of the air mid-juggle)
    if (this.y < FLOOR_Y &&
        !['jump', 'airattack', 'juggle', 'ko', 'frozen'].includes(this.state)) {
      this.vy += GRAVITY;
      this.y += this.vy;
      if (this.y >= FLOOR_Y) { this.y = FLOOR_Y; this.vy = 0; }
    }

    // wall clamp
    this.x = Math.max(WALL_PAD, Math.min(GAME_W - WALL_PAD, this.x));
  }

  // attack inputs from an actionable ground state; returns true if consumed
  tryAct(pad, fwd, back, match) {
    if (pad.bl) return false;                       // block beats buttons
    if (this.trySpecial(pad)) return true;
    if (pad.down) {
      if (pad.hpP) { this.startAttack('uppercut'); return true; }
      if (pad.lpP) { this.startAttack('clp'); return true; }
      if (pad.lkP || pad.hkP) { this.startAttack('clk'); return true; }
      return false;
    }
    if (back && pad.lkP) { this.startAttack('sweep'); return true; }
    if (pad.hpP) { this.startAttack('hp'); return true; }
    if (pad.lpP) { this.startAttack('lp'); return true; }
    if (pad.hkP) { this.startAttack('hk'); return true; }
    if (pad.lkP) { this.startAttack('lk'); return true; }
    return false;
  }

  startJump(pad) {
    this.state = 'jump';
    this.vy = JUMP_VY;
    this.vx = pad.right ? JUMP_VX : pad.left ? -JUMP_VX : 0;
    this.airAttacked = false;
    this.y -= 0.1;
    SFX.jump();
  }

  // ---- reactions (called by Match) ----
  takeHit(dmg, opts) {
    const poseAtImpact = this.spriteKey();   // frozen keeps the pose it had
    this.hp = Math.max(0, this.hp - dmg);
    this.flash = 3;
    this.attack = null;
    this.special = null;
    if (opts.launch && this.noLaunch) {      // boss: launchers just knock down
      opts = Object.assign({}, opts, { launch: null, knockdown: true });
    }
    if (this.hp <= 0 && !opts.noKO) {
      this.state = 'ko';
      this.vx = -this.facing * 2.2;
      this.vy = -3.6;
      this.pulledBy = null;
      return;
    }
    if (opts.freeze) {
      this.state = 'frozen';
      this.frozenSprite = poseAtImpact;
      this.freezeT = opts.freeze;
      this.vx = 0;
      return;
    }
    if (opts.spear) {
      this.state = 'speared';
      this.pulledBy = opts.attacker;
      this.spearStun = 70;
      this.vx = 0;
      this.vy = 0;          // if caught mid-air, the safety net drops them
      return;
    }
    if (opts.launch) {
      this.state = 'juggle';
      this.vx = -this.facing * opts.launch.vx;
      this.vy = opts.launch.vy;
      return;
    }
    // altitude-aware: a frozen (or otherwise off-the-ground) target struck
    // mid-air must fall, not snap into a grounded hitstun
    if (this.airborne || this.y < FLOOR_Y - 0.5) {
      this.state = 'juggle';
      this.vx = -this.facing * 1.4;
      this.vy = Math.min(this.vy, -2.4);
      return;
    }
    if (opts.knockdown) {
      this.state = 'juggle';
      this.vx = -this.facing * 2.0;
      this.vy = -2.6;
      return;
    }
    this.wasCrouched = this.posture() === 'crouch';
    this.state = 'hitstun';
    this.stateT = opts.hitstun || 14;
    this.vx = -this.facing * (opts.kb || 1.5);
  }

  takeBlock(chip, blockstun, kb) {
    if (chip) this.hp = Math.max(0, this.hp - chip);
    this.wasCrouched = this.isCrouchBlock();
    this.state = 'blockstun';
    this.stateT = blockstun;
    this.vx = -this.facing * kb * 0.7;
  }

  // ---- sprite selection ----
  spriteKey() {
    switch (this.state) {
      case 'idle':   return ['idle_a', 'idle_b', 'idle_c', 'idle_b'][(this.animT / 14 | 0) % 4];
      case 'walk':   return ['walk_a', 'walk_b', 'walk_c', 'walk_d'][(this.animT / 7 | 0) % 4];
      case 'crouch': return 'crouch';
      case 'block':  return 'block';
      case 'blockcrouch': return 'block_crouch';
      case 'blockstun':   return this.wasCrouched ? 'block_crouch' : 'block';
      case 'jump':   return 'jump';
      case 'airattack': return 'jump_kick';
      case 'hitstun':   return this.wasCrouched ? 'crouch' : 'hit';
      case 'juggle': case 'ko': return 'juggle';
      case 'down': case 'dead': return 'down';
      case 'getup':  return 'crouch';
      case 'frozen': return this.frozenSprite || 'hit';
      case 'speared': return 'hit';
      case 'dazed':  return 'dazed';
      case 'win':    return (this.animT / 12 | 0) % 2 ? 'win_b' : 'win';
      case 'special': {
        const sp = this.special;
        return sp ? this.animFrameKey(sp.def.anim, sp.t) : 'idle_a';
      }
      case 'attack': {
        const atk = this.attack;
        return atk ? this.animFrameKey(atk.def.anim, atk.t) : 'idle_a';
      }
    }
    return 'idle_a';
  }

  animFrameKey(anim, t) {
    let acc = 0;
    for (const [key, dur] of anim) {
      acc += dur;
      if (t < acc) return key;
    }
    return anim[anim.length - 1][0];
  }

  draw(g) {
    // vanished mid-teleport
    if (this.state === 'special' && this.special && this.special.def.vanish) {
      const [v0, v1] = this.special.def.vanish;
      if (this.special.t >= v0 && this.special.t < v1) return;
    }
    const key = this.spriteKey();
    let sheet = this.sheet;
    if (this.state === 'frozen') sheet = this.iceSheet;
    else if (this.flash > 0) sheet = this.flashSheet;
    const f = sheet[key];
    // soft ground shadow that tightens as the fighter rises
    if (this.state !== 'dead' && this.state !== 'down') {
      const air = Math.max(0, FLOOR_Y - this.y);
      const w = Math.round(Math.max(8, 20 - air / 5));
      g.fillStyle = 'rgba(0,0,0,0.35)';
      g.fillRect(Math.round(this.x) - (w >> 1), FLOOR_Y, w, 2);
      g.fillStyle = 'rgba(0,0,0,0.18)';
      g.fillRect(Math.round(this.x) - (w >> 1) - 2, FLOOR_Y, w + 4, 1);
    }
    const sway = this.state === 'dazed' ? Math.round(Math.sin(this.animT / 6) * 1.5) : 0;
    drawFrame(g, f, this.x + sway, this.y, this.facing < 0);
  }
}
