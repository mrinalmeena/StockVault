/* ======== CONFIG ======== */
const API_KEY = "O8O0V30YW2WX1KRG";
const API_BASE = "https://www.alphavantage.co/query";
const CACHE_TTL = 15 * 60 * 1000;

/* ======== DOM REFS ======== */
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const authPage = $("#authPage"), dashPage = $("#dashPage");
const loginForm = $("#loginForm"), signupForm = $("#signupForm");
const loginTab = $("#loginTab"), signupTab = $("#signupTab");
const holdingsBody = $("#holdingsBody"), emptyState = $("#emptyState");
const spinner = $("#spinner"), errorBanner = $("#errorBanner"), errorText = $("#errorText");

/* ========================================================
   CURSOR GLOW — soft blue starlight follows mouse
   ======================================================== */
const cursorGlow = document.createElement("div");
cursorGlow.className = "cursor-glow";
document.body.appendChild(cursorGlow);

let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorGlow.classList.add("visible");
});
document.addEventListener("mouseleave", () => cursorGlow.classList.remove("visible"));

(function animateGlow() {
  glowX += (mouseX - glowX) * 0.08;
  glowY += (mouseY - glowY) * 0.08;
  cursorGlow.style.left = glowX + "px";
  cursorGlow.style.top = glowY + "px";
  requestAnimationFrame(animateGlow);
})();

/* ========================================================
   STARFIELD CANVAS — hundreds of stars with parallax
   ======================================================== */
(function initStarfield() {
  const canvas = document.createElement("canvas");
  canvas.id = "starCanvas";
  document.body.prepend(canvas);
  const ctx = canvas.getContext("2d");

  let W, H;
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  // Create star layers (3 depths)
  const layers = [
    { count: 200, speed: 0.15, sizeMin: 0.3, sizeMax: 1.2, parallax: 0.02, stars: [] },
    { count: 120, speed: 0.3,  sizeMin: 0.8, sizeMax: 1.8, parallax: 0.04, stars: [] },
    { count: 50,  speed: 0.5,  sizeMin: 1.2, sizeMax: 2.5, parallax: 0.07, stars: [] },
  ];

  const starColors = [
    "rgba(170,210,150,", "rgba(190,220,170,", "rgba(150,200,130,",
    "rgba(210,230,190,", "rgba(140,190,120,", "rgba(180,215,160,"
  ];

  layers.forEach(layer => {
    for (let i = 0; i < layer.count; i++) {
      layer.stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        size: layer.sizeMin + Math.random() * (layer.sizeMax - layer.sizeMin),
        twinkleSpeed: 0.5 + Math.random() * 2,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      });
    }
  });

  // Cursor offset for parallax
  let cx = 0, cy = 0;
  document.addEventListener("mousemove", (e) => {
    cx = (e.clientX / W - 0.5) * 2;
    cy = (e.clientY / H - 0.5) * 2;
  });

  function drawStars() {
    ctx.clearRect(0, 0, W, H);
    const t = Date.now() * 0.001;

    layers.forEach(layer => {
      const px = cx * layer.parallax * W;
      const py = cy * layer.parallax * H;

      layer.stars.forEach(star => {
        const twinkle = 0.3 + 0.7 * ((Math.sin(t * star.twinkleSpeed + star.twinkleOffset) + 1) / 2);
        const sx = ((star.x + px) % W + W) % W;
        const sy = ((star.y + py) % H + H) % H;

        ctx.beginPath();
        ctx.arc(sx, sy, star.size * twinkle, 0, Math.PI * 2);
        ctx.fillStyle = star.color + twinkle.toFixed(2) + ")";
        ctx.fill();

        // Add glow to bigger stars
        if (star.size > 1.5) {
          ctx.beginPath();
          ctx.arc(sx, sy, star.size * 3 * twinkle, 0, Math.PI * 2);
          ctx.fillStyle = star.color + (twinkle * 0.08).toFixed(3) + ")";
          ctx.fill();
        }
      });
    });
    requestAnimationFrame(drawStars);
  }
  drawStars();
})();

/* ========================================================
   FLOATING SPIRAL GALAXY — rendered on canvas, cursor-reactive
   ======================================================== */
