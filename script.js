/* ================================================================
   CodeZimpeto — script.js
   Funcionalidades: Navbar, Hero terminal, Partículas, Demo player,
   Contadores animados, Abas, Modal, WhatsApp float, Dark mode,
   Formulário com redirect para WhatsApp.
   ================================================================ */

'use strict';

/* ================================================================
   1. NAVBAR — scroll + active link + hamburger
   ================================================================ */
const navbar     = document.getElementById('navbar');
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('navLinks');
const navLinkEls = document.querySelectorAll('.nav-link');

// Detectar scroll para adicionar sombra
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// Hamburger menu (mobile)
hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  // Impede scroll do body quando menu está aberto
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Fechar menu ao clicar num link
navLinkEls.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Active link conforme secção visível (Intersection Observer)
const sections = document.querySelectorAll('section[id]');
const observerNav = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinkEls.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => observerNav.observe(s));


/* ================================================================
   2. DARK MODE TOGGLE
   ================================================================ */
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = themeToggle.querySelector('.theme-icon');

// Recupera preferência guardada
const savedTheme = localStorage.getItem('cz-theme')
  || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('cz-theme', theme);
}


/* ================================================================
   3. PARTÍCULAS DE CÓDIGO (Hero background)
   ================================================================ */
const particlesContainer = document.getElementById('particles');

// Fragmentos de código para as partículas
// 🔧 PERSONALIZAÇÃO: adicione mais snippets aqui
const codeSnippets = [
  '<html>', '</div>', 'const x', 'function()', '{ }', '// TODO',
  'let a =', 'if ()', 'return', '<p>', 'style=', 'onClick',
  'document', '.querySelector', 'addEventListener', 'async',
  'await fetch', 'true', 'false', 'null', '===', '=>', '[]',
  'class', 'import', 'export', '<body>', 'border:', 'margin:',
  '.html', '.css', '.js', 'git push', 'npm start', '0px',
  'flex', 'grid', 'var(--)', 'rgba()', ':root', '@media',
];

function createParticle() {
  const el = document.createElement('span');
  el.className = 'particle';
  el.textContent = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
  el.style.left     = `${Math.random() * 100}%`;
  el.style.animationDuration = `${8 + Math.random() * 18}s`;
  el.style.animationDelay   = `${Math.random() * 5}s`;
  el.style.fontSize = `${.65 + Math.random() * .5}rem`;
  el.style.opacity  = `${.08 + Math.random() * .2}`;
  particlesContainer.appendChild(el);
  // Remove após animação para não acumular no DOM
  el.addEventListener('animationend', () => el.remove());
}

// Cria partículas periodicamente
(function initParticles() {
  for (let i = 0; i < 15; i++) createParticle();
  setInterval(createParticle, 1200);
})();


/* ================================================================
   4. TERMINAL HERO — efeito de digitação
   ================================================================ */
const terminalCode   = document.getElementById('terminalCode');
const terminalCursor = document.getElementById('terminalCursor');

// 🔧 PERSONALIZAÇÃO: mude o código que aparece no terminal do hero
const heroCode = `<!DOCTYPE html>
<html lang="pt">
<head>
  <title>O Meu Primeiro Site</title>
</head>
<body>
  <h1>Olá, Moçambique! 🇲🇿</h1>
  <p>Aprendi a programar
     no CodeZimpeto!</p>
  <button onclick="celebrar()">
    Clica Aqui!
  </button>
</body>
</html>

<script>
  function celebrar() {
    alert("Sou programador! 🚀");
  }
<\/script>`;

// Sintaxe highlighting simples para o terminal
const heroColors = {
  keyword: ['<!DOCTYPE', '<html', '<head', '<body', '<title', '<h1', '<p', '<button', '<script', '</html', '</head', '</body', '</h1', '</p', '</button', '<\/script'],
  string:  ['"pt"', '"O Meu Primeiro Site"', '"celebrar()"', '"Clica Aqui!"', '"Sou programador! 🚀"'],
};

let heroIdx = 0;
let heroTimer;
let heroPaused = false;

