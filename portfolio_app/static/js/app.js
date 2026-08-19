// Portfolio dynamique - rendu client
// Toutes les données viennent de /api/portfolio (Flask). Aucune donnée n'est codée en dur ici.

const ICONS = {
  code: '<path d="m9 18-6-6 6-6"/><path d="m15 6 6 6-6 6"/>',
  server: '<rect x="2" y="3" width="20" height="8" rx="2"/><rect x="2" y="13" width="20" height="8" rx="2"/><path d="M6 7h.01M6 17h.01"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
  cloud: '<path d="M17.5 19a4.5 4.5 0 1 0-1.44-8.765 5 5 0 1 0-9.31 2.63A4 4 0 0 0 7.5 19h10Z"/>',
  tool: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z"/>',
};

const icon = (name) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">${ICONS[name] || ICONS.code}</svg>`;

const state = {
  lang: localStorage.getItem('lang') === 'en' ? 'en' : 'fr',
  data: null,
  filter: 'all',
};

async function loadData() {
  const res = await fetch('/api/portfolio');
  if (!res.ok) throw new Error('API error');
  return res.json();
}

function t(obj) {
  return obj[state.lang] ?? obj.fr ?? obj.en;
}

function render() {
  const d = state.data;
  const nav = t(d.nav);
  const hero = t(d.hero);
  const about = t(d.about);
  const specs = t(d.specializations);
  const allProjects = t(d.projects);
  const timeline = t(d.timeline);
  const contact = t(d.contact);
  const footer = t(d.footer);

  const projects =
    state.filter === 'all' ? allProjects : allProjects.filter((p) => p.category === state.filter);

  const app = document.getElementById('app');
  app.innerHTML = `
    <header class="sticky top-0 z-30 border-b border-white/5 bg-ink-strong/90 backdrop-blur">
      <div class="mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-6 py-4 lg:px-10">
        <a href="#home" class="text-xl font-extrabold tracking-tight">${d.brand}</a>

        <nav aria-label="Navigation principale" class="hidden flex-1 items-center justify-center gap-8 md:flex">
          ${nav
            .map(
              (item, i) => `
              <a href="${item.href}" data-nav
                 class="nav-link relative py-2 text-sm text-slate-300 transition hover:text-white ${i === 0 ? 'text-white' : ''}">
                ${item.label}
              </a>`,
            )
            .join('')}
        </nav>

        <div class="flex items-center gap-3">
          <button id="lang-toggle" type="button"
            class="flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-sm font-medium transition hover:border-cyan/40">
            ${state.lang === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN'}
          </button>
          <a href="#contact" class="hidden rounded-lg bg-white/10 px-5 py-2 text-sm font-semibold transition hover:border-cyan/40 border border-white/10 sm:inline-flex">
            ${state.lang === 'fr' ? 'Contact' : 'Resume'}
          </a>
          <button id="menu-toggle" type="button" aria-label="Menu" class="grid h-9 w-9 place-items-center rounded-lg border border-white/10 md:hidden">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          </button>
        </div>
      </div>
      <nav id="mobile-nav" class="hidden flex-col gap-1 border-t border-white/5 px-6 py-3 md:hidden">
        ${nav.map((item) => `<a href="${item.href}" data-nav class="nav-link rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5">${item.label}</a>`).join('')}
      </nav>
    </header>

    <main class="w-full">
      <!-- HERO -->
      <section id="home" class="mx-auto flex min-h-[85vh] w-full max-w-[1600px] flex-col items-center justify-center px-6 py-24 text-center lg:px-10">
        <span class="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-[0.68rem] tracking-[0.15em] text-slate-300">
          <span class="h-2 w-2 rounded-full bg-cyan shadow-[0_0_12px_rgba(78,215,255,0.75)]"></span>
          ${hero.badge}
        </span>

        <h1 class="text-6xl font-extrabold leading-[0.95] tracking-tighter sm:text-7xl lg:text-8xl">${hero.name}</h1>
        <h2 class="mt-4 text-3xl font-bold text-cyan sm:text-4xl lg:text-5xl">${hero.role}</h2>

        <p class="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl">${hero.copy}</p>

        <div class="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <a href="#projects" class="w-full rounded-xl bg-white px-7 py-3 text-center font-bold text-ink-strong transition hover:-translate-y-0.5 sm:w-auto">${hero.ctaPrimary}</a>
          <a href="#contact" class="w-full rounded-xl border border-white/15 px-7 py-3 text-center font-semibold text-white transition hover:-translate-y-0.5 hover:border-cyan/40 sm:w-auto">${hero.ctaSecondary}</a>
        </div>

        <div class="mt-10 flex flex-wrap justify-center gap-3" aria-label="Technologies">
          ${d.techStack.map((tItem) => `<span class="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-xs tracking-wide text-slate-300">${tItem}</span>`).join('')}
        </div>
      </section>

      <!-- ABOUT -->
      <section id="about" class="mx-auto grid w-full max-w-[1600px] gap-12 px-6 py-20 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:px-10">
        <div class="overflow-hidden rounded-3xl border border-white/5 shadow-2xl">
          <img src="${about.image}" alt="Portrait" class="about-photo h-full w-full object-cover" />
        </div>
        <div>
          <h3 class="text-4xl font-extrabold tracking-tighter sm:text-5xl">${about.title}</h3>
          <p class="mt-5 text-lg leading-relaxed text-slate-300">${about.text}</p>
          <div class="mt-10 grid grid-cols-3 gap-5">
            ${about.stats
              .map(
                (s) => `
              <div>
                <strong class="block text-3xl font-extrabold sm:text-4xl">${s.value}</strong>
                <span class="text-sm text-slate-400">${s.label}</span>
              </div>`,
              )
              .join('')}
          </div>
        </div>
      </section>

      <!-- SKILLS -->
      <section id="skills" class="mx-auto w-full max-w-[1600px] px-6 py-20 text-center lg:px-10">
        <h3 class="text-4xl font-extrabold tracking-tighter sm:text-5xl">${state.lang === 'fr' ? 'Compétences clés' : 'Core Specializations'}</h3>
        <p class="mx-auto mt-3 max-w-xl text-slate-300">${state.lang === 'fr' ? 'Une stack pensée pour construire le web de demain.' : 'A curated stack for building the future of the web.'}</p>

        <div class="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          ${specs
            .map(
              (card) => `
              <article class="rounded-2xl border border-white/5 bg-panel/80 p-6 text-left transition hover:border-cyan/30">
                <div class="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-white/5 text-cyan">${icon(card.icon)}</div>
                <h4 class="mb-4 text-xl font-bold tracking-tight">${card.title}</h4>
                <ul class="flex flex-col gap-2 text-sm text-slate-300">
                  ${card.items.map((it) => `<li>${it}</li>`).join('')}
                </ul>
              </article>`,
            )
            .join('')}
        </div>
      </section>

      <!-- PROJECTS -->
      <section id="projects" class="mx-auto w-full max-w-[1600px] px-6 py-20 lg:px-10">
        <div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 class="text-4xl font-extrabold tracking-tighter sm:text-5xl">${state.lang === 'fr' ? 'Projets phares' : 'Featured Case Studies'}</h3>
            <p class="mt-3 max-w-lg text-slate-300">${state.lang === 'fr' ? 'Une sélection de projets illustrant ma polyvalence technique.' : 'Handpicked projects that showcase my technical depth and creative breadth.'}</p>
          </div>
          <div class="flex flex-wrap gap-2" id="filter-tabs">
            ${['all', 'frontend', 'backend', 'fullstack']
              .map(
                (f) => `
                <button data-filter="${f}" type="button"
                  class="filter-btn rounded-lg border px-4 py-2 text-sm font-medium transition ${
                    state.filter === f
                      ? 'border-white/20 bg-white/5 text-white'
                      : 'border-white/10 text-slate-300 hover:border-white/20'
                  }">
                  ${{ all: state.lang === 'fr' ? 'Tous' : 'All', frontend: 'Frontend', backend: 'Backend', fullstack: 'Full Stack' }[f]}
                </button>`,
              )
              .join('')}
          </div>
        </div>

        <div class="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2" id="projects-grid">
          ${
            projects.length
              ? projects
                  .map(
                    (p) => `
              <article class="fade-in overflow-hidden rounded-2xl border border-white/5 bg-panel/80">
                <div class="h-72 bg-cover bg-center" style="background-image:url('${p.image}')"></div>
                <div class="p-5">
                  <span class="inline-flex rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-[0.7rem] tracking-widest text-slate-300">${p.label}</span>
                  <h4 class="mt-4 text-2xl font-extrabold tracking-tight">${p.title}</h4>
                  <p class="mt-2 text-slate-300">${p.description}</p>
                </div>
              </article>`,
                  )
                  .join('')
              : `<p class="col-span-2 py-10 text-center text-slate-400">${state.lang === 'fr' ? 'Aucun projet dans cette catégorie.' : 'No project in this category.'}</p>`
          }
        </div>
      </section>

      <!-- EXPERIENCE -->
      <section id="experience" class="mx-auto w-full max-w-[1600px] px-6 py-20 text-center lg:px-10">
        <h3 class="text-4xl font-extrabold tracking-tighter sm:text-5xl">${state.lang === 'fr' ? 'Parcours professionnel' : 'Professional Timeline'}</h3>
        <p class="mx-auto mt-3 max-w-xl text-slate-300">${state.lang === 'fr' ? "L'évolution à travers différents écosystèmes techniques." : 'The journey through tech ecosystems and architectural challenges.'}</p>

        <div class="timeline-line relative mx-auto mt-12 max-w-3xl pl-3 text-left">
          ${timeline
            .map(
              (item, i) => `
              <article class="relative flex gap-6 pb-9 pl-7">
                <span class="absolute -left-1 top-1.5 h-4 w-4 rounded-full border-[3px] ${i === 0 ? 'border-cyan bg-cyan shadow-[0_0_0_6px_rgba(78,215,255,0.2)]' : 'border-cyan/70 bg-ink-strong'}"></span>
                <div>
                  <span class="text-sm text-slate-400">${item.period}</span>
                  <h4 class="mt-2 text-2xl font-bold tracking-tight">${item.role}</h4>
                  <p class="mt-1 text-slate-300">${item.company}</p>
                  <p class="mt-3 text-slate-300">${item.summary}</p>
                  <div class="mt-3 flex flex-wrap gap-2">
                    ${item.tags.map((tag) => `<span class="rounded-full border border-white/10 px-2.5 py-1 text-xs text-slate-300">${tag}</span>`).join('')}
                  </div>
                </div>
              </article>`,
            )
            .join('')}
        </div>
      </section>

      <!-- CONTACT -->
      <section id="contact" class="mx-auto w-full max-w-[1600px] px-6 py-20 lg:px-10">
        <div class="text-center">
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-cyan">${contact.eyebrow}</p>
          <h3 class="mt-3 text-4xl font-extrabold tracking-tighter sm:text-5xl">${contact.title}</h3>
        </div>

        <div class="mt-12 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <div class="grid gap-4">
            <div class="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <span class="mb-2 block text-xs uppercase tracking-widest text-slate-400">Email</span>
              <a href="mailto:${d.contact.email}" class="text-lg">${d.contact.email}</a>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <span class="mb-2 block text-xs uppercase tracking-widest text-slate-400">${state.lang === 'fr' ? 'Téléphone' : 'Phone'}</span>
              <a href="tel:${d.contact.phone.replace(/\s/g, '')}" class="text-lg">${d.contact.phone}</a>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <span class="mb-2 block text-xs uppercase tracking-widest text-slate-400">${state.lang === 'fr' ? 'Localisation' : 'Location'}</span>
              <p class="text-lg">${d.contact.location}</p>
            </div>
          </div>

          <form id="contact-form" class="rounded-2xl border border-white/10 bg-white/[0.02] p-7" novalidate>
            <h4 class="mb-5 text-xl font-bold">${contact.formTitle}</h4>
            <div class="grid gap-4">
              <div>
                <input name="name" type="text" placeholder="${contact.namePlaceholder}"
                  class="w-full rounded-xl border border-white/10 bg-transparent px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan/50 focus:outline-none" />
                <p class="field-error mt-1 text-sm text-red-400" data-error-for="name"></p>
              </div>
              <div>
                <input name="email" type="email" placeholder="${contact.emailPlaceholder}"
                  class="w-full rounded-xl border border-white/10 bg-transparent px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan/50 focus:outline-none" />
                <p class="field-error mt-1 text-sm text-red-400" data-error-for="email"></p>
              </div>
              <div>
                <textarea name="message" rows="4" placeholder="${contact.messagePlaceholder}"
                  class="w-full resize-none rounded-xl border border-white/10 bg-transparent px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan/50 focus:outline-none"></textarea>
                <p class="field-error mt-1 text-sm text-red-400" data-error-for="message"></p>
              </div>
              <button type="submit" class="rounded-xl bg-cyan px-6 py-3 font-bold text-ink-strong transition hover:brightness-110">
                ${contact.submit}
              </button>
              <p id="form-status" class="text-sm"></p>
            </div>
          </form>
        </div>
      </section>
    </main>

    <footer class="border-t border-white/5 bg-black/20 px-6 py-8 text-center text-sm text-slate-400">
      <p>© ${new Date().getFullYear()} ${d.brand}. ${footer}</p>
      <p id="visit-counter" class="mt-1 text-xs text-slate-500"></p>
    </footer>
  `;

  attachEvents();
  observeSections();
  loadStats();
}

