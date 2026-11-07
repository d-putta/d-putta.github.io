import type { Profile } from './types';

/**
 * Single source of truth for the portfolio's content.
 * Update text here; components render whatever this file says.
 */
export const profile: Profile = {
  name: 'Deepak Putta',
  initials: 'DP',
  role: 'Senior Software Engineer · AI platforms',
  roleShort: 'Senior Engineer',
  eyebrow: 'Senior Software Engineer · AI Platforms',
  headline: [
    { text: 'Engineering the layer where ' },
    { text: 'AI agents', accent: true },
    { text: ' meet enterprise systems.' },
  ],
  lede:
    'I design and ship distributed platforms, custom AI agents, and MCP servers that connect large language models to real internal systems. Five-plus years across healthcare and enterprise software, 4× AWS certified.',
  greeting:
    "Hi, I'm Deepak Putta, a Senior Software Engineer. I build AI agents, MCP servers, and distributed platforms that serve millions of users. Welcome to my portfolio.",
  portrait: {
    src: 'avatar.png',
    alt: 'Illustrated portrait of Deepak Putta',
    topChip: '4× AWS certified',
    roleChip: 'Senior Software Engineer · AI platforms',
  },
  meta: [
    { label: 'Currently', value: 'Lead, AI/ML Guild' },
    { label: 'Stack', value: 'Java · Python · TypeScript · AWS' },
  ],
  links: { linkedin: 'https://linkedin.com/in/deepakputta' },
  email: { user: 'dputta1001', domain: 'gmail', tld: 'com', subject: 'Hello from your portfolio' },
  nav: [
    { href: '#focus', label: 'Focus' },
    { href: '#work', label: 'Work' },
    { href: '#skills', label: 'Skills' },
    { href: '#certs', label: 'Certifications' },
    { href: '#contact', label: 'Contact' },
  ],
  ticker: [
    'AI agents',
    'MCP servers',
    'RAG',
    'Vector databases',
    'LlamaIndex',
    'Distributed systems',
    'Microservices',
    'Event-driven',
    'Spring Boot',
    'React · TypeScript',
    'Node.js',
    'AWS · Azure · GCP',
    'Kubernetes · Helm',
    'Infrastructure as Code',
    'Observability',
    'PostgreSQL · Redis · DynamoDB',
    'Snowflake · BigQuery',
    '4× AWS certified',
  ],
  metrics: [
    { value: '5', countTo: 5, unit: '+ yrs', label: 'Enterprise software engineering' },
    { value: '4', countTo: 4, unit: '× AWS', label: 'Certified, incl. Solutions Architect Pro' },
    { value: 'Millions', label: 'Monthly users on the platform I architect' },
    { value: '90', countTo: 90, unit: '%+', label: 'Test coverage on key modules' },
    { value: '60', countTo: 60, unit: 'hrs', label: 'Manual build effort avoided per run' },
  ],
  focus: {
    index: 'FOCUS',
    title: 'Three systems I keep building.',
    blurb:
      'Every role has come back to the same intersection: intelligence, scale, and the platform underneath both.',
    areas: [
      {
        icon: 'agents',
        title: 'AI agents & MCP',
        description:
          'Custom agents, MCP servers, and tools that give LLMs structured access to internal systems. Generative features that automate clinical and engineering workflows.',
        tags: ['MCP', 'RAG', 'LlamaIndex', 'Vector DBs'],
      },
      {
        icon: 'architecture',
        title: 'Distributed architecture',
        description:
          'Microservices, event-driven design, caching strategies, and highly available services for a platform serving millions of monthly users.',
        tags: ['Microservices', 'Event-driven', 'REST APIs', 'Spring Boot'],
      },
      {
        icon: 'cloud',
        title: 'Cloud & platform engineering',
        description:
          'AWS-first delivery with infrastructure as code, observability, and release governance that cut deployment failures and sped up incident detection.',
        tags: ['AWS', 'Kubernetes', 'Helm', 'IaC', 'CI/CD'],
      },
    ],
  },
  work: {
    index: 'SELECTED WORK',
    title: 'Shipped in production.',
    blurb: 'Platform, AI, and product work from 2023 onward.',
    projects: [
      {
        id: 'sdlc-pipeline',
        featured: true,
        pills: [
          { label: 'All 6 stages shipped', tone: 'live' },
          { label: 'AI agents', tone: 'accent' },
          { label: '2026' },
        ],
        title: 'Multi-agent SDLC automation pipeline',
        description:
          'Architected and shipped all six stages of an agentic pipeline that turns a Jira ticket and a Figma design into working code. Agents call MCP servers for Jira, Figma, and internal tooling, plan the work, and hand off between stages.',
        outcomes: [
          { value: '~60 h', label: 'manual build effort avoided (est.)' },
          { value: '3', label: 'MCP integrations' },
          { value: '6 / 6', label: 'stages in production' },
        ],
        stack: ['Python', 'MCP', 'LLM APIs', 'Jira', 'Figma'],
        visual: {
          kind: 'pipeline',
          stages: ['Intake', 'Design', 'Build', 'Verify', 'Review', 'Release'],
        },
      },
      {
        id: 'a11y-scanning',
        pills: [
          { label: 'Platform', tone: 'accent' },
          { label: 'Accessibility' },
          { label: '2026' },
        ],
        title: 'CI/CD accessibility scanning',
        description:
          'Designed and delivered the first automated WCAG scanning step in the delivery pipeline, standardizing checks across multiple repositories and reducing the dependence on manual validation before release.',
        outcomes: [],
        stack: ['CI/CD', 'WCAG', 'GitHub', 'Node.js'],
        visual: {
          kind: 'a11y',
          repos: [
            'patient-portal-web',
            'consent-service-ui',
            'clinician-dashboard',
            'design-system-react',
          ],
          coverageLabel: 'multi-repo',
        },
      },
      {
        id: 'ha-platform',
        pills: [{ label: 'Architecture', tone: 'accent' }, { label: 'Scale' }, { label: '2026' }],
        title: 'High-availability platform for millions of monthly users',
        description:
          'Directed the architecture of a user-facing platform, applying microservice patterns, distributed services, and caching to improve scalability and reliability. Hardened it with observability, infrastructure as code, and release governance.',
        outcomes: [
          { value: 'Fewer', label: 'deployment failures' },
          { value: 'Faster', label: 'incident detection' },
        ],
        stack: ['Java', 'Spring Boot', 'Redis', 'Kubernetes', 'Observability'],
        visual: {
          kind: 'arch',
          edge: 'Edge · CDN · API gateway',
          core: [
            { title: 'Service mesh', sub: 'microservices' },
            { title: 'Event bus', sub: 'async workflows' },
            { title: 'Cache tier', sub: 'Redis' },
          ],
          stores: ['PostgreSQL', 'DynamoDB', 'Object store'],
          base: 'Observability · IaC · release governance',
        },
      },
      {
        id: 'secure-healthcare',
        pills: [
          { label: 'Full-stack', tone: 'accent' },
          { label: 'Healthcare' },
          { label: '2023 – 2026' },
        ],
        title: 'Secure healthcare applications',
        description:
          'Led full-stack development in React, TypeScript, and Node.js, hardened the backend with JWT authentication, AWS KMS, and PGP encryption, and kept key modules above 90% unit-test coverage. Earlier, built a patient well-being platform grounded in user-centered design.',
        outcomes: [
          { value: '90%+', label: 'test coverage, key modules' },
          { value: 'JWT · KMS · PGP', label: 'security layers' },
        ],
        stack: ['React', 'TypeScript', 'Node.js', 'Jest', 'AWS KMS'],
        visual: {
          kind: 'console',
          title: 'sdlc-agent · trace',
          command: 'sdlc-agent run --all-stages --ticket ENG-4821',
          lines: [
            {
              status: 'step',
              tool: 'jira.get_issue',
              value: 'ENG-4821',
              dim: '"Add consent banner"',
            },
            {
              status: 'step',
              tool: 'figma.get_design',
              value: 'node 212:40',
              dim: '"Consent / Banner v3"',
            },
            { status: 'step', tool: 'mcp.resolve_tools', value: '3 servers · 14 tools' },
            { status: 'ok', tool: 'scaffold.generate', value: 'ConsentBanner.tsx' },
            { status: 'ok', tool: 'a11y.scan', value: 'WCAG 2.2 AA', dim: '· 0 violations' },
            { status: 'ok', tool: 'pr.open', value: '#1187', highlight: '· ~60h avoided' },
          ],
        },
      },
    ],
  },
  skills: {
    index: 'CAPABILITIES',
    title: 'Stack and practice.',
    blurb: 'Breadth across the platform, depth in architecture and AI integration.',
    groups: [
      {
        title: 'AI & machine learning',
        items: [
          'Generative AI',
          'AI agents',
          'MCP servers',
          'RAG',
          'Vector databases',
          'LLM API integration',
          'LlamaIndex',
        ],
      },
      {
        title: 'Architecture',
        items: [
          'Distributed systems',
          'Microservices',
          'Event-driven',
          'System design',
          'REST & API design',
          'Highly available services',
        ],
      },
      {
        title: 'Languages',
        items: [
          'Java',
          'Python',
          'TypeScript',
          'JavaScript',
          'Go',
          'C#',
          'C / C++',
          'SQL',
          'Shell',
          'HTML / CSS',
        ],
      },
      {
        title: 'Frameworks',
        items: [
          'Spring Boot',
          'Node.js',
          'Express',
          'React',
          'Redux',
          'Hibernate',
          'JUnit',
          'Jest',
          'Cypress',
        ],
      },
      {
        title: 'Cloud & DevOps',
        items: [
          'AWS',
          'Azure',
          'GCP',
          'Docker',
          'Kubernetes',
          'Helm',
          'CI/CD',
          'Infrastructure as Code',
          'Observability',
        ],
      },
      {
        title: 'Data',
        items: [
          'PostgreSQL',
          'Oracle',
          'MySQL',
          'MongoDB',
          'Redis',
          'DynamoDB',
          'Snowflake',
          'BigQuery',
          'SQLite',
        ],
      },
    ],
  },
  credentials: {
    index: 'CREDENTIALS',
    title: 'AWS certified, four times over.',
    blurb: 'Architecture and machine learning tracks, Associate through Professional.',
    items: [
      {
        code: 'SAP-C02',
        badge: ['SAP', 'C02'],
        title: 'AWS Certified Solutions Architect – Professional',
        date: 'Aug 2025',
        highlight: true,
      },
      {
        code: 'MLA-C01',
        badge: ['MLA', 'C01'],
        title: 'AWS Certified Machine Learning Engineer – Associate',
        date: 'Sep 2026',
      },
      {
        code: 'AIF-C01',
        badge: ['AIF', 'C01'],
        title: 'AWS Certified AI Practitioner',
        date: 'Mar 2026',
      },
      {
        code: 'SAA-C03',
        badge: ['SAA', 'C03'],
        title: 'AWS Certified Solutions Architect – Associate',
        date: 'Sep 2024',
      },
    ],
  },
  contact: {
    index: 'CONTACT',
    headline: [
      { text: 'Building something at the edge of ' },
      { text: 'AI and scale', accent: true },
      { text: "? Let's talk." },
    ],
  },
  systemsMap: {
    core: {
      name: 'Enterprise AI platform',
      description: 'Where models, agents, and systems meet at scale.',
    },
    groups: [
      {
        group: 'Models',
        concepts: [
          {
            name: 'Large language model',
            description: 'Foundation model that reasons over text and tools.',
          },
          { name: 'Embeddings', description: 'Dense vectors that capture meaning for search.' },
          { name: 'Tokenizer', description: 'Splits text into the units a model reads.' },
          { name: 'Fine-tuning', description: 'Adapting a model to a domain with curated data.' },
          { name: 'Inference', description: 'Serving model output inside a latency budget.' },
          { name: 'Context window', description: 'How much the model can attend to at once.' },
          {
            name: 'Structured output',
            description: 'Schema-constrained generation for reliable parsing.',
          },
        ],
      },
      {
        group: 'Agents',
        concepts: [
          {
            name: 'Agent runtime',
            description: 'The loop that plans, calls tools, and verifies results.',
          },
          { name: 'Planner', description: 'Breaks a goal into executable steps.' },
          { name: 'Orchestrator', description: 'Routes work across specialised agents.' },
          { name: 'Tool calling', description: 'Lets the model act through typed functions.' },
          { name: 'Memory', description: 'Short- and long-term state across steps.' },
          { name: 'Reflection', description: 'Self-critique that catches errors before shipping.' },
          { name: 'Handoffs', description: 'Passing context between pipeline stages.' },
        ],
      },
      {
        group: 'Retrieval',
        concepts: [
          { name: 'RAG', description: 'Grounds answers in your own documents.' },
          { name: 'Vector database', description: 'Stores and searches embeddings at scale.' },
          { name: 'Chunking', description: 'Splitting documents into retrievable pieces.' },
          { name: 'Reranker', description: 'Reorders results for precision.' },
          {
            name: 'Knowledge graph',
            description: 'Entities and relationships the model can traverse.',
          },
          { name: 'Hybrid search', description: 'Keyword plus semantic retrieval.' },
          { name: 'Citations', description: 'Traceable sources behind every answer.' },
        ],
      },
      {
        group: 'Integration',
        concepts: [
          { name: 'MCP server', description: 'Standard interface exposing tools to any model.' },
          { name: 'Tools', description: 'Typed actions: query, create, update.' },
          { name: 'Resources', description: 'Read-only context a server exposes.' },
          { name: 'Prompts', description: 'Reusable task templates served to clients.' },
          { name: 'Jira connector', description: 'Tickets become structured specs.' },
          { name: 'Figma connector', description: 'Designs become component contracts.' },
          { name: 'Internal APIs', description: 'Enterprise systems reachable by agents.' },
        ],
      },
      {
        group: 'Trust',
        concepts: [
          { name: 'Guardrails', description: 'Policies that bound what agents may do.' },
          { name: 'Evals', description: 'Measured quality on real tasks.' },
          { name: 'Observability', description: 'Traces, metrics, and logs for every run.' },
          { name: 'Red teaming', description: 'Adversarial testing before release.' },
          { name: 'Human in the loop', description: 'Approval gates on consequential actions.' },
          { name: 'PII handling', description: 'Detection and redaction of sensitive data.' },
          { name: 'Audit trail', description: 'Every action attributable and replayable.' },
        ],
      },
      {
        group: 'Platform',
        concepts: [
          { name: 'Microservices', description: 'Independently deployable services.' },
          { name: 'Event bus', description: 'Async workflows across the platform.' },
          { name: 'Streaming', description: 'Token-by-token responses to users.' },
          { name: 'Caching', description: 'Redis-backed reuse of expensive results.' },
          { name: 'Rate limiting', description: 'Protecting models and budgets.' },
          { name: 'Cost control', description: 'Routing and budgets per workload.' },
          { name: 'Release governance', description: 'Gated, observable deployments.' },
        ],
      },
      {
        group: 'Data',
        concepts: [
          { name: 'Data pipelines', description: 'Reliable movement and transformation of data.' },
          { name: 'Lakehouse', description: 'Snowflake and BigQuery as the analytical backbone.' },
          { name: 'Feature store', description: 'Consistent features for training and serving.' },
          { name: 'Lineage', description: 'Where every field came from.' },
          { name: 'Governance', description: 'Access, retention, and classification.' },
          { name: 'Synthetic data', description: 'Generated examples for evals and training.' },
          { name: 'Schema registry', description: 'Contracts between producers and consumers.' },
        ],
      },
    ],
  },
  footer: { copyright: '© 2026 Deepak Putta', line: 'Senior Software Engineer · AI platforms' },
};
