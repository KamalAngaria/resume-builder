// ══════════════════════════════════════════════════════════
// RESUME BUILDER INTELLIGENCE SYSTEM — ATS SCORING ENGINE
// ══════════════════════════════════════════════════════════
window.ResumeIntel = window.ResumeIntel || { data: {} };

window.ResumeIntel.AtsEngine = {
  calculate(resumeState, jdKeywords = []) {
    let scoreDetails = {
      score: 0,
      breakdown: {
        keywordMatch: 0,       // 30 pts max
        completeness: 0,       // 25 pts max
        metricsDensity: 0,     // 15 pts max
        formattingSafety: 15,  // 15 pts max
        actionVerbs: 0         // 15 pts max
      },
      penalties: [],
      alerts: []
    };

    // Extract all text and tokens from state S
    const resumeText = this.extractAllText(resumeState);
    const resumeTokens = window.ResumeIntel.Utils.tokenizeAndNormalize(resumeText);
    const resumeTokenSet = new Set(resumeTokens);

    // 1. Keyword Match (30 points)
    let matchCount = 0;
    let stuffedKeywords = [];
    
    if (jdKeywords && jdKeywords.length > 0) {
      jdKeywords.forEach(keyword => {
        const kw = keyword.toLowerCase();
        if (resumeTokenSet.has(kw)) {
          matchCount++;
          
          // Anti-stuffing: check if frequency is > 4% of total tokens
          const occurrences = resumeTokens.filter(t => t === kw).length;
          const density = occurrences / resumeTokens.length;
          if (density > 0.04) {
            stuffedKeywords.push(keyword);
          }
        }
      });
      scoreDetails.breakdown.keywordMatch = Math.round((matchCount / jdKeywords.length) * 30);
    } else {
      // Default baseline match using generic ATS tokens
      const keywordsFound = this.countCommonAtsKeywords(resumeTokenSet);
      scoreDetails.breakdown.keywordMatch = Math.min(30, Math.round((keywordsFound / 10) * 30));
    }

    // 2. Completeness (25 points)
    let completePoints = 0;
    if (resumeState.f_name) completePoints += 3;
    if (resumeState.f_title) completePoints += 3;
    if (resumeState.f_summary) completePoints += 4;
    if (resumeState.f_email || resumeState.f_phone) completePoints += 3;
    if (resumeState.experience && resumeState.experience.length > 0) completePoints += 4;
    if (resumeState.education && resumeState.education.length > 0) completePoints += 4;
    if (resumeState.skills && resumeState.skills.length > 0) completePoints += 4;
    scoreDetails.breakdown.completeness = completePoints;

    // 3. Metrics Density (15 points)
    let metricHits = 0;
    const detector = window.ResumeIntel.MetricsDetector;
    if (resumeState.experience && resumeState.experience.length > 0) {
      resumeState.experience.forEach(exp => {
        if (detector.hasMetrics(exp.desc)) {
          metricHits++;
        }
      });
      const ratio = metricHits / resumeState.experience.length;
      scoreDetails.breakdown.metricsDensity = Math.round(ratio * 15);
    }

    // 4. Formatting Safety (15 points)
    let formatScore = 15;
    if (resumeState.fontSize < 80 || resumeState.fontSize > 120) {
      formatScore -= 5;
      scoreDetails.alerts.push("Font size is outside standard ATS-optimal range (80% - 120%).");
    }
    if (resumeState.lineH < 1.2 || resumeState.lineH > 2.0) {
      formatScore -= 5;
      scoreDetails.alerts.push("Line height is outside standard ATS-optimal margins (1.2 - 2.0).");
    }
    scoreDetails.breakdown.formattingSafety = formatScore;

    // 5. Action Verbs (15 points)
    const verbs = ["led", "built", "designed", "engineered", "optimized", "managed", "orchestrated", "developed", "collaborated", "authored", "resolved", "executed", "formulated", "spearheaded"];
    let verbHits = 0;
    verbs.forEach(v => {
      if (resumeTokenSet.has(v)) verbHits++;
    });
    scoreDetails.breakdown.actionVerbs = Math.min(15, Math.round((verbHits / 5) * 15));

    // Calculate raw score sum
    let totalScore = Object.values(scoreDetails.breakdown).reduce((a, b) => a + b, 0);

    // Apply Stuffing Penalty
    if (stuffedKeywords.length > 0) {
      totalScore -= 15;
      scoreDetails.penalties.push({
        type: "stuffing",
        message: `Keyword stuffing flagged! These words exceed 4% overall density: ${stuffedKeywords.join(', ')}. Keep usage natural.`
      });
    }

    // Apply Invisible Text Check (White text on white canvas penalty)
    if (resumeState.accent && resumeState.accent.toLowerCase() === '#ffffff') {
      totalScore -= 20;
      scoreDetails.penalties.push({
        type: "invisible_text",
        message: "White background-contrast conflict: pure white accent configurations fail standard ATS readability tests."
      });
    }

    scoreDetails.score = Math.max(0, Math.min(100, Math.round(totalScore)));
    return scoreDetails;
  },

  extractAllText(state) {
    let text = [
      state.f_name,
      state.f_title,
      state.f_summary,
      state.f_email,
      state.f_phone,
      state.f_city,
      state.f_country
    ].join(' ');

    if (state.skills) text += ' ' + state.skills.join(' ');
    if (state.experience) {
      state.experience.forEach(exp => {
        text += ' ' + (exp.company || '') + ' ' + (exp.role || '') + ' ' + (exp.desc || '');
      });
    }
    if (state.education) {
      state.education.forEach(edu => {
        text += ' ' + (edu.school || '') + ' ' + (edu.degree || '') + ' ' + (edu.desc || '');
      });
    }
    return text;
  },

  countCommonAtsKeywords(resumeTokenSet) {
    const commonKeywords = ["responsibilities", "project", "management", "technical", "agile", "collaboration", "performance", "communication", "delivery", "process", "systems", "strategic"];
    let hits = 0;
    commonKeywords.forEach(k => {
      if (resumeTokenSet.has(k)) hits++;
    });
    return hits;
  }
};