(function initGalaxy() {
  const canvas = document.createElement("canvas");
  canvas.id = "galaxyCanvas";
  const SIZE = 500;
  canvas.width = SIZE;
  canvas.height = SIZE;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  // Galaxy parameters
  const arms = 3;
  const starsPerArm = 180;
  const armSpread = 0.6;
  const coreRadius = 15;

  // Pre-generate galaxy star positions
  const galaxyStars = [];
  for (let a = 0; a < arms; a++) {
    const armAngle = (a / arms) * Math.PI * 2;
    for (let i = 0; i < starsPerArm; i++) {
      const t = i / starsPerArm;
      const dist = coreRadius + t * (SIZE * 0.38);
      const angle = armAngle + t * 4.5 + (Math.random() - 0.5) * armSpread;
      const scatter = (Math.random() - 0.5) * dist * 0.18;
      const x = Math.cos(angle) * (dist + scatter);
      const y = Math.sin(angle) * (dist + scatter);
      const brightness = 0.2 + (1 - t) * 0.8;
      const size = 0.4 + Math.random() * (1 - t) * 2;
      // Olive-green tinted colors
      const colorIdx = Math.random();
      let color;
      if (colorIdx < 0.4) color = `rgba(120,170,90,`;          // soft olive
      else if (colorIdx < 0.65) color = `rgba(90,140,70,`;     // mid olive
      else if (colorIdx < 0.8) color = `rgba(160,200,120,`;    // light olive
      else if (colorIdx < 0.9) color = `rgba(200,225,170,`;    // pale green
      else color = `rgba(110,160,85,`;                         // sage green
      galaxyStars.push({ x, y, size, brightness, color, twinkleOff: Math.random() * Math.PI * 2 });
    }
  }
  // Core glow stars
  for (let i = 0; i < 80; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * coreRadius * 2;
    galaxyStars.push({
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      size: 0.5 + Math.random() * 1.5,
      brightness: 0.6 + Math.random() * 0.4,
      color: `rgba(180,210,150,`,
      twinkleOff: Math.random() * Math.PI * 2,
    });
  }

  // Galaxy floating position & cursor tracking
  let gBaseX = window.innerWidth * 0.7;
  let gBaseY = window.innerHeight * 0.35;
  let gCursorX = 0, gCursorY = 0;
  let gDriftAngle = 0;

  document.addEventListener("mousemove", (e) => {
    gCursorX = (e.clientX / window.innerWidth - 0.5) * 40;
    gCursorY = (e.clientY / window.innerHeight - 0.5) * 30;
  });

  window.addEventListener("resize", () => {
    gBaseX = window.innerWidth * 0.7;
    gBaseY = window.innerHeight * 0.35;
  });

  function drawGalaxy() {
    ctx.clearRect(0, 0, SIZE, SIZE);
    const t = Date.now() * 0.001;
    const rotation = t * 0.08; // slow rotation

    // Drift orbit
    gDriftAngle += 0.003;
    const driftX = Math.sin(gDriftAngle) * 30;
    const driftY = Math.cos(gDriftAngle * 0.7) * 20;

    // Position galaxy canvas
    canvas.style.left = (gBaseX + gCursorX + driftX - SIZE / 2) + "px";
    canvas.style.top = (gBaseY + gCursorY + driftY - SIZE / 2) + "px";

    // Core glow
    const coreGrad = ctx.createRadialGradient(SIZE/2, SIZE/2, 0, SIZE/2, SIZE/2, coreRadius * 4);
    coreGrad.addColorStop(0, "rgba(100,160,80,.15)");
    coreGrad.addColorStop(0.3, "rgba(70,120,50,.06)");
    coreGrad.addColorStop(1, "transparent");
    ctx.fillStyle = coreGrad;
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Draw stars
    const cx = SIZE / 2, cy = SIZE / 2;
    galaxyStars.forEach(star => {
      const twinkle = 0.5 + 0.5 * Math.sin(t * 1.5 + star.twinkleOff);
      const cosR = Math.cos(rotation), sinR = Math.sin(rotation);
      const rx = star.x * cosR - star.y * sinR + cx;
      const ry = star.x * sinR + star.y * cosR + cy;

      if (rx < -5 || rx > SIZE + 5 || ry < -5 || ry > SIZE + 5) return;

      const alpha = star.brightness * twinkle;
      ctx.beginPath();
      ctx.arc(rx, ry, star.size * (0.7 + 0.3 * twinkle), 0, Math.PI * 2);
      ctx.fillStyle = star.color + alpha.toFixed(2) + ")";
      ctx.fill();
    });

    requestAnimationFrame(drawGalaxy);
  }
  drawGalaxy();
})();

/* ========================================================
   NEBULA CLOUDS — navy blue haze reacting to cursor
   ======================================================== */
