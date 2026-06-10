'use strict';
// All sound is synthesized with the Web Audio API. No samples.
const SFX = (() => {
  let ctx = null, master = null;

  function ensure() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!ctx) {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.45;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // simple tone: square/saw/triangle with pitch slide + decay envelope
  function tone(freq, dur, opts) {
    if (!ensure()) return;
    opts = opts || {};
    const t0 = ctx.currentTime + (opts.delay || 0);
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = opts.type || 'square';
    o.frequency.setValueAtTime(freq, t0);
    if (opts.slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq + opts.slide), t0 + dur);
    g.gain.setValueAtTime(opts.vol || 0.25, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    o.connect(g); g.connect(master);
    o.start(t0); o.stop(t0 + dur + 0.02);
  }

  // filtered white-noise burst
  function noise(dur, opts) {
    if (!ensure()) return;
    opts = opts || {};
    const t0 = ctx.currentTime + (opts.delay || 0);
    const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = opts.filter || 'lowpass';
    f.frequency.setValueAtTime(opts.freq || 800, t0);
    if (opts.sweep) f.frequency.exponentialRampToValueAtTime(Math.max(40, (opts.freq || 800) + opts.sweep), t0 + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(opts.vol || 0.3, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t0);
  }

  return {
    unlock() { ensure(); },

    hit()      { noise(0.09, { freq: 500, vol: 0.4 }); tone(110, 0.09, { vol: 0.3, slide: -50 }); },
    heavyHit() { noise(0.16, { freq: 350, vol: 0.5 }); tone(75, 0.18, { vol: 0.4, slide: -40 }); },
    whiff()    { noise(0.07, { filter: 'bandpass', freq: 1600, sweep: -1100, vol: 0.18 }); },
    block()    { tone(220, 0.05, { vol: 0.2, type: 'square' }); noise(0.04, { freq: 1200, vol: 0.12 }); },
    jump()     { tone(160, 0.1, { vol: 0.08, slide: 120, type: 'triangle' }); },
    special()  { noise(0.25, { filter: 'bandpass', freq: 500, sweep: 1400, vol: 0.25 }); },
    freeze()   { for (let i = 0; i < 4; i++) tone(900 + i * 250, 0.1, { vol: 0.12, type: 'triangle', delay: i * 0.05 }); },
    shatter()  { noise(0.3, { filter: 'highpass', freq: 1500, vol: 0.4 }); tone(1400, 0.2, { vol: 0.15, slide: -900, type: 'triangle' }); },
    spear()    { tone(600, 0.12, { vol: 0.2, slide: -350, type: 'sawtooth' }); noise(0.1, { freq: 2500, filter: 'highpass', vol: 0.15 }); },
    teleport() { tone(700, 0.1, { vol: 0.2, slide: -500, type: 'sawtooth' }); tone(200, 0.12, { vol: 0.2, slide: 500, type: 'sawtooth', delay: 0.08 }); },
    select()   { tone(440, 0.06, { vol: 0.15 }); },
    confirm()  { tone(330, 0.07, { vol: 0.18 }); tone(495, 0.1, { vol: 0.18, delay: 0.07 }); },
    timer()    { tone(880, 0.05, { vol: 0.1 }); },
    thud()     { noise(0.2, { freq: 200, vol: 0.5 }); tone(55, 0.25, { vol: 0.4, slide: -20 }); },

    // gravelly pitched-down "announcer": one low blip per syllable
    announce(text) {
      const syll = Math.max(1, Math.round(String(text).length / 3));
      for (let i = 0; i < syll; i++) {
        const f = 95 - i * 8 + Math.random() * 10;
        tone(f, 0.16, { vol: 0.35, type: 'square', slide: -25, delay: i * 0.14 });
        tone(f * 1.5, 0.14, { vol: 0.12, type: 'sawtooth', slide: -40, delay: i * 0.14 });
      }
    },

    jingle() {
      const notes = [262, 330, 392, 523];
      notes.forEach((f, i) => tone(f, 0.16, { vol: 0.2, type: 'square', delay: i * 0.12 }));
      tone(659, 0.4, { vol: 0.2, type: 'square', delay: notes.length * 0.12 });
    },

    koSting() {
      tone(110, 0.5, { vol: 0.35, type: 'sawtooth', slide: -70 });
      noise(0.45, { freq: 300, vol: 0.35 });
    },
  };
})();
