// ══════════════════════════════════════════════════════════
// RESUME BUILDER INTELLIGENCE SYSTEM — TECH DATABASE
// ══════════════════════════════════════════════════════════
window.ResumeIntel = window.ResumeIntel || { data: {} };

window.ResumeIntel.data.tech = {
  frontend_developer: {
    title: "Frontend Developer",
    aliases: ["frontend", "front-end", "fe developer", "react developer", "web developer", "ui developer"],
    skills: ["React", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Next.js", "Redux", "REST APIs"],
    tools: ["Figma", "Git", "Webpack", "Chrome DevTools", "VS Code", "GitHub"],
    keywords: ["Single Page Applications", "Responsive Web Design", "State Management", "DOM Manipulation", "CSS Grid", "Cross-browser Compatibility", "Web Performance Optimization"],
    summaries: {
      fresher: "Enthusiastic and detail-oriented Frontend Developer graduate. Skilled in building responsive, modern layouts using HTML, CSS, and modern JavaScript libraries.",
      mid: "Dedicated Frontend Developer with 3+ years of experience engineering high-performance Single Page Applications. Passionate about responsive UI/UX and clean reusable React components.",
      senior: "Lead Frontend Engineer with 7+ years of expertise. Proven record of optimizing web application speed, establishing company-wide design systems, and mentoring junior engineers."
    },
    bulletTemplates: [
      "Engineered responsive and accessible user interfaces using React and TypeScript, resulting in a 25% increase in mobile engagement.",
      "Optimized frontend bundle sizes and assets, reducing page loading times by 35% and improving lighthouse scores.",
      "Established modular component design systems that reduced design-to-development timelines by 15 hours per week.",
      "Collaborated with backend engineers to integrate RESTful API endpoints and maintain reliable client-side state handling."
    ]
  },
  
  backend_developer: {
    title: "Backend Developer",
    aliases: ["backend", "back-end", "node developer", "python developer", "java developer", "server developer"],
    skills: ["Node.js", "Express.js", "Python", "SQL", "PostgreSQL", "MongoDB", "REST APIs", "GraphQL", "Redis"],
    tools: ["Docker", "Git", "Postman", "AWS", "Nginx", "VS Code"],
    keywords: ["Relational Databases", "NoSQL Databases", "Server Architecture", "API Design", "Query Optimization", "Microservices", "Server Security", "Authentication Systems"],
    summaries: {
      fresher: "Aspiring Backend Developer with hands-on training in server setups, database modeling, and building secure RESTful APIs using Node.js and SQL.",
      mid: "Backend Systems Developer with 4 years of experience building secure APIs, managing database migrations, and scaling backend server architectures.",
      senior: "Senior Backend Architect with 8+ years of experience leading microservices migrations, optimizing heavy SQL/NoSQL query flows, and managing cloud container databases."
    },
    bulletTemplates: [
      "Designed and implemented scalable RESTful APIs that handled over 50,000 active daily requests with a 99.9% server uptime.",
      "Optimized slow SQL database queries, improving server response times by 45% and reducing infrastructure costs.",
      "Created secure user authentication modules utilizing JWT tokens and password hashing schemes to safeguard data transactions.",
      "Migrated monolithic backend APIs into lightweight containerized microservices using Docker to streamline deployments."
    ]
  },

  fullstack_developer: {
    title: "Full Stack Developer",
    aliases: ["fullstack", "full-stack", "full stack", "software engineer", "mern developer"],
    skills: ["React", "Node.js", "TypeScript", "Express.js", "SQL", "MongoDB", "REST APIs", "CSS3", "JavaScript"],
    tools: ["Git", "Docker", "VS Code", "AWS", "Postman", "Heroku"],
    keywords: ["Full Stack Engineering", "Database Architectures", "Responsive UIs", "API Integrations", "End-to-End Testing", "State Management", "CI/CD Pipelines"],
    summaries: {
      fresher: "Adaptable Full Stack Developer graduate with practical knowledge across modern client-side interfaces and database development methodologies.",
      mid: "Versatile Full Stack Engineer with 3+ years of experience delivering complete, end-to-end web products from structural schema designs to responsive user interfaces.",
      senior: "Senior Full Stack Architect with 7+ years of experience guiding engineering teams, deploying complex SaaS web systems, and establishing CI/CD automation pipelines."
    },
    bulletTemplates: [
      "Developed and maintained end-to-end web applications using React, Node.js, and SQL, driving a 20% growth in client acquisition.",
      "Optimized query performance and frontend rendering to deliver seamless, real-time data visualisations for dashboards.",
      "Collaborated with product designers and business teams to define functional scope and rapidly deploy minimum viable products.",
      "Implemented comprehensive unit and integration tests, reducing production application error counts by 30%."
    ]
  },

  data_scientist: {
    title: "Data Scientist",
    aliases: ["data scientist", "data analyst", "machine learning engineer", "ml engineer", "ai engineer"],
    skills: ["Python", "R", "SQL", "Pandas", "NumPy", "Scikit-Learn", "TensorFlow", "Data Visualization", "Machine Learning"],
    tools: ["Jupyter Notebook", "Tableau", "Git", "AWS", "SQL Server"],
    keywords: ["Predictive Modeling", "Statistical Analysis", "Data Cleaning", "Natural Language Processing", "Feature Engineering", "A/B Testing", "Machine Learning Models"],
    summaries: {
      fresher: "Detail-oriented Data Analyst graduate. Proficient in statistical analytics, data cleaning, and scripting predictive ML models using Python and SQL.",
      mid: "Data Scientist with 3+ years of experience extraction business insights, training predictive models, and constructing interactive dashboards.",
      senior: "Senior Data Scientist with 6+ years of experience directing data analytics initiatives, deploying deep learning algorithms, and leading statistical experimentation."
    },
    bulletTemplates: [
      "Engineered predictive machine learning models that improved customer retention rate forecasting accuracy by 18%.",
      "Cleaned and analyzed complex multi-source database systems, surfacing critical operational bottlenecks for management teams.",
      "Designed interactive business dashboards in Tableau, decreasing weekly business reporting turnaround times by 8 hours.",
      "Conducted thorough A/B testing methodologies on website landing pages, boosting checkout click-through rates by 12%."
    ]
  },

  devops_engineer: {
    title: "DevOps Engineer",
    aliases: ["devops", "cloud engineer", "site reliability engineer", "sre", "infrastructure engineer"],
    skills: ["AWS", "Docker", "Kubernetes", "Linux", "Bash", "Terraform", "CI/CD", "GitHub Actions", "Python"],
    tools: ["Git", "Jenkins", "Ansible", "Prometheus", "Grafana"],
    keywords: ["Infrastructure as Code", "Container Orchestration", "Continuous Integration", "Cloud Architecture", "Monitoring", "Automation Scripts", "Security Policies"],
    summaries: {
      fresher: "Certified Cloud Engineer with hands-on experience script-writing continuous deployment pipelines and container setups.",
      mid: "DevOps Engineer with 4 years of experience streamlining software deployment pipelines, provisioning cloud setups, and managing site scaling.",
      senior: "Senior Site Reliability Engineer with 8+ years of experience architecting secure cloud server meshes, configuring disaster recovery, and reducing cloud spending."
    },
    bulletTemplates: [
      "Architected and deployed automated CI/CD pipelines that reduced average software deployment times from 45 minutes to 6 minutes.",
      "Configured container orchestration configurations using Kubernetes to manage automatic resource scaling during peak traffic hours.",
      "Implemented comprehensive log collection systems using Prometheus and Grafana, lowering network failure recovery times by 50%.",
      "Provisioned infrastructure configurations using Terraform, reducing development environment setup tasks by 12 hours weekly."
    ]
  },

  qa_engineer: {
    title: "QA Engineer",
    aliases: ["qa engineer", "software tester", "qa analyst", "automation engineer", "test engineer"],
    skills: ["Automation Testing", "Manual Testing", "Selenium", "Cypress", "JavaScript", "Python", "API Testing", "Postman", "SQL"],
    tools: ["Jira", "Git", "Jenkins", "Chrome DevTools"],
    keywords: ["Regression Testing", "Test Automation", "Bug Tracking", "UI Testing", "Black Box Testing", "Performance Testing", "API Validation", "Test Case Writing"],
    summaries: {
      fresher: "Quality Assurance graduate with knowledge of manual software validation, test case drafting, and automation script scripting.",
      mid: "QA Engineer with 3 years of experience developing automated test frameworks, validating REST API pipelines, and monitoring bug tracking boards.",
      senior: "Senior Test Automation Lead with 7+ years of experience establishing organizational validation standards and managing quality delivery systems."
    },
    bulletTemplates: [
      "Designed and executed automated testing suites using Selenium and Cypress, reducing regression test cycles by 70%.",
      "Collaborated with frontend and backend developers to diagnose software bugs, resulting in a 40% decrease in user-reported errors.",
      "Authored over 200 high-coverage manual test cases, ensuring reliable verification of cross-browser interface components.",
      "Validated RESTful API payloads and responses using Postman scripts, preventing structural database integration failures."
    ]
  }
};
