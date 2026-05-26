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
    let stuffedKeywords = [];
    const synonyms = {
      "react": ["react", "reactjs", "react.js", "react-js"],
      "reactjs": ["react", "reactjs", "react.js", "react-js"],
      "react.js": ["react", "reactjs", "react.js", "react-js"],
      "react-js": ["react", "reactjs", "react.js", "react-js"],
      "node": ["node", "nodejs", "node.js"],
      "nodejs": ["node", "nodejs", "node.js"],
      "node.js": ["node", "nodejs", "node.js"],
      "javascript": ["javascript", "js", "es6", "ecmascript"],
      "js": ["javascript", "js", "es6", "ecmascript"],
      "es6": ["javascript", "js", "es6", "ecmascript"],
      "ecmascript": ["javascript", "js", "es6", "ecmascript"],
      "typescript": ["typescript", "ts"],
      "ts": ["typescript", "ts"],
      "ui": ["ui", "user interface", "interface design", "user-interface", "ui design"],
      "user interface": ["ui", "user interface", "interface design", "user-interface", "ui design"],
      "interface design": ["ui", "user interface", "interface design", "user-interface", "ui design"],
      "user-interface": ["ui", "user interface", "interface design", "user-interface", "ui design"],
      "ui design": ["ui", "user interface", "interface design", "user-interface", "ui design"],
      "ux": ["ux", "user experience", "ux design", "user-experience"],
      "user experience": ["ux", "user experience", "ux design", "user-experience"],
      "ux design": ["ux", "user experience", "ux design", "user-experience"],
      "user-experience": ["ux", "user experience", "ux design", "user-experience"],
      "machine learning": ["machine learning", "ml"],
      "ml": ["machine learning", "ml"],
      "design systems": ["design systems", "design system"],
      "design system": ["design systems", "design system"],
      "project management": ["project management", "pm"],
      "pm": ["project management", "pm"],
      "single page applications": ["single page applications", "single page application", "spa"],
      "single page application": ["single page applications", "single page application", "spa"],
      "spa": ["single page applications", "single page application", "spa"]
    };

    const isTechSkill = (keyword) => {
      return /react|node|javascript|typescript|js|ts|figma|css|html|aws|docker|sql|seo|analytics|design|ui|ux|machine learning|ml|design system|single page application|spa|software engineering|web development|cloud computing|data science|ci\/cd|continuous integration|continuous deployment|responsive design|mobile development/i.test(keyword);
    };

    if (jdKeywords && jdKeywords.length > 0) {
      let matchedWeight = 0;
      let totalWeight = 0;

      const normalizedResumeText = resumeText.toLowerCase().replace(/[\s-]+/g, ' ');

      jdKeywords.forEach(keyword => {
        const kw = keyword.toLowerCase();
        const weight = isTechSkill(kw) ? 2.0 : 1.0;
        totalWeight += weight;

        const syns = synonyms[kw] || [kw];
        let isMatched = false;

        for (let s of syns) {
          const normalizedSyn = s.toLowerCase().replace(/[\s-]+/g, ' ');
          if (normalizedSyn.includes(' ')) {
            if (normalizedResumeText.includes(normalizedSyn)) {
              isMatched = true;
              break;
            }
          } else {
            if (resumeTokenSet.has(s)) {
              isMatched = true;
              break;
            }
          }
        }

        if (isMatched) {
          matchedWeight += weight;
        }
      });

      scoreDetails.breakdown.keywordMatch = totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 30) : 0;
    } else {
      // Default baseline match using generic ATS tokens
      const keywordsFound = this.countCommonAtsKeywords(resumeTokenSet);
      scoreDetails.breakdown.keywordMatch = Math.min(30, Math.round((keywordsFound / 10) * 30));
    }

    // General Keyword Stuffing check (>4% density limit of non-stop-word tokens)
    const stopWords = window.ResumeIntel.JdAnalyzer ? window.ResumeIntel.JdAnalyzer.stopWords : new Set();
    const tokenCounts = {};
    resumeTokens.forEach(t => {
      if (t.length > 1 && !stopWords.has(t)) {
        tokenCounts[t] = (tokenCounts[t] || 0) + 1;
      }
    });

    Object.keys(tokenCounts).forEach(word => {
      const count = tokenCounts[word];
      const density = count / Math.max(1, resumeTokens.length);
      if (density > 0.04 && count > 3) {
        if (!stuffedKeywords.includes(word)) {
          stuffedKeywords.push(word);
        }
      }
    });

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
