// ══════════════════════════════════════════════════════════
// RESUME BUILDER INTELLIGENCE SYSTEM — BULLET ENGINE
// ══════════════════════════════════════════════════════════
window.ResumeIntel = window.ResumeIntel || { data: {} };

window.ResumeIntel.BulletEngine = {
  verbMap: {
    "^made\\b": "Built",
    "^worked on\\b": "Developed",
    "^helped\\b": "Collaborated on",
    "^managed\\b": "Led",
    "^fixed\\b": "Resolved",
    "^did\\b": "Executed",
    "^wrote\\b": "Authored",
    "^handled\\b": "Managed",
    "^took care of\\b": "Directed",
    "^supervised\\b": "Guided",
    "^designed\\b": "Designed",
    "^coded\\b": "Engineered"
  },
  
  improve(text) {
    let clean = (text || '').trim();
    if (!clean) return "";

    // Remove leading bullet symbols and ending periods
    clean = clean.replace(/^[•\-▸*]\s*/, '').replace(/\.$/, '');

    // Replace weak action verbs at sentence start
    for (const [weakPattern, strongVerb] of Object.entries(this.verbMap)) {
      const regex = new RegExp(weakPattern, 'i');
      if (regex.test(clean)) {
        clean = clean.replace(regex, strongVerb);
        break;
      }
    }

    // Capitalize first letter
    clean = clean.charAt(0).toUpperCase() + clean.slice(1);

    // Return with single ending period
    return clean + ".";
  },

  // Flags recruiter-hostile corporate buzzwords
  flagBuzzwords(text) {
    const buzzwords = [
      "synergy", "synergized", "synergize", "leverage", "leveraged", 
      "strategic paradigm", "transformative ecosystem", "ecosystem",
      "game-changing", "disruptive", "cutting-edge", "outside the box"
    ];
    const lowerText = text.toLowerCase();
    return buzzwords.filter(b => lowerText.includes(b));
  }
};