(function initNebulae() {
  const container = document.createElement("div");
  container.className = "nebula-container";
  document.body.prepend(container);

  for (let i = 0; i < 4; i++) {
    const n = document.createElement("div");
    n.className = "nebula";
    container.appendChild(n);
  }

  const nebulae = container.querySelectorAll(".nebula");
  const speeds = [0.015, 0.012, 0.018, 0.01];
  const offsets = Array.from({ length: 4 }, () => ({ x: 0, y: 0 }));

  document.addEventListener("mousemove", (e) => {
    const nx = (e.clientX / window.innerWidth - 0.5) * 2;
    const ny = (e.clientY / window.innerHeight - 0.5) * 2;
    nebulae.forEach((_, i) => {
      const intensity = 20 + i * 12;
      offsets[i].x = nx * intensity * (i % 2 === 0 ? 1 : -1);
      offsets[i].y = ny * intensity * (i % 2 === 0 ? -1 : 1);
    });
  });

  (function animateNebulae() {
    const t = Date.now() * 0.001;
    nebulae.forEach((n, i) => {
      const driftX = Math.sin(t * speeds[i] + i) * 15;
      const driftY = Math.cos(t * speeds[i] * 0.7 + i * 2) * 12;
      n.style.transform = `translate(${offsets[i].x + driftX}px, ${offsets[i].y + driftY}px)`;
    });
    requestAnimationFrame(animateNebulae);
  })();
})();

/* ========================================================
   TWINKLING CSS STARS — small bright dots
   ======================================================== */
(function initTwinkleStars() {
  const layer = document.createElement("div");
  layer.className = "twinkle-layer";
  document.body.prepend(layer);

  for (let i = 0; i < 40; i++) {
    const s = document.createElement("div");
    s.className = "twinkle-star";
    const size = 1 + Math.random() * 2.5;
    s.style.cssText = `
      width:${size}px;height:${size}px;
      left:${Math.random() * 100}%;top:${Math.random() * 100}%;
      animation-duration:${1.5 + Math.random() * 3}s;
      animation-delay:${Math.random() * 3}s;
      box-shadow:0 0 ${size * 2}px rgba(160,210,130,${0.3 + Math.random() * 0.4});
    `;
    layer.appendChild(s);
  }
})();

/* ========================================================
   SHOOTING STARS — random streaks across the sky
   ======================================================== */
(function initShootingStars() {
  function createShootingStar() {
    const star = document.createElement("div");
    star.className = "shooting-star";
    const startX = Math.random() * window.innerWidth * 0.7;
    const startY = Math.random() * window.innerHeight * 0.4;
    const angle = 25 + Math.random() * 20;
    const length = 80 + Math.random() * 100;
    const duration = 0.6 + Math.random() * 0.8;

    star.style.cssText = `
      left:${startX}px;top:${startY}px;width:${length}px;
      transform:rotate(${angle}deg);
      animation:shoot ${duration}s ease-out forwards;
    `;
    document.body.appendChild(star);
    setTimeout(() => star.remove(), duration * 1000 + 100);
  }

  // Random interval for shooting stars
  function scheduleNext() {
    const wait = 2000 + Math.random() * 5000;
    setTimeout(() => {
      createShootingStar();
      scheduleNext();
    }, wait);
  }
  scheduleNext();
})();

/* ========================================================
   FLOATING 3D FINTECH ICONS — money/tech themed
   ======================================================== */
