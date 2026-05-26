// ══════════════════════════════════════════════════════════
// RESUME BUILDER INTELLIGENCE SYSTEM — ROLE MATCHER
// ══════════════════════════════════════════════════════════
window.ResumeIntel = window.ResumeIntel || { data: {} };

window.ResumeIntel.RoleMatcher = {
  matchRole(query) {
    const utils = window.ResumeIntel.Utils;
    const queryTokens = utils.tokenizeAndNormalize(query);
    if (queryTokens.length === 0) return [];

    const results = [];
    
    // Scan all loaded categories inside window.ResumeIntel.data
    for (const [catName, roles] of Object.entries(window.ResumeIntel.data)) {
      for (const [key, role] of Object.entries(roles)) {
        const titleTokens = utils.tokenizeAndNormalize(role.title);
        const aliasTokens = (role.aliases || []).map(a => utils.tokenizeAndNormalize(a));

        let maxScore = 0;

        // 1. Calculate Score for Primary Title
        let score = this.calculateOverlap(queryTokens, titleTokens, true);
        maxScore = Math.max(maxScore, score);

        // 2. Calculate Score for Aliases
        aliasTokens.forEach(tokens => {
          let aliasScore = this.calculateOverlap(queryTokens, tokens, false);
          maxScore = Math.max(maxScore, aliasScore);
        });

        if (maxScore > 10) { // Matching threshold
          results.push({
            key,
            role,
            category: catName,
            score: Math.round(maxScore)
          });
        }
      }
    }

    // Sort descending by score
    return results.sort((a, b) => b.score - a.score).slice(0, 5);
  },

  calculateOverlap(queryTokens, targetTokens, isPrimary) {
    let intersection = 0;
    let positionWeight = 0;

    queryTokens.forEach((qToken, qIdx) => {
      targetTokens.forEach((tToken, tIdx) => {
        if (qToken === tToken) {
          intersection += 1.0; // Exact match boost
          positionWeight += (1 / (qIdx + 1)) * (1 / (tIdx + 1));
        } else if (tToken.startsWith(qToken) || qToken.startsWith(tToken)) {
          intersection += 0.6; // Partial matching/typo-tolerance heuristic
          positionWeight += (0.6 / (qIdx + 1)) * (1 / (tIdx + 1));
        }
      });
    });

    if (intersection === 0) return 0;

    const union = new Set([...queryTokens, ...targetTokens]).size;
    const jaccard = intersection / union;
    
    // Weight Jaccard similarity and structural word-position
    let score = (jaccard * 80) + (positionWeight * 20);
    
    if (isPrimary) {
      score += 10; // Primary title bonus
    }

    return Math.min(100, score);
  }
};
