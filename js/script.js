// 1. Navbar: fondo al hacer scroll + menú móvil
const nav = document.getElementById('nav');
const links = document.getElementById('links');
const menuBtn = document.getElementById('menuBtn');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});
menuBtn.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
links.addEventListener('click', e => {
  if (e.target.tagName === 'A') links.classList.remove('open');
});

// 2. Aparecer elementos al hacer scroll
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 90);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// 3. Contadores animados
function animateCount(el) {
  const target = +el.dataset.count;
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased).toLocaleString('es-EC') + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const countObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      countObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));

// 4. Simulador del sensor
const sources = {
  tanque: { score: 94, ph: 7.2, tur: 0.8, temp: 16, label: 'Apta para beber',
            advice: 'Todo en orden. Próxima medición en 1 minuto.', level: 'ok' },
  rio:    { score: 58, ph: 6.4, tur: 14.5, temp: 13, label: 'Precaución',
            advice: 'Turbidez elevada. Hierve el agua antes de usarla.', level: 'warn' },
  pozo:   { score: 23, ph: 5.1, tur: 38.0, temp: 18, label: 'No apta',
            advice: 'Alerta enviada a los vecinos. No consumir hasta revisar.', level: 'bad' }
};
const colors = { ok: '#7AE0D6', warn: '#FFB347', bad: '#E5533D' };
const gFg = document.getElementById('gFg');
const panel = document.querySelector('.panel');

function showSource(key) {
  const s = sources[key];
  const circumference = 327;
  gFg.style.strokeDashoffset = circumference - (circumference * s.score) / 100;
  gFg.style.stroke = colors[s.level];

  document.getElementById('gVal').textContent = s.score;
  document.getElementById('rPh').textContent = s.ph;
  document.getElementById('rTur').textContent = s.tur + ' NTU';
  document.getElementById('rTemp').textContent = s.temp + ' °C';
  document.getElementById('advice').textContent = s.advice;

  const status = document.getElementById('status');
  status.textContent = s.label;
  status.style.background = colors[s.level];

  panel.classList.remove('bad');
  if (s.level === 'bad') { void panel.offsetWidth; panel.classList.add('bad'); }
}
document.getElementById('chips').addEventListener('click', e => {
  const btn = e.target.closest('.chip');
  if (!btn) return;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  showSource(btn.dataset.src);
});
setTimeout(() => showSource('tanque'), 400);

// 5. Formulario de contacto
document.getElementById('form').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('email');
  const msg = document.getElementById('msg');
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
  if (!valid) {
    msg.textContent = 'Escribe un correo válido, por ejemplo nombre@correo.com';
    return;
  }
  msg.textContent = '¡Listo! Ya estás en la lista 💧';
  email.value = '';
});
