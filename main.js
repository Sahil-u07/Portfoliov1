const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const sleep = ms => new Promise(r => setTimeout(r, reduceMotion ? 0 : ms));

document.documentElement.classList.add('js');

// Reveal on scroll, count up stats, and highlight the nav link of the section in view.
const revealer = new IntersectionObserver(entries => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    e.target.classList.add('in');
    $$('[data-count]', e.target).forEach(countUp);
    revealer.unobserve(e.target);
  }
}, { rootMargin: '0px 0px -10% 0px' });
$$('.reveal').forEach(el => revealer.observe(el));

function countUp(el) {
  const end = +el.dataset.count, suffix = el.dataset.suffix || '';
  if (reduceMotion) return;
  const start = performance.now();
  const tick = now => {
    const t = Math.min((now - start) / 900, 1);
    el.textContent = Math.round(end * (1 - (1 - t) ** 3)) + suffix;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const navLinks = $$('.nav nav a');
const spy = new IntersectionObserver(entries => {
  for (const e of entries) {
    if (e.isIntersecting) navLinks.forEach(a => a.classList.toggle('current', a.hash === '#' + e.target.id));
  }
}, { rootMargin: '-45% 0px -50% 0px' });
$$('main section[id]').forEach(s => spy.observe(s));

// Terminal: type the summary out once.
const term = $('#term code');
const highlight = s => s.replace(/^\$.*$/gm, m => `<span class="cmd">${m}</span>`);
const termText = term.textContent;
term.innerHTML = highlight(termText);
if (!reduceMotion) {
  let i = 0;
  const typer = setInterval(() => {
    i += 2;
    term.innerHTML = highlight(termText.slice(0, i));
    if (i >= termText.length) clearInterval(typer);
  }, 18);
}

// Card spotlight follows the pointer.
$$('.card').forEach(card => card.addEventListener('pointermove', e => {
  const r = card.getBoundingClientRect();
  card.style.setProperty('--x', `${e.clientX - r.left}px`);
  card.style.setProperty('--y', `${e.clientY - r.top}px`);
}));

// EvidenceRAG pipeline walkthrough. Stage text comes from the project README.
const STAGES = [
  ['Ingest & chunk', 'Loads PDF, TXT or Markdown files and splits them into retrievable passages.'],
  ['Index', 'Persists chunks, metadata and embedding matrices. SHA-256 fingerprints mean unchanged documents are never re-embedded.'],
  ['Dense search', 'Semantic similarity search with <code>all-MiniLM-L6-v2</code> embeddings.'],
  ['BM25 search', 'Exact-term matching, so identifiers and technical terms are not missed by the semantic search.'],
  ['RRF fusion', 'Reciprocal Rank Fusion merges the dense and BM25 ranked lists into one candidate set.'],
  ['Rerank', 'A cross-encoder (<code>ms-marco-MiniLM-L-6-v2</code>) re-scores the candidates for a precise final order.'],
  ['Generate', 'A local Ollama model (<code>llama3.2:1b</code>) answers using only the retrieved evidence and cites it as [Evidence N].'],
  ['Verify (NLI)', 'Each cited claim is checked against its evidence with an NLI cross-encoder, plus a strict lexical fallback. Unsupported answers become abstentions.'],
];
const stages = $$('.stage');
const detail = $('#stage-detail');
const verdict = $('#verdict');
const runBtn = $('#run-pipeline');
const toggle = $('#evidence-toggle');

const showStage = i => {
  stages.forEach((s, j) => s.classList.toggle('selected', j === i));
  detail.innerHTML = `<b>${STAGES[i][0]}.</b> ${STAGES[i][1]}`;
};
stages.forEach((s, i) => s.addEventListener('click', () => showStage(i)));

toggle.addEventListener('click', () => {
  const on = toggle.getAttribute('aria-checked') !== 'true';
  toggle.setAttribute('aria-checked', on);
  $('.switch-label', toggle).textContent = `Evidence: ${on ? 'sufficient' : 'insufficient'}`;
});

const setVerdict = (state, html) => { verdict.dataset.state = state; verdict.innerHTML = html; };
const icon = id => `<svg class="ic"><use href="#i-${id}"/></svg>`;

// Query path: indexing already happened at upload time; dense and BM25 run side by side.
const STEPS = [
  [[2, 3], 'retrieving…'], [[4], 'fusing ranks…'], [[5], 'reranking…  retrieval ~1.0 s'],
  [[6], 'generating…  ~2.8 s'], [[7], 'verifying…  ~0.1 s'],
];
runBtn.addEventListener('click', async () => {
  const sufficient = toggle.getAttribute('aria-checked') === 'true';
  runBtn.disabled = toggle.disabled = true;
  stages.forEach((s, i) => s.className = i < 2 ? 'stage done' : 'stage');
  for (const [ids, msg] of STEPS) {
    setVerdict('running', msg);
    ids.forEach(i => stages[i].classList.add('active'));
    showStage(ids.at(-1));
    await sleep(650);
    ids.forEach(i => stages[i].classList.replace('active', 'done'));
  }
  if (sufficient) {
    setVerdict('verified', `${icon('check')} Verified answer with [Evidence N] citations. Total ~3.9 s.`);
  } else {
    stages[7].classList.replace('done', 'halt');
    setVerdict('abstained', `${icon('x')} Abstained: the evidence can't support an answer, so it says so instead of guessing.`);
  }
  runBtn.disabled = toggle.disabled = false;
});

// Retrieval benchmark (README, 20-question set).
const EVAL = {
  Dense: { r1: 0.6, r3: 1, r5: 1, mrr: 0.975, ndcg: 0.974 },
  BM25: { r1: 0.55, r3: 0.875, r5: 0.925, mrr: 0.925, ndcg: 0.885 },
  'Hybrid (RRF)': { r1: 0.6, r3: 0.9, r5: 0.975, mrr: 0.975, ndcg: 0.936 },
  'Reranked hybrid': { r1: 0.65, r3: 0.975, r5: 0.975, mrr: 1, ndcg: 0.973 },
};
const bars = $('.bars');
bars.innerHTML = Object.keys(EVAL).map(name =>
  `<div class="bar" data-name="${name}"><span class="name">${name}</span><span class="track"><span class="fill"></span></span><span class="val"></span></div>`).join('');
function drawMetric(m) {
  const best = Math.max(...Object.values(EVAL).map(r => r[m]));
  $$('.bar', bars).forEach(bar => {
    const v = EVAL[bar.dataset.name][m];
    bar.classList.toggle('best', v === best);
    $('.fill', bar).style.setProperty('--w', `${v * 100}%`);
    $('.val', bar).textContent = v.toFixed(3);
  });
}
const pressOne = (buttons, chosen) => buttons.forEach(b => {
  b.classList.toggle('active', b === chosen);
  b.setAttribute('aria-pressed', b === chosen);
});
const metrics = $$('.metric');
metrics.forEach(b => b.addEventListener('click', () => { pressOne(metrics, b); drawMetric(b.dataset.metric); }));
drawMetric('mrr');

// Skill filter.
const filters = $$('.filter');
filters.forEach(b => b.addEventListener('click', () => {
  pressOne(filters, b);
  $$('.chip').forEach(c => c.hidden = b.dataset.group !== 'all' && c.dataset.group !== b.dataset.group);
}));

// Copy email.
const copyBtn = $('#copy-email');
copyBtn.addEventListener('click', async () => {
  const label = $('span', copyBtn);
  try {
    await navigator.clipboard.writeText('sahillenka44@gmail.com');
    label.textContent = 'Copied to clipboard';
    setTimeout(() => label.textContent = 'sahillenka44@gmail.com', 2000);
  } catch {
    location.href = 'mailto:sahillenka44@gmail.com';
  }
});

// Command palette: native <dialog> gives focus trapping and Esc for free.
const palette = $('#palette');
const input = $('#palette-input');
const list = $('#palette-list');
const go = hash => () => { location.hash = hash; };
const open = url => () => window.open(url, '_blank', 'noopener');
const COMMANDS = [
  ['EvidenceRAG', 'Featured project', go('#work')],
  ['Open source', 'Beehive, Diomede, Concore, GNU Radio', go('#open-source')],
  ['Experience', 'Internships and education', go('#experience')],
  ['Skills', 'Toolbox and achievements', go('#skills')],
  ['Contact', 'Email, LinkedIn, GitHub', go('#contact')],
  ['Back to top', 'Home', go('#top')],
  ['Run the EvidenceRAG demo', 'Pipeline walkthrough', () => { location.hash = '#work'; runBtn.click(); }],
  ['Copy email address', 'sahillenka44@gmail.com', () => copyBtn.click()],
  ['GitHub profile', 'github.com/Sahil-u07', open('https://github.com/Sahil-u07')],
  ['LinkedIn profile', 'linkedin.com/in/sahil-lenka-3608a2311', open('https://www.linkedin.com/in/sahil-lenka-3608a2311')],
  ['EvidenceRAG source', 'github.com/Sahil-u07/evidencerag', open('https://github.com/Sahil-u07/evidencerag')],
];
let shown = [], sel = 0;

function renderPalette() {
  const q = input.value.trim().toLowerCase();
  shown = COMMANDS.filter(([label, hint]) => `${label} ${hint}`.toLowerCase().includes(q));
  sel = Math.min(sel, Math.max(shown.length - 1, 0));
  list.innerHTML = shown.length
    ? shown.map(([label, hint], i) => `<li role="option" data-i="${i}" aria-selected="${i === sel}"><b>${label}</b><span>${hint}</span></li>`).join('')
    : '<li aria-disabled="true"><span>No matches</span></li>';
  list.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
}
function runCommand(i) {
  const cmd = shown[i];
  if (!cmd) return;
  palette.close();
  cmd[2]();
}
function openPalette() {
  input.value = '';
  sel = 0;
  renderPalette();
  palette.showModal();
  input.focus();
}

$$('[data-open-palette]').forEach(b => b.addEventListener('click', openPalette));
input.addEventListener('input', () => { sel = 0; renderPalette(); });
input.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + shown.length) % shown.length;
    renderPalette();
  } else if (e.key === 'Enter') {
    e.preventDefault();
    runCommand(sel);
  }
});
list.addEventListener('click', e => {
  const li = e.target.closest('li[data-i]');
  if (li) runCommand(+li.dataset.i);
});
palette.addEventListener('click', e => { if (e.target === palette) palette.close(); });
document.addEventListener('keydown', e => {
  const typing = e.target.closest('input, textarea');
  if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') || (e.key === '/' && !typing)) {
    e.preventDefault();
    palette.open ? palette.close() : openPalette();
  }
});
