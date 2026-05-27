// ══════════════════════════════════════════════════════════
// TEMPLATE ENGINE SYSTEMS
// ══════════════════════════════════════════════════════════

/**
 * Creates a brand new resume instance from the selected template registry ID
 * and pre-fills it with the template's realistic starter data.
 * @param {string} templateId 
 */
function createResumeFromTemplate(templateId) {
  const template = TEMPLATE_REGISTRY[templateId];
  if (!template) return;

  const newResumeId = 'res-' + Date.now();
  const starterData = deepClone(template.starterData);
  
  // Set template tracking metadata
  starterData.templateId = template.id;
  starterData.templateVersion = template.version;

  const newResume = {
    id: newResumeId,
    name: template.label + ' Resume',
    data: starterData
  };

  // Add to global resumes list
  if (!window.resumes) window.resumes = [];
  window.resumes.push(newResume);
  window.activeResumeId = newResumeId;

  // Persist back to local storage
  localStorage.setItem('resumes', JSON.stringify(window.resumes));
  localStorage.setItem('activeResumeId', window.activeResumeId);

  // Load the newly created template state
  if (typeof loadState === 'function') loadState(newResume.data);
  if (typeof loadResumeIntoDOM === 'function') loadResumeIntoDOM();
  if (typeof renderImmediate === 'function') renderImmediate();
  if (typeof renderResumesList === 'function') renderResumesList();

  // Highlight active layout choices in Sidebar
  syncTemplateUI();
}

/**
 * Applies only style overrides from a template preset to the currently active
 * resume state 'S', preserving all user written content.
 * @param {string} templateId 
 */
function applyTemplateStyles(templateId) {
  const template = TEMPLATE_REGISTRY[templateId];
  if (!template) return;

  const preset = template.stylePreset;
  
  // Update state style properties
  S.templateId = template.id;
  S.templateVersion = template.version;
  S.accent = preset.accent;
  S.layout = preset.layout;
  S.font = preset.font;
  S.fontSize = preset.fontSize;
  S.lineH = preset.lineH;
  S.secGap = preset.secGap;

  // Re-save active resume to persist style changes
  if (typeof saveActiveResume === 'function') saveActiveResume();
  
  // Sync UI controls, class tags, and re-render preview
  syncTemplateUI();
  syncTemplateClass();
  if (typeof renderImmediate === 'function') renderImmediate();
}

/**
 * Synchronizes sidebar controls (sliders, swatches, and grid lists)
 * with the current state 'S' variables.
 */
function syncTemplateUI() {
  // Sync font size slider
  const fontSizeR = document.getElementById('fontSizeR');
  const fontSizeV = document.getElementById('fontSizeV');
  if (fontSizeR) fontSizeR.value = S.fontSize;
  if (fontSizeV) fontSizeV.textContent = S.fontSize + '%';

  // Sync line height slider (stored as scale, slider is 130-200)
  const lineHR = document.getElementById('lineHR');
  const lineHV = document.getElementById('lineHV');
  if (lineHR) lineHR.value = Math.round(S.lineH * 100);
  if (lineHV) lineHV.textContent = S.lineH.toFixed(2);

  // Sync section gap slider
  const secGapR = document.getElementById('secGapR');
  const secGapV = document.getElementById('secGapV');
  if (secGapR) secGapR.value = S.secGap;
  if (secGapV) secGapV.textContent = S.secGap + 'px';

  // Sync color swatches selection
  document.querySelectorAll('.c-swatch').forEach(swatch => {
    const color = swatch.getAttribute('title');
    if (color && color.toLowerCase() === S.accent.toLowerCase()) {
      swatch.classList.add('active');
    } else {
      swatch.classList.remove('active');
    }
  });
  const customColorPreview = document.getElementById('customColorPreview');
  if (customColorPreview) customColorPreview.style.background = S.accent;

  // Sync layouts grid selection
  document.querySelectorAll('.layout-opt').forEach(opt => {
    // Check if layout matches
    const clickAttr = opt.getAttribute('onclick');
    if (clickAttr && clickAttr.includes(`setLayout('${S.layout}'`)) {
      opt.classList.add('active');
    } else {
      opt.classList.remove('active');
    }
  });

  // Sync font family grid selection
  document.querySelectorAll('.font-opt').forEach(opt => {
    const clickAttr = opt.getAttribute('onclick');
    if (clickAttr && clickAttr.includes(`setFont('${S.font}'`)) {
      opt.classList.add('active');
    } else {
      opt.classList.remove('active');
    }
  });

  // Rerender presets list to highlight active template preset
  buildTemplatePresets();
}

/**
 * Syncs root classes on the #cvDoc container inside the builder.
 */
function syncTemplateClass() {
  const doc = document.getElementById('cvDoc');
  if (doc) {
    // Filter out existing template class classes
    doc.className = doc.className.split(' ')
      .filter(c => !c.startsWith('template-'))
      .join(' ');
    
    if (S.templateId) {
      doc.classList.add('template-' + S.templateId);
    }
  }
}

/**
 * Builds and populates the template presets selector list in the Design tab
 */
function buildTemplatePresets() {
  const container = document.getElementById('templatePresetsGrid');
  if (!container) return;

  container.innerHTML = Object.values(TEMPLATE_REGISTRY).map(t => {
    const isActive = S.templateId === t.id;
    return `
      <div class="template-preset-opt ${isActive ? 'active' : ''}" onclick="swapTemplate('${t.id}')">
        <div class="preset-name">${t.label}</div>
        <div class="preset-desc">${t.targetAudience}</div>
      </div>
    `;
  }).join('');
}

// Expose systems to window scope
window.createResumeFromTemplate = createResumeFromTemplate;
window.applyTemplateStyles = applyTemplateStyles;
window.syncTemplateUI = syncTemplateUI;
window.syncTemplateClass = syncTemplateClass;
window.buildTemplatePresets = buildTemplatePresets;
