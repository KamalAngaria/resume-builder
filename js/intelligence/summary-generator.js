// ══════════════════════════════════════════════════════════
// RESUME BUILDER INTELLIGENCE SYSTEM — SUMMARY GENERATOR
// ══════════════════════════════════════════════════════════
window.ResumeIntel = window.ResumeIntel || { data: {} };

window.ResumeIntel.SummaryGenerator = {
  generate(roleKey, level) {
    const databases = Object.values(window.ResumeIntel.data);
    let matchedRole = null;

    // Search databases for role details
    for (const db of databases) {
      if (db[roleKey]) {
        matchedRole = db[roleKey];
        break;
      }
    }

    if (!matchedRole) return [];

    const title = matchedRole.title;
    const skills = matchedRole.skills.slice(0, 3).join(', ');
    const tools = matchedRole.tools.slice(0, 2).join(' and ');

    // Compile dynamic variations based on experience tier
    const variations = [];
    const baseSummary = matchedRole.summaries[level] || matchedRole.summaries['mid'];

    if (level === 'fresher') {
      variations.push(
        `${baseSummary} Enthusiastic about applying technical skills in ${skills} to solve complex problems and support team deliverables.`,
        `Recent graduate trained in ${title} methodologies. Eager to deploy skills in ${skills} utilizing ${tools} to deliver high-quality project results.`
      );
    } else if (level === 'senior') {
      variations.push(
        `${baseSummary} Adept at guiding engineering directions, collaborating with cross-functional partners, and optimizing operational workflows using modern methodologies.`,
        `Results-driven Lead with a verified history of managing complex project deliverables. Strong expertise in ${skills} and orchestrating teams using ${tools}.`
      );
    } else { // mid
      variations.push(
        `${baseSummary} Experienced in working within Agile environments to build high-coverage features, optimize assets, and leverage tools like ${tools}.`,
        `Detail-oriented ${title} with a proven record of optimizing project cycles. Skilled in ${skills} and utilizing modern software engineering practices.`
      );
    }

    return variations;
  }
};