function typeHeroChar() {
  if (heroPaused) return;
  if (heroIdx < heroCode.length) {
    terminalCode.textContent += heroCode[heroIdx];
    heroIdx++;
    heroTimer = setTimeout(typeHeroChar, 28 + Math.random() * 20);
    // Auto-scroll
    terminalCode.scrollTop = terminalCode.scrollHeight;
  } else {
    // Loop: pausa 3s e reinicia
    setTimeout(() => {
      terminalCode.textContent = '';
      heroIdx = 0;
      typeHeroChar();
    }, 3000);
  }
}

// Inicia após pequena pausa
setTimeout(typeHeroChar, 600);


/* ================================================================
   5. CONTADOR ANIMADO — Hero + Stats
   ================================================================ */
// Contador de alunos no hero
animateCounter('studentCount', 0, 142, 1800, '');

// Contadores das estatísticas (activados quando visíveis)
const statCards = document.querySelectorAll('.stat-card');
const observerStats = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const el     = entry.target;
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const numEl  = el.querySelector('.stat-number');
      animateCounter(numEl.id, 0, target, 1600, suffix);
      observerStats.unobserve(el);
    }
  });
}, { threshold: .3 });
statCards.forEach(c => observerStats.observe(c));

/**
 * Anima um número de start até end em duração ms.
 * @param {string} elId - ID do elemento
 * @param {number} start
 * @param {number} end
 * @param {number} duration - ms
 * @param {string} suffix - texto após o número
 */
function animateCounter(elId, start, end, duration, suffix) {
  const el = document.getElementById(elId);
  if (!el) return;
  const startTime = performance.now();
  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    // Ease out quart
    const eased = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.round(start + (end - start) * eased) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}


/* ================================================================
   6. ABAS DE PERFIL (Cursos)
   ================================================================ */
const tabBtns   = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    tabBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    tabPanels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    document.querySelector(`.tab-panel[data-panel="${target}"]`).classList.add('active');
  });
});


/* ================================================================
   7. DEMO PLAYER — Codificação ao vivo com controlo de velocidade
   ================================================================ */

// 🔧 PERSONALIZAÇÃO: mude o código do demo aqui
const demoLines = [
  '<!DOCTYPE html>',
  '<html lang="pt">',
  '<head>',
  '  <meta charset="UTF-8">',
  '  <title>A Minha Loja</title>',
  '  <style>',
  '    body { font-family: Arial; }',
  '    .hero { background: #009639;',
  '            color: white;',
  '            padding: 3rem; }',
  '    h1   { font-size: 2.5rem; }',
  '    .btn { background: #FF6B35;',
  '           color: white;',
  '           padding: .8rem 2rem;',
  '           border: none;',
  '           border-radius: .5rem;',
  '           cursor: pointer; }',
  '  </style>',
  '</head>',
  '<body>',
  '  <div class="hero">',
  '    <h1>Bem-vindo à Minha Loja! 🛍️</h1>',
  '    <p>Produtos frescos de Maputo</p>',
  '    <button class="btn"',
  '            onclick="comprar()">',
  '      Comprar Agora',
  '    </button>',
  '  </div>',
  '  <script>',
  '    function comprar() {',
  "      alert('Obrigado! 🎉');",
  '    }',
  '  <\/script>',
  '</body>',
  '</html>',
];

const demoCodeEl   = document.getElementById('demoCodeContent');
const previewEl    = document.getElementById('previewContent');

let demoCurrentLine  = 0;
let demoCurrentChar  = 0;
let demoIsPlaying    = false;
let demoInterval     = null;
let demoSpeedMs      = 60; // ms por caractere
let demoAccumulated  = '';

function demoTick() {
  if (demoCurrentLine >= demoLines.length) {
    demoControl('pause');
    return;
  }

  const line = demoLines[demoCurrentLine];

  if (demoCurrentChar < line.length) {
    demoAccumulated += line[demoCurrentChar];
    demoCodeEl.textContent = demoAccumulated + '|';
    demoCurrentChar++;
  } else {
    // Nova linha
    demoAccumulated += '\n';
    demoCodeEl.textContent = demoAccumulated + '|';
    demoCurrentLine++;
    demoCurrentChar = 0;
    // Actualiza preview a cada linha
    updateDemoPreview(demoAccumulated);
  }
}