(function initFintechIcons() {
  const container = document.createElement("div");
  container.className = "fintech-container";
  document.body.appendChild(container);

  // SVG icon definitions: [svgPath, style, colorClass, animVariant]
  const icons = [
    // Dollar Sign
    { svg: '<svg viewBox="0 0 24 24"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>',
      style:'outline', clr:'clr-green', anim:'', size:42, x:8, y:12 },
    // Rupee Sign
    { svg: '<svg viewBox="0 0 24 24"><path d="M6 3h12M6 8h12M14 21L6 13h4a5 5 0 000-10"/></svg>',
      style:'outline', clr:'clr-amber', anim:'pulse-glow', size:38, x:85, y:18 },
    // Euro
    { svg: '<svg viewBox="0 0 24 24"><path d="M4 10h12M4 14h12M17.2 4.2a8 8 0 010 15.6"/></svg>',
      style:'outline', clr:'clr-blue', anim:'', size:36, x:72, y:65 },
    // Yen
    { svg: '<svg viewBox="0 0 24 24"><path d="M12 20V12M4 4l8 8 8-8M6 12h12M6 16h12"/></svg>',
      style:'outline', clr:'clr-red', anim:'pulse-glow', size:34, x:15, y:75 },
    // Bitcoin
    { svg: '<svg viewBox="0 0 24 24"><path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042l-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893l-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042l.348-1.97M7.48 16.711l1.56-8.862"/></svg>',
      style:'outline', clr:'clr-gold', anim:'coin-flip', size:48, x:90, y:42 },
    // Ethereum diamond
    { svg: '<svg viewBox="0 0 24 24"><path d="M12 1l-8 13 8 5 8-5-8-13zM4 14l8 9 8-9-8 5-8-5z"/></svg>',
      style:'outline', clr:'clr-purple', anim:'coin-flip', size:44, x:5, y:45 },
    // Candlestick chart
    { svg: '<svg viewBox="0 0 24 24"><rect x="4" y="8" width="4" height="8" rx="1"/><line x1="6" y1="4" x2="6" y2="8"/><line x1="6" y1="16" x2="6" y2="20"/><rect x="10" y="6" width="4" height="10" rx="1"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="16" x2="12" y2="22"/><rect x="16" y="9" width="4" height="6" rx="1"/><line x1="18" y1="5" x2="18" y2="9"/><line x1="18" y1="15" x2="18" y2="19"/></svg>',
      style:'outline', clr:'clr-cyan', anim:'', size:46, x:45, y:8 },
    // Trending Up arrow
    { svg: '<svg viewBox="0 0 24 24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
      style:'outline', clr:'clr-green', anim:'pulse-glow', size:40, x:30, y:85 },
    // Pie Chart
    { svg: '<svg viewBox="0 0 24 24"><path d="M21.21 15.89A10 10 0 118 2.83"/><path d="M22 12A10 10 0 0012 2v10z"/></svg>',
      style:'outline', clr:'clr-pink', anim:'', size:38, x:60, y:30 },
    // Bar Chart
    { svg: '<svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
      style:'outline', clr:'clr-blue', anim:'', size:36, x:78, y:82 },
    // Wallet
    { svg: '<svg viewBox="0 0 24 24"><path d="M20 12V8H6a2 2 0 01-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12a2 2 0 002 2h14v-4"/><circle cx="18" cy="14" r="1"/></svg>',
      style:'outline', clr:'clr-amber', anim:'', size:40, x:25, y:55 },
    // Shield (security)
    { svg: '<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>',
      style:'outline', clr:'clr-green', anim:'pulse-glow', size:36, x:50, y:72 },
    // Lightning bolt (fast trades)
    { svg: '<svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
      style:'outline', clr:'clr-gold', anim:'', size:34, x:92, y:70 },
    // Coin stack
    { svg: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M20 5v4c0 1.66-3.58 3-8 3S4 10.66 4 9V5"/><path d="M20 9v4c0 1.66-3.58 3-8 3s-8-1.34-8-3V9"/><path d="M20 13v4c0 1.66-3.58 3-8 3s-8-1.34-8-3v-4"/></svg>',
      style:'outline', clr:'clr-purple', anim:'coin-flip', size:42, x:38, y:40 },
    // Globe (global markets)
    { svg: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>',
      style:'outline', clr:'clr-cyan', anim:'', size:40, x:68, y:48 },
    // Credit card
    { svg: '<svg viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
      style:'outline', clr:'clr-pink', anim:'pulse-glow', size:44, x:18, y:28 },
    // Target/crosshair (precision)
    { svg: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>',
      style:'outline', clr:'clr-red', anim:'', size:36, x:55, y:90 },
    // Diamond (premium)
    { svg: '<svg viewBox="0 0 24 24"><path d="M6 3h12l4 6-10 13L2 9z"/><path d="M2 9h20"/><path d="M10 3l-2 6 4 13 4-13-2-6"/></svg>',
      style:'outline', clr:'clr-gold', anim:'coin-flip', size:38, x:3, y:88 },
  ];

  // Store references for cursor reactivity
  const fintechEls = [];

  icons.forEach((icon, i) => {
    const el = document.createElement("div");
    const animClass = icon.anim ? icon.anim : "";
    el.className = `fintech-icon style-${icon.style} ${icon.clr} ${animClass}`;
    el.innerHTML = icon.svg;
    el.style.cssText = `
      width:${icon.size}px;height:${icon.size}px;
      left:${icon.x}%;top:${icon.y}%;
      animation-duration:${18 + i * 3}s;
      animation-delay:${-i * 1.5}s;
    `;
    container.appendChild(el);
    fintechEls.push({ el, baseX: icon.x, baseY: icon.y, depth: 0.3 + (i % 5) * 0.15 });
  });

  // Cursor parallax for fintech icons
  let ftMouseX = 0, ftMouseY = 0;
  document.addEventListener("mousemove", (e) => {
    ftMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    ftMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  (function animateFintech() {
    fintechEls.forEach((item, i) => {
      const parallaxX = ftMouseX * 25 * item.depth * (i % 2 === 0 ? 1 : -1);
      const parallaxY = ftMouseY * 20 * item.depth * (i % 3 === 0 ? -1 : 1);
      item.el.style.marginLeft = parallaxX + "px";
      item.el.style.marginTop = parallaxY + "px";
    });
    requestAnimationFrame(animateFintech);
  })();
})();

/* ========================================================
   3D TILT EFFECT — glass cards tilt toward cursor
   ======================================================== */
function initTiltCards() {
  const cards = $$(".glass");
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) translateY(0px)";
    });
  });
}

