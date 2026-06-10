'use strict';
// Keyboard state. `held` tracks keys currently down; `hit` tracks keys pressed
// since the last logic frame consumed them (edge detection).
const Input = {
  held: {},
  hit: {},

  init() {
    window.addEventListener('keydown', (e) => {
      if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'].includes(e.code)) e.preventDefault();
      if (!e.repeat) {
        Input.held[e.code] = true;
        Input.hit[e.code] = true;
      }
      SFX.unlock();
      if (e.code === 'Backquote') DEBUG = !DEBUG;
    });
    window.addEventListener('keyup', (e) => { Input.held[e.code] = false; });
    window.addEventListener('blur', () => { Input.held = {}; });
  },

  endFrame() { Input.hit = {}; },
};

// Player key maps. Layout mirrors an arcade panel:
//   top row = high punch / high kick, bottom row = low punch / low kick, then block.
const PAD_MAPS = [
  { left:'KeyA', right:'KeyD', up:'KeyW', down:'KeyS',
    hp:'KeyR', hk:'KeyT', lp:'KeyF', lk:'KeyG', bl:'KeyH' },
  { left:'ArrowLeft', right:'ArrowRight', up:'ArrowUp', down:'ArrowDown',
    hp:'KeyU', hk:'KeyI', lp:'KeyJ', lk:'KeyK', bl:'KeyL' },
];

// Build the abstract pad a Fighter consumes. AI builds the same shape.
function readPad(idx) {
  const m = PAD_MAPS[idx];
  return {
    left:  !!Input.held[m.left],
    right: !!Input.held[m.right],
    up:    !!Input.held[m.up],
    down:  !!Input.held[m.down],
    bl:    !!Input.held[m.bl],
    hpP:   !!Input.hit[m.hp],
    lpP:   !!Input.hit[m.lp],
    hkP:   !!Input.hit[m.hk],
    lkP:   !!Input.hit[m.lk],
    special: null,   // AI shortcut: name of special to perform
  };
}

function neutralPad() {
  return { left:false, right:false, up:false, down:false, bl:false,
           hpP:false, lpP:false, hkP:false, lkP:false, special:null };
}
