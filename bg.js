/* ══════════════════════════════════════════════════════
   boosting.tech — Particle Wave Background
   Technique from DIG project, adapted to
   boosting.tech light-green palette.
══════════════════════════════════════════════════════ */
(function () {
  const PIX      = 3;
  const STEP     = 6;
  const FRAME_MS = 1000 / 30; // cap at 30 fps

  const C0 = { r: 130, g: 200, b: 165 };
  const C1 = { r: 185, g: 232, b: 207 };
  const C2 = { r: 108, g: 175, b: 148 };

  let t         = 0;
  let rafId     = null;
  let lastFrame = 0;
  let running   = false;

  /* ── Canvas ──────────────────────────────────────── */
  const cv = document.createElement('canvas');
  cv.setAttribute('aria-hidden', 'true');
  cv.style.cssText = [
    'position:fixed', 'top:0', 'left:0',
    'width:100%', 'height:100%',
    'z-index:0', 'pointer-events:none',
  ].join(';');

  document.body.insertBefore(cv, document.body.firstChild);
  const ctx = cv.getContext('2d');

  /* ── Resize — DPR-aware, debounced ──────────────── */
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    cv.width  = window.innerWidth  * dpr;
    cv.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });
  resize();

  /* ── Helpers ─────────────────────────────────────── */
  function lerp(a, b, f) {
    return {
      r: a.r + (b.r - a.r) * f,
      g: a.g + (b.g - a.g) * f,
      b: a.b + (b.b - a.b) * f,
    };
  }

  function dotColor(band, norm) {
    let c;
    if      (band < 0.40) c = lerp(C0, C1, band / 0.40);
    else if (band < 0.62) c = C1;
    else                  c = lerp(C1, C2, (band - 0.62) / 0.38);

    const lum   = 0.48 + norm * 0.52;
    const alpha = Math.min(0.22 + norm * 0.35, 0.57);
    return (
      'rgba(' +
      Math.round(c.r * lum) + ',' +
      Math.round(c.g * lum) + ',' +
      Math.round(c.b * lum) + ',' +
      alpha.toFixed(2) + ')'
    );
  }

  /* ── Draw a single frame (shared by animated + static paths) */
  function drawFrame(W, H) {
    ctx.clearRect(0, 0, W, H);
    for (let y = 0; y < H; y += STEP) {
      for (let x = 0; x < W; x += STEP) {
        const nx = x / W;
        const ny = y / H;
        const w1  = Math.sin(nx * 4.2 + ny * 2.6 + t * 0.35);
        const w2  = Math.sin(nx * 1.9 - ny * 3.4 - t * 0.22);
        const w3  = Math.cos((nx + ny) * 3.1 + t * 0.18);
        const raw = (w1 * 0.42 + w2 * 0.33 + w3 * 0.25) * 0.5 + 0.5;
        const ridge = Math.pow(1 - Math.abs(2 * raw - 1), 1.8);
        if (ridge < 0.30) continue;
        const norm = (ridge - 0.30) / 0.70;
        const band = ((nx * 0.55 + (1 - ny) * 0.45 + Math.sin(t * 0.12) * 0.04 + raw * 0.08) % 1 + 1) % 1;
        ctx.fillStyle = dotColor(band, norm);
        ctx.fillRect(x, y, PIX, PIX);
      }
    }
  }

  /* ── Animated loop ───────────────────────────────── */
  function draw(ts) {
    if (!running) return;
    rafId = requestAnimationFrame(draw);
    if (ts - lastFrame < FRAME_MS) return;
    lastFrame = ts;
    t += 0.024;
    drawFrame(window.innerWidth, window.innerHeight);
  }

  /* ── Lifecycle ───────────────────────────────────── */
  function start() {
    if (running) return;
    running   = true;
    lastFrame = 0;
    rafId     = requestAnimationFrame(draw);
  }

  function stop() {
    running = false;
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  }

  // One static frame for users who prefer reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    t = 0.5; // mid-point for a visually interesting static state
    drawFrame(window.innerWidth, window.innerHeight);
    return;
  }

  // Pause when the tab is hidden to save CPU/battery
  document.addEventListener('visibilitychange', () => {
    document.hidden ? stop() : start();
  });

  start();
}());
