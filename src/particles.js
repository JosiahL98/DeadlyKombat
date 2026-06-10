'use strict';
// Chunky pixel particles: blood on hits, gray sparks on blocks, ice shards.
const BLOOD_COLORS = ['#b01818', '#8a1212', '#d83030'];
const SPARK_COLORS = ['#c8c8d0', '#8a8a96'];
const ICE_COLORS   = ['#a8e0f4', '#7ce0f8', '#ffffff'];

class ParticleSystem {
  constructor() { this.list = []; }

  burst(x, y, dir, n, colors, power) {
    for (let i = 0; i < n; i++) {
      this.list.push({
        x, y,
        vx: dir * (0.5 + Math.random() * 2.2) * power + (Math.random() - 0.5),
        vy: -(0.5 + Math.random() * 2.6) * power,
        size: Math.random() < 0.3 ? 3 : 2,
        color: colors[(Math.random() * colors.length) | 0],
        life: 90 + Math.random() * 60,
        grounded: false,
      });
    }
  }

  blood(x, y, dir, n, power) { this.burst(x, y, dir, n, BLOOD_COLORS, power || 1); }
  spark(x, y, dir)          { this.burst(x, y, dir, 4, SPARK_COLORS, 0.7); }
  ice(x, y)                 { this.burst(x, y, 0, 14, ICE_COLORS, 1.2); }

  update() {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const p = this.list[i];
      p.life--;
      if (p.life <= 0) { this.list.splice(i, 1); continue; }
      if (!p.grounded) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += GRAVITY * 0.9;
        if (p.y >= FLOOR_Y) {      // blood pools on the floor for a moment
          p.y = FLOOR_Y;
          p.grounded = true;
          p.life = Math.min(p.life, 50 + Math.random() * 40);
        }
      }
    }
  }

  draw(g) {
    for (const p of this.list) {
      g.fillStyle = p.color;
      const s = p.grounded ? 2 : p.size;
      g.fillRect(Math.round(p.x), Math.round(p.y) - (p.grounded ? 1 : 0), s, p.grounded ? 1 : s);
    }
  }

  clear() { this.list.length = 0; }
}