// Run after page transitions
setTimeout(initTiltCards, 100);

/* ========================================================
   TECH PATTERN CANVAS — geometric fintech shapes
   ======================================================== */
(function initTechPattern() {
  const canvas = $("#techPatternCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W, H;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  let pMouseX = 0.5, pMouseY = 0.5;
  canvas.parentElement.addEventListener("mousemove", (e) => {
    const rect = canvas.parentElement.getBoundingClientRect();
    pMouseX = (e.clientX - rect.left) / rect.width;
    pMouseY = (e.clientY - rect.top) / rect.height;
  });

  function drawPattern() {
    ctx.clearRect(0, 0, W, H);
    const t = Date.now() * 0.001;
    const offsetX = (pMouseX - 0.5) * 30;
    const offsetY = (pMouseY - 0.5) * 25;

    ctx.strokeStyle = "rgba(90,140,60,0.12)";
    ctx.lineWidth = 1;

    // Dashed circles (gear-like)
    ctx.save();
    ctx.setLineDash([6, 8]);
    for (let i = 0; i < 4; i++) {
      const cx = W * 0.65 + offsetX * (i * 0.3 + 0.5);
      const cy = H * 0.35 + offsetY * (i * 0.2 + 0.3);
      const r = 60 + i * 50;
      const rot = t * 0.15 * (i % 2 === 0 ? 1 : -1);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(90,140,60,${0.08 + i * 0.02})`;
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();

    // Arc segments (gear teeth)
    ctx.setLineDash([]);
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + t * 0.1;
      const cx = W * 0.75 + offsetX * 0.5;
      const cy = H * 0.6 + offsetY * 0.4;
      const r1 = 140, r2 = 155;
      ctx.beginPath();
      ctx.arc(cx, cy, r1, angle, angle + 0.15);
      ctx.strokeStyle = "rgba(90,140,60,0.1)";
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
      ctx.lineTo(cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2);
      ctx.stroke();
    }

    // Horizontal dashed lines
    ctx.setLineDash([10, 15]);
    for (let i = 0; i < 5; i++) {
      const y = H * (0.15 + i * 0.18) + offsetY * (i * 0.1);
      const startX = W * 0.05 + Math.sin(t + i) * 20;
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(startX + W * 0.5, y);
      ctx.strokeStyle = `rgba(90,140,60,${0.06 + Math.sin(t + i) * 0.03})`;
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Dot grid
    for (let x = 0; x < W; x += 45) {
      for (let y = 0; y < H; y += 45) {
        const dist = Math.hypot(x - pMouseX * W, y - pMouseY * H);
        const alpha = Math.max(0.02, 0.08 - dist * 0.0001);
        ctx.beginPath();
        ctx.arc(x + offsetX * 0.1, y + offsetY * 0.1, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(90,140,60,${alpha})`;
        ctx.fill();
      }
    }

    // Chevron arrows
    const chevronY = H * 0.55 + offsetY * 0.3;
    for (let i = 0; i < 8; i++) {
      const cx = W * 0.3 + i * 22 + Math.sin(t * 2 + i * 0.5) * 3;
      ctx.beginPath();
      ctx.moveTo(cx, chevronY - 8);
      ctx.lineTo(cx - 6, chevronY);
      ctx.lineTo(cx, chevronY + 8);
      ctx.strokeStyle = `rgba(90,140,60,${0.12 + Math.sin(t * 2 + i) * 0.05})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    ctx.lineWidth = 1;

    // Diamond shapes
    const diamonds = [[W*0.8, H*0.15], [W*0.9, H*0.75], [W*0.15, H*0.85]];
    diamonds.forEach(([dx, dy], i) => {
      const s = 14 + i * 4;
      const ddx = dx + offsetX * (0.2 + i * 0.1);
      const ddy = dy + offsetY * (0.2 + i * 0.1);
      const rot = t * 0.3 + i;
      ctx.save();
      ctx.translate(ddx, ddy);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.moveTo(0, -s); ctx.lineTo(s, 0); ctx.lineTo(0, s); ctx.lineTo(-s, 0);
      ctx.closePath();
      ctx.strokeStyle = `rgba(90,140,60,0.1)`;
      ctx.stroke();
      ctx.restore();
    });

    // Small circles row
    for (let i = 0; i < 10; i++) {
      const cx = W * 0.55 + i * 22;
      const cy = H * 0.06 + Math.sin(t + i * 0.8) * 3;
      ctx.beginPath();
      ctx.arc(cx + offsetX * 0.2, cy + offsetY * 0.1, 4, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(90,140,60,${0.1 + Math.sin(t + i) * 0.04})`;
      ctx.stroke();
    }

    requestAnimationFrame(drawPattern);
  }
  drawPattern();
})();

