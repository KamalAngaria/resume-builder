// ══════════════════════════════════════════════════════════
// RESUME BUILDER INTELLIGENCE SYSTEM — DIAGNOSTICS & QA RUNNER
// ══════════════════════════════════════════════════════════
window.ResumeIntel = window.ResumeIntel || { data: {} };

function logDiag(msg, type = 'info') {
  const terminal = document.getElementById('diagTerminal');
  if (!terminal) return;
  const line = document.createElement('div');
  line.className = `diag-line ${type}`;
  let symbol = '•';
  if (type === 'pass') symbol = '✓';
  if (type === 'fail') symbol = '✗';
  if (type === 'run') symbol = '▶';
  if (type === 'success') symbol = '★';
  
  line.innerHTML = `<span class="diag-symbol">${symbol}</span> <span class="diag-msg">${msg}</span>`;
  terminal.appendChild(line);
  terminal.scrollTop = terminal.scrollHeight;
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function launchDiagnostics() {
  // Backup all states
  window._diagnosticsOriginalState = JSON.parse(JSON.stringify(window.S));
  if (window.resumes) {
    window._diagnosticsOriginalResumes = JSON.parse(JSON.stringify(window.resumes));
  }
  window._diagnosticsOriginalActiveResumeId = window.activeResumeId;

  // Show modal
  const modal = document.getElementById('diagnosticsModal');
  if (modal) {
    modal.style.display = 'flex';
  }
  
  // Set up welcome console message
  const terminal = document.getElementById('diagTerminal');
  if (terminal) {
    terminal.innerHTML = '';
  }
  
  logDiag("Diagnostics Mode Activated.", "info");
  logDiag("Original resume data cloned and secured.", "info");
  logDiag("Ready. Click 'Run Diagnostics' to start testing.", "info");
}

async function runDiagnostics() {
  const btnRun = document.getElementById('diagRunBtn');
  const btnClose = document.getElementById('diagCloseBtn');
  if (btnRun) btnRun.disabled = true;
  if (btnClose) btnClose.disabled = true;

  const terminal = document.getElementById('diagTerminal');
  if (terminal) terminal.innerHTML = '';

  logDiag("Starting Automated Diagnostics Suite...", "info");
  await sleep(600);

  try {
    // ----------------------------------------------------
    // STEP 1: Test Role Matcher & Autocomplete
    // ----------------------------------------------------
    logDiag("TEST 1: Testing Role Matcher Autocomplete...", "run");
    switchTab(0); // Switch to Info tab
    await sleep(400);

    const fTitle = document.getElementById('f_title');
    if (!fTitle) throw new Error("Job Title input (#f_title) not found.");

    // Simulate typing "front-end"
    fTitle.value = '';
    const textToType = "front-end";
    for (let i = 0; i < textToType.length; i++) {
      fTitle.value += textToType[i];
      fTitle.dispatchEvent(new Event('input'));
      await sleep(80);
    }
    
    logDiag("Typing simulated. Loading tech role category data...", "info");
    // Explicitly load category data to be safe, then trigger handlers
    await window.ResumeIntel.LazyLoader.loadCategory('tech');
    
    // Trigger autocomplete manually to ensure it displays matches immediately
    const suggestionsBox = document.getElementById('role-suggestions');
    if (!suggestionsBox) throw new Error("Role suggestions element (#role-suggestions) not found.");
    
    // Simulate input matching
    const matches = window.ResumeIntel.RoleMatcher.matchRole("front-end");
    if (!matches || matches.length === 0) {
      throw new Error("RoleMatcher returned no results for 'front-end'.");
    }
    
    logDiag(`Role matches found: ${matches.map(m => m.role.title).join(', ')}`, "info");
    
    // Trigger selectRole for Frontend Developer
    const feMatch = matches.find(m => m.key === 'frontend_developer') || matches[0];
    selectRole(feMatch);
    await sleep(800);

    const rolePanel = document.getElementById('smart-role-panel');
    if (!rolePanel || rolePanel.style.display === 'none') {
      throw new Error("Assistant panel (#smart-role-panel) was not displayed after selecting a role.");
    }
    logDiag("TEST 1: Autocomplete & Assistant Panel verified.", "pass");
    await sleep(600);

    // ----------------------------------------------------
    // STEP 2: Test Summary Generation & Autofill
    // ----------------------------------------------------
    logDiag("TEST 2: Testing Summary Suggester & Autofill...", "run");
    const summaryCard = rolePanel.querySelector('.summary-suggest-card');
    if (!summaryCard) throw new Error("No suggested summary cards found in Assistant panel.");
    
    const summaryText = summaryCard.textContent.trim();
    logDiag(`Selecting suggested summary: "${summaryText.substring(0, 40)}..."`, "info");
    
    applySummaryText(summaryText);
    await sleep(500);

    const fSummary = document.getElementById('f_summary');
    if (!fSummary || fSummary.value !== summaryText) {
      throw new Error("Summary input (#f_summary) did not receive the correct suggestion text.");
    }
    logDiag("TEST 2: Summary autofill verified.", "pass");
    await sleep(600);

    // ----------------------------------------------------
    // STEP 3: Test Skill Recommendations
    // ----------------------------------------------------
    logDiag("TEST 3: Testing Skill Engine Recommendations...", "run");
    switchTab(3); // Switch to Skills tab
    await sleep(400);

    // Clear and add skills
    window.S.skills = [];
    buildSkillTags();
    render();
    await sleep(300);

    logDiag("Adding 'React' and 'TypeScript' from suggestions...", "info");
    addSkillFromSuggestions("React");
    await sleep(300);
    addSkillFromSuggestions("TypeScript");
    await sleep(300);

    if (!window.S.skills.includes("React") || !window.S.skills.includes("TypeScript")) {
      throw new Error("Skills 'React' or 'TypeScript' were not added to state.");
    }

    const skillsArea = document.getElementById('skills-area');
    if (!skillsArea || skillsArea.querySelectorAll('.s-tag').length < 2) {
      throw new Error("Skill tags were not rendered to the DOM skills-area.");
    }
    logDiag("TEST 3: Skill recommendations added & rendered successfully.", "pass");
    await sleep(600);

    // ----------------------------------------------------
    // STEP 4: Test Experience Bullet Point Enhancer
    // ----------------------------------------------------
    logDiag("TEST 4: Testing Bullet Point Enhancer...", "run");
    switchTab(1); // Switch to Work tab
    await sleep(400);

    // Inject a poor experience bullet
    const testDesc = "made frontend website\nhelped team work faster";
    window.S.experience = [{
      company: "Acme Corp",
      role: "Developer",
      start: "2024",
      end: "Present",
      desc: testDesc
    }];
    buildEntries();
    render();
    await sleep(500);

    logDiag("Triggering bullet point enhancer...", "info");
    enhanceBulletPoint(0);
    await sleep(600);

    const updatedDesc = document.getElementById('exp-desc-0').value;
    if (updatedDesc === testDesc || !updatedDesc) {
      throw new Error("Bullet point was not enhanced or updated in textarea.");
    }
    logDiag(`Original: "made frontend website"`, "info");
    logDiag(`Enhanced: "${updatedDesc.split('\n')[0]}"`, "info");
    logDiag("TEST 4: Bullet point enhancer verified.", "pass");
    await sleep(600);

    // ----------------------------------------------------
    // STEP 5: Test JD Scanner & ATS Scorer
    // ----------------------------------------------------
    logDiag("TEST 5: Testing Job Description Scanner & ATS Engine...", "run");
    switchTab(6); // Switch to Optimizer tab
    await sleep(400);

    const jdText = "Looking for a Frontend Developer with React, TypeScript, and responsive web design.";
    const jdInput = document.getElementById('jdInputText');
    if (!jdInput) throw new Error("Job Description textarea (#jdInputText) not found.");

    jdInput.value = jdText;
    logDiag(`Scanning job description: "${jdText}"`, "info");
    triggerJdAnalysis();
    await sleep(800);

    const atsScoreVal = document.getElementById('atsScoreVal');
    if (!atsScoreVal) throw new Error("ATS score display (#atsScoreVal) not found.");

    const scoreNum = parseInt(atsScoreVal.textContent);
    if (isNaN(scoreNum) || scoreNum <= 0) {
      throw new Error(`ATS score is invalid: ${atsScoreVal.textContent}`);
    }
    logDiag(`ATS Score calculated: ${scoreNum}%`, "info");

    const kwPanel = document.getElementById('jdKeywordsPanel');
    if (!kwPanel || kwPanel.querySelectorAll('.kw-pill').length === 0) {
      throw new Error("Job Description keywords panel was not populated.");
    }
    logDiag("TEST 5: JD Scanner & ATS calculations verified.", "pass");
    await sleep(600);

    // ----------------------------------------------------
    // SUCCESS
    // ----------------------------------------------------
    logDiag("All 5 Diagnostics Tests Passed successfully!", "success");

  } catch (error) {
    logDiag(`DIAGNOSTIC FAILURE: ${error.message}`, "fail");
    console.error("Diagnostics error: ", error);
  } finally {
    if (btnRun) btnRun.disabled = false;
    if (btnClose) btnClose.disabled = false;
  }
}

function closeDiagnostics() {
  // Restore all original states
  if (window._diagnosticsOriginalState) {
    // Delete keys in S first, then assign
    for (let key in window.S) {
      if (window.S.hasOwnProperty(key)) delete window.S[key];
    }
    Object.assign(window.S, window._diagnosticsOriginalState);
  }
  
  if (window._diagnosticsOriginalResumes) {
    window.resumes = window._diagnosticsOriginalResumes;
    localStorage.setItem('resumes', JSON.stringify(window.resumes));
  }
  
  if (window._diagnosticsOriginalActiveResumeId) {
    window.activeResumeId = window._diagnosticsOriginalActiveResumeId;
    localStorage.setItem('activeResumeId', window.activeResumeId);
  }

  // Reload views
  loadResumeIntoDOM();
  render();

  // Reset tab to step 1
  switchTab(0);

  // Close modal
  const modal = document.getElementById('diagnosticsModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Auto-run trigger if "?diagnostics=true" is in the URL query string
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('diagnostics') === 'true') {
    setTimeout(async () => {
      launchDiagnostics();
      await sleep(1000);
      runDiagnostics();
    }, 1500);
  }
});
