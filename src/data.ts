// All site content in one place. Every fact here comes from the resume or the
// EvidenceRAG README; edit this file, not the components, to update the site.

export const profile = {
  name: 'Sahil Lenka',
  tagline: 'B.Tech CSE (AIML) · Manipal University Jaipur · Class of 2028',
  intro: 'I build full-stack products and contribute to open source, where my code ships under real maintainer review.',
  email: 'sahillenka44@gmail.com',
  github: 'https://github.com/Sahil-u07',
  linkedin: 'https://www.linkedin.com/in/sahil-lenka-3608a2311',
};

export const about = {
  paragraphs: [
    "I'm Sahil, a computer science student at Manipal University Jaipur, specialising in AI and machine learning. I've learned the most by shipping: two internships building real products, and a steady run of pull requests to open-source projects where maintainers review every line.",
    'My biggest open-source piece is a security scanner for Beehive that maps every API auth check and flags the endpoints that have none. It surfaced six real vulnerabilities. I also built a DICOM routing engine for Diomede and have merged work in Concore and GNU Radio.',
    "On my own I built EvidenceRAG, a document Q&A system that won't answer unless it can back the answer with evidence. Check before you claim: that idea runs through most of what I build.",
  ],
  facts: [
    { label: 'Studying', value: 'B.Tech CSE (AIML), Manipal University Jaipur, class of 2028' },
    { label: 'Worked at', value: 'IOTA Studio AI and Sundarone, as an intern' },
    { label: 'Open source', value: 'Beehive, Diomede, Concore and GNU Radio' },
    { label: 'Focus', value: 'Full-stack web, security tooling and retrieval systems' },
  ],
};

export const stats = [
  { value: 6, label: 'real vulnerabilities found in Beehive by my audit tool' },
  { value: 30, suffix: '+', label: 'PRs across Beehive, Concore, Diomede and GNU Radio' },
  { text: 'Top 35', label: 'of 10,000+ teams at HackRx 6.0 (Bajaj Finserv)' },
  { value: 97, label: 'backend tests passing in EvidenceRAG' },
];

export const evidenceRag = {
  repo: 'https://github.com/Sahil-u07/evidencerag',
  motto: 'Retrieve evidence first. Generate from it. Verify before answering.',
  summary:
    "A local-first document intelligence platform that answers questions from your own documents using hybrid retrieval, cross-encoder reranking, grounded generation, citation alignment and NLI-based verification, and abstains when the evidence isn't enough.",
  tags: ['Python', 'FastAPI', 'React', 'TypeScript', 'Ollama', 'Sentence Transformers', 'SSE'],
  stages: [
    { name: 'Ingest & chunk', detail: 'Loads PDF, TXT or Markdown files and splits them into retrievable passages.' },
    { name: 'Index', detail: 'Persists chunks, metadata and embedding matrices. SHA-256 fingerprints mean unchanged documents are never re-embedded.' },
    { name: 'Dense search', detail: 'Semantic similarity search with all-MiniLM-L6-v2 embeddings.' },
    { name: 'BM25 search', detail: 'Exact-term matching, so identifiers and technical terms are not missed by the semantic search.' },
    { name: 'RRF fusion', detail: 'Reciprocal Rank Fusion merges the dense and BM25 ranked lists into one candidate set.' },
    { name: 'Rerank', detail: 'A cross-encoder (ms-marco-MiniLM-L-6-v2) re-scores the candidates for a precise final order.' },
    { name: 'Generate', detail: 'A local Ollama model (llama3.2:1b) answers using only the retrieved evidence and cites it as [Evidence N].' },
    { name: 'Verify (NLI)', detail: 'Each cited claim is checked against its evidence with an NLI cross-encoder, plus a strict lexical fallback. Unsupported answers become abstentions.' },
  ],
  // README "Evaluation" table, 20-question benchmark.
  metrics: { r1: 'Recall@1', r3: 'Recall@3', r5: 'Recall@5', mrr: 'MRR', ndcg: 'nDCG@5' },
  benchmark: {
    Dense: { r1: 0.6, r3: 1, r5: 1, mrr: 0.975, ndcg: 0.974 },
    BM25: { r1: 0.55, r3: 0.875, r5: 0.925, mrr: 0.925, ndcg: 0.885 },
    'Hybrid (RRF)': { r1: 0.6, r3: 0.9, r5: 0.975, mrr: 0.975, ndcg: 0.936 },
    'Reranked hybrid': { r1: 0.65, r3: 0.975, r5: 0.975, mrr: 1, ndcg: 0.973 },
  },
};

export type Metric = keyof typeof evidenceRag.metrics;

