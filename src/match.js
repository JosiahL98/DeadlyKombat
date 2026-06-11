'use strict';
// One best-2-of-3 match: round flow, hit resolution, projectiles, HUD, stage.

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

// Stage backdrops are authored as pixel art in art.js (STAGE_ART).
const STAGES = STAGE_ART;
const TRAIL_COLORS = { iceball: '#7ce0f8', spear: '#b8b8c4', ring: '#48c048' };

class Match {
  // opts: { p1, p2: char ids, mode: 'cpu'|'vs', aiLevel }
  constructor(opts) {
    this.mode = opts.mode;
    const samePal = opts.p1 === opts.p2;
    this.fighters = [
      new Fighter(opts.p1, 0, CHARACTERS[opts.p1].palette),
      new Fighter(opts.p2, 1, samePal ? CHARACTERS[opts.p2].altPalette
                                      : CHARACTERS[opts.p2].palette),
    ];
    this.ai = this.mode === 'cpu' ? new AI(opts.aiLevel == null ? 1 : opts.aiLevel) : null;
    this.particles = new ParticleSystem();
    this.projectiles = [];
    this.projSheets = bakeSheet(PROJ_FRAMES, PROJ_PALETTE, { flat: true });
    this.wins = [0, 0];
    this.round = 1;
    this.combo = [{ n: 0, show: 0 }, { n: 0, show: 0 }];
    this.hitstop = 0;
    this.shake = 0;
    this.finished = false;
    this.winnerIdx = -1;
    this.stage = STAGES[opts.stage || 0] || STAGES[0];
    this.backdrop = bakeStage(this.stage);
    this.stageAnims = (this.stage.anims || []).map(a => ({
      x: a.x, y: a.y, period: a.period,
      frames: a.order.map(k => bakeFrame(a.frames[k], a.palette, { noShade: true })),
    }));
    this.sparkSheets = {
      hit: bakeSheet(SPARK_FRAMES, SPARK_HIT_PALETTE, { noShade: true }),
      block: bakeSheet(SPARK_FRAMES, SPARK_BLOCK_PALETTE, { noShade: true }),
    };
    this.sparks = [];
    this.t = 0;
    this.finishWinner = -1;
    this.finisherFX = null;
    this.startRound();
  }

  addSpark(x, y, kind, big) {
    this.sparks.push({ x, y, kind, big: !!big, t: 0 });
  }

  startRound() {
    for (const f of this.fighters) f.resetRound();
    this.projectiles.length = 0;
    this.particles.clear();
    this.timerFrames = ROUND_TIME * 60;
    this.phase = 'intro';
    this.phaseT = 80;
    this.finishWinner = -1;
    this.finisherFX = null;
    this.banner = { text: 'ROUND ' + this.round, t: 80, scale: 3, color: '#e8e8f0' };
    SFX.announce('ROUND ' + this.round);
  }

  teleportFighter(f) {
    const foe = this.fighters[0] === f ? this.fighters[1] : this.fighters[0];
    this.particles.spark(f.x, f.y - 24, 0);
    // reappear on the far side of the opponent
    const side = f.x >= foe.x ? -1 : 1;
    f.x = Math.max(WALL_PAD + 4, Math.min(GAME_W - WALL_PAD - 4, foe.x + side * 34));
    f.facing = foe.x >= f.x ? 1 : -1;
    this.particles.spark(f.x, f.y - 24, 0);
    SFX.teleport();
  }

  hasProjectile(f) { return this.projectiles.some(p => p.owner === f); }

  spawnProjectile(owner, spDef) {
    if (this.hasProjectile(owner)) return;
    const p = spDef.proj;
    this.projectiles.push({
      owner, def: p,
      x: owner.x + owner.facing * 16,
      y: owner.y + p.y,
      vx: owner.facing * p.speed,
      t: 0, dead: false,
    });
  }

