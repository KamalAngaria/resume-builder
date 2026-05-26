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
        const breakdownEl = document.getElementById('atsBreakdownPanel');
        if (breakdownEl) {
          breakdownEl.innerHTML = `<div style="color:#ff4d4d;padding:10px;font-family:monospace;font-size:0.75rem;background:rgba(255,77,77,0.08);border-radius:6px;border:1px solid rgba(255,77,77,0.15)">
            <strong>Analysis Error:</strong> ${err.message}<br>
            <span style="font-size:0.68rem;opacity:0.8">${err.stack ? err.stack.split('\n')[0] : ''}</span>
          </div>`;
        }
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
      atsScoreFill.style.background = `conic-gradient(var(--accent) ${angle}deg, rgba(0,0,0,0.06) ${angle}deg)`;
    }

    // Score delta animation
    const atsScoreDelta = document.getElementById('atsScoreDelta');
    if (atsScoreDelta) {
      if (typeof window._prevAtsScore !== 'undefined' && window._prevAtsScore !== null) {
        const delta = analysis.ats.score - window._prevAtsScore;
        if (delta !== 0) {
          atsScoreDelta.textContent = delta > 0 ? `+${delta}` : `${delta}`;
          atsScoreDelta.style.color = delta > 0 ? '#22c55e' : '#ff4d4d';
          atsScoreDelta.style.transform = 'translateY(-12px)';
          atsScoreDelta.style.opacity = '1';
          
          if (window._atsScoreDeltaTimeout) clearTimeout(window._atsScoreDeltaTimeout);
          window._atsScoreDeltaTimeout = setTimeout(() => {
            atsScoreDelta.style.opacity = '0';
            atsScoreDelta.style.transform = 'translateY(8px)';
          }, 1200);
        }
      }
      window._prevAtsScore = analysis.ats.score;
    } else {
      window._prevAtsScore = analysis.ats.score;
    }

    // Update screen-reader live status announcer
    const announcer = document.getElementById('ats-live-announcer');
    if (announcer) {
      announcer.textContent = `Resume score is ${analysis.ats.score} percent. ${analysis.recommendations.length} recommendations available.`;
    }

    // 2. Render breakdown details with expandability
    const bd = analysis.ats.breakdown;
    
    if (!window.toggleBdExplain) {
      window.toggleBdExplain = function(cat, event) {
        if (event) event.stopPropagation();
        const el = document.getElementById(`bd-exp-${cat}`);
        const chev = document.getElementById(`bd-chev-${cat}`);
        if (el) {
          const isHidden = el.style.display === 'none' || el.style.display === '';
          el.style.display = isHidden ? 'block' : 'none';
          if (chev) {
            chev.style.transform = isHidden ? 'rotate(90deg)' : 'rotate(0deg)';
          }
        }
      };
    }

    const bHtml = `
      <div class="bd-row-container" style="border-bottom: 1px solid var(--border); padding: 2px 0;">
        <div class="bd-row" onclick="toggleBdExplain('keywordMatch', event)" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center; padding: 8px 0; font-size: 0.78rem;">
          <span class="bd-lbl" style="display: flex; align-items: center; gap: 6px; font-weight: 500; color: var(--text);">
            <i class="ti ti-chevron-right" id="bd-chev-keywordMatch" style="font-size: 11px; transition: transform 0.2s; color: var(--muted);"></i>
            Keyword Match
          </span>
          <span class="bd-val" style="font-weight: 700; font-family: monospace; color: var(--text);">${bd.keywordMatch}/30</span>
        </div>
        <div class="bd-explain" id="bd-exp-keywordMatch" style="display: none; padding: 4px 6px 10px 18px; font-size: 0.74rem; color: var(--muted); line-height: 1.45;">
          <div style="margin-bottom: 4px;"><strong>What it means:</strong> Measures how many of the target job keywords are present in your resume.</div>
          <div style="margin-bottom: 4px;"><strong>Why it matters:</strong> Recruiters query database search filters by these terms. Resumes without exact keyword hits are filtered out.</div>
          <div><strong>How to improve:</strong> Paste a Job Description below and click the yellow recommendation pills to add missing keywords.</div>
        </div>
      </div>

      <div class="bd-row-container" style="border-bottom: 1px solid var(--border); padding: 2px 0;">
        <div class="bd-row" onclick="toggleBdExplain('completeness', event)" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center; padding: 8px 0; font-size: 0.78rem;">
          <span class="bd-lbl" style="display: flex; align-items: center; gap: 6px; font-weight: 500; color: var(--text);">
            <i class="ti ti-chevron-right" id="bd-chev-completeness" style="font-size: 11px; transition: transform 0.2s; color: var(--muted);"></i>
            Completeness
          </span>
          <span class="bd-val" style="font-weight: 700; font-family: monospace; color: var(--text);">${bd.completeness}/25</span>
        </div>
        <div class="bd-explain" id="bd-exp-completeness" style="display: none; padding: 4px 6px 10px 18px; font-size: 0.74rem; color: var(--muted); line-height: 1.45;">
          <div style="margin-bottom: 4px;"><strong>What it means:</strong> Validates if core sections (Name, Title, Summary, Work History, Education, Skills) are populated.</div>
          <div style="margin-bottom: 4px;"><strong>Why it matters:</strong> Missing metadata fields prevent candidate matching algorithms from index-profiling your resume.</div>
          <div><strong>How to improve:</strong> Fill out empty inputs in the Profile Info tab and ensure at least one Experience and Education item is added.</div>
        </div>
      </div>

      <div class="bd-row-container" style="border-bottom: 1px solid var(--border); padding: 2px 0;">
        <div class="bd-row" onclick="toggleBdExplain('metricsDensity', event)" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center; padding: 8px 0; font-size: 0.78rem;">
          <span class="bd-lbl" style="display: flex; align-items: center; gap: 6px; font-weight: 500; color: var(--text);">
            <i class="ti ti-chevron-right" id="bd-chev-metricsDensity" style="font-size: 11px; transition: transform 0.2s; color: var(--muted);"></i>
            Metrics Density
          </span>
          <span class="bd-val" style="font-weight: 700; font-family: monospace; color: var(--text);">${bd.metricsDensity}/15</span>
        </div>
        <div class="bd-explain" id="bd-exp-metricsDensity" style="display: none; padding: 4px 6px 10px 18px; font-size: 0.74rem; color: var(--muted); line-height: 1.45;">
          <div style="margin-bottom: 4px;"><strong>What it means:</strong> Scans descriptions for quantitative metrics (percentages, revenues, timespans).</div>
          <div style="margin-bottom: 4px;"><strong>Why it matters:</strong> Hiring managers hire for business results. Quantifiable bullets show proven outcomes rather than a basic task list.</div>
          <div><strong>How to improve:</strong> Edit descriptions under Work experience to include numbers (e.g. *"grew user base by 15%"* or *"reduced build time by 4 hours"*).</div>
        </div>
      </div>

      <div class="bd-row-container" style="border-bottom: 1px solid var(--border); padding: 2px 0;">
        <div class="bd-row" onclick="toggleBdExplain('formattingSafety', event)" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center; padding: 8px 0; font-size: 0.78rem;">
          <span class="bd-lbl" style="display: flex; align-items: center; gap: 6px; font-weight: 500; color: var(--text);">
            <i class="ti ti-chevron-right" id="bd-chev-formattingSafety" style="font-size: 11px; transition: transform 0.2s; color: var(--muted);"></i>
            Formatting Safety
          </span>
          <span class="bd-val" style="font-weight: 700; font-family: monospace; color: var(--text);">${bd.formattingSafety}/15</span>
        </div>
        <div class="bd-explain" id="bd-exp-formattingSafety" style="display: none; padding: 4px 6px 10px 18px; font-size: 0.74rem; color: var(--muted); line-height: 1.45;">
          <div style="margin-bottom: 4px;"><strong>What it means:</strong> Asserts if document styles (font size and line heights) fall within standard margins.</div>
          <div style="margin-bottom: 4px;"><strong>Why it matters:</strong> Extreme sizing properties fail text-readability rendering or overlap lines during text parsing.</div>
          <div><strong>How to improve:</strong> Keep font size between 80-120% and line height between 1.2-2.0 under the Design tab.</div>
        </div>
      </div>

      <div class="bd-row-container" style="padding: 2px 0;">
        <div class="bd-row" onclick="toggleBdExplain('actionVerbs', event)" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center; padding: 8px 0; font-size: 0.78rem;">
          <span class="bd-lbl" style="display: flex; align-items: center; gap: 6px; font-weight: 500; color: var(--text);">
            <i class="ti ti-chevron-right" id="bd-chev-actionVerbs" style="font-size: 11px; transition: transform 0.2s; color: var(--muted);"></i>
            Action Verbs
          </span>
          <span class="bd-val" style="font-weight: 700; font-family: monospace; color: var(--text);">${bd.actionVerbs}/15</span>
        </div>
        <div class="bd-explain" id="bd-exp-actionVerbs" style="display: none; padding: 4px 6px 10px 18px; font-size: 0.74rem; color: var(--muted); line-height: 1.45;">
          <div style="margin-bottom: 4px;"><strong>What it means:</strong> Measures occurrences of strong, executive action verbs (*led, built, designed, optimized*).</div>
          <div style="margin-bottom: 4px;"><strong>Why it matters:</strong> Weak passive words (*helped, worked on*) weaken recruiter impact. Action verbs emphasize ownership.</div>
          <div><strong>How to improve:</strong> Click the "Enhance Bullets" trigger in the Work experience tab to automatically elevate passive statements.</div>
        </div>
      </div>
    `;
    const breakdownEl = document.getElementById('atsBreakdownPanel');
    if (breakdownEl) breakdownEl.innerHTML = bHtml;

    // 3. Render recommendations checklist cards
    const recsList = document.getElementById('recsListPanel');
    if (recsList) {
      if (analysis.recommendations.length === 0) {
        recsList.innerHTML = `<div class="rec-empty"><i class="ti ti-check-double"></i> All checklist items completed! Excellent work.</div>`;
      } else {
        recsList.innerHTML = analysis.recommendations.map((r, idx) => {
          const iconColor = r.urgency === 'high' ? '#ff4d4d' : '#f59e0b';
          const iconType = r.urgency === 'high' ? 'ti-alert-circle' : 'ti-alert-triangle';
          const borderStyle = idx < analysis.recommendations.length - 1 ? 'border-bottom: 1px solid var(--border);' : '';
          return `
            <div class="rec-row" style="display: flex; align-items: flex-start; gap: 10px; padding: 10px 0; ${borderStyle} font-size: 0.82rem; line-height: 1.45; color: var(--text);">
              <i class="ti ${iconType}" style="color: ${iconColor}; font-size: 15px; margin-top: 2.5px; flex-shrink: 0;"></i>
              <div style="flex: 1;">${r.message}</div>
            </div>
          `;
        }).join('');
      }
    }

    // 4. Render Job Description keywords indicators
    const kwPanel = document.getElementById('jdKeywordsPanel');
    const resumeText = window.ResumeIntel.AtsEngine.extractAllText(window.S);
    const resumeTokens = window.ResumeIntel.Utils.tokenizeAndNormalize(resumeText);
    const resumeTokenSet = new Set(resumeTokens);
    
    if (kwPanel && this._activeJdKeywords.length > 0) {
      const normalizedResumeText = resumeText.toLowerCase().replace(/[\s-]+/g, ' ');
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

      let matchedHtml = "";
      let missingHtml = "";

      this._activeJdKeywords.forEach(kw => {
        const kwLower = kw.toLowerCase();
        const syns = synonyms[kwLower] || [kwLower];
        let hasIt = false;

        for (let s of syns) {
          const normalizedSyn = s.toLowerCase().replace(/[\s-]+/g, ' ');
          if (normalizedSyn.includes(' ')) {
            if (normalizedResumeText.includes(normalizedSyn)) {
              hasIt = true;
              break;
            }
          } else {
            if (resumeTokenSet.has(s)) {
              hasIt = true;
              break;
            }
          }
        }

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

    // 5. Render ATS Parser Plain-Text Visualizer Preview
    const rawText = this.getChronologicalRawText(window.S);
    const rawTextOutputEl = document.getElementById('atsRawTextOutput');
    if (rawTextOutputEl) {
      rawTextOutputEl.textContent = rawText || "No content extracted. Please fill out your resume info.";
    }

    // Render parser warnings
    const warningsPanel = document.getElementById('parserWarningsPanel');
    if (warningsPanel) {
      let warningsHtml = "";
      
      const isMultiColumn = window.S.layout === 'sidebar-l' || window.S.layout === 'modern-split';
      if (isMultiColumn) {
        warningsHtml += `
          <div style="padding: 8px 10px; background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.18); border-radius: 6px; font-size: 0.72rem; color: #b45309; line-height: 1.45; display: flex; align-items: flex-start; gap: 6px;">
            <i class="ti ti-alert-triangle" style="font-size: 14px; margin-top: 1.5px; flex-shrink: 0;"></i>
            <div>
              <strong>Column Parsing Alert:</strong> Legacy ATS systems can parse multi-column tables horizontally. Confirm your sections read in the correct logical order below.
            </div>
          </div>
        `;
      } else {
        warningsHtml += `
          <div style="padding: 8px 10px; background: rgba(34, 197, 94, 0.08); border: 1px solid rgba(34, 197, 94, 0.18); border-radius: 6px; font-size: 0.72rem; color: #166534; line-height: 1.45; display: flex; align-items: flex-start; gap: 6px;">
            <i class="ti ti-circle-check" style="font-size: 14px; margin-top: 1.5px; flex-shrink: 0;"></i>
            <div>
              <strong>ATS-Safe Layout:</strong> Single-column chronological layout detected. This matches the standard sequential parsing format.
            </div>
          </div>
        `;
      }

      if (window.S.accent && window.S.accent.toLowerCase() === '#ffffff') {
        warningsHtml += `
          <div style="padding: 8px 10px; background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.18); border-radius: 6px; font-size: 0.72rem; color: #991b1b; line-height: 1.45; display: flex; align-items: flex-start; gap: 6px; margin-top: 4px;">
            <i class="ti ti-alert-circle" style="font-size: 14px; margin-top: 1.5px; flex-shrink: 0;"></i>
            <div>
              <strong>Contrast Risk:</strong> Pure white accent style conflicts with standard document canvas backgrounds, causing invisible text screening warnings.
            </div>
          </div>
        `;
      }

      if (window.S.fontSize < 80 || window.S.fontSize > 120) {
        warningsHtml += `
          <div style="padding: 8px 10px; background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.18); border-radius: 6px; font-size: 0.72rem; color: #b45309; line-height: 1.45; display: flex; align-items: flex-start; gap: 6px; margin-top: 4px;">
            <i class="ti ti-alert-triangle" style="font-size: 14px; margin-top: 1.5px; flex-shrink: 0;"></i>
            <div>
              <strong>Sizing Alert:</strong> Font size outside 80-120% can trigger vertical overlapping warnings during automated PDF text mapping.
            </div>
          </div>
        `;
      }
      
      if (window.S.lineH < 1.2 || window.S.lineH > 2.0) {
        warningsHtml += `
          <div style="padding: 8px 10px; background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.18); border-radius: 6px; font-size: 0.72rem; color: #b45309; line-height: 1.45; display: flex; align-items: flex-start; gap: 6px; margin-top: 4px;">
            <i class="ti ti-alert-triangle" style="font-size: 14px; margin-top: 1.5px; flex-shrink: 0;"></i>
            <div>
              <strong>Spacing Alert:</strong> Line spacing outside 1.2-2.0 violates structural document guidelines.
            </div>
          </div>
        `;
      }

      warningsPanel.innerHTML = warningsHtml;
    }

    // Render section detection badges
    const sectionsFlex = document.getElementById('detectedSectionsFlex');
    if (sectionsFlex) {
      const order = window.S.sectionOrder || ['summary', 'experience', 'education', 'certifications', 'skills', 'languages', 'awards', 'interests'];
      const vis = window.S.sectionVis || {};
      const labels = {
        summary: 'Summary', experience: 'Experience', education: 'Education',
        certifications: 'Certs', skills: 'Skills', languages: 'Languages',
        awards: 'Awards', interests: 'Interests'
      };

      sectionsFlex.innerHTML = order.map(sec => {
        const isVisible = vis[sec] !== false;
        let isPopulated = false;
        
        if (sec === 'summary' && window.S.f_summary) isPopulated = true;
        else if (sec === 'experience' && window.S.experience && window.S.experience.length > 0) isPopulated = true;
        else if (sec === 'education' && window.S.education && window.S.education.length > 0) isPopulated = true;
        else if (sec === 'certifications' && window.S.certs && window.S.certs.filter(c => c.name).length > 0) isPopulated = true;
        else if (sec === 'skills' && window.S.skills && window.S.skills.length > 0) isPopulated = true;
        else if (sec === 'languages' && window.S.langs && window.S.langs.filter(l => l.lang).length > 0) isPopulated = true;
        else if (sec === 'awards' && window.S.awards && window.S.awards.filter(a => a.title).length > 0) isPopulated = true;
        else if (sec === 'interests' && window.S.interests && (Array.isArray(window.S.interests) ? window.S.interests.length > 0 : window.S.interests.trim().length > 0)) isPopulated = true;

        if (isVisible && isPopulated) {
          return `
            <span style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 4px; font-size: 0.68rem; font-weight: 600; background: rgba(34, 197, 94, 0.08); color: #166534; border: 1px solid rgba(34, 197, 94, 0.18);">
              <i class="ti ti-circle-check" style="color: #22c55e;"></i> ${labels[sec]}
            </span>
          `;
        } else if (isVisible) {
          return `
            <span style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 4px; font-size: 0.68rem; font-weight: 600; background: rgba(245, 158, 11, 0.08); color: #b45309; border: 1px solid rgba(245, 158, 11, 0.18);">
              <i class="ti ti-alert-triangle" style="color: #f59e0b;"></i> ${labels[sec]} (Empty)
            </span>
          `;
        } else {
          return `
            <span style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 4px; font-size: 0.68rem; font-weight: 600; background: rgba(0, 0, 0, 0.04); color: var(--muted); border: 1px solid var(--border); opacity: 0.6;">
              <i class="ti ti-eye-off"></i> ${labels[sec]} (Hidden)
            </span>
          `;
        }
      }).join('');
    }
  },

  // Chronological raw text compiler
  getChronologicalRawText(state) {
    let lines = [];
    
    if (state.f_name) lines.push(state.f_name.toUpperCase());
    if (state.f_title) lines.push(state.f_title);
    
    let contact = [];
    if (state.f_email) contact.push(state.f_email);
    if (state.f_phone) contact.push(state.f_phone);
    if (state.f_city || state.f_country) {
      contact.push([state.f_city, state.f_country].filter(Boolean).join(', '));
    }
    if (state.f_linkedin) contact.push(state.f_linkedin);
    if (state.f_website) contact.push(state.f_website);
    if (state.f_github) contact.push(state.f_github);
    
    if (contact.length > 0) lines.push(contact.join('  |  '));
    lines.push('');

    const order = state.sectionOrder || ['summary', 'experience', 'education', 'certifications', 'skills', 'languages', 'awards', 'interests'];
    const vis = state.sectionVis || {};

    order.forEach(sec => {
      if (vis[sec] === false) return;

      if (sec === 'summary') {
        if (state.f_summary) {
          lines.push("PROFILE / SUMMARY");
          lines.push("═".repeat(17));
          lines.push(state.f_summary);
          lines.push('');
        }
      } else if (sec === 'experience') {
        if (state.experience && state.experience.length > 0) {
          lines.push("PROFESSIONAL EXPERIENCE");
          lines.push("═".repeat(23));
          state.experience.forEach(exp => {
            let eh = [];
            if (exp.role) eh.push(exp.role);
            if (exp.company) eh.push(exp.company);
            const dateStr = [exp.start, exp.end].filter(Boolean).join(' - ');
            if (dateStr) eh.push(dateStr);
            
            lines.push(eh.join('  •  '));
            if (exp.desc) {
              lines.push(exp.desc);
            }
            lines.push('');
          });
        }
      } else if (sec === 'education') {
        if (state.education && state.education.length > 0) {
          lines.push("EDUCATION");
          lines.push("═".repeat(9));
          state.education.forEach(edu => {
            let eh = [];
            if (edu.degree) eh.push(edu.degree);
            if (edu.school) eh.push(edu.school);
            const dateStr = [edu.start, edu.end].filter(Boolean).join(' - ');
            if (dateStr) eh.push(dateStr);
            
            lines.push(eh.join('  •  '));
            if (edu.desc) {
              lines.push(edu.desc);
            }
            lines.push('');
          });
        }
      } else if (sec === 'certifications') {
        const certs = (state.certs || []).filter(c => c.name);
        if (certs.length > 0) {
          lines.push("CERTIFICATIONS");
          lines.push("═".repeat(14));
          certs.forEach(c => {
            let ch = [c.name];
            if (c.issuer) ch.push(c.issuer);
            if (c.year) ch.push(c.year);
            lines.push(ch.join('  •  '));
          });
          lines.push('');
        }
      } else if (sec === 'skills') {
        if (state.skills && state.skills.length > 0) {
          lines.push("SKILLS");
          lines.push("═".repeat(6));
          lines.push(state.skills.join(', '));
          lines.push('');
        }
      } else if (sec === 'languages') {
        const langs = (state.langs || []).filter(l => l.lang);
        if (langs.length > 0) {
          lines.push("LANGUAGES");
          lines.push("═".repeat(9));
          lines.push(langs.map(l => `${l.lang} (${l.level || 'Professional'})`).join(', '));
          lines.push('');
        }
      } else if (sec === 'awards') {
        const awards = (state.awards || []).filter(a => a.title);
        if (awards.length > 0) {
          lines.push("AWARDS & HONORS");
          lines.push("═".repeat(15));
          awards.forEach(a => {
            let ah = [a.title];
            if (a.org) ah.push(a.org);
            if (a.year) ah.push(a.year);
            lines.push(ah.join('  •  '));
          });
          lines.push('');
        }
      } else if (sec === 'interests') {
        const hasInterests = state.interests && (Array.isArray(state.interests) ? state.interests.length > 0 : state.interests.trim().length > 0);
        if (hasInterests) {
          lines.push("INTERESTS");
          lines.push("═".repeat(9));
          if (Array.isArray(state.interests)) {
            lines.push(state.interests.join(', '));
          } else {
            lines.push(state.interests);
          }
          lines.push('');
        }
      }
    });

    return lines.join('\n').trim();
  }
};

// Global toggle functions
window.toggleParserPreview = function() {
  const container = document.getElementById('parserPreviewContainer');
  const btn = document.getElementById('toggleParserPreviewBtn');
  if (container && btn) {
    const isHidden = container.style.display === 'none' || container.style.display === '';
    container.style.display = isHidden ? 'block' : 'none';
    btn.textContent = isHidden ? 'Hide Preview' : 'Show Preview';
  }
};
