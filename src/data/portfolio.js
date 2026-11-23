export const portfolioData = {
  personal: {
    name: "Sujaie",
    title: "Software Engineer",
    basedIn: "Chennai, India",
    focus: "AI-Powered Apps · Full-Stack",
    monogram: "S / DEV",
    availability: "Open to opportunities",
  },

  hero: {
    introLabel: "HELLO, I'M SUJAIE · CS UNDERGRAD",
    headlinePart1: "BUILDING",
    headlineAccent: "INTELLIGENT",
    headlinePart2: "APPLICATIONS",
    metadata: [
      { label: "STATUS", value: "Open to opportunities" },
      { label: "FOCUS", value: "AI-Powered Apps · Full-Stack" },
      { label: "BASED IN", value: "Chennai, India" },
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
      name: "ArtiNova",
      role: "Team Lead & AI Developer",
      description: "An AI commerce platform that turns a product photo and a few spoken words into a polished, priced online listing, in the artisan's own language.",
      impact: "Led the team from problem statement to a working app that reached the internal finals of SIH 2026, and contributed to image enhancement, voice cataloguing and pricing features.",
      stack: ["Flutter", "FastAPI", "PostgreSQL", "Ollama"],
      github: "",
      demo: ""
    },
    {
      num: "02",
      name: "Fashion Sizing API",
      role: "Team Project · MakeAthon 2026",
      description: "A two-model API that extracts body measurements from photos, maps them to brand-specific size charts, and uses a review classifier to improve fit recommendations.",
      impact: "An API combining body measurement extraction with brand size-chart mapping and a review-based fit classifier to recommend accurate clothing sizes.",
      stack: ["Python", "PyTorch", "HuggingFace", "API"],
      github: "",
      demo: ""
    },
    {
      num: "03",
      name: "DevAtlas",
      role: "Solo Builder · In Progress",
      description: "A React-based tool that helps developers find their way around unfamiliar code repositories faster.",
      impact: "Designing and building the project independently, from the interface to the navigation logic.",
      stack: ["React", "JavaScript"],
      github: "",
      demo: ""
    }
  ],

  skills: {
    "LANGUAGES": [
      { name: "Python", pips: 3, tier: "COMFORTABLE" },
      { name: "JavaScript", pips: 3, tier: "COMFORTABLE" },
      { name: "SQL", pips: 3, tier: "COMFORTABLE" },
      { name: "C", pips: 2, tier: "BUILDING WITH" },
      { name: "C++", pips: 2, tier: "BUILDING WITH" }
    ],
    "FRONTEND & MOBILE": [
      { name: "HTML & CSS", pips: 3, tier: "COMFORTABLE" },
      { name: "Tailwind CSS", pips: 3, tier: "COMFORTABLE" },
      { name: "React.js", pips: 3, tier: "COMFORTABLE" },
      { name: "Flutter", pips: 2, tier: "BUILDING WITH" },
      { name: "Dart", pips: 2, tier: "BUILDING WITH" }
    ],
    "BACKEND & APIs": [
      { name: "FastAPI", pips: 2, tier: "BUILDING WITH" },
      { name: "REST APIs", pips: 2, tier: "BUILDING WITH" }
    ],
    "AI / MACHINE LEARNING": [
      { name: "NumPy & Pandas", pips: 3, tier: "HANDS-ON" },
      { name: "HuggingFace", pips: 2, tier: "PROJECT-USED" },
      { name: "PyTorch", pips: 2, tier: "PROJECT-USED" },
      { name: "Ollama / Local LLMs", pips: 2, tier: "PROJECT-USED" },
      { name: "LiveKit", pips: 1, tier: "EXPLORING" }
    ],
    "DATABASES": [
      { name: "MySQL", pips: 3, tier: "HANDS-ON" },
      { name: "PostgreSQL", pips: 2, tier: "PROJECT-USED" },
      { name: "MongoDB", pips: 1, tier: "EXPLORING" }
    ],
    "CS FOUNDATIONS": [
      { name: "OOP", pips: 3, tier: "SOLID" },
      { name: "DBMS", pips: 3, tier: "SOLID" },
      { name: "File Handling", pips: 3, tier: "SOLID" },
      { name: "Data Structures", pips: 2, tier: "GROWING" },
      { name: "Data Mining", pips: 2, tier: "GROWING" },
      { name: "8086 Microprocessors", pips: 2, tier: "GROWING" }
    ],
    "TOOLS & DESIGN": [
      { name: "Git", pips: 1, tier: "BEGINNER" },
      { name: "GitHub", pips: 1, tier: "BEGINNER" },
      { name: "Figma", pips: 1, tier: "BEGINNER" }
    ]
  },

  experience: [
    {
      period: "2026",
      role: "Web Developer Intern",
      organization: "StanVentures",
      tag: "PROFESSIONAL",
      highlight: "primary",
      description: "Developing my personal portfolio while gaining hands-on experience in frontend development and component-based architecture.",
      tags: ["React", "Frontend Development"],
      verification: [
        {
          label: "WORK UNDERTAKEN",
          items: [
            "Developed my personal portfolio website",
            "Gained practical experience in frontend development & component-based architecture",
            "Learned how frontend components interact to create a complete web application",
            "Explored interactive interfaces and frontend implementation"
          ]
        },
        {
          label: "PROJECT SCOPE & OBJECTIVE",
          items: [
            "Project: Personal Developer Portfolio",
            "Description: Designed and developed to showcase projects, technical interests, skills, and development journey",
            "Evidence: Repository & live demo links will be added upon deployment"
          ]
        }
      ]
    },
    {
      period: "SIH 2026",
      role: "AI/ML Contributor",
      organization: "Smart India Hackathon — Internal Selection",
      achievement: "SIH Internal Finalist",
      problemStatement: "SIH26090",
      project: "AI-Powered Artisan Commerce Platform",
      tag: "COMPETITION",
      highlight: "secondary",
      description: "Contributed to an AI-powered artisan commerce platform featuring image enhancement, multilingual voice cataloguing, and intelligent pricing recommendations.",
      tags: ["AI / ML", "SIH Internal Finalist"],
      verification: [
        {
          label: "MY CONTRIBUTIONS",
          items: [
            "Led team ideation and problem analysis",
            "Contributed to feature planning and coordination",
            "Contributed to AI-driven image enhancement",
            "Worked on multilingual voice-based product cataloguing",
            "Contributed to ML-based pricing recommendations"
          ]
        },
        {
          label: "PROJECT OBJECTIVE & PROBLEM",
          items: [
            "Problem Statement: SIH26090",
            "Project: AI-Powered Artisan Commerce Platform (ArtiNova)",
            "Achievement: SIH Internal Finalist",
            "Objective: Empowering artisans with accessible digital commerce tools through AI-assisted product enhancement, multilingual accessibility, and intelligent pricing recommendations"
          ]
        }
      ]
    },
    {
      period: "CADET · ONGOING",
      role: "Naval Wing Cadet",
      organization: "National Cadet Corps (NCC)",
      tag: "LEADERSHIP & SERVICE",
      highlight: "standard",
      description: "Participating in Naval Wing training and camps that foster discipline, teamwork, leadership, and responsibility.",
      tags: ["NCC Naval Wing", "CATC", "NTAC"],
      verification: [
        {
          label: "EXPERIENCES & CAMPS",
          items: [
            "CATC (Combined Annual Training Camp, Chennai) participation",
            "NTAC (Naval Technical Attachment Camp, INS Shivaji) participation",
            "Naval Wing training and cadet activities"
          ]
        },
        {
          label: "DEVELOPMENT & VALUES",
          items: [
            "Discipline and responsibility",
            "Teamwork and adaptability",
            "Leadership and participation",
            "Structured training and practical experiences"
          ]
        }
      ]
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
    instagram: "https://www.instagram.com/anonymous.__.113?evlk=MWo0dWdlODN6a3p6Ng=="
  }
};
