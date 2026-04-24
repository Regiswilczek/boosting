/* ══════════════════════════════════════════════════════
   boosting.tech — GSAP Animations
══════════════════════════════════════════════════════ */
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ── 1. HERO ENTRANCE ─────────────────────────────── */
(function heroEntrance() {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  // Use fromTo so the end-state (opacity:1) is explicit — prevents the
  // CSS pre-hide (opacity:0) from being read as the target and keeping
  // elements invisible forever.
  tl.fromTo(".hero-tag",
      { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
    .fromTo(".hero-word",
      { y: 70, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.9 }, "-=0.3")
    .fromTo(".hero-sub",
      { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.45")
    .fromTo(".hero-ctas",
      { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.45")
    .fromTo(".stat-chip",
      { y: 28, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 0.65 }, "-=0.4")
    .fromTo(".hero-visual",
      { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 1.2, ease: "power2.out" }, "-=1.1")
    .fromTo([".hv-rock-1", ".hv-rock-2"],
      { scale: 0.6, opacity: 0, rotation: -18 }, { scale: 1, opacity: 0.72, rotation: 0, stagger: 0.1, duration: 1.0, ease: "back.out(1.5)" }, "-=0.9")
    .fromTo([".hv-rock-3", ".hv-rock-4", ".hv-rock-5"],
      { scale: 0.65, opacity: 0, rotation: 14 }, { scale: 1, opacity: 1, rotation: 0, stagger: 0.1, duration: 1.0, ease: "back.out(1.5)" }, "-=0.7")
    .fromTo(".hv-astro",
      { xPercent: -50, yPercent: -50, scale: 0.78, opacity: 0, y: 24 },
      { xPercent: -50, yPercent: -50, scale: 1, opacity: 1, y: 0, duration: 1.2, ease: "back.out(1.2)" }, "-=0.8")
    .fromTo(".hv-badge",
      { scale: 0.75, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.14, duration: 0.6, ease: "back.out(1.4)" }, "-=0.8")
    .fromTo(".hv-code",
      { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, "-=0.4")
    .fromTo(".hv-partners",
      { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.3");
})();

/* ── 2. FLOATING BADGES (continuous) ─────────────── */
// Delay so float begins after hero entrance completes
gsap.to(".hv-badge-1", { y: -14, repeat: -1, yoyo: true, duration: 2.8, ease: "sine.inOut", delay: 2.5 });
gsap.to(".hv-badge-2", { y: -20, repeat: -1, yoyo: true, duration: 3.5, ease: "sine.inOut", delay: 3.1 });
gsap.to(".hv-badge-3", { y: -10, repeat: -1, yoyo: true, duration: 2.2, ease: "sine.inOut", delay: 3.6 });

/* ── 2b. ASTRONAUT + ASTEROID FLOAT ──────────────── */
// Delays set safely AFTER each element's entrance animation finishes:
// rocks-1/2 entrance ends ~2.6s, rocks-3/4/5 ends ~2.4s, astro ends ~3.7s
gsap.to(".hv-astro",  { y: -18, rotation:  3, repeat: -1, yoyo: true, duration: 3.4, ease: "sine.inOut", delay: 4.2 });
gsap.to(".hv-rock-1", { y: -12, rotation: -9, repeat: -1, yoyo: true, duration: 4.2, ease: "sine.inOut", delay: 3.1 });
gsap.to(".hv-rock-2", { y: -16, rotation: 12, repeat: -1, yoyo: true, duration: 3.6, ease: "sine.inOut", delay: 3.4 });
gsap.to(".hv-rock-3", { y: -10, rotation: -5, repeat: -1, yoyo: true, duration: 2.9, ease: "sine.inOut", delay: 3.5 });
gsap.to(".hv-rock-4", { y: -14, rotation:  7, repeat: -1, yoyo: true, duration: 3.8, ease: "sine.inOut", delay: 3.0 });
gsap.to(".hv-rock-5", { y:  -8, rotation:-13, repeat: -1, yoyo: true, duration: 2.6, ease: "sine.inOut", delay: 3.9 });

/* ── 2c. CODE CARD TYPEWRITER (once per page load) ── */
(function initCodeTyper() {
  const lines = document.querySelectorAll('.hv-code-line');
  if (!lines.length) return;

  // Mirrors the exact span/text structure inside each .hv-code-line
  const lineTokens = [
    [
      { cls: 'ck', text: 'const' }, { cls: '',   text: ' ' },
      { cls: 'cv', text: 'success' }, { cls: '',  text: ' = ' },
      { cls: 'cf', text: 'boosting' }, { cls: '', text: '();' },
    ],
    [{ cls: 'cc', text: '// Acelerando seu negócio' }],
    [
      { cls: 'ck', text: 'return' }, { cls: '', text: ' ' },
      { cls: 'cs', text: '"resultados"' }, { cls: '', text: ';' },
    ],
    [{ cls: 'cc', text: '// +5M linhas entregues' }],
  ];

  // Flatten tokens → [{ch, cls}, …]
  function flatChars(tokens) {
    const out = [];
    for (const tok of tokens)
      for (const ch of [...tok.text]) out.push({ ch, cls: tok.cls });
    return out;
  }

  // Rebuild innerHTML showing first `count` chars, preserving span colours
  function toHTML(chars, count) {
    let html = '', curCls = null, curText = '';
    for (let i = 0; i < Math.min(count, chars.length); i++) {
      const { ch, cls } = chars[i];
      if (cls !== curCls) {
        if (curText) html += curCls ? `<span class="${curCls}">${curText}</span>` : curText;
        curCls = cls; curText = '';
      }
      curText += ch;
    }
    if (curText) html += curCls ? `<span class="${curCls}">${curText}</span>` : curText;
    return html;
  }

  // Lock line heights so the card doesn't collapse when cleared
  lines.forEach(l => { l.style.minHeight = l.offsetHeight + 'px'; l.innerHTML = ''; });

  function typeLine(idx, cb) {
    const chars = flatChars(lineTokens[idx]);
    const line  = lines[idx];
    let n = 0;
    (function tick() {
      line.innerHTML = toHTML(chars, ++n);
      if (n < chars.length) gsap.delayedCall(0.022, tick);
      else if (cb)          gsap.delayedCall(0.12,  cb);
    })();
  }

  function typeAll(idx) {
    if (idx >= lines.length) return; // done — no loop
    typeLine(idx, () => typeAll(idx + 1));
  }

  // Fire after code card entrance finishes (~3 s into hero timeline)
  gsap.delayedCall(3.0, () => typeAll(0));
})();

/* ── 3. NAVBAR SHRINK ON SCROLL ───────────────────── */
ScrollTrigger.create({
  start: "top -50",
  end: 99999,
  toggleClass: { targets: "#navbar", className: "scrolled" }
});

/* ── 4. MARQUEE (infinite scroll) ────────────────── */
(function initMarquee() {
  const track = document.getElementById("marqueeTrack");
  if (!track) return;
  gsap.to(track, { x: "-50%", duration: 28, ease: "none", repeat: -1 });
})();

/* ── 4b. CLIENT LOGOS MARQUEE ─────────────────────── */
(function initClientMarquee() {
  const track = document.getElementById("clientTrack");
  if (!track) return;
  // 18 items total (6 × 3), animate by -33.33% = one full set, seamless loop
  // 3 sets needed so the remaining 2 sets always fill the viewport during playback
  gsap.to(track, { xPercent: -100 / 3, duration: 22, ease: "none", repeat: -1 });
  // Pause on hover
  const wrap = track.closest(".client-marquee-wrap");
  if (wrap) {
    wrap.addEventListener("mouseenter", () => gsap.getTweensOf(track)[0]?.pause());
    wrap.addEventListener("mouseleave", () => gsap.getTweensOf(track)[0]?.play());
  }
})();

/* ── 5. COUNTER ANIMATION ────────────────────────── */
function countUp(el, end, duration) {
  const obj = { val: 0 };
  gsap.to(obj, {
    val: end,
    duration: duration,
    ease: "power2.out",
    onUpdate() { el.textContent = Math.floor(obj.val).toLocaleString("pt-BR"); },
    onComplete() { el.textContent = end.toLocaleString("pt-BR"); }
  });
}

ScrollTrigger.create({
  trigger: "#empresa",
  start: "top 70%",
  once: true,
  onEnter() {
    const el = document.getElementById("mainCounter");
    if (el) countUp(el, 5000000, 2.8);
  }
});

/* Metric counters */
document.querySelectorAll(".mval[data-target]").forEach(el => {
  const target = parseInt(el.dataset.target);
  const prefix = el.dataset.prefix || "";
  const suffix = el.dataset.suffix || "";
  ScrollTrigger.create({
    trigger: el,
    start: "top 82%",
    once: true,
    onEnter() {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target, duration: 1.6, ease: "power2.out",
        onUpdate() { el.textContent = prefix + Math.floor(obj.val) + suffix; }
      });
    }
  });
});

/* ── 6. SCROLL-TRIGGERED SECTION REVEALS ─────────── */
// Generic fade-up — exclude .light-tag/.light-title (handled by processo) and .contact-anim (contact section)
gsap.utils.toArray(".section-title:not(.light-title):not(.contact-anim), .section-tag:not(.light-tag)").forEach(el => {
  gsap.from(el, {
    y: 48, opacity: 0, duration: 0.85, ease: "power3.out",
    scrollTrigger: { trigger: el, start: "top 86%", once: true }
  });
});

// Staggered children groups
const staggerGroups = [
  { selector: ".diff-cards .diff-card",  stagger: 0.09 },
  { selector: ".partner-logos .plogo",   stagger: 0.08 },
  { selector: ".ovals-wrap .oval-item",  stagger: 0.07 },
];

staggerGroups.forEach(({ selector, stagger }) => {
  const els = document.querySelectorAll(selector);
  if (!els.length) return;
  gsap.from(els, {
    y: 40, opacity: 0, stagger, duration: 0.65, ease: "power2.out",
    scrollTrigger: { trigger: els[0].closest("section") || els[0], start: "top 80%", once: true }
  });
});

// Metrics row
gsap.from(".metrics-row .metric", {
  y: 32, opacity: 0, stagger: 0.1, duration: 0.6, ease: "power2.out",
  scrollTrigger: { trigger: ".metrics-row", start: "top 80%", once: true }
});

// Segments — typewriter cycle
(function initTypewriter() {
  const typed  = document.getElementById("segTyped");
  const cursor = document.getElementById("segCursor");
  if (!typed) return;

  const words = ["Industrial", "Logística Offshore", "Saúde", "Financeiro", "Consultorias", "Entidades"];
  let idx = 0;
  let running = false;

  // Blinking cursor
  gsap.to(cursor, { opacity: 0, duration: 0.45, repeat: -1, yoyo: true, ease: "steps(1)" });

  function typeChar(word, cb) {
    let i = 0;
    (function tick() {
      typed.textContent = word.slice(0, ++i);
      if (i < word.length) gsap.delayedCall(0.065, tick);
      else gsap.delayedCall(1.4, cb);
    })();
  }

  function eraseChar(cb) {
    const word = typed.textContent;
    let i = word.length;
    (function tick() {
      typed.textContent = word.slice(0, --i);
      if (i > 0) gsap.delayedCall(0.038, tick);
      else gsap.delayedCall(0.28, cb);
    })();
  }

  function cycle() {
    typeChar(words[idx], () => {
      eraseChar(() => {
        idx = (idx + 1) % words.length;
        cycle();
      });
    });
  }

  // Section entrance + start typewriter
  gsap.fromTo(".seg-display",
    { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: "power3.out",
    scrollTrigger: { trigger: ".segments", start: "top 75%", once: true } });

  gsap.fromTo(".seg-list",
    { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out",
    scrollTrigger: { trigger: ".segments", start: "top 75%", once: true, delay: 0.4 } });

  ScrollTrigger.create({
    trigger: ".segments", start: "top 75%", once: true,
    onEnter() {
      if (running) return;
      running = true;
      gsap.delayedCall(0.5, cycle);
    }
  });
})();

// Process section — minimal timeline
ScrollTrigger.create({
  trigger: ".processo",
  start: "top 68%",
  once: true,
  onEnter() {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(".light-tag",
        { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 })
      .fromTo(".light-title",
        { y: 38, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.28")
      .fromTo(".proc-pill",
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.55, ease: "power2.out" }, "-=0.4")
      .fromTo(".proc-strip-line",
        { opacity: 0 },
        { opacity: 1, stagger: 0.1, duration: 0.3, ease: "power2.out" }, "-=0.5")
      .fromTo(".processo .btn",
        { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, "-=0.1");
  }
});

// Contact section — single timeline, all fromTo (no glitch)
ScrollTrigger.create({
  trigger: ".contact",
  start: "top 68%",
  once: true,
  onEnter() {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // --- LEFT column ---
    tl.fromTo(".contact .section-title",
        { y: 64, opacity: 0, clipPath: "inset(0 0 40% 0)" },
        { y: 0,  opacity: 1, clipPath: "inset(0 0 0% 0)", duration: 1.0 })
      .fromTo(".contact-desc",
        { y: 28, opacity: 0 },
        { y: 0,  opacity: 1, duration: 0.65 }, "-=0.62")
      .fromTo(".contact-tel",
        { y: 20, opacity: 0 },
        { y: 0,  opacity: 1, duration: 0.5 }, "-=0.42")
      .fromTo(".benefits li",
        { x: -22, opacity: 0 },
        { x: 0,   opacity: 1, stagger: 0.07, duration: 0.45, ease: "power2.out" }, "-=0.3")
      .fromTo(".step",
        { y: 26, opacity: 0, scale: 0.97 },
        { y: 0,  opacity: 1, scale: 1,  stagger: 0.11, duration: 0.5, ease: "back.out(1.4)" }, "-=0.2");

    // --- RIGHT column — arrives slightly after left starts ---
    gsap.fromTo(".contact-right",
      { x: 48, opacity: 0 },
      { x: 0,  opacity: 1, duration: 1.0, ease: "power3.out", delay: 0.2 });

    gsap.fromTo(".form-card h3",
      { y: -14, opacity: 0 },
      { y: 0,   opacity: 1, duration: 0.5, ease: "power2.out", delay: 0.55 });

    gsap.fromTo(".cform .fi",
      { y: 16, opacity: 0 },
      { y: 0,  opacity: 1, stagger: 0.055, duration: 0.4, ease: "power2.out", delay: 0.7 });

    gsap.fromTo("#submitBtn",
      { y: 12, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.42, ease: "power2.out", delay: 1.28 });
  }
});

// CTA end section — use fromTo so opacity:1 is explicit (from() can read 0→0 if CSS omits opacity)
ScrollTrigger.create({
  trigger: ".cta-end",
  start: "top 80%",
  once: true,
  onEnter() {
    gsap.fromTo(".cta-end-pre",
      { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" });
    gsap.fromTo(".cta-end-icon",
      { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.12, duration: 0.55, ease: "back.out(2)", delay: 0.1 });
    gsap.fromTo(".cta-end-h",
      { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0, ease: "power3.out", delay: 0.25 });
    gsap.fromTo(".cta-end-sub",
      { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power2.out", delay: 0.45 });
    gsap.fromTo(".cta-end-btn",
      { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, ease: "power2.out", delay: 0.6 });
    gsap.fromTo(".cta-divider, .social-btn",
      { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.5, ease: "power2.out", delay: 0.75 });
  }
});

/* ── 7. BIG LOGO PARALLAX ─────────────────────────── */
ScrollTrigger.create({
  trigger: ".cta-biglogo",
  start: "top bottom",
  end: "bottom top",
  scrub: 0.6,
  onUpdate(self) { gsap.set("#ctaBigLogo span", { x: -self.progress * 120 }); }
});

gsap.from("#ctaBigLogo span", {
  y: 60, opacity: 0, duration: 1, ease: "power3.out",
  scrollTrigger: { trigger: "#ctaBigLogo", start: "top 90%", once: true }
});

/* ── 8. DIFFERENTIALS AUTO-CYCLE ──────────────────── */
const diffCards = Array.from(document.querySelectorAll(".diff-card"));
const diffLabel = document.getElementById("diffCounterLabel");
let   diffIdx   = 0;
let   diffTimer = null;

function activateDiff(idx) {
  diffCards.forEach(c => c.classList.remove("diff-active"));
  diffCards[idx].classList.add("diff-active");
  diffIdx = idx;
  if (diffLabel) diffLabel.textContent = `0${idx + 1} // 0${diffCards.length}`;
  gsap.from(diffCards[idx], { scale: 0.96, duration: 0.4, ease: "back.out(1.5)" });
}

function startDiffCycle() {
  clearInterval(diffTimer);
  diffTimer = setInterval(() => activateDiff((diffIdx + 1) % diffCards.length), 3200);
}

activateDiff(0);
startDiffCycle();

diffCards.forEach((card, i) => {
  card.addEventListener("click", () => { activateDiff(i); startDiffCycle(); });
});

document.getElementById("diffNext")?.addEventListener("click", () => {
  activateDiff((diffIdx + 1) % diffCards.length);
  startDiffCycle();
  gsap.from("#diffNext", { scale: 0.88, duration: 0.25, ease: "back.out(2)" });
});

document.getElementById("diffPrev")?.addEventListener("click", () => {
  activateDiff((diffIdx - 1 + diffCards.length) % diffCards.length);
  startDiffCycle();
  gsap.from("#diffPrev", { scale: 0.88, duration: 0.25, ease: "back.out(2)" });
});

/* ── 9. SERVICES OVALS ────────────────────────────── */
const ovals     = Array.from(document.querySelectorAll(".oval-item"));
let   ovalIdx   = 0;
let   ovalTimer = null;

function activateOval(idx) {
  ovals.forEach(o => o.classList.remove("oval-active"));
  ovals[idx].classList.add("oval-active");
  ovalIdx = idx;
}

function startOvalCycle() {
  clearInterval(ovalTimer);
  ovalTimer = setInterval(() => activateOval((ovalIdx + 1) % ovals.length), 2600);
}

activateOval(0);
startOvalCycle();

ovals.forEach((oval, i) => {
  oval.addEventListener("mouseenter", () => { activateOval(i); clearInterval(ovalTimer); });
});

document.querySelector(".services")?.addEventListener("mouseleave", () => startOvalCycle());

/* ── 10. MOBILE MENU ──────────────────────────────── */
document.getElementById("menuToggle")?.addEventListener("click", () => {
  const navbar = document.getElementById("navbar");
  const isOpen = navbar.classList.toggle("nav-open");
  const bars   = document.querySelectorAll(".menu-toggle span");

  if (isOpen) {
    gsap.to(bars[0], { rotation: 45,  y:  7, duration: 0.25 });
    gsap.to(bars[1], { opacity: 0,          duration: 0.15 });
    gsap.to(bars[2], { rotation: -45, y: -7, duration: 0.25 });
    gsap.from(".nav-links li", { y: 10, opacity: 0, stagger: 0.06, duration: 0.3, ease: "power2.out", delay: 0.1 });
    // Position nav-right exactly below nav-center (avoids hardcoded calc approximation)
    requestAnimationFrame(() => {
      const navCenter = document.querySelector('.nav-center');
      const navRight  = document.querySelector('.nav-right');
      if (navCenter && navRight) {
        navRight.style.top = (navbar.offsetHeight + navCenter.offsetHeight) + 'px';
      }
    });
  } else {
    gsap.to(bars[0], { rotation: 0, y: 0, duration: 0.25 });
    gsap.to(bars[1], { opacity: 1,        duration: 0.15 });
    gsap.to(bars[2], { rotation: 0, y: 0, duration: 0.25 });
  }
});

/* ── 11. FORM SUBMIT FEEDBACK ─────────────────────── */
document.getElementById("cform")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const btn = document.getElementById("submitBtn");
  gsap.to(btn, { scale: 0.96, duration: 0.12, yoyo: true, repeat: 1 });
  btn.textContent      = "Enviado com sucesso!";
  btn.style.background = "#00D463";
  btn.style.color      = "#0B0F0D";
  btn.style.borderColor= "#00D463";
  setTimeout(() => {
    btn.textContent      = "Enviar";
    btn.style.background = "";
    btn.style.color      = "";
    btn.style.borderColor= "";
    this.reset();
  }, 3500);
});

/* ── 12. SMOOTH ANCHOR SCROLL ─────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", e => {
    const id     = link.getAttribute("href").slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    document.getElementById("navbar")?.classList.remove("nav-open");
    const bars = document.querySelectorAll(".menu-toggle span");
    gsap.to(bars[0], { rotation: 0, y: 0, duration: 0.25 });
    gsap.to(bars[1], { opacity: 1,        duration: 0.15 });
    gsap.to(bars[2], { rotation: 0, y: 0, duration: 0.25 });
    gsap.to(window, { scrollTo: { y: target, offsetY: 88 }, duration: 1.0, ease: "power2.inOut" });
  });
});