function updateDemoPreview(code) {
  // Extrai conteúdo do <body> para o preview em tempo real
  const bodyMatch = code.match(/<body[^>]*>([\s\S]*)/i);
  const styleMatch = code.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  let preview = '';
  if (styleMatch) preview += `<style>${styleMatch[1]}</style>`;
  if (bodyMatch)  preview += bodyMatch[1].replace(/<\/body[\s\S]*/i,'').replace(/<script[\s\S]*/i,'');
  if (preview.trim()) previewEl.innerHTML = preview;
}

function demoControl(action) {
  if (action === 'play') {
    if (demoIsPlaying) return;
    demoIsPlaying = true;
    demoInterval  = setInterval(demoTick, demoSpeedMs);
  } else if (action === 'pause') {
    demoIsPlaying = false;
    clearInterval(demoInterval);
    // Remove cursor no texto ao pausar
    if (demoCodeEl.textContent.endsWith('|')) {
      demoCodeEl.textContent = demoCodeEl.textContent.slice(0,-1);
    }
  } else if (action === 'reset') {
    clearInterval(demoInterval);
    demoIsPlaying    = false;
    demoCurrentLine  = 0;
    demoCurrentChar  = 0;
    demoAccumulated  = '';
    demoCodeEl.textContent = '';
    previewEl.innerHTML = '<p style="color:#888;font-size:.85rem">O preview aparece aqui enquanto o código é escrito...</p>';
  }
}

function setDemoSpeed(val) {
  // val: 1 = rápido, 2 = normal, 3 = lento
  const speeds = { '1': 18, '2': 60, '3': 160 };
  demoSpeedMs = speeds[val] || 60;
  if (demoIsPlaying) {
    clearInterval(demoInterval);
    demoInterval = setInterval(demoTick, demoSpeedMs);
  }
}

// Auto-play quando a secção demo ficar visível
const demoSection = document.getElementById('demo');
const observerDemo = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !demoIsPlaying && demoCurrentLine === 0) {
    demoControl('play');
  }
}, { threshold: .3 });
if (demoSection) observerDemo.observe(demoSection);


/* ================================================================
   8. BOTÃO FLUTUANTE WHATSAPP
   ================================================================ */
const waToggle = document.getElementById('waToggle');
const waMenu   = document.getElementById('waMenu');

function toggleWaMenu() {
  const isOpen = waMenu.hidden;
  waMenu.hidden = !isOpen;
  waToggle.setAttribute('aria-expanded', isOpen);
  waToggle.querySelector('.wa-icon-main').textContent = isOpen ? '✕' : '💬';
}

// Fechar ao clicar fora
document.addEventListener('click', e => {
  if (!e.target.closest('.wa-float-group')) {
    waMenu.hidden = true;
    waToggle.setAttribute('aria-expanded', 'false');
    waToggle.querySelector('.wa-icon-main').textContent = '💬';
  }
});


/* ================================================================
   9. MODAL DE MATRÍCULA
   ================================================================ */
const modalOverlay = document.getElementById('modalOverlay');
const modalCourse  = document.getElementById('modalCourse');
const modalWa1     = document.getElementById('modalWa1');
const modalWa2     = document.getElementById('modalWa2');

/**
 * Abre o modal de matrícula.
 * @param {string} [courseName] - Nome do pacote (opcional)
 */
function openModal(courseName) {
  // Actualiza links WhatsApp com o pacote seleccionado
  const msg = courseName
    ? `Olá! Vi o CodeZimpeto e quero me matricular no pacote: ${courseName}.`
    : `Olá! Vi o CodeZimpeto e quero saber mais sobre os cursos.`;
  const encoded = encodeURIComponent(msg);

  modalWa1.href = `https://wa.me/258857592248?text=${encoded}`;
  modalWa2.href = `https://wa.me/258848699933?text=${encoded}`;

  if (courseName) {
    modalCourse.textContent = `📦 Pacote seleccionado: ${courseName}`;
    modalCourse.style.display = 'block';
  } else {
    modalCourse.style.display = 'none';
  }

  modalOverlay.hidden = false;
  document.body.style.overflow = 'hidden';
  modalOverlay.focus?.();
}

function closeModal() {
  modalOverlay.hidden = true;
  document.body.style.overflow = '';
}

// Fechar modal ao clicar no overlay
modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});