export const openSource = [
  {
    name: 'Beehive', org: 'KathiraveluLab', url: 'https://github.com/KathiraveluLab/Beehive',
    sub: 'Security Audit Tool · 14+ PRs',
    body: [
      'Built a static scanner that maps every API auth decorator and flags unprotected endpoints with exact file and line references.',
      'Other PRs covered testing infrastructure, CI linting, API refactoring and security hardening, most of them merged.',
    ],
    severity: { Critical: 1, High: 4, Medium: 1 },
    tags: ['Python', 'Flask', 'GitHub Actions'],
  },
  {
    name: 'Diomede', org: 'KathiraveluLab', url: 'https://github.com/KathiraveluLab/Diomede',
    sub: 'Dynamic DICOM Routing Module · 3 PRs',
    body: ['Implemented the routing engine, weighted destination scoring and a health-checker daemon for adaptive DICOM routing across multiple Orthanc nodes.'],
    tags: ['Python', 'pynetdicom', 'Docker Compose'],
  },
  {
    name: 'Concore', org: 'ControlCore-Project', url: 'https://github.com/ControlCore-Project/concore',
    sub: '12+ PRs merged',
    body: ['Merged contributions to Concore under maintainer review.'],
  },
  {
    name: 'GNU Radio', org: 'gnuradio', url: 'https://github.com/gnuradio/gnuradio',
    sub: '2 PRs merged',
    body: ['Merged contributions to the GNU Radio signal-processing toolkit.'],
  },
];

export const projects = [
  {
    name: 'EvidenceRAG', kind: 'Personal project · AI / RAG',
    summary: 'Local-first document Q&A that retrieves evidence first, generates only from it, and verifies every cited claim before answering. It abstains when the evidence is not enough.',
    highlights: ['Hybrid dense + BM25 retrieval with RRF', 'Cross-encoder reranking, MRR 1.000 on its benchmark', 'NLI verification, 97 backend tests'],
    tags: ['Python', 'FastAPI', 'React', 'Ollama'],
    links: [{ label: 'Deep dive', href: '#evidencerag' }, { label: 'Source', href: 'https://github.com/Sahil-u07/evidencerag' }],
  },
  {
    name: 'This portfolio', kind: 'Personal project · Frontend',
    summary: 'The site you are on. Every interaction is hand-built with no UI, animation or icon libraries.',
    highlights: ['3D nearest-neighbour search in the hero, no 3D library', 'Playwright browser test in CI on every PR', 'Auto-deploys to GitHub Pages from main'],
    tags: ['React', 'TypeScript', 'Vite', 'Canvas'],
    links: [{ label: 'Live', href: 'https://sahil-u07.github.io/Portfoliov1/' }, { label: 'Source', href: 'https://github.com/Sahil-u07/Portfoliov1' }],
  },
  {
    name: 'ProjectMUJToppers', kind: 'Live product · Full-stack',
    summary: 'A platform featuring university toppers, with authentication, an admin dashboard and student database integration, built collaboratively with feature branching.',
    highlights: ['Authentication and admin dashboard', 'Student database integration', 'In production at mujtoppers.in'],
    tags: ['React.js', 'Node.js', 'MongoDB'],
    links: [{ label: 'Live', href: 'https://mujtoppers.in' }],
  },
];

export const experience = [
  {
    when: 'Apr 2025 – Aug 2025 · Remote', role: 'Web Development Intern', org: 'IOTA Studio AI', sub: 'AIC MUJ incubated startup',
    points: [
      "Built and deployed the company's official full-stack website with React.js, Node.js and REST APIs, with 10+ production-level commits merged into the main codebase.",
      'Designed the API architecture with clean frontend/backend separation and MongoDB/SQL integration for content handling.',
    ],
  },
  {
    when: 'Feb 2024 – May 2024', role: 'Software Development Intern', org: 'Sundarone Private Limited', sub: 'sundaronehostel.in',
    points: [
      'Integrated the Razorpay payment gateway, contributing to a 15% increase in bookings.',
      'Led UX iteration cycles that resulted in a 20% increase in user retention.',
    ],
  },
  {
    when: 'Expected 2028', role: 'B.Tech, Computer Science & Engineering', org: 'Manipal University Jaipur',
    sub: 'AIML specialization · Don Bosco School, Bandel: Class XII (2024), Class X (2022)', points: [],
  },
];

export const skills: Record<string, string[]> = {
  Languages: ['Python', 'JavaScript', 'TypeScript', 'C++', 'Java', 'HTML/CSS'],
  Frameworks: ['React.js', 'Node.js', 'Express.js', 'Flask', 'FastAPI', 'TailwindCSS'],
  Databases: ['MongoDB', 'PostgreSQL', 'SQL'],
  Tools: ['Git', 'GitHub Actions (CI/CD)', 'Docker (basics)', 'Linux', 'Postman', 'Vercel', 'Netlify'],
  Other: ['REST APIs', 'JWT Auth', 'RBAC', 'Security Hardening', 'Full-Stack Architecture'],
};

export const achievements = [
  { title: 'HackRx 6.0 (Bajaj Finserv)', body: 'Top 35 out of 10,000+ teams in a national-level hackathon.' },
  { title: 'Smart Delhi Ideathon', body: '3rd place in category at a government-backed tech innovation competition.' },
  { title: '3× Hackathon Finalist', body: 'Reached the finals of three university-level and national hackathons.' },
];

export const sections = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'open-source', label: 'Open source' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];
