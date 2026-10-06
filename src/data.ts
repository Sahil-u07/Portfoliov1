// All site content in one place. Every fact here comes from the resume or the
// EvidenceRAG README; edit this file, not the components, to update the site.

export const profile = {
  name: 'Sahil Lenka',
  role: 'Full-stack developer',
  tagline: 'B.Tech CSE (AIML) · Manipal University Jaipur · Class of 2028',
  intro: "I like building things people actually use. Most of my time goes into web apps, open-source projects, and an AI side project that only answers when it can show where the answer came from.",
  email: 'sahillenka44@gmail.com',
  github: 'https://github.com/Sahil-u07',
  linkedin: 'https://www.linkedin.com/in/sahil-lenka-3608a2311',
  cv: `${import.meta.env.BASE_URL}Sahil-Lenka-CV.pdf`,
};

export const about = {
  paragraphs: [
    "I'm doing my B.Tech in Computer Science (AI and ML) at Manipal University Jaipur. Most of what I know I picked up by building things: two internships, a team project that's live, and a lot of pull requests to open-source projects.",
    "At IOTA Studio AI I built the company's website from start to finish with React, Node.js and a REST API. Before that, at Sundarone, I added Razorpay payments to their hostel-booking site, which helped push bookings up by 15%.",
    "My favourite side project is EvidenceRAG. You give it your documents and ask questions, and it only answers if it can point to the exact passage that backs the answer up. If it can't, it just says it doesn't know.",
  ],
  facts: [
    { label: 'Studying', value: 'B.Tech CSE (AIML), Manipal University Jaipur, class of 2028' },
    { label: 'Worked at', value: 'IOTA Studio AI and Sundarone, as an intern' },
    { label: 'Stack', value: 'React, Node.js, Python, FastAPI and MongoDB' },
    { label: 'Into', value: 'Web development, security tooling and search' },
  ],
  quote: 'Most of what I know I picked up by building things.',
  // Back of the ID card: one line each, all from the resume.
  card: [
    'Full-stack developer',
    'B.Tech CSE (AIML), Manipal University Jaipur',
    '100+ open-source contributions',
    'Builds EvidenceRAG and RoadGuard AI',
    'Top 35 of 10,000+ teams at HackRx 6.0',
  ],
};

export const evidenceRag = {
  repo: 'https://github.com/Sahil-u07/evidencerag',
  motto: 'Retrieve evidence first. Generate from it. Verify before answering.',
  summary:
    "Ask questions about your own documents, fully offline. It searches them two ways (by meaning and by exact keywords), reranks what it finds, writes an answer using only those passages, and then checks every citation. If the evidence isn't good enough, it refuses instead of guessing.",
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
    sub: 'Security Audit Tool · 13 merged PRs',
    body: 'Built a scanner that finds unprotected API endpoints, hardened secrets and config, and added tests and linting to CI.',
    tags: ['Python', 'Flask', 'React', 'GitHub Actions'],
  },
  {
    name: 'Concore', org: 'ControlCore-Project', url: 'https://github.com/ControlCore-Project/concore',
    sub: 'Neuromodulation simulation protocol · 13 merged PRs',
    body: 'Built the concore command-line tool, set up tests and CI, and fixed shared-memory and simulation-time bugs.',
    tags: ['Python', 'C++', 'MATLAB', 'ZeroMQ'],
  },
  {
    name: 'Diomede', org: 'KathiraveluLab', url: 'https://github.com/KathiraveluLab/Diomede',
    sub: 'Dynamic DICOM Routing Module · 5 merged PRs',
    body: 'Built the routing engine that sends medical images to the healthiest of several servers, plus its tests.',
    tags: ['Python', 'pynetdicom', 'Docker Compose'],
  },
  {
    name: 'GNU Radio', org: 'gnuradio', url: 'https://github.com/gnuradio/gnuradio',
    sub: 'Signal-processing toolkit · 2 merged PRs',
    body: 'Fixed redundant signals in the GRC Qt editor and updated the WAV file blocks for libsndfile.',
    tags: ['Python', 'Qt', 'C++'],
  },
];