  update() {
    this.t++;                                   // free-running clock (stage anims)
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      if (++this.sparks[i].t > 8) this.sparks.splice(i, 1);
    }
    // during FINISH THEM only the winner keeps control
    const live = (i) => this.phase === 'fight' ||
                        (this.phase === 'finish' && i === this.finishWinner);
    const pads = [
      live(0) ? readPad(0) : neutralPad(),
      live(1)
        ? (this.ai ? this.ai.update(this.fighters[1], this.fighters[0], this) : readPad(1))
        : neutralPad(),
    ];

    if (this.shake > 0) this.shake--;
    if (this.hitstop > 0) { this.hitstop--; this.tickPhase(); return; }

    const [f1, f2] = this.fighters;
    f1.update(pads[0], f2, this);
    f2.update(pads[1], f1, this);
    this.pushApart(f1, f2);

    if (['fight', 'ko', 'finish'].includes(this.phase)) {
      this.resolveHits(f1, f2);
      this.resolveHits(f2, f1);
      this.updateProjectiles();
    }
    if (this.finisherFX && this.finisherFX.t > 0) {     // blood fountain
      this.finisherFX.t--;
      const t = this.finisherFX.target;
      this.particles.blood(t.x, t.y - 22, Math.random() < 0.5 ? -1 : 1, 4, 1.7);
    }
    this.particles.update();

    for (const c of this.combo) if (c.show > 0) c.show--;

