// All site content in one place. Every fact here comes from the resume or the
// project READMEs; edit this file, not the components, to update the site.

export const profile = {
  name: 'Sahil Lenka',
  role: '20', // shown under the name
  tagline: 'B.Tech CSE (AIML) · Manipal University Jaipur · Class of 2028',
  intro: 'Full-stack developer / Open-source contributor. I like building things people actually use.',
  // **text** is shown in bold
  bullets: [
    'Studying Computer Science (AI and ML) at Manipal University Jaipur, class of 2028.',
    'Interned at IOTA Studio AI and Sundarone, building websites and payment flows.',
    '100+ open-source contributions to Beehive, Concore, Diomede and GNU Radio.',
    'Currently building **EvidenceRAG** and **RoadGuard AI**.',
  ],
  quote: 'Do so much work that it would be unreasonable for you to not be successful.',
  quoteBy: 'Alex Hormozi',
  email: 'sahillenka44@gmail.com',
  github: 'https://github.com/Sahil-u07',
  githubUser: 'Sahil-u07',
  linkedin: 'https://www.linkedin.com/in/sahil-lenka-3608a2311',
  cv: `${import.meta.env.BASE_URL}Sahil-Lenka-CV.pdf`,
};

export const openSource = [
  {
    name: 'Beehive', org: 'KathiraveluLab', url: 'https://github.com/KathiraveluLab/Beehive', count: 20,
    sub: 'Security Audit Tool · 20+ contributions',
    body: 'Built a static scanner that hunts for API routes missing auth. It found 6 vulnerabilities (1 critical, 4 high). Also locked down secret handling, turned off debug mode in production, and added tests and linting to CI.',
  },
  {
    name: 'Concore', org: 'ControlCore-Project', url: 'https://github.com/ControlCore-Project/concore', count: 25,
    sub: 'Neuromodulation simulation protocol · 25+ contributions',
    body: 'Wrote the concore CLI from scratch with 6 commands (init, run, validate, inspect, status, stop), and fixed a race where two writers could corrupt the same shared-memory message, using a sequence counter and a POSIX semaphore in Python and C++.',
  },
  {
    name: 'Diomede', org: 'KathiraveluLab', url: 'https://github.com/KathiraveluLab/Diomede', count: 15,
    sub: 'Dynamic DICOM Routing Module · 15+ contributions',
    body: 'Built load-based DICOM routing across several Orthanc servers, then made it fail gracefully: a clean HTTP 503 when Redis is down, and retries for failed acknowledgements.',
  },
  {
    name: 'GNU Radio', org: 'gnuradio', url: 'https://github.com/gnuradio/gnuradio', count: 0,
    sub: 'Signal-processing toolkit · and counting',
    body: 'Fixed redundant signals in the GRC Qt editor and updated the WAV file blocks for libsndfile.',
  },
];

export const projects: { name: string; status: string; summary: string; tags: string[]; href: string; image?: string }[] = [
  {
    name: 'EvidenceRAG', status: 'On GitHub',
    summary: "Ask a question about your own documents and get an answer you can check. It finds the evidence first, answers only from it, verifies every citation, and says so when the evidence isn't there.",
    tags: ['Python', 'FastAPI', 'React', 'Ollama'],
    href: 'https://github.com/Sahil-u07/evidencerag',
    image: 'evidencerag.webp', // the app in its built-in demo mode
  },
  {
    name: 'RoadGuard AI', status: 'Building',
    summary: "A university team project that spots potholes, cracks and speed bumps in road photos and video, so damage can be reported and fixed before it causes accidents.",
    tags: ['Python', 'YOLOv8', 'Streamlit', 'OpenCV'],
    href: 'https://github.com/Sahil-u07/roadguard-ai',
  },
  {
    name: 'ProjectMUJToppers', status: 'Live',
    summary: "A site that showcases toppers at our university, with logins, an admin dashboard and a student database. We built it as a team.",
    tags: ['React.js', 'Node.js', 'MongoDB'],
    href: 'https://mujtoppers.in',
  },
  {
    name: 'This portfolio', status: 'Live',
    summary: "The site you're on right now, built with React and Vite and no UI libraries. Browser tests run on every pull request.",
    tags: ['React', 'TypeScript', 'Vite'],
    href: 'https://github.com/Sahil-u07/Portfoliov1',
    image: 'portfolio.webp',
  },
];

