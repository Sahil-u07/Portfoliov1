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
  quote: 'Most of what I know I picked up by building things.',
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
    body: 'Built a scanner that finds unprotected API endpoints, hardened secrets and config, and added tests and linting to CI.',
  },
  {
    name: 'Concore', org: 'ControlCore-Project', url: 'https://github.com/ControlCore-Project/concore', count: 25,
    sub: 'Neuromodulation simulation protocol · 25+ contributions',
    body: 'Built the concore command-line tool, set up tests and CI, and fixed shared-memory and simulation-time bugs.',
  },
  {
    name: 'Diomede', org: 'KathiraveluLab', url: 'https://github.com/KathiraveluLab/Diomede', count: 15,
    sub: 'Dynamic DICOM Routing Module · 15+ contributions',
    body: 'Built the routing engine that sends medical images to the healthiest of several servers, plus its tests.',
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
      'Added Razorpay payments to the booking flow, which helped bookings go up 15%.',
      'Ran a few rounds of UX changes that improved user retention by 20%.',
    ],
    tags: ['Razorpay'],
  },
  {
    // shortcut: no start date yet, add it when known
    when: 'Ongoing', role: 'KathiraveluLab, ControlCore & GNU Radio', org: 'Open Source Contributor', logo: 'github', sub: 'Remote',
    stats: [{ value: '100+', label: 'Contributions' }, { value: '33', label: 'Merged PRs' }, { value: '4', label: 'Projects' }, { value: '3', label: 'Orgs' }],
    points: [
      'Beehive: built a scanner that finds unprotected API endpoints, hardened secrets and config, and added tests and linting to CI.',
      'Concore: built the concore command-line tool, set up tests and CI, and fixed shared-memory and simulation-time bugs.',
      'Diomede: built the routing engine that sends medical images to the healthiest of several servers, plus its tests.',
      'GNU Radio: fixed redundant signals in the GRC Qt editor and updated the WAV file blocks for libsndfile.',
    ],
    tags: ['Python', 'CI/CD', 'Security', 'DICOM', 'CLI', 'C++'],
  },
  {
    when: 'Apr 2025 – Aug 2025', role: 'Web Development Intern', org: 'IOTA Studio AI', logo: 'iota-studio.webp', sub: 'AIC MUJ incubated startup · Remote',
    stats: [{ value: '10+', label: 'Production commits' }, { value: 'Apr–Aug', label: 'Term' }, { value: 'React + Node', label: 'Stack' }, { value: 'MongoDB + SQL', label: 'Storage' }],
    points: [
      "Built the company's website from start to finish with React.js, Node.js and REST APIs, and got more than 10 commits into their production codebase.",
      'Set up the API so the frontend and backend stayed separate, with MongoDB and SQL storing the content.',
    ],
    tags: ['React.js', 'Node.js', 'REST APIs', 'MongoDB', 'SQL'],
  },
  {
    when: '2024 – 2028 (expected)', role: 'B.Tech, Computer Science & Engineering', org: 'Manipal University Jaipur', logo: 'manipal.webp',
    sub: 'Jaipur, India', stats: [{ value: 'AIML', label: 'Specialization' }, { value: '2028', label: 'Graduation' }],
    points: ['Before that: Don Bosco School, Bandel. Class XII (2024), Class X (2022).'], tags: [],
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
  { value: '100+', label: 'Open-source contributions', caption: 'Across four projects, including 33 merged pull requests.' },
  { value: '15%', label: 'More bookings', caption: 'After I added Razorpay payments during the Sundarone internship.' },
  { value: '3rd', label: 'Smart Delhi Ideathon', caption: 'Third place in our category at a government-backed contest.' },
  { value: '97', label: 'Backend tests', caption: 'Written for EvidenceRAG.' },
  { value: '3×', label: 'Hackathon finalist', caption: 'At university and national level.' },
];

// Quotes from Alex Hormozi shown near the bottom of the page.
export const quotes = [
  'Volume negates luck.',
  'A focused fool can accomplish more than a distracted genius.',
  'Who you compare yourself to dictates who you become.',
  "Do what you are most afraid of because it's usually the thing you need to do most.",
];

export const sections = [
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'open-source', label: 'Open Source' },
  { id: 'skills', label: 'Skills' },
  { id: 'highlights', label: 'Highlights' },
];