    if (this.phase === 'fight') {
      this.timerFrames--;
      if (this.timerFrames <= 0) this.timeUp();
      this.checkKO();
    }
    this.tickPhase();
  }

  tickPhase() {
    if (this.banner && --this.banner.t <= 0) this.banner = null;
    this.phaseT--;
    switch (this.phase) {
      case 'intro':
        if (this.phaseT <= 0) {
          this.phase = 'fight';
          this.banner = { text: 'FIGHT!', t: 40, scale: 4, color: '#d83030', flash: true };
          SFX.announce('FIGHT');
        }
        break;
      case 'ko':
      case 'finisher': {
        // wait for the loser to hit the floor, then call the round
        const losers = this.fighters.filter(f => f.hp <= 0);
        if (losers.every(f => f.state === 'dead') && this.phaseT <= 0) {
          this.endRound();
        }
        break;
      }
      case 'finish': {
        // 4 seconds to land the finisher, or they just collapse
        if (this.phaseT <= 0) this.collapseLoser();
        break;
      }
      case 'roundend':
        if (this.phaseT <= 0) {
          if (this.wins[0] >= WINS_NEEDED || this.wins[1] >= WINS_NEEDED) {
            this.finished = true;
            this.winnerIdx = this.wins[0] >= WINS_NEEDED ? 0 : 1;
          } else {
            this.round++;
            this.startRound();
          }
        }
        break;
    }
  }

  checkKO() {
    if (this.phase !== 'ko' && this.fighters.some(f => f.state === 'ko' || f.state === 'dead')) {
      this.phase = 'ko';
      this.phaseT = 70;
      SFX.koSting();
    }
  }

  // the deciding blow lands: loser stays standing, dazed, for 4 seconds
  enterFinish(attIdx, def) {
    this.phase = 'finish';
    this.phaseT = 240;
    this.finishWinner = attIdx;
    def.finishDazed = true;
    this.banner = { text: 'FINISH THEM', t: 240, scale: 3, color: '#d83030', flash: true };
    SFX.announce('FINISH THEM');
  }

  collapseLoser() {
    const def = this.fighters[1 - this.finishWinner];
    def.finishDazed = false;
    def.state = 'ko';
    def.vx = -def.facing * 1.6;
    def.vy = -3.2;
    this.phase = 'ko';
    this.phaseT = 70;
    SFX.koSting();
  }

  // uppercut on a dazed loser: the over-the-top finisher
  startFinisher(att, def) {
    def.finishDazed = false;
    def.state = 'ko';
    def.vx = -def.facing * 2.6;
    def.vy = -7.8;
    def.flash = 4;
    this.finisherFX = { target: def, t: 55 };
    this.phase = 'finisher';
    this.phaseT = 150;
    this.hitstop = 10;
    this.shake = 18;
    this.particles.blood(def.x, def.y - 30, att.facing, 26, 2.2);
    this.banner = { text: 'ANNIHILATION!', t: 140, scale: 3, color: '#d83030', flash: true };
    SFX.heavyHit(); SFX.koSting();
    SFX.announce('ANNIHILATION');
  }

  timeUp() {
    this.banner = { text: 'TIME UP', t: 90, scale: 3, color: '#e8e8f0' };
    SFX.announce('TIME UP');
    const [f1, f2] = this.fighters;
    if (f1.hp === f2.hp) {           // dead-even: replay the round, no score
      this.phase = 'roundend';
      this.phaseT = 110;
      return;
    }
    const w = f1.hp > f2.hp ? 0 : 1;
    this.awardRound(w);
  }

  endRound() {
    const losers = this.fighters.map((f, i) => f.hp <= 0 ? i : -1).filter(i => i >= 0);
    if (losers.length === 2) {       // double KO
      this.banner = { text: 'DOUBLE KO', t: 100, scale: 3, color: '#d83030' };
      this.phase = 'roundend';
      this.phaseT = 110;
      return;
    }
    this.awardRound(losers[0] === 0 ? 1 : 0);
  }

  awardRound(w) {
    this.wins[w]++;
    const winner = this.fighters[w];
    if (winner.hp > 0) winner.state = 'win';
    this.banner = { text: this.fighters[w].char.name + ' WINS', t: 130, scale: 3, color: '#e8c838' };
    SFX.announce(this.fighters[w].char.name + ' WINS');
    if (this.wins[w] >= WINS_NEEDED) SFX.jingle();
    this.phase = 'roundend';
    this.phaseT = 140;
  }

  // ---- physics: keep grounded fighters from overlapping ----
  pushApart(a, b) {
    if (a.airborne || b.airborne) return;
    if (['down','dead','getup'].includes(a.state) || ['down','dead','getup'].includes(b.state)) return;
    const pa = a.pushbox(), pb = b.pushbox();
    if (!rectsOverlap(pa, pb)) return;
    const overlap = (pa.w + pb.w) / 2 - Math.abs(a.x - b.x);
    if (overlap <= 0) return;
    const dir = a.x <= b.x ? -1 : 1;
    a.x += dir * overlap / 2;
    b.x -= dir * overlap / 2;
    a.x = Math.max(WALL_PAD, Math.min(GAME_W - WALL_PAD, a.x));
    b.x = Math.max(WALL_PAD, Math.min(GAME_W - WALL_PAD, b.x));
    // if one is pinned to the wall, the other gives way
    if (Math.abs(a.x - b.x) < (pa.w + pb.w) / 2 - 0.5) {
      if (a.x <= WALL_PAD || a.x >= GAME_W - WALL_PAD) b.x = a.x - dir * ((pa.w + pb.w) / 2);
      else a.x = b.x + dir * ((pa.w + pb.w) / 2);
    }
  }

  // ---- melee hit resolution: att swinging at def ----
  resolveHits(att, def) {
    const hb = att.hitbox();
    if (!hb) return;
    if (!def.isVulnerable()) return;
    const hurt = def.hurtbox();
    if (!hurt || !rectsOverlap(hb, hurt)) return;

    att.attack.hasHit = true;
    const d = hb.def;
    const idx = this.fighters.indexOf(att);
    const contactX = att.x + att.facing * (d.hitbox.x + d.hitbox.w * 0.7);
    const contactY = def.y + d.hitbox.y + d.hitbox.h / 2;

    // block check: lows must be blocked crouching
    const blocked = def.isBlocking() && !(d.low && !def.isCrouchBlock());
    if (blocked) {
      def.takeBlock(0, d.blockstun, d.kb);
      this.cornerPush(att, def, d.kb);
      this.particles.spark(contactX, contactY, -def.facing);
      this.addSpark(contactX, contactY, 'block', d.heavy);
      SFX.block();
      this.hitstop = 2;
      if (d.dash) {                  // blocked dash: bounce off, punishable
        att.attack = null;
        att.state = 'hitstun';
        att.stateT = 20;
        att.vx = -att.facing * 2.6;
      }
      return;
    }

    let dmg = Math.round(d.dmg * att.dmgMul);
    let shatter = false;
    if (def.state === 'frozen') { dmg = Math.round(dmg * FROZEN_BONUS); shatter = true; }
    if (def.state === 'juggle' || (def.airborne && def.state !== 'jump' && def.state !== 'airattack')) {
      dmg = Math.max(1, Math.round(dmg * JUGGLE_SCALE));
    }

    // combo bookkeeping
    const c = this.combo[idx];
    c.n = def.inStun() ? c.n + 1 : 1;
    c.show = c.n >= 2 ? 70 : 0;

    // a hit that would decide the match doesn't KO -- it triggers FINISH THEM
    const deciding = this.wins[idx] === WINS_NEEDED - 1;
    const noKO = deciding || this.phase === 'finish';

    // finisher resolution comes before the normal reaction
    if (this.phase === 'finish' && idx === this.finishWinner) {
      if (d.key === 'uppercut') {
        this.particles.blood(contactX, contactY, att.facing, 14, 1.6);
        this.startFinisher(att, def);
        return;
      }
      if (d.knockdown || d.launch) {  // any other knockdown just ends it
        this.particles.blood(contactX, contactY, att.facing, 10, 1.2);
        SFX.heavyHit();
        this.collapseLoser();
        return;
      }
    }

    def.takeHit(dmg, {
      hitstun: d.hitstun, kb: d.kb,
      launch: d.launch, knockdown: d.knockdown,
      attacker: att, noKO,
    });
    this.cornerPush(att, def, d.kb);

    this.particles.blood(contactX, contactY, att.facing, d.heavy ? 14 : 7, d.heavy ? 1.4 : 1);
    this.addSpark(contactX, contactY, 'hit', d.heavy);
    if (shatter) { this.particles.ice(def.x, def.y - 20); SFX.shatter(); }
    else if (d.heavy) SFX.heavyHit();
    else SFX.hit();

    this.hitstop = d.heavy ? HITSTOP_HEAVY : HITSTOP_LIGHT;
    if (d.heavy) this.shake = 8;
    if (def.hp <= 0) {
      if (this.phase === 'finish') { /* stays dazed; reaction already applied */ }
      else if (deciding) this.enterFinish(idx, def);
      else this.checkKO();
    }
  }

  cornerPush(att, def, kb) {
    if (def.x <= WALL_PAD + 0.5 || def.x >= GAME_W - WALL_PAD - 0.5) {
      att.x -= att.facing * kb * 2.5;
    }
  }

  // ---- projectiles ----
  updateProjectiles() {
    for (const p of this.projectiles) {
      p.t++;
      p.x += p.vx;
      if (p.t % 2 === 0) {        // fading energy trail
        this.particles.trail(p.x - p.vx * 2, p.y + 4, TRAIL_COLORS[p.def.kind] || '#888');
      }
      if (p.x < -20 || p.x > GAME_W + 20) { p.dead = true; continue; }

      const def = this.fighters[0] === p.owner ? this.fighters[1] : this.fighters[0];
      if (!def.isVulnerable()) continue;
      const hurt = def.hurtbox();
      if (!hurt) continue;
      const box = { x: p.x - 5, y: p.y - 4, w: 10, h: 8 };
      if (!rectsOverlap(box, hurt)) continue;

      p.dead = true;
      const ownerIdx = this.fighters.indexOf(p.owner);
      const deciding = this.wins[ownerIdx] === WINS_NEEDED - 1;
      const noKO = deciding || this.phase === 'finish';

      if (def.isBlocking()) {
        def.takeBlock(p.def.chip, 14, 1.6);
        this.particles.spark(p.x, p.y, -def.facing);
        this.addSpark(p.x, p.y, 'block', false);
        SFX.block();
        if (def.hp <= 0) {                       // chip KO
          if (deciding || this.phase === 'finish') this.enterFinish(ownerIdx, def);
          else {
            def.state = 'ko'; def.vx = -def.facing * 2; def.vy = -3.5;
            this.checkKO();
          }
        }
        continue;
      }
      if (p.def.freeze) {
        if (def.state === 'frozen') continue;    // no double-freeze
        def.takeHit(0, { freeze: p.def.freeze, noKO: true });
        SFX.freeze();
        this.particles.ice(def.x, def.y - 24);
        this.comboTag(p.owner, def);
      } else if (p.def.pull) {
        def.takeHit(Math.round(p.def.dmg * p.owner.dmgMul), { spear: true, attacker: p.owner, noKO });
        SFX.spear();
        this.particles.blood(def.x, def.y - 28, p.owner.facing, 8, 1);
        this.comboTag(p.owner, def);
        if (def.hp <= 0 && !this.afterProjKill(ownerIdx, def, deciding)) continue;
      } else {
        // plain damage projectile (STRIKER's pulse ring)
        def.takeHit(Math.round(p.def.dmg * p.owner.dmgMul),
          { hitstun: p.def.hitstun || 18, kb: p.def.kb || 2, attacker: p.owner, noKO });
        SFX.hit();
        this.particles.blood(def.x, def.y - 28, Math.sign(p.vx) || 1, 8, 1);
        this.comboTag(p.owner, def);
        this.hitstop = HITSTOP_LIGHT;
        if (def.hp <= 0 && !this.afterProjKill(ownerIdx, def, deciding)) continue;
      }
    }
    // rival projectiles cancel each other out
    for (let i = 0; i < this.projectiles.length; i++) {
      for (let j = i + 1; j < this.projectiles.length; j++) {
        const a = this.projectiles[i], b = this.projectiles[j];
        if (!a.dead && !b.dead && Math.abs(a.x - b.x) < 10 && Math.abs(a.y - b.y) < 10) {
          a.dead = b.dead = true;
          this.particles.spark((a.x + b.x) / 2, a.y, 0);
          SFX.block();
        }
      }
    }
    this.projectiles = this.projectiles.filter(p => !p.dead);
  }

  comboTag(att, def) {
    const idx = this.fighters.indexOf(att);
    const c = this.combo[idx];
    c.n = def.inStun() ? c.n + 1 : 1;
    if (c.n >= 2) c.show = 70;
  }

  // a projectile dropped them to 0 hp; returns true if the round goes on
  afterProjKill(ownerIdx, def, deciding) {
    if (this.phase === 'finish') return true;            // stays dazed
    if (deciding) { this.enterFinish(ownerIdx, def); return true; }
    this.checkKO();
    return true;
  }

  // ================= drawing =================
  draw(g) {
    g.save();
    if (this.shake > 0) {
      g.translate((Math.random() * 4 - 2) | 0, (Math.random() * 3 - 1.5) | 0);
    }
    this.drawStage(g);

    // draw the fighter in hitstun first so the attacker reads on top
    const [f1, f2] = this.fighters;
    const order = f1.inStun() ? [f1, f2] : [f2, f1];
    order[0].draw(g);
    order[1].draw(g);

    this.drawProjectiles(g);
    this.particles.draw(g);
    this.drawSparks(g);
    g.restore();

    this.drawHUD(g);
    if (this.banner) this.drawBanner(g);
    if (DEBUG) this.drawDebug(g);
  }

  drawStage(g) {
    g.drawImage(this.backdrop, 0, 0);
    for (const a of this.stageAnims) {
      const f = a.frames[(this.t / a.period | 0) % a.frames.length];
      g.drawImage(f.cv, a.x, a.y);
    }
    g.fillStyle = this.stage.line;
    g.fillRect(0, FLOOR_Y, GAME_W, 2);
  }

  drawSparks(g) {
    for (const s of this.sparks) {
      const f = this.sparkSheets[s.kind][s.t < 4 ? 'spark_a' : 'spark_b'];
      const scale = s.big ? 2 : 1;
      g.drawImage(f.cv,
        Math.round(s.x) - (f.w * scale >> 1), Math.round(s.y) - (f.h * scale >> 1),
        f.w * scale, f.h * scale);
    }
  }

  drawProjectiles(g) {
    for (const p of this.projectiles) {
      let key = p.def.frames[0];
      if (p.def.frames.length > 1) key = p.def.frames[(p.t / 6 | 0) % p.def.frames.length];
      if (p.def.rope) {               // spear rope back to the thrower's hand
        g.strokeStyle = '#6a5a3a';
        g.beginPath();
        g.moveTo(Math.round(p.owner.x + p.owner.facing * 10), Math.round(p.owner.y - 28));
        g.lineTo(Math.round(p.x), Math.round(p.y));
        g.stroke();
      }
      drawFrame(g, this.projSheets[key], p.x, p.y + 4, p.vx < 0);
    }
  }

  drawHUD(g) {
    const [f1, f2] = this.fighters;
    this.drawHealthBar(g, 10, 10, 140, f1, false);
    this.drawHealthBar(g, GAME_W - 150, 10, 140, f2, true);
    // timer
    const sec = Math.max(0, Math.ceil(this.timerFrames / 60));
    g.fillStyle = '#000';
    g.fillRect(GAME_W / 2 - 12, 7, 24, 14);
    drawText(g, String(sec).padStart(2, '0'), GAME_W / 2, 9, 2, sec <= 10 ? '#d83030' : '#e8e8f0', 'center');
    // round win pips
    for (let i = 0; i < WINS_NEEDED; i++) {
      g.fillStyle = i < this.wins[0] ? '#e8c838' : '#3a3a44';
      g.fillRect(12 + i * 8, 22, 5, 5);
      g.fillStyle = i < this.wins[1] ? '#e8c838' : '#3a3a44';
      g.fillRect(GAME_W - 17 - i * 8, 22, 5, 5);
    }
    // combo counters
    if (this.combo[0].show > 0) drawText(g, this.combo[0].n + ' HITS', 14, 40, 2, '#e8c838');
    if (this.combo[1].show > 0) drawText(g, this.combo[1].n + ' HITS', GAME_W - 14, 40, 2, '#e8c838', 'right');
  }

  drawHealthBar(g, x, y, w, f, rightAlign) {
    g.fillStyle = '#e8e8f0';
    g.fillRect(x - 1, y - 1, w + 2, 10);
    g.fillStyle = '#5a1010';
    g.fillRect(x, y, w, 8);
    const fillW = Math.round(w * f.hp / MAX_HP);
    g.fillStyle = f.hp <= 25 ? '#c83030' : '#3c9c44';
    if (rightAlign) g.fillRect(x + w - fillW, y, fillW, 8);
    else g.fillRect(x, y, fillW, 8);
    drawText(g, f.char.name, rightAlign ? x + w - 3 : x + 3, y + 2, 1, '#0d0a14', rightAlign ? 'right' : 'left');
  }

  drawBanner(g) {
    const b = this.banner;
    let color = b.color;
    if (b.flash && (b.t / 4 | 0) % 2) color = '#e8e8f0';
    drawText(g, b.text, GAME_W / 2 + 1, 71, b.scale, '#0d0a14', 'center');
    drawText(g, b.text, GAME_W / 2, 70, b.scale, color, 'center');
  }

  drawDebug(g) {
    for (const f of this.fighters) {
      const hurt = f.hurtbox();
      if (hurt) { g.strokeStyle = '#30d850'; g.strokeRect(hurt.x, hurt.y, hurt.w, hurt.h); }
      const push = f.pushbox();
      g.strokeStyle = '#3080d8'; g.strokeRect(push.x, push.y, push.w, push.h);
      const hit = f.hitbox();
      if (hit) { g.strokeStyle = '#d83030'; g.strokeRect(hit.x, hit.y, hit.w, hit.h); }
    }
    const [f1, f2] = this.fighters;
    const info = (f) => f.state +
      (f.attack ? ' ' + f.attack.def.name + ' t' + f.attack.t + '/' + f.attack.total : '');
    drawText(g, info(f1), 10, GAME_H - 26, 1, '#30d850');
    drawText(g, info(f2), GAME_W - 10, GAME_H - 26, 1, '#30d850', 'right');
    drawText(g, 'HITSTOP ' + this.hitstop + ' PHASE ' + this.phase, 10, GAME_H - 18, 1, '#30d850');
  }
}