// Fechar com Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !modalOverlay.hidden) closeModal();
});


/* ================================================================
   10. FORMULÁRIO DE MATRÍCULA → Redireciona para WhatsApp
   ================================================================ */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(e) {
  e.preventDefault();

  const name      = document.getElementById('name').value.trim();
  const phone     = document.getElementById('phone').value.trim();
  const course    = document.getElementById('course').value;
  const modalidadeEl = document.getElementById('modalidade');
  const modalidade= modalidadeEl ? modalidadeEl.value : '';
  const message   = document.getElementById('message').value.trim();

  // Validação básica
  if (!name || !phone || !course) {
    showFormAlert('Por favor, preenche todos os campos obrigatórios (*).', 'error');
    return;
  }

  // Monta texto para WhatsApp
  const courseLabels = {
    basico:        'Básico — 1.000 MT',
    intermediario: 'Intermediário — 2.000 MT',
    completo:      'Completo — 2.800 MT',
  };
  const modalidadeLabels = {
    presencial: 'Presencial (Zimpeto)',
    online:     'Online',
    hibrido:    'Híbrido',
  };

  const waText = [
    `Olá! Vim pelo site CodeZimpeto e gostaria de me matricular.`,
    ``,
    `👤 *Nome:* ${name}`,
    `📱 *Telefone:* ${phone}`,
    `📦 *Pacote:* ${courseLabels[course] || course}`,
    `🎓 *Modalidade:* ${modalidadeLabels[modalidade] || modalidade}`,
    message ? `💬 *Mensagem:* ${message}` : '',
  ].filter(Boolean).join('\n');

  const encoded = encodeURIComponent(waText);
  // 🔧 PERSONALIZAÇÃO: mude o número padrão aqui (número 1 é o padrão para formulário)
  const waUrl   = `https://wa.me/258857592248?text=${encoded}`;

  showFormAlert('✅ A redirecionar para o WhatsApp...', 'success');

  setTimeout(() => {
    window.open(waUrl, '_blank', 'noopener');
    contactForm.reset();
    showFormAlert('', 'clear');
  }, 1200);
}

/** Mostra mensagem de estado no formulário */
function showFormAlert(msg, type) {
  let alertEl = document.getElementById('formAlert');
  if (!alertEl) {
    alertEl = document.createElement('div');
    alertEl.id = 'formAlert';
    alertEl.style.cssText = `
      padding: .75rem 1rem;
      border-radius: .5rem;
      font-size: .9rem;
      font-weight: 600;
      margin-top: -.5rem;
      transition: all .2s;
    `;
    contactForm.insertBefore(alertEl, contactForm.querySelector('button[type="submit"]'));
  }
  if (type === 'clear') {
    alertEl.remove();
    return;
  }
  alertEl.textContent = msg;
  alertEl.style.background = type === 'success' ? '#d1fae5' : '#fee2e2';
  alertEl.style.color      = type === 'success' ? '#065f46' : '#991b1b';
  alertEl.style.border     = `1px solid ${type === 'success' ? '#a7f3d0' : '#fca5a5'}`;
}

/** Rola até ao formulário de contato */
function scrollToForm() {
  document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });
}


/* ================================================================
   11. REVEAL ANIMATION (scroll)
   ================================================================ */
// Adiciona classe .reveal a todos os cards para animação de entrada
const revealEls = [
  ...document.querySelectorAll('.pricing-card, .module-card, .testimonial-card, .project-card, .stat-card, .highlight, .about-highlights .highlight'),
];

revealEls.forEach((el, i) => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity .5s ease ${(i % 4) * 0.08}s, transform .5s ease ${(i % 4) * 0.08}s`;
});

const observerReveal = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
      observerReveal.unobserve(entry.target);
    }
  });
}, { threshold: .12 });

revealEls.forEach(el => observerReveal.observe(el));


/* ================================================================
   12. SMOOTH SCROLL para links ancora
   ================================================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = navbar.offsetHeight + 8;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* ================================================================
   13. INICIALIZAÇÃO
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  console.log('%c🇲🇿 CodeZimpeto', 'color:#009639;font-size:1.4rem;font-weight:bold');
  console.log('%cAprende a programar em Maputo! wa.me/258857592248', 'color:#555;font-size:.9rem');
});