/* ========================================================
   PAGE NAVIGATION
   ======================================================== */
const landingPage = $("#landingPage");

function showAuth(tab) {
  landingPage.classList.remove("active");
  authPage.classList.add("active");
  dashPage.classList.remove("active");
  if (tab === "signup") switchTab("signup");
  else switchTab("login");
  setTimeout(initTiltCards, 200);
}

function showLanding() {
  authPage.classList.remove("active");
  dashPage.classList.remove("active");
  landingPage.classList.add("active");
}

/* ======== AUTH LOGIC ======== */
const forgotForm = $("#forgotForm");

function switchTab(tab) {
  // Always hide forgot form when switching tabs
  if (forgotForm) forgotForm.classList.add("hidden");
  if (tab === "login") {
    loginTab.classList.add("active"); signupTab.classList.remove("active");
    loginForm.classList.remove("hidden"); signupForm.classList.add("hidden");
  } else {
    signupTab.classList.add("active"); loginTab.classList.remove("active");
    signupForm.classList.remove("hidden"); loginForm.classList.add("hidden");
  }
}

/* ======== FORGOT PASSWORD ======== */
function showForgotPassword() {
  loginForm.classList.add("hidden");
  signupForm.classList.add("hidden");
  forgotForm.classList.remove("hidden");
  loginTab.classList.remove("active");
  signupTab.classList.remove("active");
  // Reset form state
  $("#resetStep1").classList.remove("hidden");
  $("#resetStep2").classList.add("hidden");
  $("#resetEmail").value = "";
  $("#resetError").textContent = "";
  $("#resetError2").textContent = "";
}

function backToLogin() {
  forgotForm.classList.add("hidden");
  switchTab("login");
}

function verifyResetEmail() {
  const email = $("#resetEmail").value.trim().toLowerCase();
  const errEl = $("#resetError");

  if (!email) { errEl.textContent = "Please enter your email."; return; }

  const users = getUsers();
  if (!users[email]) {
    errEl.textContent = "No account found with this email.";
    return;
  }

  // Email verified — show step 2
  errEl.textContent = "";
  $("#resetVerifiedEmail").textContent = email;
  $("#resetStep1").classList.add("hidden");
  $("#resetStep2").classList.remove("hidden");
  $("#resetStep2").dataset.email = email;
}

function resetPassword() {
  const email = $("#resetStep2").dataset.email;
  const newPass = $("#resetNewPass").value;
  const confirmPass = $("#resetConfirmPass").value;
  const errEl = $("#resetError2");

  if (!newPass || newPass.length < 6) {
    errEl.textContent = "Password must be at least 6 characters.";
    return;
  }
  if (newPass !== confirmPass) {
    errEl.textContent = "Passwords do not match.";
    return;
  }

  const users = getUsers();
  if (users[email]) {
    users[email].password = btoa(newPass);
    saveUsers(users);
  }

  // Go back to login with success message
  forgotForm.classList.add("hidden");
  switchTab("login");
  $("#loginEmail").value = email;
  const loginErr = $("#loginError");
  loginErr.textContent = "Password reset successful! Please sign in.";
  loginErr.style.color = "var(--green)";
}

