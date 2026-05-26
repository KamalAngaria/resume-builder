// ══════════════════════════════════════════════════════════
// RESUME BUILDER INTELLIGENCE SYSTEM — RECOMMENDATIONS
// ══════════════════════════════════════════════════════════
window.ResumeIntel = window.ResumeIntel || { data: {} };

window.ResumeIntel.Recommendations = {
  getRecommendations(state, atsDetails) {
    const list = [];

    // 1. Check Section Completeness (Critical items)
    if (!state.f_name) {
      list.push({
        id: "missing_name",
        type: "completeness",
        message: "Add your Full Name to the personal info section.",
        urgency: "high"
      });
    }
    if (!state.f_title) {
      list.push({
        id: "missing_title",
        type: "completeness",
        message: "Specify your Target Job Title to optimize search matching.",
        urgency: "high"
      });
    }
    if (!state.f_summary) {
      list.push({
        id: "missing_summary",
        type: "completeness",
        message: "Draft a Professional Summary to capture recruiter attention.",
        urgency: "high"
      });
    }
    if (!state.f_email && !state.f_phone) {
      list.push({
        id: "missing_contact",
        type: "completeness",
        message: "Include at least one Contact Method (Email or Phone).",
        urgency: "high"
      });
    }

    // 2. Check LinkedIn Links
    if (!state.f_linkedin) {
      list.push({
        id: "missing_linkedin",
        type: "completeness",
        message: "Add a LinkedIn Profile Link to increase callback rates.",
        urgency: "medium"
      });
    }

    // 3. Scan Experience Metrics
    const detector = window.ResumeIntel.MetricsDetector;
    let missingMetricsCount = 0;
    if (state.experience && state.experience.length > 0) {
      state.experience.forEach(exp => {
        if (!detector.hasMetrics(exp.desc)) {
          missingMetricsCount++;
          list.push({
            id: `missing_metric_${exp.company || 'exp'}`,
            type: "metric",
            message: `Consider adding quantitative metrics (percentages, revenues, or timespans) under "${exp.company || 'experience'}".`,
            urgency: "medium"
          });
        }
      });
    }

    // 4. Scorer Alerts (Formatting issues)
    if (atsDetails && atsDetails.alerts) {
      atsDetails.alerts.forEach((alert, idx) => {
        list.push({
          id: `ats_alert_${idx}`,
          type: "formatting",
          message: alert,
          urgency: "medium"
        });
      });
    }

    // 5. Scorer Penalties (Stuffing & Invisible issues)
    if (atsDetails && atsDetails.penalties) {
      atsDetails.penalties.forEach((penalty, idx) => {
        list.push({
          id: `ats_penalty_${idx}`,
          type: "penalty",
          message: penalty.message,
          urgency: "high"
        });
      });
    }

    // Sort: High urgency first, completeness next, followed by other suggestions
    const sorted = list.sort((a, b) => {
      const urgencyRank = { "high": 3, "medium": 2, "low": 1 };
      return urgencyRank[b.urgency] - urgencyRank[a.urgency];
    });

    // Capping recommendations list to prevent user fatigue (Top 4 items max)
    return sorted.slice(0, 4);
  }
};
