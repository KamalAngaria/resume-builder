// ══════════════════════════════════════════════════════════
// TEMPLATE REGISTRY
// ══════════════════════════════════════════════════════════

const TEMPLATE_REGISTRY = {
  executive: {
    id: "executive",
    version: 1,
    label: "Executive Minimal",
    description: "An elegant serif-based template focusing on leadership scope, business metrics, and high-level outcomes.",
    targetAudience: "Executives, Directors, Managers, Consultants",
    previewClass: "template-executive",
    layoutType: "elegant",
    stylePreset: {
      accent: "#111111",
      layout: "elegant",
      font: "Playfair Display",
      fontSize: 100,
      lineH: 1.5,
      secGap: 24,
      photo: null,
      photoSize: 76,
      photoBR: 50
    },
    starterData: {
      photo: null, photoSize: 76, photoBR: 50,
      accent: "#111111", layout: "elegant", font: "Playfair Display", fontSize: 100, lineH: 1.5, secGap: 24,
      f_name: "Elizabeth Vance",
      f_title: "Managing Director, Strategy & Operations",
      f_summary: "Enterprise strategist with 14+ years of experience leading cross-functional teams in digital transformation, organizational design, and market expansion. Proven track record driving $100M+ corporate initiatives.",
      f_email: "elizabeth.vance@consulting.com",
      f_phone: "+1 (555) 321-4567",
      f_city: "New York",
      f_country: "NY",
      f_linkedin: "linkedin.com/in/elizabethvance",
      f_website: "vancestrategy.com",
      f_github: "",
      skills: ["Corporate Strategy", "Digital Transformation", "Executive Leadership", "M&A Integration", "Financial Modeling", "Organizational Design", "Stakeholder Management"],
      langs: [
        { lang: "English", level: "Native" },
        { lang: "French", level: "Conversational" }
      ],
      experience: [
        {
          company: "McKinsey & Company",
          role: "Principal Consultant",
          start: "2019",
          end: "Present",
          desc: "• Formulated global supply chain strategy for Fortune 50 consumer goods group, realizing $35M in annual cost reductions.\n• Guided executive leadership through a $120M digital integration program across European business units.\n• Managed cross-functional consultant teams of 12+ on high-impact strategy turnarounds."
        },
        {
          company: "Accenture",
          role: "Senior Strategy Consultant",
          start: "2015",
          end: "2019",
          desc: "• Designed market entry strategy for a high-growth SaaS enterprise, capturing 12% market share within 18 months.\n• Spearheaded operational efficiency audit for national retail client, yielding 18% improvement in supply chain throughput."
        }
      ],
      education: [
        {
          school: "Harvard Business School",
          degree: "Master of Business Administration (MBA)",
          start: "2013",
          end: "2015",
          desc: "Specialized in corporate finance, international business operations, and leadership development."
        }
      ],
      certs: [
        { name: "Project Management Professional (PMP)", issuer: "PMI", year: "2016" }
      ],
      awards: [
        { title: "Consultant of the Year", org: "Accenture", year: "2018" }
      ],
      interests: ["Philanthropy", "Sailing", "Macroeconomics"],
      sectionOrder: ["summary", "experience", "education", "certifications", "skills", "languages", "awards", "interests"],
      sectionVis: { summary: true, experience: true, education: true, certifications: true, skills: true, languages: true, awards: true, interests: true }
    }
  },

  tech: {
    id: "tech",
    version: 1,
    label: "Modern Tech",
    description: "Developer-focused style using clean sans-serif layout with monospaced tech indicator labels.",
    targetAudience: "Software Engineers, DevOps Specialists, Solutions Architects, Researchers",
    previewClass: "template-tech",
    layoutType: "minimal",
    stylePreset: {
      accent: "#0f766e",
      layout: "minimal",
      font: "IBM Plex Sans",
      fontSize: 95,
      lineH: 1.55,
      secGap: 18,
      photo: null,
      photoSize: 76,
      photoBR: 50
    },
    starterData: {
      photo: null, photoSize: 76, photoBR: 50,
      accent: "#0f766e", layout: "minimal", font: "IBM Plex Sans", fontSize: 95, lineH: 1.55, secGap: 18,
      f_name: "Alexander Chen",
      f_title: "Lead Infrastructure Architect",
      f_summary: "Systems architect specializing in high-performance cloud networking, container orchestration, and real-time infrastructure automation. Passionate about developer tools and zero-downtime deployments.",
      f_email: "alex.chen@infra.dev",
      f_phone: "+1 (415) 888-0192",
      f_city: "San Francisco",
      f_country: "CA",
      f_linkedin: "linkedin.com/in/alechen",
      f_website: "alexchen.dev",
      f_github: "github.com/alechen",
      skills: ["Go", "Rust", "Kubernetes", "Terraform", "AWS", "Docker", "eBPF", "gRPC", "Linux Kernel", "CI/CD Platforms"],
      langs: [
        { lang: "English", level: "Native" },
        { lang: "Mandarin", level: "Conversational" }
      ],
      experience: [
        {
          company: "Vercel",
          role: "Lead Systems Engineer",
          start: "2022",
          end: "Present",
          desc: "• Re-architected edge routing fabric handling 50B+ weekly requests, lowering average latency by 14ms.\n• Automated container provisioning workflows, reducing cold start deployment delays from 4s to 450ms.\n• Developed internal tooling in Go and Rust to stream performance telemetry via eBPF probes."
        },
        {
          company: "Stripe",
          role: "Senior DevOps Engineer",
          start: "2018",
          end: "2022",
          desc: "• Spearheaded multi-region database replication over Kubernetes, maintaining 99.999% system uptime during peaks.\n• Built declarative infrastructure scaling pipelines, saving $1.2M in annual cloud spending."
        }
      ],
      education: [
        {
          school: "Stanford University",
          degree: "B.S. Computer Science",
          start: "2014",
          end: "2018",
          desc: "Graduated with Honors. Focus on Distributed Systems and Operating System design."
        }
      ],
      certs: [
        { name: "Certified Kubernetes Administrator (CKA)", issuer: "CNCF", year: "2020" },
        { name: "AWS Solutions Architect Professional", issuer: "Amazon Web Services", year: "2019" }
      ],
      awards: [
        { title: "Open Source Contributor Award", org: "Stripe", year: "2021" }
      ],
      interests: ["Linux Kernel Contributor", "Robotics", "Home Automation"],
      sectionOrder: ["summary", "experience", "education", "certifications", "skills", "languages", "awards", "interests"],
      sectionVis: { summary: true, experience: true, education: true, certifications: true, skills: true, languages: true, awards: false, interests: true }
    }
  },

  creative: {
    id: "creative",
    version: 1,
    label: "Creative Professional",
    description: "Modern asymmetrical split layout featuring sleek geometric typography and visual highlights.",
    targetAudience: "UI/UX Designers, Product Managers, Writers, Creative Directors",
    previewClass: "template-creative",
    layoutType: "modern-split",
    stylePreset: {
      accent: "#be123c",
      layout: "modern-split",
      font: "Montserrat",
      fontSize: 95,
      lineH: 1.6,
      secGap: 20,
      photo: null,
      photoSize: 76,
      photoBR: 50
    },
    starterData: {
      photo: null, photoSize: 76, photoBR: 50,
      accent: "#be123c", layout: "modern-split", font: "Montserrat", fontSize: 95, lineH: 1.6, secGap: 20,
      f_name: "Elena Rostova",
      f_title: "Senior Product Designer",
      f_summary: "Interface designer focused on interactive systems, custom design systems, and delightful user experiences. Bridging the gap between engineering efficiency and polished visual design.",
      f_email: "elena.rostova@design.io",
      f_phone: "+1 (718) 456-7890",
      f_city: "Brooklyn",
      f_country: "NY",
      f_linkedin: "linkedin.com/in/elenarostova",
      f_website: "elena.design",
      f_github: "",
      skills: ["Figma", "Design Systems", "Typography", "Prototyping", "CSS Grid", "User Research", "Interaction Design", "After Effects", "Motion Graphics"],
      langs: [
        { lang: "English", level: "Native" },
        { lang: "Russian", level: "Native" }
      ],
      experience: [
        {
          company: "Framer",
          role: "Lead Designer",
          start: "2021",
          end: "Present",
          desc: "• Led redesign of layout engine controls, increasing workspace retention metrics by 32%.\n• Developed and scaled internal component library used by 10,000+ creators worldwide.\n• Conducted design sprints collaborating directly with React core developers."
        },
        {
          company: "Notion",
          role: "Product Designer",
          start: "2018",
          end: "2021",
          desc: "• Designed collaborative block templates, driving 15% growth in team onboarding cycles.\n• Created standard iconography package and visual guidelines for workspace layouts."
        }
      ],
      education: [
        {
          school: "Pratt Institute",
          degree: "B.F.A. Communication Design",
          start: "2014",
          end: "2018",
          desc: "Specialized in interactive typography and digital prototyping interfaces. Graduated Outstanding Merit."
        }
      ],
      certs: [
        { name: "Interaction Design Specialist", issuer: "Nielsen Norman Group", year: "2020" }
      ],
      awards: [
        { title: "Design Systems Innovation Award", org: "Framer", year: "2023" }
      ],
      interests: ["Generative Art", "Indie Game Design", "Bicycle Touring"],
      sectionOrder: ["summary", "experience", "education", "certifications", "skills", "languages", "awards", "interests"],
      sectionVis: { summary: true, experience: true, education: true, certifications: true, skills: true, languages: true, awards: true, interests: true }
    }
  },

  classic: {
    id: "classic",
    version: 1,
    label: "Corporate Classic",
    description: "Centered header traditional grid with high-density serif fonts. Recruiter favorite for corporate roles.",
    targetAudience: "Finance, Legal, Corporate Operations, Analysts",
    previewClass: "template-classic",
    layoutType: "classic",
    stylePreset: {
      accent: "#535366",
      layout: "classic",
      font: "Merriweather",
      fontSize: 100,
      lineH: 1.65,
      secGap: 20,
      photo: null,
      photoSize: 76,
      photoBR: 50
    },
    starterData: {
      photo: null, photoSize: 76, photoBR: 50,
      accent: "#535366", layout: "classic", font: "Merriweather", fontSize: 100, lineH: 1.65, secGap: 20,
      f_name: "Marcus Sterling, CFA",
      f_title: "Vice President, Financial Analysis",
      f_summary: "Analytical financial officer with 12+ years managing investment portfolios, corporate forecasting, and asset allocations. Expert in treasury management, risk mitigation, and SEC reporting.",
      f_email: "m.sterling@capital.com",
      f_phone: "+1 (312) 789-0123",
      f_city: "Chicago",
      f_country: "IL",
      f_linkedin: "linkedin.com/in/marcussterling",
      f_website: "sterlingfinance.com",
      f_github: "",
      skills: ["Portfolio Management", "Financial Modeling", "Valuations", "SEC Compliance", "Treasury Operations", "Asset Allocation", "Risk Management", "SQL", "Bloomberg Terminal"],
      langs: [
        { lang: "English", level: "Native" },
        { lang: "German", level: "Conversational" }
      ],
      experience: [
        {
          company: "Vanguard",
          role: "Vice President, Finance",
          start: "2020",
          end: "Present",
          desc: "• Supervised financial modeling for a $450M equity portfolio, achieving a 14.8% annualized return.\n• Standardized financial reporting templates across 6 departments, saving 40 hours of monthly manual entry.\n• Directed a team of 8 senior analysts mapping market hedging scenarios."
        },
        {
          company: "JP Morgan",
          role: "Senior Financial Analyst",
          start: "2015",
          end: "2020",
          desc: "• Led valuation research for 18 M&A transactions totaling $1.2B in volume.\n• Built automated auditing scripts which reduced ledger discrepancy reports by 28%."
        }
      ],
      education: [
        {
          school: "Wharton School, University of Pennsylvania",
          degree: "B.S. in Finance & Economics",
          start: "2011",
          end: "2015",
          desc: "Summa Cum Laude. President of the Wharton Finance Club."
        }
      ],
      certs: [
        { name: "Chartered Financial Analyst (CFA)", issuer: "CFA Institute", year: "2018" }
      ],
      awards: [
        { title: "Excellence in Corporate Finance", org: "JP Morgan", year: "2017" }
      ],
      interests: ["Chess", "Economics History", "Venture Capital Blogging"],
      sectionOrder: ["summary", "experience", "education", "certifications", "skills", "languages", "awards", "interests"],
      sectionVis: { summary: true, experience: true, education: true, certifications: true, skills: true, languages: true, awards: true, interests: true }
    }
  },

  fresher: {
    id: "fresher",
    version: 1,
    label: "Fresher Smart",
    description: "Compact template placing academic achievements, projects, and structured skills first.",
    targetAudience: "Students, Recent Graduates, Junior Positions",
    previewClass: "template-fresher",
    layoutType: "classic",
    stylePreset: {
      accent: "#2563eb",
      layout: "classic",
      font: "DM Sans",
      fontSize: 100,
      lineH: 1.65,
      secGap: 18,
      photo: null,
      photoSize: 76,
      photoBR: 50
    },
    starterData: {
      photo: null, photoSize: 76, photoBR: 50,
      accent: "#2563eb", layout: "classic", font: "DM Sans", fontSize: 100, lineH: 1.65, secGap: 18,
      f_name: "Devon Martinez",
      f_title: "Junior Software Developer",
      f_summary: "Recent Computer Science honors graduate with experience building client-side tools, local file servers, and web automation scripts. Eager to contribute to high-scale infrastructure projects.",
      f_email: "devon.martinez@edu.org",
      f_phone: "+1 (512) 333-9081",
      f_city: "Austin",
      f_country: "TX",
      f_linkedin: "linkedin.com/in/devonm",
      f_website: "devonm.dev",
      f_github: "github.com/devonm",
      skills: ["Python", "Go", "C++", "JavaScript", "Git", "Linux Shell", "SQL", "API Design", "HTML/CSS", "PostgreSQL"],
      langs: [
        { lang: "English", level: "Native" },
        { lang: "Spanish", level: "Conversational" }
      ],
      experience: [
        {
          company: "UT Austin Open-Source Lab",
          role: "Lead Developer (Academic Project)",
          start: "2025",
          end: "2026",
          desc: "• Designed a custom Linux shell with pipeline redirection and background execution, utilized by 200+ students.\n• Authored continuous integration unit tests, boosting testing coverage from 60% to 94%."
        },
        {
          company: "Personal Portfolio Projects",
          role: "Full Stack Developer",
          start: "2024",
          end: "2025",
          desc: "• Built a local offline-first task board utilizing local storage, reducing page weight to 12kb.\n• Designed RESTful backend API in Go, integrating key-value validation patterns."
        }
      ],
      education: [
        {
          school: "University of Texas at Austin",
          degree: "B.S. in Computer Engineering (Honors)",
          start: "2022",
          end: "2026",
          desc: "GPA: 3.92 / 4.0. Completed advanced coursework in Distributed Systems, Compiler Design, and Algorithms."
        }
      ],
      certs: [
        { name: "Git Fundamentals Certificate", issuer: "GitHub Academy", year: "2024" }
      ],
      awards: [
        { title: "Dean's Honor List", org: "UT Austin", year: "2025" }
      ],
      interests: ["Hackathons", "Retro Gaming", "Cybersecurity Capture the Flag"],
      sectionOrder: ["summary", "experience", "education", "certifications", "skills", "languages", "awards", "interests"],
      sectionVis: { summary: true, experience: true, education: true, certifications: true, skills: true, languages: true, awards: true, interests: true }
    }
  }
};

window.TEMPLATE_REGISTRY = TEMPLATE_REGISTRY;