function getUsers() {
  return JSON.parse(localStorage.getItem("sv_users") || "{}");
}
function saveUsers(u) {
  localStorage.setItem("sv_users", JSON.stringify(u));
}

function handleSignup(e) {
  e.preventDefault();
  const name = $("#signupName").value.trim();
  const email = $("#signupEmail").value.trim().toLowerCase();
  const pass = $("#signupPass").value;
  const confirm = $("#signupConfirm").value;
  const errEl = $("#signupError");

  if (pass !== confirm) { errEl.textContent = "Passwords do not match."; return; }
  const users = getUsers();
  if (users[email]) { errEl.textContent = "Account already exists. Sign in instead."; return; }

  users[email] = { name, password: btoa(pass), holdings: [] };
  saveUsers(users);
  errEl.textContent = "";
  switchTab("login");
  $("#loginEmail").value = email;
  $("#loginError").textContent = "Account created! Please sign in.";
  $("#loginError").style.color = "var(--green)";
}

function handleLogin(e) {
  e.preventDefault();
  const email = $("#loginEmail").value.trim().toLowerCase();
  const pass = $("#loginPass").value;
  const errEl = $("#loginError");
  errEl.style.color = "";

  const users = getUsers();
  if (!users[email]) { errEl.textContent = "No account found. Sign up first."; return; }
  if (atob(users[email].password) !== pass) { errEl.textContent = "Incorrect password."; return; }

  localStorage.setItem("sv_current", email);
  errEl.textContent = "";
  enterDashboard(email, users[email].name);
}

function enterDashboard(email, name) {
  landingPage.classList.remove("active");
  authPage.classList.remove("active");
  dashPage.classList.add("active");
  $("#navUserName").textContent = name;
  renderHoldings();
  refreshAllPrices();
  setTimeout(initTiltCards, 200);
}

function logout() {
  localStorage.removeItem("sv_current");
  dashPage.classList.remove("active");
  authPage.classList.remove("active");
  landingPage.classList.add("active");
  loginForm.reset(); signupForm.reset();
}

/* Auto-login if session exists */
(function autoLogin() {
  const email = localStorage.getItem("sv_current");
  if (email) {
    const users = getUsers();
    if (users[email]) enterDashboard(email, users[email].name);
  }
})();

/* ======== HOLDINGS CRUD ======== */
function getCurrentHoldings() {
  const email = localStorage.getItem("sv_current");
  const users = getUsers();
  return users[email]?.holdings || [];
}
function saveCurrentHoldings(holdings) {
  const email = localStorage.getItem("sv_current");
  const users = getUsers();
  if (users[email]) users[email].holdings = holdings;
  saveUsers(users);
}

function addStock(e) {
  e.preventDefault();
  const ticker = $("#tickerInput").value.trim().toUpperCase();
  const buyPrice = parseFloat($("#buyPriceInput").value);
  const qty = parseInt($("#qtyInput").value);

  if (!ticker || isNaN(buyPrice) || isNaN(qty)) return;

  const holdings = getCurrentHoldings();
  holdings.push({ ticker, buyPrice, qty, currentPrice: null, lastUpdated: null });
  saveCurrentHoldings(holdings);
  $("#addStockForm").reset();
  renderHoldings();
  fetchPrice(holdings.length - 1);
}

function removeStock(idx) {
  const holdings = getCurrentHoldings();
  holdings.splice(idx, 1);
  saveCurrentHoldings(holdings);
  renderHoldings();
  updateSummary();
}

/* ======== RENDERING ======== */
function renderHoldings() {
  const holdings = getCurrentHoldings();
  holdingsBody.innerHTML = "";

  if (holdings.length === 0) {
    emptyState.classList.remove("hidden");
    updateSummary();
    return;
  }
  emptyState.classList.add("hidden");

  holdings.forEach((h, i) => {
    const tr = document.createElement("tr");
    const cp = h.currentPrice;
    const gl = cp != null ? (cp - h.buyPrice) * h.qty : null;
    const glPct = cp != null ? ((cp - h.buyPrice) / h.buyPrice * 100) : null;
    const cls = gl != null ? (gl >= 0 ? "gain-positive" : "gain-negative") : "";
    const ts = h.lastUpdated ? new Date(h.lastUpdated).toLocaleString() : "—";

    tr.innerHTML = `
      <td class="ticker-cell">${h.ticker}</td>
      <td>${h.qty}</td>
      <td>$${h.buyPrice.toFixed(2)}</td>
      <td>${cp != null ? "$" + cp.toFixed(2) : '<span style="color:var(--text-dim)">—</span>'}</td>
      <td class="${cls}">${gl != null ? (gl >= 0 ? "+" : "") + "$" + gl.toFixed(2) : "—"}</td>
      <td class="${cls}">${glPct != null ? (glPct >= 0 ? "+" : "") + glPct.toFixed(2) + "%" : "—"}</td>
      <td class="timestamp-cell">${ts}</td>
      <td><button class="btn-danger" onclick="removeStock(${i})">Remove</button></td>
    `;
    holdingsBody.appendChild(tr);
  });
  updateSummary();
}

