// ══════════════════════════════════════════════════════════
// RESUME BUILDER INTELLIGENCE SYSTEM — SKILL ENGINE
// ══════════════════════════════════════════════════════════
window.ResumeIntel = window.ResumeIntel || { data: {} };

window.ResumeIntel.SkillEngine = {
  dependencies: {
    // Tech Skill links
    "react": ["Next.js", "Redux", "TypeScript", "Tailwind CSS", "REST APIs", "Cypress"],
    "typescript": ["React", "Node.js", "JavaScript", "REST APIs", "GraphQL"],
    "javascript": ["HTML5", "CSS3", "React", "TypeScript", "Node.js", "Webpack"],
    "node.js": ["Express.js", "MongoDB", "SQL", "PostgreSQL", "REST APIs", "Docker"],
    "python": ["SQL", "Pandas", "NumPy", "Scikit-Learn", "TensorFlow", "Django", "Flask"],
    "aws": ["Docker", "Kubernetes", "Terraform", "Linux", "CI/CD", "Nginx"],
    "docker": ["Kubernetes", "AWS", "Terraform", "CI/CD", "Node.js"],
    "automation testing": ["Selenium", "Cypress", "Postman", "JavaScript", "Jira"],
    
    // Design Skill links
    "ui/ux design": ["Wireframing", "Prototyping", "User Research", "Design Systems", "Usability Testing", "Figma"],
    "figma": ["UI/UX Design", "Wireframing", "Prototyping", "Design Systems", "Visual Design", "Sketch"],
    "graphic design": ["Typography", "Branding", "Layout Design", "Adobe Illustrator", "Adobe Photoshop"],
    
    // Business Skill links
    "product roadmap": ["Agile Methodologies", "Feature Prioritization", "User Stories", "Jira", "Mixpanel"],
    "project management": ["Agile", "Scrum", "Risk Management", "Asana", "Monday.com"],
    "business analysis": ["Requirements Gathering", "SQL", "Data Modeling", "Process Mapping", "Tableau"],
    "financial accounting": ["General Ledger", "Tax Compliance", "Auditing", "Reconciliation", "QuickBooks"],

    // Marketing Skill links
    "digital marketing": ["Paid Ads", "Google Analytics", "Email Marketing", "SEO", "Facebook Ads"],
    "seo": ["Keyword Research", "Google Search Console", "Google Analytics", "SEMrush", "Ahrefs"]
  },

  recommend(currentSkills) {
    if (!currentSkills || currentSkills.length === 0) {
      // Return a set of default starter skills
      return ["React", "JavaScript", "UI/UX Design", "Figma", "Project Management", "Digital Marketing", "SQL"];
    }

    const suggestions = new Set();
    const currentSet = new Set(currentSkills.map(s => s.toLowerCase().trim()));

    currentSkills.forEach(skill => {
      const sLower = skill.toLowerCase().trim();
      
      // Check exact matching links
      for (const [key, deps] of Object.entries(this.dependencies)) {
        if (key === sLower || sLower.includes(key) || key.includes(sLower)) {
          deps.forEach(dep => {
            if (!currentSet.has(dep.toLowerCase().trim())) {
              suggestions.add(dep);
            }
          });
        }
      }
    });

    return Array.from(suggestions).slice(0, 5); // Return top 5 suggestions
  }
};
