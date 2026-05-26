// ══════════════════════════════════════════════════════════
// RESUME BUILDER INTELLIGENCE SYSTEM — CORE ORCHESTRATOR
// ══════════════════════════════════════════════════════════
window.ResumeIntel = window.ResumeIntel || { data: {} };

window.ResumeIntel.Core = {
  _currentExecutionId: 0,
  _activeJdKeywords: [],
  _cache: {
    lastStateHash: "",
    atsResult: null
  },

  // Generates a simple hash string from the state to see if it changed
  generateStateHash(state) {
    const s = state || {};
    return [
      s.f_name, s.f_title, s.f_summary, s.f_email, s.f_phone, s.fontSize, s.lineH, s.accent,
      (s.skills || []).join(','),
      (s.experience || []).map(e => (e.company || '') + (e.role || '') + (e.desc || '')).join(','),
      (s.education || []).map(e => (e.school || '') + (e.degree || '') + (e.desc || '')).join(',')
    ].join('|');
  },

  // Runs debounced async analysis (Latest-Input-Wins concurrency guard)
  analyzeResume() {
    const executionId = ++this._currentExecutionId;
    const activeState = window.S;
    if (!activeState) return;

    const currentHash = this.generateStateHash(activeState) + '|' + this._activeJdKeywords.join(',');
    
    // Use cached results if state hasn't changed
    if (this._cache.lastStateHash === currentHash && this._cache.atsResult) {
      this.renderAnalytics(this._cache.atsResult);
      return;
    }

    // Wrap execution in standard Promise chain
    Promise.resolve().then(() => {
      // Check cancellation token before running calculations
      if (executionId !== this._currentExecutionId) return;

      const atsResult = window.ResumeIntel.AtsEngine.calculate(activeState, this._activeJdKeywords);
      const recommendations = window.ResumeIntel.Recommendations.getRecommendations(activeState, atsResult);
      
      const analysisResult = {
        ats: atsResult,
        recommendations: recommendations
      };

      // Save to cache
      this._cache.lastStateHash = currentHash;
      this._cache.atsResult = analysisResult;

      if (executionId === this._currentExecutionId) {
        this.renderAnalytics(analysisResult);
      }
    }).catch(err => {
      if (executionId === this._currentExecutionId) {
        console.error("Intelligence analysis cycle failed:", err);
      }
    });
  },

  // Pasted job description scanner entrypoint
  scanJobDescription(jdText) {
    if (!jdText || !jdText.trim()) {
      this._activeJdKeywords = [];
      this.analyzeResume();
      return { keywords: [], score: null };
    }

    const keywords = window.ResumeIntel.JdAnalyzer.analyze(jdText);
    this._activeJdKeywords = keywords;
    
    // Invalidate cache and trigger scan
    this._cache.lastStateHash = "";
    this.analyzeResume();
    
    return keywords;
  },

  // Updates the dynamic UI cards and status indicators
  renderAnalytics(analysis) {
    // 1. Update circular score element
    const atsScoreVal = document.getElementById('atsScoreVal');
    const atsScoreFill = document.getElementById('atsScoreFill');
    if (atsScoreVal) {
      atsScoreVal.textContent = `${analysis.ats.score}%`;
    }
    if (atsScoreFill) {
      // Draw progress circular stroke dasharray or simple border offset percentage
      const angle = (analysis.ats.score / 100) * 360;
      atsScoreFill.style.background = `conic-gradient(var(--accent) ${angle}deg, rgba(255,255,255,0.06) ${angle}deg)`;
    }

    // Update screen-reader live status announcer
    const announcer = document.getElementById('ats-live-announcer');
    if (announcer) {
      announcer.textContent = `Resume score is ${analysis.ats.score} percent. ${analysis.recommendations.length} recommendations available.`;
    }

    // 2. Render breakdown details
    const bd = analysis.ats.breakdown;
    const bHtml = `
      <div class="bd-row"><span class="bd-lbl">Keyword Match</span><span class="bd-val">${bd.keywordMatch}/30</span></div>
      <div class="bd-row"><span class="bd-lbl">Completeness</span><span class="bd-val">${bd.completeness}/25</span></div>
      <div class="bd-row"><span class="bd-lbl">Metrics Density</span><span class="bd-val">${bd.metricsDensity}/15</span></div>
      <div class="bd-row"><span class="bd-lbl">Formatting Safety</span><span class="bd-val">${bd.formattingSafety}/15</span></div>
      <div class="bd-row"><span class="bd-lbl">Action Verbs</span><span class="bd-val">${bd.actionVerbs}/15</span></div>
    `;
    const breakdownEl = document.getElementById('atsBreakdownPanel');
    if (breakdownEl) breakdownEl.innerHTML = bHtml;

    // 3. Render recommendations checklist cards
    const recsList = document.getElementById('recsListPanel');
    if (recsList) {
      if (analysis.recommendations.length === 0) {
        recsList.innerHTML = `<div class="rec-empty"><i class="ti ti-check-double"></i> All checklist items completed! Excellent work.</div>`;
      } else {
        recsList.innerHTML = analysis.recommendations.map(r => {
          const badgeClass = r.urgency === 'high' ? 'badge-high' : 'badge-med';
          return `
            <div class="rec-card urgency-${r.urgency}" tabindex="0">
              <div class="rec-card-header">
                <span class="rec-badge ${badgeClass}">${r.urgency.toUpperCase()}</span>
                <span class="rec-card-msg">${r.message}</span>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // 4. Render Job Description keywords indicators
    const kwPanel = document.getElementById('jdKeywordsPanel');
    if (kwPanel && this._activeJdKeywords.length > 0) {
      const resumeText = this.ats = window.ResumeIntel.AtsEngine.extractAllText(window.S);
      const resumeTokens = new Set(window.ResumeIntel.Utils.tokenizeAndNormalize(resumeText));

      let matchedHtml = "";
      let missingHtml = "";

      this._activeJdKeywords.forEach(kw => {
        const hasIt = resumeTokens.has(kw.toLowerCase());
        const pill = `<span class="kw-pill ${hasIt ? 'matched' : 'missing'}" tabindex="0" title="${hasIt ? 'Included' : 'Missing keyword - Click to add to your skills'}" onclick="if(!${hasIt}) addSkillFromJd('${kw}')"><i class="ti ${hasIt ? 'ti-check' : 'ti-plus'}"></i> ${kw}</span>`;
        if (hasIt) matchedHtml += pill;
        else missingHtml += pill;
      });

      kwPanel.innerHTML = `
        <div class="kw-group-label"><i class="ti ti-circle-check" style="color:#22c55e"></i> Found in Resume</div>
        <div class="kw-flex">${matchedHtml || '<span style="opacity:0.6;font-size:0.78rem">No matching keywords.</span>'}</div>
        <div class="kw-group-label" style="margin-top:12px"><i class="ti ti-alert-circle" style="color:#f59e0b"></i> Recommended Additions</div>
        <div class="kw-flex">${missingHtml || '<span style="opacity:0.6;font-size:0.78rem">No missing keywords!</span>'}</div>
      `;
    } else if (kwPanel) {
      kwPanel.innerHTML = `<div style="text-align:center;padding:12px;opacity:0.5;font-size:0.8rem">Paste a Job Description above to scan for missing keywords.</div>`;
    }
  }
};