function updateSummary() {
  const holdings = getCurrentHoldings();
  let invested = 0, current = 0, hasPrice = false;

  holdings.forEach(h => {
    invested += h.buyPrice * h.qty;
    if (h.currentPrice != null) {
      current += h.currentPrice * h.qty;
      hasPrice = true;
    } else {
      current += h.buyPrice * h.qty;
    }
  });

  const gl = current - invested;
  const glPct = invested > 0 ? (gl / invested * 100) : 0;

  $("#totalInvested").textContent = "$" + invested.toFixed(2);
  $("#currentValue").textContent = hasPrice ? "$" + current.toFixed(2) : "$0.00";

  const glEl = $("#totalGainLoss");
  const pctEl = $("#totalGainPct");
  glEl.textContent = (gl >= 0 ? "+$" : "-$") + Math.abs(gl).toFixed(2);
  glEl.style.color = gl >= 0 ? "var(--green)" : "var(--red)";
  pctEl.textContent = (gl >= 0 ? "+" : "") + glPct.toFixed(2) + "%";
  pctEl.style.color = gl >= 0 ? "var(--green)" : "var(--red)";
}

/* ======== API & CACHING ======== */
function getCacheKey(ticker) { return "sv_cache_" + ticker; }

function getCachedPrice(ticker) {
  try {
    const raw = localStorage.getItem(getCacheKey(ticker));
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (Date.now() - data.timestamp > CACHE_TTL) {
      localStorage.removeItem(getCacheKey(ticker));
      return null;
    }
    return data;
  } catch { return null; }
}

function setCachedPrice(ticker, price) {
  localStorage.setItem(getCacheKey(ticker), JSON.stringify({ price, timestamp: Date.now() }));
}

async function fetchPrice(idx) {
  const holdings = getCurrentHoldings();
  const h = holdings[idx];
  if (!h) return;

  const cached = getCachedPrice(h.ticker);
  if (cached) {
    holdings[idx].currentPrice = cached.price;
    holdings[idx].lastUpdated = cached.timestamp;
    saveCurrentHoldings(holdings);
    renderHoldings();
    return;
  }

  spinner.classList.remove("hidden");
  try {
    const res = await fetch(`${API_BASE}?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(h.ticker)}&apikey=${API_KEY}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (data["Error Message"]) throw new Error(`Invalid ticker: ${h.ticker}`);
    if (data["Note"]) throw new Error("API rate limit reached. Try again later.");

    const quote = data["Global Quote"];
    if (!quote || !quote["05. price"]) throw new Error(`No data for ${h.ticker}. Check the ticker symbol.`);

    const price = parseFloat(quote["05. price"]);
    const now = Date.now();
    setCachedPrice(h.ticker, price);

    const fresh = getCurrentHoldings();
    if (fresh[idx]) {
      fresh[idx].currentPrice = price;
      fresh[idx].lastUpdated = now;
      saveCurrentHoldings(fresh);
    }
    renderHoldings();
  } catch (err) {
    showError(err.message || "Failed to fetch price for " + h.ticker);
  } finally {
    spinner.classList.add("hidden");
  }
}

async function refreshAllPrices() {
  const holdings = getCurrentHoldings();
  if (holdings.length === 0) return;

  spinner.classList.remove("hidden");
  dismissError();

  for (let i = 0; i < holdings.length; i++) {
    await fetchPrice(i);
    if (i < holdings.length - 1) await delay(1200);
  }
  spinner.classList.add("hidden");
}

/* ======== UTILITIES ======== */
function showError(msg) {
  errorText.textContent = msg;
  errorBanner.classList.remove("hidden");
}
function dismissError() {
  errorBanner.classList.add("hidden");
}
function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}