export const projects = [
  {
    name: 'EvidenceRAG', kind: 'Personal project · AI / RAG',
    summary: "Ask a question about your own documents and get an answer you can check. It finds the evidence first, answers only from it, verifies every citation, and says so when the evidence isn't there.",
    highlights: ['Hybrid dense + BM25 retrieval with RRF', 'Cross-encoder reranking, MRR 1.000 on its benchmark', 'NLI verification, 97 backend tests'],
    tags: ['Python', 'FastAPI', 'React', 'Ollama'],
    links: [{ label: 'How it works', href: '#evidencerag' }, { label: 'Source', href: 'https://github.com/Sahil-u07/evidencerag' }],
  },
  {
    name: 'RoadGuard AI', kind: 'Team project · Computer vision · In progress',
    summary: "A university team project that spots potholes, cracks and speed bumps in road photos and video, so damage can be reported and fixed before it causes accidents. We're training the full model right now.",
    highlights: ['A tested script that merges road datasets with different labels into one', 'Pilot crack model: mAP@0.5 of 0.606', 'Streamlit demo for images and video'],
    tags: ['Python', 'YOLOv8', 'Streamlit', 'OpenCV'],
    links: [{ label: 'Source', href: 'https://github.com/Sahil-u07/roadguard-ai' }],
  },
  {
    name: 'This portfolio', kind: 'Personal project · Frontend',
    summary: "The site you're on right now. The 3D search sketch, the scroll effects and the smooth scrolling are built from scratch, without any UI, animation or 3D libraries.",
    highlights: ['A 3D sketch you can drag around, on a plain canvas', 'Browser tests run on every pull request', 'Goes live on GitHub Pages with every merge'],
    tags: ['React', 'TypeScript', 'Vite', 'Canvas'],
    links: [{ label: 'Live', href: 'https://sahil-u07.github.io/Portfoliov1/' }, { label: 'Source', href: 'https://github.com/Sahil-u07/Portfoliov1' }],
  },
  {
    name: 'ProjectMUJToppers', kind: 'Live product · Full-stack',
    summary: "A site that showcases toppers at our university, with logins, an admin dashboard and a student database. We built it as a team using feature branches, and it's live.",
    highlights: ['Sign-in and an admin dashboard', 'Student database behind it', 'Live at mujtoppers.in'],
    tags: ['React.js', 'Node.js', 'MongoDB'],
    links: [{ label: 'Live', href: 'https://mujtoppers.in' }],
  },
];

// Oldest first, so the timeline reads as a path.
export const experience = [
  {
    when: '2024 – 2028 (expected)', role: 'B.Tech, Computer Science & Engineering', org: 'Manipal University Jaipur',
    sub: 'AIML specialization · Don Bosco School, Bandel: Class XII (2024), Class X (2022)', points: [],
  },
  {
    when: 'Feb 2024 – May 2024', role: 'Software Development Intern', org: 'Sundarone Private Limited', sub: 'sundaronehostel.in',
    points: [
      'Added Razorpay payments to the booking flow, which helped bookings go up 15%.',
      'Ran a few rounds of UX changes that improved user retention by 20%.',
    ],
  },
  {
    when: 'Apr 2025 – Aug 2025 · Remote', role: 'Web Development Intern', org: 'IOTA Studio AI', sub: 'AIC MUJ incubated startup',
    points: [
      "Built the company's website from start to finish with React.js, Node.js and REST APIs, and got more than 10 commits into their production codebase.",
      'Set up the API so the frontend and backend stayed separate, with MongoDB and SQL storing the content.',
    ],
  },
];

export const skills: Record<string, string[]> = {
  Languages: ['Python', 'JavaScript', 'TypeScript', 'C++', 'Java', 'HTML/CSS'],
  Frameworks: ['React.js', 'Node.js', 'Express.js', 'Flask', 'FastAPI', 'TailwindCSS'],
  Databases: ['MongoDB', 'PostgreSQL', 'SQL'],
  Tools: ['Git', 'GitHub Actions (CI/CD)', 'Docker (basics)', 'Linux', 'Postman', 'Vercel', 'Netlify'],
  Other: ['REST APIs', 'JWT Auth', 'RBAC', 'Security Hardening', 'Full-Stack Architecture'],
};

// Each card's big number counts up the first time it is seen.
export const achievements: { value: number; prefix?: string; suffix?: string; label: string; caption: string; detail?: string }[] = [
  { value: 35, prefix: 'Top ', label: 'HackRx 6.0', caption: 'Bajaj Finserv national hackathon', detail: 'Top 35 out of 10,000+ teams' },
  { value: 100, suffix: '+', label: 'Open-source contributions', caption: 'Across four projects', detail: 'Including 33 merged pull requests' },
  { value: 15, suffix: '%', label: 'More bookings', caption: 'Sundarone internship', detail: 'After I added Razorpay payments' },
  { value: 3, suffix: 'rd', label: 'Smart Delhi Ideathon', caption: 'Government-backed innovation contest', detail: 'Third place in our category' },
  { value: 97, label: 'Backend tests', caption: 'EvidenceRAG' },
  { value: 3, suffix: '×', label: 'Hackathon finalist', caption: 'University and national level' },
];

export const sections = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'open-source', label: 'Open source' },
  { id: 'skills', label: 'Skills' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
];
