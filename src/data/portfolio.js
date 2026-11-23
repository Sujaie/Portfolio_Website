export const portfolioData = {
  personal: {
    name: "Sujaie",
    title: "Software Engineer",
    location: "Salem, INDIA",
    focus: "FULL-STACK DOMAIN",
    interests: "AI / ML / CREATIVE TECHNOLOGY",
    monogram: "S / DEV",
    availability: "OPEN FOR OPPORTUNITIES",
  },

  hero: {
    introLabel: "HELLO, I'M SUJAIE · CS UNDERGRAD",
    headlinePart1: "BUILDING",
    headlineAccent: "INTELLIGENT",
    headlinePart2: "APPLICATIONS",
    metadata: [
      { label: "LOCATION", value: "Salem, INDIA" },
      { label: "FOCUS", value: "FULL-STACK DOMAIN" },
      { label: "INTERESTS", value: "AI / ML / CREATIVE TECH" },
    ]
  },

  about: {
    badge: "A LITTLE ABOUT ME",
    lead: "I'm Sujaie.",
    headlineAccent: "Building useful",
    headlineRest: "things with code & curiosity.",
    paragraphs: [
      "I'm a Computer Science undergrad at Sri Venkateswara College of Engineering, Chennai, who enjoys building AI-powered applications from idea to working product.",
      "At Smart India Hackathon 2026, I led my team's ideation and planning for ArtiNova, an AI-powered platform for artisans, and we built a working app that made it to the internal finals. Outside code, I'm a Leading Cadet in the NCC Navy wing, which taught me discipline, teamwork and how to lead under pressure.",
      "I'm looking for internships and projects where I can contribute, learn from experienced engineers, and keep building."
    ],
    highlightsTitle: "interest in",
    highlights: ["AI-POWERED APPS", "FULL-STACK", "TEAM LEADERSHIP"]
  },

  showcase: [
    {
      id: "builder",
      category: "BUILDER",
      filename: "artinova.pipeline",
      status: "SIH 2026 · INTERNAL FINALIST",
      title: "ArtiNova",
      subtitle: "AI Commerce Platform for Artisans",
      description: "Turns a product photo and a few spoken words into a polished, priced online listing, in the artisan's own language. Built for SIH 2026, where we made it to the internal finals.",
      stats: [
        { label: "ROLE", value: "Team Lead", isNumeric: false },
        { label: "AI FEATURES", value: 5, isNumeric: true },
        { label: "STATUS", value: "Working App", isNumeric: false }
      ],
      featureChips: [
        "Image Enhancement",
        "Multilingual Voice Cataloguing",
        "Smart Cataloguing",
        "Price Recommendations",
        "Market Recommendations"
      ],
      tags: ["Flutter", "FastAPI", "PostgreSQL", "Ollama"],
      links: {
        primary: { label: "VIEW PROJECT →", href: "#work" },
        // TODO: add repo URL
        secondary: { label: "GITHUB ↗", href: "#" }
      }
    },
    {
      id: "leader",
      category: "LEADER",
      filename: "leadership.log",
      status: "ACTIVE",
      title: "Leading in Code and in Uniform",
      subtitle: "SIH Team · NCC Navy Wing",
      description: "I led ideation, problem analysis and planning for my SIH team, and serve as a Leading Cadet in the NCC Navy wing, with camps at INS Shivaji, Mumbai and CATC, Chennai.",
      stats: [
        { label: "NCC RANK", value: "Leading Cadet", isNumeric: false },
        { label: "CAMPS", value: "NTAC + CATC", isNumeric: false },
        { label: "TEAM ROLE", value: "SIH Lead", isNumeric: false }
      ],
      tags: ["Teamwork", "Discipline", "Planning", "Public Speaking"],
      links: {
        primary: { label: "SEE EXPERIENCE →", href: "#experience" }
      }
    },
    {
      id: "learner",
      category: "LEARNER",
      filename: "learning.log",
      status: "IN PROGRESS",
      title: "Always Building the Next Thing",
      subtitle: "B.E. CSE · SVCE Chennai · 2025–29",
      description: "Certified in C (Infosys Springboard), MongoDB and Python fundamentals. Right now I'm building DevAtlas, a React-based tool that helps developers navigate and understand unfamiliar code repositories faster.",
      stats: [
        { label: "SEMESTER", value: "4 of 8", isNumeric: false },
        { label: "CERTIFICATES", value: 3, isNumeric: true },
        { label: "BUILDING NOW", value: "DevAtlas", isNumeric: false }
      ],
      tags: ["Data Structures", "DBMS", "OOP", "Data Mining"],
      links: {
        // TODO: add certificates URL
        primary: { label: "VIEW CERTIFICATES →", href: "#" }
      }
    },
    {
      id: "beyond-code",
      category: "BEYOND CODE",
      filename: "off-duty.log",
      status: "ONLINE",
      title: "Not Just a Screen Person",
      subtitle: "Speaking · Events · Running",
      description: "I enjoy speaking on stage, organising and hosting cultural events, and endurance running, with marathon-event distances up to 10 km.",
      stats: [
        { label: "STAGE", value: "Speaker & Host", isNumeric: false },
        { label: "EVENTS", value: "Cultural Organiser", isNumeric: false },
        { label: "ENDURANCE", value: "Up to 10 km", isNumeric: false }
      ],
      tags: ["Public Speaking", "Event Management", "Running"],
      links: {
        primary: { label: "LET'S TALK →", href: "#contact" }
      }
    }
  ],

  projects: [
    {
      num: "01",
      name: "Autonomous Agent Fleet",
      role: "Lead Systems Architect & Core Developer",
      description: "Orchestration platform for cooperative LLM swarms executing multi-step research, code verification, and real-time environment synthesis.",
      impact: "Reduced multi-agent debugging cycles by 40% with streaming trace visualizers and checkpoint rewind.",
      stack: ["Python", "Ollama", "FastAPI", "React", "Redis"],
      github: "https://github.com/sujaie/agent-fleet",
      demo: "https://agent-fleet.demo"
    },
    {
      num: "02",
      name: "PulseStream Telemetry Engine",
      role: "Full-Stack Engineer",
      description: "High-performance timeseries event ingestion architecture delivering sub-second anomaly detection graphs for mission-critical services.",
      impact: "Processes over 5M events per second with instant live charting and edge alerting.",
      stack: ["Go", "Kafka", "TimescaleDB", "React", "Tailwind"],
      github: "https://github.com/sujaie/pulsestream",
      demo: "https://pulsestream.demo"
    },
    {
      num: "03",
      name: "Krypton WebAssembly IDE",
      role: "Frontend Architect",
      description: "In-browser lightweight C/C++ compiler and runtime debugger powered by WebAssembly, Monaco Editor, and virtualized memory visualization.",
      impact: "Zero-install compilation sandbox used by over 10,000 students and hobbyists.",
      stack: ["TypeScript", "WebAssembly", "Clang/LLVM", "React"],
      github: "https://github.com/sujaie/krypton-ide",
      demo: "https://krypton-ide.demo"
    }
  ],

  skills: {
    "PROGRAMMING": [
      { name: "TypeScript / JavaScript", level: "Advanced" },
      { name: "Python", level: "Advanced" },
      { name: "Go", level: "Proficient" },
      { name: "C++ / Rust", level: "Familiar" },
      { name: "SQL", level: "Advanced" },
    ],
    "FRONTEND DEVELOPMENT": [
      { name: "React 19 & Next.js", level: "Advanced" },
      { name: "Tailwind CSS & PostCSS", level: "Advanced" },
      { name: "Anime.js & Motion Graphics", level: "Advanced" },
      { name: "Web Audio & WebGL", level: "Proficient" },
      { name: "Vite & Modern Toolchains", level: "Advanced" },
    ],
    "BACKEND DEVELOPMENT": [
      { name: "Node.js & Express", level: "Advanced" },
      { name: "FastAPI & Flask", level: "Advanced" },
      { name: "REST & gRPC / WebSockets", level: "Advanced" },
      { name: "Microservices Architecture", level: "Proficient" },
      { name: "Distributed Systems", level: "Proficient" },
    ],
    "AI / MACHINE LEARNING": [
      { name: "PyTorch & Transformers", level: "Proficient" },
      { name: "Local LLMs (Ollama, vLLM)", level: "Advanced" },
      { name: "Vector Search & RAG (pgvector, Qdrant)", level: "Advanced" },
      { name: "Multimodal AI & Diffusion", level: "Proficient" },
      { name: "Model Quantization & Routing", level: "Proficient" },
    ],
    "DATABASES & CACHE": [
      { name: "PostgreSQL & pgvector", level: "Advanced" },
      { name: "Redis & Pub/Sub", level: "Advanced" },
      { name: "SQLite", level: "Advanced" },
      { name: "MongoDB", level: "Proficient" },
    ],
    "DEVELOPER TOOLS": [
      { name: "Docker & Containerization", level: "Advanced" },
      { name: "Git & GitHub CI/CD", level: "Advanced" },
      { name: "Linux / Shell Scripting", level: "Advanced" },
      { name: "Vite, UV & PNPM", level: "Advanced" },
    ]
  },

  experience: [
    {
      period: "2024 — PRESENT",
      role: "Software Engineering & AI Researcher",
      organization: "Independent Lab / Academic Research",
      description: "Architecting autonomous LLM frameworks, high-speed vector retrieval pipelines, and interactive web tools for developer productivity.",
      tag: "CORE INITIATIVE"
    },
    {
      period: "2023 — 2024",
      role: "Full-Stack Development Intern",
      organization: "Technology Innovation Center",
      description: "Spearheaded frontend redesign for cloud analytics dashboards, decreasing first-contentful paint by 65% and deploying real-time WebSocket feeds.",
      tag: "INTERNSHIP"
    },
    {
      period: "2023",
      role: "Hackathon Winner & Tech Lead",
      organization: "National Innovation Challenge",
      description: "Built and pitched an edge-computing emergency dispatch routing engine; awarded 1st place among 120 participating teams.",
      tag: "HONOR"
    }
  ],

  contact: {
    badge: "LET'S TALK. CODE, HACKS & OPPORTUNITIES.",
    headline: "READY TO",
    headlineItalic: "CONTRIBUTE.",
    headlineEnd: "READY TO LEARN.",
    email: "sujaie2008@gmail.com",
    github: "https://github.com/Sujaie",
    linkedin: "https://www.linkedin.com/in/sujaie-babu-a00298383/",
    instagram: "https://www.instagram.com/anonymous.__.113?evlk=MWo0dWdlODN6a3p6Ng==",
    location: "Available Worldwide (Remote)"
  }
};
