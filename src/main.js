'use strict';
// Boot + fixed-timestep loop: logic always steps at 60fps regardless of
// display refresh; rendering happens once per animation frame.

(function boot() {
  const canvas = document.getElementById('game');
  const g = canvas.getContext('2d');
  g.imageSmoothingEnabled = false;

  Input.init();
  setScreen(new TitleScreen());

  const STEP = 1000 / 60;
  let last = performance.now();
  let acc = 0;

  function frame(now) {
    acc += now - last;
    last = now;
    if (acc > 250) acc = 250;            // tab-switch panic cap
    while (acc >= STEP) {
      currentScreen.update();
      Input.endFrame();                  // consume edge-triggered presses
      acc -= STEP;
    }
    g.imageSmoothingEnabled = false;
    currentScreen.draw(g);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