function attachEvents() {
  document.getElementById('lang-toggle').addEventListener('click', () => {
    state.lang = state.lang === 'fr' ? 'en' : 'fr';
    localStorage.setItem('lang', state.lang);
    render();
  });

  document.getElementById('menu-toggle').addEventListener('click', () => {
    document.getElementById('mobile-nav').classList.toggle('hidden');
  });

  document.querySelectorAll('[data-nav]').forEach((a) =>
    a.addEventListener('click', () => document.getElementById('mobile-nav').classList.add('hidden')),
  );

  document.querySelectorAll('.filter-btn').forEach((btn) =>
    btn.addEventListener('click', () => {
      state.filter = btn.dataset.filter;
      render();
      document.getElementById('projects').scrollIntoView({ block: 'start' });
    }),
  );

  const form = document.getElementById('contact-form');
  form.addEventListener('submit', handleContactSubmit);
}

async function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const status = document.getElementById('form-status');
  const contact = t(state.data.contact);
  document.querySelectorAll('.field-error').forEach((el) => (el.textContent = ''));
  status.textContent = '';

  const payload = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    message: form.message.value.trim(),
  };

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = contact.sending;

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
      Object.entries(data.errors || {}).forEach(([field, msg]) => {
        const el = form.querySelector(`[data-error-for="${field}"]`);
        if (el) el.textContent = msg;
      });
      status.className = 'text-sm text-red-400';
      status.textContent = contact.error;
    } else {
      status.className = 'text-sm text-cyan';
      status.textContent = contact.success;
      form.reset();
    }
  } catch (err) {
    status.className = 'text-sm text-red-400';
    status.textContent = contact.error;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = contact.submit;
  }
}