// Newest first, like a CV.
export const experience = [
  {
    when: 'May 2026 – Aug 2026', role: 'Software Development Intern', org: 'Sundarone Private Limited', logo: 'sundarone.webp', sub: 'sundaronehostel.in',
    stats: [{ value: '15%', label: 'More bookings' }, { value: '20%', label: 'Better retention' }, { value: 'Razorpay', label: 'Payments' }, { value: 'May–Aug', label: 'Term' }],
    points: [
      'Added Razorpay payments to the hostel booking flow on sundaronehostel.in, so guests can pay online as they book. Bookings went up 15% after launch.',
      'Worked with the team on rounds of UX changes to the booking pages, which helped lift retention 20%.',
    ],
    tags: ['Razorpay', 'Payments', 'Booking flow', 'UX'],
  },
  {
    // shortcut: no start date yet, add it when known
    when: 'Ongoing', role: 'KathiraveluLab, ControlCore, Krkn (CNCF) & GNU Radio', org: 'Open Source Contributor', logo: 'github', sub: 'Remote',
    stats: [{ value: '100+', label: 'Contributions' }, { value: '40+', label: 'Merged PRs' }, { value: '6', label: 'Vulns found' }, { value: '5', label: 'Projects' }],
    points: [
      'Concore (15 merged PRs): tracked down a race where two writers could corrupt the same shared-memory message, and fixed it with a sequence counter and a POSIX semaphore in Python and C++, backed by 3 regression tests and a C++ CI job.',
      'Concore: wrote the concore CLI from scratch, with 6 commands (init, run, validate, inspect, status, stop), unit tests and GitHub Actions CI.',
      'Beehive (KathiraveluLab): built a static scanner that hunts for API routes missing auth. It found 6 vulnerabilities, 1 critical and 4 high. Also locked down secret handling and turned off debug mode in production.',
      'Diomede (KathiraveluLab): built load-based DICOM routing across several Orthanc servers, then made it fail gracefully, with a clean HTTP 503 when Redis is down and retries for failed acknowledgements. 22 merged PRs across Beehive and Diomede.',
      'Krkn (CNCF Sandbox, 5 merged PRs): plugged a thread-pool leak that left worker threads running after cloud API errors, with 2 tests to keep it fixed.',
      'GNU Radio: fixed redundant signals in the GRC Qt editor and updated the WAV file blocks for libsndfile.',
    ],
    tags: ['Python', 'C++', 'ZeroMQ', 'Docker', 'Flask', 'Redis', 'pynetdicom', 'Kubernetes', 'GitHub Actions'],
  },
  {
    when: 'Apr 2025 – Aug 2025', role: 'Web Development Intern', org: 'IOTA Studio AI', logo: 'iota-studio.webp', sub: 'AIC MUJ incubated startup · Remote',
    stats: [{ value: '10+', label: 'Production commits' }, { value: 'Apr–Aug', label: 'Term' }, { value: 'React + Node', label: 'Stack' }, { value: 'MongoDB + SQL', label: 'Storage' }],
    points: [
      "Built and shipped the company's production website end to end with React.js, Node.js and REST APIs, landing 10+ commits in production.",
      'Designed the REST API between the React frontend and the Node.js backend, so the two could change independently, with content stored in MongoDB and SQL.',
      'IOTA Studio AI is a startup incubated at AIC MUJ, the Manipal University Jaipur incubation centre. The internship was remote.',
    ],
    tags: ['React.js', 'Node.js', 'REST APIs', 'MongoDB', 'SQL'],
  },
  {
    when: 'Aug 2024 – May 2028', role: 'B.Tech, Computer Science & Engineering (AI & ML)', org: 'Manipal University Jaipur', logo: 'manipal.webp',
    sub: 'Jaipur, India', stats: [{ value: 'AI & ML', label: 'Specialization' }, { value: '2nd year', label: 'Now in' }, { value: 'May 2028', label: 'Graduation' }, { value: '3×', label: 'Hackathon finalist' }],
    points: [
      'Second-year CS student specialising in AI and ML, building full-stack and backend software in Python and JavaScript alongside coursework.',
      'Hackathons: Top 35 of 10,000+ teams at HackRx 6.0 (Bajaj Finserv), Grand Finalist at HackOn with Amazon 6.0, and 3rd place at the Smart Delhi Ideathon.',
      'Before university: Don Bosco School, Bandel. Class XII (2024), Class X (2022).',
    ],
    tags: [],
  },
];

export const skills: Record<string, string[]> = {
  Languages: ['Python', 'JavaScript', 'TypeScript', 'C++', 'Java', 'HTML/CSS'],
  Frameworks: ['React.js', 'Node.js', 'Express.js', 'Flask', 'FastAPI', 'TailwindCSS'],
  Databases: ['MongoDB', 'PostgreSQL', 'SQL'],
  Tools: ['Git', 'GitHub Actions (CI/CD)', 'Docker (basics)', 'Linux', 'Postman', 'Vercel', 'Netlify'],
  Other: ['REST APIs', 'JWT Auth', 'RBAC', 'Security Hardening', 'Full-Stack Architecture'],
};

export const highlights: { value: string; label: string; caption: string }[] = [
  { value: 'Top 35', label: 'HackRx 6.0', caption: 'Top 35 out of 10,000+ teams at the Bajaj Finserv national hackathon.' },
  { value: '100+', label: 'Open-source contributions', caption: 'Across five projects, including 40+ merged pull requests.' },
  { value: '15%', label: 'More bookings', caption: 'After I added Razorpay payments during the Sundarone internship.' },
  { value: '3rd', label: 'Smart Delhi Ideathon', caption: 'Third place in our category at a government-backed contest.' },
  { value: '97', label: 'Backend tests', caption: 'Written for EvidenceRAG.' },
  { value: '3×', label: 'Hackathon finalist', caption: 'At university and national level.' },
];

export const sections = [
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'open-source', label: 'Open Source' },
  { id: 'skills', label: 'Skills' },
  { id: 'highlights', label: 'Highlights' },
];
