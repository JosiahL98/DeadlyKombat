'use strict';
// Screen flow:
//   title -> select -> fight -> victory (vs modes)
//   title -> select -> ladder -> fight -> ladder ... -> ending
//                                  \-> continue -> fight | game over
// Each screen: { update(), draw(g) }. setScreen() swaps them.

let currentScreen = null;
function setScreen(s) { currentScreen = s; }

function bakePortrait(charId) {
  const p = PORTRAIT_ART[charId];
  return bakeFrame(p.frame, p.palette, { flat: true });
}

function shuffled(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---------------- TITLE ----------------
class TitleScreen {
  constructor() {
    this.t = 0;
    this.cursor = 0;
    this.options = ['TOURNAMENT', 'VS CPU', '2 PLAYERS'];
  }

  update() {
    this.t++;
    const n = this.options.length;
    if (Input.hit['ArrowUp'] || Input.hit['KeyW']) { this.cursor = (this.cursor + n - 1) % n; SFX.select(); }
    if (Input.hit['ArrowDown'] || Input.hit['KeyS']) { this.cursor = (this.cursor + 1) % n; SFX.select(); }
    if (Input.hit['Enter'] || Input.hit['Space']) {
      SFX.confirm();
      const mode = ['ladder', 'cpu', 'vs'][this.cursor];
      setScreen(new SelectScreen(mode));
    }
  }

  draw(g) {
    g.fillStyle = '#0d0a14';
    g.fillRect(0, 0, GAME_W, GAME_H);
    // dim moon backdrop
    g.fillStyle = '#1c1730';
    g.fillRect(GAME_W / 2 - 60, 14, 120, 60);

    drawText(g, 'DEADLY', GAME_W / 2 + 2, 24, 5, '#3a0d0d', 'center');
    drawText(g, 'DEADLY', GAME_W / 2, 22, 5, '#c83030', 'center');
    drawText(g, 'KOMBAT', GAME_W / 2 + 2, 56, 5, '#3a3a10', 'center');
    drawText(g, 'KOMBAT', GAME_W / 2, 54, 5, '#e8c838', 'center');
    drawText(g, 'A TOURNAMENT TO THE END', GAME_W / 2, 86, 1, '#8a8a96', 'center');

    for (let i = 0; i < this.options.length; i++) {
      const sel = i === this.cursor;
      drawText(g, this.options[i], GAME_W / 2, 104 + i * 13, 2, sel ? '#e8e8f0' : '#5a5a66', 'center');
      if (sel && (this.t / 16 | 0) % 2 === 0) {
        drawText(g, '>', GAME_W / 2 - textWidth(this.options[i], 2) / 2 - 12, 104 + i * 13, 2, '#c83030');
      }
    }

    drawText(g, 'P1: WASD MOVE  R/T HI PUNCH/KICK  F/G LO PUNCH/KICK  H BLOCK', GAME_W / 2, 152, 1, '#6f6f7a', 'center');
    drawText(g, 'P2: ARROWS     U/I HI PUNCH/KICK  J/K LO PUNCH/KICK  L BLOCK', GAME_W / 2, 162, 1, '#6f6f7a', 'center');
    drawText(g, 'DOWN+HIGH PUNCH = UPPERCUT   BACK+LOW KICK = SWEEP', GAME_W / 2, 176, 1, '#4a4a56', 'center');
    drawText(g, 'P: PAUSE   FINISH THEM WITH AN UPPERCUT', GAME_W / 2, 188, 1, '#5a1818', 'center');
  }
}

// ---------------- FIGHTER SELECT ----------------
const DIFFICULTY_NAMES = ['EASY', 'NORMAL', 'HARD'];
let lastDifficulty = 1;               // remembered across rematches
const SELECT_COLS = 6;                // select grid: 2 rows of 6

class SelectScreen {
  constructor(mode) {
    this.mode = mode;                 // 'ladder' | 'cpu' | 'vs'
    this.difficulty = lastDifficulty;
    this.slots = ROSTER.slice();
    this.cursor = [0, 1];
    this.picked = [null, null];
    this.picking = 0;                 // whose turn (0, then 1 in vs mode)
    this.t = 0;
    this.portraits = {};
    for (const id of ROSTER) this.portraits[id] = bakePortrait(id);
  }

  moveCursor(d) {
    const p = this.picking;
    this.cursor[p] = (this.cursor[p] + d + this.slots.length) % this.slots.length;
    SFX.select();
  }

  update() {
    this.t++;
    if (Input.hit['Escape']) { setScreen(new TitleScreen()); return; }
    if (this.mode === 'cpu') {
      const n = DIFFICULTY_NAMES.length;
      if (Input.hit['KeyE']) { this.difficulty = (this.difficulty + 1) % n; SFX.select(); }
      if (Input.hit['KeyQ']) { this.difficulty = (this.difficulty + n - 1) % n; SFX.select(); }
      lastDifficulty = this.difficulty;
    }
    const p = this.picking;
    const maps = p === 0
      ? ['KeyA', 'KeyD', 'KeyW', 'KeyS', 'Enter']
      : ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter'];
    // either player can also confirm with their own attack buttons
    const confirm = Input.hit[maps[4]] || Input.hit['Space'] ||
      (p === 0 ? Input.hit['KeyF'] || Input.hit['KeyR'] : Input.hit['KeyJ'] || Input.hit['KeyU']);

    if (Input.hit[maps[0]]) this.moveCursor(-1);
    if (Input.hit[maps[1]]) this.moveCursor(1);
    if (Input.hit[maps[2]]) this.moveCursor(-SELECT_COLS);
    if (Input.hit[maps[3]]) this.moveCursor(SELECT_COLS);

    if (confirm) {
      SFX.confirm();
      this.picked[p] = this.slots[this.cursor[p]];
      if (this.mode === 'vs' && p === 0) {
        this.picking = 1;
        return;
      }
      if (this.mode === 'ladder') {
        const ladder = {
          player: this.picked[0],
          rungs: shuffled(ROSTER).concat([BOSS_ID]),
          idx: 0,
          stageOffset: (Math.random() * 6) | 0,   // vary arena order per run
        };
        setScreen(new LadderScreen(ladder));
        return;
      }
      if (this.mode === 'cpu') {
        this.picked[1] = ROSTER[(Math.random() * ROSTER.length) | 0];
      }
      setScreen(new FightScreen({
        p1: this.picked[0], p2: this.picked[1],
        mode: 'cpu' === this.mode ? 'cpu' : 'vs',
        aiLevel: this.difficulty,
        stage: (Math.random() * STAGES.length) | 0,
      }));
    }
  }

  draw(g) {
    g.fillStyle = '#0d0a14';
    g.fillRect(0, 0, GAME_W, GAME_H);
    drawText(g, 'CHOOSE YOUR FIGHTER', GAME_W / 2, 8, 2, '#c83030', 'center');

    // 2 rows of 6; A/D wrap through all slots, W/S hop between rows
    const cols = SELECT_COLS, cellW = 40, cellH = 48, gap = 8, rowStride = cellH + 16;
    const total = cols * cellW + (cols - 1) * gap;
    const x0 = (GAME_W - total) / 2, y0 = 24;

    for (let i = 0; i < this.slots.length; i++) {
      const x = x0 + (i % cols) * (cellW + gap);
      const y = y0 + (i / cols | 0) * rowStride;
      const id = this.slots[i];
      g.fillStyle = '#1c1726';
      g.fillRect(x, y, cellW, cellH);
      const pf = this.portraits[id];
      g.drawImage(pf.cv, x + ((cellW - pf.w * 2) >> 1), y + 4, pf.w * 2, pf.h * 2);
      drawText(g, CHARACTERS[id].name, x + cellW / 2, y + cellH + 5, 1, '#e8e8f0', 'center');
      // cursors
      const blink = (this.t / 10 | 0) % 2 === 0;
      if (this.cursor[0] === i && (this.picking === 0 ? blink : this.picked[0])) {
        g.strokeStyle = '#3e9cd8'; g.strokeRect(x - 2, y - 2, cellW + 4, cellH + 4);
      }
      if (this.mode === 'vs' && this.picking === 1 && this.cursor[1] === i && blink) {
        g.strokeStyle = '#c87a1e'; g.strokeRect(x - 4, y - 4, cellW + 8, cellH + 8);
      }
    }

    const sel = this.slots[this.cursor[this.picking]];
    if (sel) {
      drawText(g, CHARACTERS[sel].tagline, GAME_W / 2, 152, 1, '#8a8a96', 'center');
      CHARACTERS[sel].moveHint.forEach((line, i) => {
        drawText(g, line, GAME_W / 2, 162 + i * 9, 1, '#6f6f7a', 'center');
      });
    }
    const who = this.mode === 'vs' ? 'PLAYER ' + (this.picking + 1) + ' SELECT' : 'SELECT: A/D/W/S + ENTER';
    drawText(g, who, GAME_W / 2, 182, 1, '#e8c838', 'center');
    if (this.mode === 'cpu') {
      drawText(g, 'DIFF: ' + DIFFICULTY_NAMES[this.difficulty] + ' (Q/E)',
        GAME_W - 6, 182, 1, '#8a8a96', 'right');
    }
    drawText(g, 'ESC: BACK', 6, 182, 1, '#4a4a56');
  }
}

// ---------------- TOURNAMENT LADDER ----------------
class LadderScreen {
  constructor(ladder) {
    this.ladder = ladder;
    this.t = 0;
    this.portraits = {};
    for (const id of ladder.rungs) {
      if (!this.portraits[id]) this.portraits[id] = bakePortrait(id);
    }
    this.playerPortrait = bakePortrait(ladder.player);
  }

  update() {
    this.t++;
    if (Input.hit['Escape']) { setScreen(new TitleScreen()); return; }
    if (Input.hit['Enter'] || Input.hit['Space']) {
      SFX.confirm();
      const lad = this.ladder;
      setScreen(new FightScreen({
        p1: lad.player,
        p2: lad.rungs[lad.idx],
        mode: 'cpu',
        aiLevel: LADDER_AI_LEVELS[Math.min(lad.idx, LADDER_AI_LEVELS.length - 1)],
        ladder: lad,
        // the pit (stage 1) is the boss arena; others rotate through the rest
        stage: lad.idx === lad.rungs.length - 1
          ? 1
          : [0, 2, 3, 4, 5, 6][(lad.idx + (lad.stageOffset || 0)) % 6],
      }));
    }
  }

  draw(g) {
    g.fillStyle = '#0d0a14';
    g.fillRect(0, 0, GAME_W, GAME_H);
    drawText(g, 'THE TOURNAMENT', GAME_W / 2, 12, 2, '#c83030', 'center');

    const lad = this.ladder;
    // tower of opponents in two columns: climb the left, then the right
    const colRungs = 7;
    for (let i = 0; i < lad.rungs.length; i++) {
      const id = lad.rungs[i];
      const isBoss = id === BOSS_ID;
      const y = 158 - (i % colRungs) * 17;
      const x = GAME_W / 2 - 102 + ((i / colRungs) | 0) * 108;
      const beaten = i < lad.idx;
      const current = i === lad.idx;
      g.fillStyle = current ? '#241c30' : '#16121e';
      g.fillRect(x, y, 96, 15);
      const pf = this.portraits[id];
      g.globalAlpha = beaten ? 0.3 : 1;
      g.drawImage(pf.cv, x + 1, y + 1, 13, 13);
      drawText(g, CHARACTERS[id].name, x + 18, y + 5, 1,
        beaten ? '#4a4a56' : isBoss ? '#c83030' : '#e8e8f0');
      g.globalAlpha = 1;
      if (beaten) drawText(g, 'X', x + 88, y + 5, 1, '#7a1010');
      if (current && (this.t / 12 | 0) % 2 === 0) {
        drawText(g, '>', x - 12, y + 4, 2, '#e8c838');
      }
    }

    // your fighter, bottom left
    g.drawImage(this.playerPortrait.cv, 18, 150, 30, 30);
    drawText(g, 'YOU:', 18, 138, 1, '#8a8a96');
    drawText(g, CHARACTERS[lad.player].name, 18, 184, 1, '#e8c838');

    drawText(g, 'NEXT: ' + CHARACTERS[lad.rungs[lad.idx]].name, GAME_W - 14, 178, 1, '#e8e8f0', 'right');
    if ((this.t / 20 | 0) % 2 === 0) {
      drawText(g, 'ENTER: FIGHT', GAME_W - 14, 189, 1, '#e8c838', 'right');
    }
    drawText(g, 'ESC: QUIT', GAME_W / 2, 189, 1, '#4a4a56', 'center');
  }
}

// ---------------- FIGHT (wraps Match) ----------------
class FightScreen {
  constructor(opts) {
    this.match = new Match(opts);
    this.opts = opts;
    this.paused = false;
    this.endT = 0;
  }

  update() {
    if (Input.hit['KeyP']) this.paused = !this.paused;
    if (this.paused) {
      if (Input.hit['Escape']) setScreen(new TitleScreen());
      return;
    }
    this.match.update();
    if (this.match.finished) {
      this.endT++;
      if (this.endT > 30) {
        const lad = this.opts.ladder;
        if (lad) {
          if (this.match.winnerIdx === 0) {
            lad.idx++;
            if (lad.idx >= lad.rungs.length) setScreen(new EndingScreen(lad));
            else setScreen(new LadderScreen(lad));
          } else {
            setScreen(new ContinueScreen(this.opts));
          }
        } else {
          setScreen(new VictoryScreen(this.match, this.opts));
        }
      }
    }
  }

  draw(g) {
    this.match.draw(g);
    if (this.paused) {
      g.fillStyle = 'rgba(0,0,0,0.6)';
      g.fillRect(0, 0, GAME_W, GAME_H);
      drawText(g, 'PAUSED', GAME_W / 2, 90, 3, '#e8e8f0', 'center');
      drawText(g, 'P: RESUME   ESC: QUIT', GAME_W / 2, 116, 1, '#8a8a96', 'center');
    }
  }
}

// ---------------- CONTINUE (ladder loss) ----------------
class ContinueScreen {
  constructor(fightOpts) {
    this.opts = fightOpts;
    this.frames = 0;
    this.lastSec = 10;
  }

  update() {
    this.frames++;
    const sec = 9 - (this.frames / 60 | 0);
    if (sec !== this.lastSec && sec >= 0) { this.lastSec = sec; SFX.timer(); }
    if (Input.hit['Enter'] || Input.hit['Space']) {
      SFX.confirm();
      setScreen(new FightScreen(this.opts));   // same rung, fresh match
      return;
    }
    if (sec < 0 || Input.hit['Escape']) setScreen(new GameOverScreen());
  }

  draw(g) {
    g.fillStyle = '#0d0a14';
    g.fillRect(0, 0, GAME_W, GAME_H);
    drawText(g, 'CONTINUE?', GAME_W / 2, 48, 3, '#c83030', 'center');
    const sec = Math.max(0, 9 - (this.frames / 60 | 0));
    drawText(g, String(sec), GAME_W / 2, 84, 6, '#e8e8f0', 'center');
    drawText(g, 'ENTER: CONTINUE   ESC: GIVE UP', GAME_W / 2, 150, 1, '#8a8a96', 'center');
  }
}

class GameOverScreen {
  constructor() { this.t = 0; SFX.koSting(); }

  update() {
    this.t++;
    if (this.t > 60 && (Input.hit['Enter'] || Input.hit['Space'] || Input.hit['Escape'])) {
      setScreen(new TitleScreen());
    }
    if (this.t > 300) setScreen(new TitleScreen());
  }

  draw(g) {
    g.fillStyle = '#000';
    g.fillRect(0, 0, GAME_W, GAME_H);
    drawText(g, 'GAME OVER', GAME_W / 2, 88, 4, '#7a1010', 'center');
  }
}

// ---------------- ENDING (ladder complete) ----------------
class EndingScreen {
  constructor(ladder) {
    this.ladder = ladder;
    this.t = 0;
    this.fighter = new Fighter(ladder.player, 0, CHARACTERS[ladder.player].palette);
    this.fighter.state = 'win';
    SFX.jingle();
  }

  update() {
    this.t++;
    if (this.t > 90 && (Input.hit['Enter'] || Input.hit['Space'] || Input.hit['Escape'])) {
      setScreen(new TitleScreen());
    }
  }

  draw(g) {
    g.fillStyle = '#0d0a14';
    g.fillRect(0, 0, GAME_W, GAME_H);
    const name = CHARACTERS[this.ladder.player].name;
    drawText(g, 'GORRUK HAS FALLEN', GAME_W / 2, 24, 2, '#c83030', 'center');
    const f = this.fighter.sheet['win'];
    g.drawImage(f.cv, GAME_W / 2 - f.w, 52, f.w * 2, f.h * 2);
    drawText(g, name + ' IS THE', GAME_W / 2, 148, 2, '#e8e8f0', 'center');
    drawText(g, 'GRAND CHAMPION', GAME_W / 2, 162, 2, '#e8c838', 'center');
    if (this.t > 90 && (this.t / 20 | 0) % 2 === 0) {
      drawText(g, 'ENTER: TITLE', GAME_W / 2, 186, 1, '#8a8a96', 'center');
    }
  }
}

// ---------------- VICTORY (vs modes) ----------------
class VictoryScreen {
  constructor(match, opts) {
    this.winner = match.fighters[match.winnerIdx];
    this.opts = opts;
    this.t = 0;
  }

  update() {
    this.t++;
    if (Input.hit['Enter'] || Input.hit['Space']) {
      SFX.confirm();
      setScreen(new SelectScreen(this.opts.mode));
    }
    if (Input.hit['Escape']) setScreen(new TitleScreen());
  }

  draw(g) {
    g.fillStyle = '#0d0a14';
    g.fillRect(0, 0, GAME_W, GAME_H);
    const f = this.winner.sheet['win'];
    g.imageSmoothingEnabled = false;
    g.drawImage(f.cv, GAME_W / 2 - f.w, 50, f.w * 2, f.h * 2);
    drawText(g, this.winner.char.name + ' WINS', GAME_W / 2, 24, 3, '#e8c838', 'center');
    if ((this.t / 20 | 0) % 2 === 0) {
      drawText(g, 'ENTER: REMATCH   ESC: TITLE', GAME_W / 2, 172, 1, '#e8e8f0', 'center');
    }
  }
}