function observeSections() {
  const navLinks = document.querySelectorAll('[data-nav]');
  const sections = document.querySelectorAll('main section[id]');

  const updateActive = (id) => {
    navLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('text-white', active);
      link.classList.toggle('text-slate-300', !active);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) updateActive(visible.target.id);
    },
    { threshold: [0.25, 0.45, 0.7], rootMargin: '-15% 0px -40% 0px' },
  );

  sections.forEach((s) => observer.observe(s));
}

async function loadStats() {
  try {
    const res = await fetch('/api/stats');
    const stats = await res.json();
    const el = document.getElementById('visit-counter');
    if (el) el.textContent = state.lang === 'fr' ? `Visite n°${stats.visits}` : `Visit #${stats.visits}`;
  } catch (err) {
    // le compteur n'est pas critique : on échoue silencieusement
  }
}

(async function init() {
  try {
    state.data = await loadData();
    render();
  } catch (err) {
    document.getElementById('app').innerHTML = `
      <div class="flex min-h-screen items-center justify-center px-6 text-center">
        <div>
          <p class="text-xl font-bold text-red-400">Impossible de charger le portfolio.</p>
          <p class="mt-2 text-slate-400">Vérifiez que le serveur Flask est bien lancé.</p>
        </div>
      </div>`;
    console.error(err);
  }
})();
