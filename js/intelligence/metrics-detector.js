// ══════════════════════════════════════════════════════════
// RESUME BUILDER INTELLIGENCE SYSTEM — METRICS DETECTOR
// ══════════════════════════════════════════════════════════
window.ResumeIntel = window.ResumeIntel || { data: {} };

window.ResumeIntel.MetricsDetector = {
  // Regex to scan for metrics: percentages, dollar values, timespans, count targets, scaling terms
  metricsRegex: /\b(\d+(?:\.\d+)?%|\$\d+(?:[\d,\.]*[\w]*)?|\d+\s*(?:hours|days|weeks|months|years|x|percent|users|leads|customers|clients|projects|servers|records))\b/i,

  // Scans experience block descriptions for quantitative numbers
  hasMetrics(text) {
    if (!text) return false;
    return this.metricsRegex.test(text);
  },

  // Returns tailored advice if metrics are missing
  getAdviceForSection(companyName) {
    return {
      type: "metric",
      message: `Include measurable metrics in your experience under "${companyName || 'Company'}" (e.g. 20% faster, saved 5 hours, managed $10K budget) to prove your achievements.`,
      urgency: "medium"
    };
  }
};
