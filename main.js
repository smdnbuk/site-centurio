// ─── Particle Network Animation ───────────────────────────────────────────────
(function () {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], animId, mouse = { x: null, y: null };
  const MOUSE_DIST = 120;

  const CONFIG = {
    count: 140,
    maxDist: 220,
    speed: 0.35,
    dotRadius: 1.2,
    dotColor: 'rgba(200,200,200,',
    lineColor: 'rgba(200,200,200,',
  };

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    const angle = Math.random() * Math.PI * 2;
    this.vx = Math.cos(angle) * CONFIG.speed * (0.4 + Math.random() * 0.6);
    this.vy = Math.sin(angle) * CONFIG.speed * (0.4 + Math.random() * 0.6);
    this.r = CONFIG.dotRadius + Math.random() * 0.8;
  }

  function init() {
    particles = [];
    const cols = Math.ceil(Math.sqrt(CONFIG.count * W / H));
    const rows = Math.ceil(CONFIG.count / cols);
    let i = 0;
    for (let r = 0; r < rows && i < CONFIG.count; r++) {
      for (let c = 0; c < cols && i < CONFIG.count; c++) {
        const p = new Particle();
        p.x = (c + 0.5 + (Math.random() - 0.5) * 0.8) * (W / cols);
        p.y = (r + 0.5 + (Math.random() - 0.5) * 0.8) * (H / rows);
        particles.push(p);
        i++;
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      if (mouse.x !== null) {
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_DIST) {
          p.vx += dx * 0.0008;
          p.vy += dy * 0.0008;
        }
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 1.8) { p.vx *= 1.8 / speed; p.vy *= 1.8 / speed; }

        if (dist < MOUSE_DIST) {
          const alpha = (1 - dist / MOUSE_DIST) * 0.5;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `rgba(200,200,200,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = CONFIG.dotColor + '0.55)';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.maxDist) {
          const alpha = (1 - dist / CONFIG.maxDist) * 0.18;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = CONFIG.lineColor + alpha + ')';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    animId = requestAnimationFrame(draw);
  }

  const heroSection = canvas.parentElement;
  heroSection.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  heroSection.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  resize();
  init();
  draw();
  window.addEventListener('resize', () => { resize(); init(); });
})();


// ─── Tiles Button ─────────────────────────────────────────────────────────────
(function () {
  var btn = document.getElementById('btn-transform');
  var cnv = document.getElementById('tf-canvas');
  if (!btn || !cnv) return;
  var ctx = cnv.getContext('2d');
  var tiles, animId, t, running = false;
  var COLS = 12, ROWS = 3;

  function setup() {
    var r = btn.getBoundingClientRect();
    cnv.width  = r.width;
    cnv.height = r.height;
  }

  function initTiles() {
    tiles = [];
    var W = cnv.width, H = cnv.height;
    var tw = W / COLS;
    var th = H / ROWS;

    var off = document.createElement('canvas');
    off.width = W; off.height = H;
    var octx = off.getContext('2d');
    var grad = octx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0,   '#a8873a');
    grad.addColorStop(0.4, '#c9a84c');
    grad.addColorStop(0.6, '#a8873a');
    grad.addColorStop(1,   '#7a5a1e');
    octx.fillStyle = grad;
    octx.fillRect(0, 0, W, H);
    octx.fillStyle = '#1A1A1A';
    octx.font = '700 14px Manrope, sans-serif';
    octx.textAlign = 'center';
    octx.textBaseline = 'middle';
    var text = 'ENGAGER LA TRANSFORMATION';
    var spacing = 14 * 0.12;
    var totalW = 0;
    for (var i = 0; i < text.length; i++) totalW += octx.measureText(text[i]).width + spacing;
    totalW -= spacing;
    var startX = W / 2 - totalW / 2;
    for (var i = 0; i < text.length; i++) {
      octx.fillText(text[i], startX, H / 2);
      startX += octx.measureText(text[i]).width + spacing;
    }

    for (var row = 0; row < ROWS; row++) {
      for (var col = 0; col < COLS; col++) {
        var ox = Math.round(col * tw);
        var oy = Math.round(row * th);
        tiles.push({
          ox: ox, oy: oy, w: tw, h: th,
          dx: (Math.random() - 0.5) * W * 0.6,
          dy: (Math.random() - 0.5) * H * 1.2,
          delay: Math.random() * 0.2,
          r: (Math.random() - 0.5) * 0.8,
          img: octx.getImageData(ox, oy, Math.ceil(tw) + 1, Math.ceil(th) + 1)
        });
      }
    }
  }

  function easeIn(t)  { return t * t * t; }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  var DUR_OUT = 0.45, DUR_IN = 0.55, DUR_FADE = 0.4;
  var fading = false, fadeT = 0;

  function tick() {
    if (!running) return;
    t += 0.016;
    ctx.clearRect(0, 0, cnv.width, cnv.height);

    var allDone = true;
    tiles.forEach(function (ti) {
      var lt = Math.max(0, t - ti.delay);
      var cx, cy, op, rot;

      if (lt < DUR_OUT) {
        var p = easeIn(lt / DUR_OUT);
        cx  = ti.ox + ti.dx * p;
        cy  = ti.oy + ti.dy * p;
        op  = 1 - p;
        rot = ti.r * p;
        allDone = false;
      } else {
        var lt2 = lt - DUR_OUT - 0.08;
        if (lt2 < 0) {
          cx = ti.ox + ti.dx; cy = ti.oy + ti.dy; op = 0; rot = ti.r; allDone = false;
        } else if (lt2 < DUR_IN) {
          var p = easeOut(lt2 / DUR_IN);
          cx  = ti.ox + ti.dx * (1 - p);
          cy  = ti.oy + ti.dy * (1 - p);
          op  = p;
          rot = ti.r * (1 - p);
          allDone = false;
        } else {
          cx = ti.ox; cy = ti.oy; op = 1; rot = 0;
        }
      }

      if (op <= 0) return;
      ctx.save();
      ctx.globalAlpha = op;
      ctx.translate(cx + ti.w / 2, cy + ti.h / 2);
      ctx.rotate(rot);
      var tmpC = document.createElement('canvas');
      tmpC.width  = Math.ceil(ti.w) + 1;
      tmpC.height = Math.ceil(ti.h) + 1;
      tmpC.getContext('2d').putImageData(ti.img, 0, 0);
      ctx.drawImage(tmpC, -ti.w / 2, -ti.h / 2, ti.w + 1, ti.h + 1);
      ctx.restore();
    });

    if (!fading && allDone) {
      fading = true; fadeT = 0;
      btn.style.background = 'linear-gradient(135deg,#a8873a 0%,#c9a84c 40%,#a8873a 60%,#7a5a1e 100%)';
      btn.style.boxShadow  = '0 2px 12px rgba(201,168,76,0.25)';
      btn.style.color      = '#1A1A1A';
    }

    if (fading) {
      fadeT += 0.016;
      var fp = Math.min(fadeT / DUR_FADE, 1);
      cnv.style.opacity = String(1 - easeOut(fp));
      if (fp >= 1) {
        running = false; fading = false;
        cnv.style.opacity = '1';
        ctx.clearRect(0, 0, cnv.width, cnv.height);
        return;
      }
    }

    animId = requestAnimationFrame(tick);
  }

  function fire() {
    if (running) return;
    running = true;
    fading = false; fadeT = 0;
    cnv.style.opacity = '1';
    setup();
    initTiles();
    t = 0;
    btn.style.background = 'transparent';
    btn.style.boxShadow  = 'none';
    btn.style.color      = 'transparent';
    animId = requestAnimationFrame(tick);
  }

  btn.addEventListener('mouseenter', fire);
})();


// ─── Scroll Reveal ────────────────────────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


// ─── Form Handler ─────────────────────────────────────────────────────────────
async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn  = form.querySelector('button[type=submit]');
  const originalText = btn.textContent;

  btn.textContent = 'Envoi en cours…';
  btn.disabled = true;

  const data = {
    prenom:  form.querySelector('input[placeholder="Jean"]').value,
    societe: form.querySelector('input[placeholder="Nom de l\'entreprise"]').value,
    email:   form.querySelector('input[type="email"]').value,
    message: form.querySelector('textarea').value,
  };

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      btn.textContent = 'Message envoyé ✓';
      btn.style.background = '#2a2a2a';
      btn.style.color = '#D4AF37';
    } else {
      btn.textContent = 'Erreur — réessayez';
      btn.style.background = '#3a1a1a';
      btn.style.color = '#ff6b6b';
      btn.disabled = false;
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.color = '';
      }, 3000);
    }
  } catch {
    btn.textContent = 'Erreur réseau';
    btn.style.background = '#3a1a1a';
    btn.style.color = '#ff6b6b';
    btn.disabled = false;
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.style.color = '';
    }, 3000);
  }
}
