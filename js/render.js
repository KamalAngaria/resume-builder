// ══════════════════════════════════════════════════════════
// SECTION RENDERERS
// ══════════════════════════════════════════════════════════
function renderSection(sec, opts = {}) {
  const chipStyle = opts.chipStyle || 'filled';
  const vis = S.sectionVis[sec]; if (!vis) return '';

  if (sec === 'summary') {
    const sum = esc(gv('f_summary')); if (!sum) return '';
    return `<div class="cv-section-wrap">
      <div class="cvs-title"><i class="ti ti-align-left"></i>Profile</div>
      <p class="cv-sum">${sum}</p>
    </div>`;
  }
  if (sec === 'experience') {
    if (!S.experience.length) return '';
    return `<div class="cv-section-wrap">
      <div class="cvs-title"><i class="ti ti-briefcase"></i>Experience</div>
      ${S.experience.map(e => `<div class="cv-entry">
        <div class="cv-eh"><div class="cv-et">${esc(e.role || 'Role')}</div><div class="cv-ed">${[esc(e.start), esc(e.end)].filter(Boolean).join(' – ')}</div></div>
        <div class="cv-es">${esc(e.company || '')}</div>
        ${e.desc ? `<div class="cv-edesc">${fmtDesc(e.desc)}</div>` : ''}
      </div>`).join('')}
    </div>`;
  }
  if (sec === 'education') {
    if (!S.education.length) return '';
    return `<div class="cv-section-wrap">
      <div class="cvs-title"><i class="ti ti-school"></i>Education</div>
      ${S.education.map(e => `<div class="cv-entry">
        <div class="cv-eh"><div class="cv-et">${esc(e.degree || 'Degree')}</div><div class="cv-ed">${[esc(e.start), esc(e.end)].filter(Boolean).join(' – ')}</div></div>
        <div class="cv-es">${esc(e.school || '')}</div>
        ${e.desc ? `<div class="cv-edesc">${fmtDesc(e.desc)}</div>` : ''}
      </div>`).join('')}
    </div>`;
  }
  if (sec === 'certifications') {
    const certs = S.certs.filter(c => c.name); if (!certs.length) return '';
    return `<div class="cv-section-wrap">
      <div class="cvs-title"><i class="ti ti-certificate"></i>Certifications</div>
      ${certs.map(c => `<div class="cv-entry">
        <div class="cv-eh"><div class="cv-et">${esc(c.name)}</div><div class="cv-ed">${esc(c.year || '')}</div></div>
        <div class="cv-es">${esc(c.issuer || '')}</div>
      </div>`).join('')}
    </div>`;
  }
  if (sec === 'skills') {
    if (!S.skills.length) return '';
    const chips = S.skills.map(s => {
      const safeS = esc(s);
      return `<span class="cv-sk-chip ${chipStyle}">${safeS}</span>`;
    }).join('');
    return `<div class="cv-section-wrap">
      <div class="cvs-title"><i class="ti ti-tools"></i>Skills</div>
      <div class="cv-sk">${chips}</div>
    </div>`;
  }
  if (sec === 'languages') {
    const langs = S.langs.filter(l => l.lang); if (!langs.length) return '';
    return `<div class="cv-section-wrap">
      <div class="cvs-title"><i class="ti ti-language"></i>Languages</div>
      <div class="cv-sk">${langs.map(l => `<span class="cv-sk-chip outline">${esc(l.lang)}<span class="cv-lang-level"> · ${esc(l.level)}</span></span>`).join('')}</div>
    </div>`;
  }
  if (sec === 'awards') {
    if (!S.awards.filter(a => a.title).length) return '';
    return `<div class="cv-section-wrap">
      <div class="cvs-title"><i class="ti ti-trophy"></i>Awards</div>
      ${S.awards.filter(a => a.title).map(a => `<div class="cv-entry">
        <div class="cv-eh"><div class="cv-et">${esc(a.title)}</div><div class="cv-ed">${esc(a.year || '')}</div></div>
        <div class="cv-es">${esc(a.org || '')}</div>
      </div>`).join('')}
    </div>`;
  }
  if (sec === 'interests') {
    const ints = esc(gv('f_interests')); if (!ints) return '';
    return `<div class="cv-section-wrap">
      <div class="cvs-title"><i class="ti ti-heart"></i>Interests</div>
      <div class="cv-interests-text">${ints}</div>
    </div>`;
  }
  return '';
}

// sidebar section (for sidebar-l layout)
function renderSidebarSection(sec) {
  const vis = S.sectionVis[sec]; if (!vis) return '';
  const stitle = `<div class="layout-sidebar-section-title">${SEC_LABELS[sec] || sec}</div>`;

  if (sec === 'skills') {
    if (!S.skills.length) return '';
    return stitle + `<div class="layout-sidebar-skills-grid">${S.skills.map(s => `<span class="layout-sidebar-skill-badge">${esc(s)}</span>`).join('')}</div>`;
  }
  if (sec === 'languages') {
    const langs = S.langs.filter(l => l.lang); if (!langs.length) return '';
    return stitle + langs.map(l => `
      <div class="layout-sidebar-lang-item">
        <div class="layout-sidebar-lang-header"><span>${esc(l.lang)}</span><span class="layout-sidebar-lang-level">${esc(l.level)}</span></div>
        <div class="layout-sidebar-lang-track"><div class="layout-sidebar-lang-fill" style="width:${{ Native: 100, Fluent: 85, Advanced: 70, Conversational: 55, Intermediate: 45, Beginner: 30 }[l.level] || 50}%"></div></div>
      </div>`).join('');
  }
  if (sec === 'certifications') {
    const certs = S.certs.filter(c => c.name); if (!certs.length) return '';
    return stitle + certs.map(c => `<div class="layout-sidebar-cert-item"><div class="layout-sidebar-cert-name">${esc(c.name)}</div><div class="layout-sidebar-cert-issuer">${esc(c.issuer)}${c.year ? ' · ' + esc(c.year) : ''}</div></div>`).join('');
  }
  if (sec === 'interests') {
    const ints = esc(gv('f_interests')); if (!ints) return '';
    return stitle + `<div class="layout-sidebar-interests">${ints}</div>`;
  }
  return '';
}

// ══════════════════════════════════════════════════════════
// LAYOUT RENDERERS
// ══════════════════════════════════════════════════════════
let lastRenderedHTML = '';

function renderImmediate() {
  const doc = document.getElementById('cvDoc');
  if (!doc) return;

  const a = S.accent;
  const f = `'${S.font}',sans-serif`;
  const gap = `${S.secGap}px`;

  // Sync personal info inputs to state S
  S.f_name = gv('f_name');
  S.f_title = gv('f_title');
  S.f_summary = gv('f_summary');
  S.f_email = gv('f_email');
  S.f_phone = gv('f_phone');
  S.f_city = gv('f_city');
  S.f_country = gv('f_country');
  S.f_linkedin = gv('f_linkedin');
  S.f_website = gv('f_website');
  S.f_github = gv('f_github');

  // Debounced save to active resume in localStorage (saving performance)
  debouncedSaveActiveResume();

  // Set layout and template class names on doc
  doc.className = doc.className.split(' ')
    .filter(c => !c.startsWith('layout-') && !c.startsWith('template-'))
    .join(' ');
  doc.classList.add('layout-' + S.layout);
  if (S.templateId) {
    doc.classList.add('template-' + S.templateId);
  }

  // Set CSS variables for typography, gap, colors, photo sizing
  doc.style.fontSize = `${S.fontSize}%`;
  doc.style.fontFamily = f;
  doc.style.setProperty('--cv-a', a);
  doc.style.setProperty('--cv-f', f);
  doc.style.setProperty('--cv-lh', S.lineH);
  doc.style.setProperty('--cv-gap', gap);
  doc.style.setProperty('--cv-photo-size', `${S.photoSize}px`);
  doc.style.setProperty('--cv-photo-br', `${S.photoBR}%`);

  const name = esc(gv('f_name') || 'Your Name');
  const title = esc(gv('f_title'));
  
  // Safe photo URL validation
  const isSafePhoto = S.photo && (typeof S.photo === 'string') && (S.photo.startsWith('data:image/') || S.photo.match(/^https?:\/\//i));
  const photoHTML = isSafePhoto ? `<img src="${esc(S.photo)}" class="cv-photo" onclick="openPhotoPreview(event)" alt="Profile Photo">` : '';

  const sideSecs = ['skills', 'languages', 'certifications', 'interests'];

  let html = '';

  if (S.layout === 'classic') {
    const contactLine = renderContacts('classic');
    html = `
    <div class="layout-classic-header">
      <div class="layout-classic-header-content">
        ${photoHTML ? `<div class="cv-photo-container">${photoHTML}</div>` : ''}
        <div class="layout-classic-meta">
          <div class="cv-name">${name}</div>
          ${title ? `<div class="cv-title">${title}</div>` : ''}
          <div class="cv-contacts-line">${contactLine}</div>
        </div>
      </div>
    </div>
    <div class="layout-classic-body">
      ${S.sectionOrder.map(s => renderSection(s, { accent: a })).join('')}
    </div>`;
  }
  else if (S.layout === 'sidebar-l') {
    const headerHTML = `
      <div class="layout-sidebar-header">
        ${photoHTML ? `<div class="layout-sidebar-photo">${photoHTML}</div>` : ''}
        <div class="layout-sidebar-name">${name}</div>
        ${title ? `<div class="layout-sidebar-title">${title}</div>` : ''}
        <div class="layout-sidebar-section-label">Contact</div>
        <div class="layout-sidebar-contacts">
          ${renderContacts('sidebar')}
        </div>
      </div>`;
    const mainHTML = `
      <div class="layout-sidebar-main">
        ${S.sectionOrder.filter(s => !sideSecs.includes(s)).map(s => renderSection(s, { accent: a })).join('')}
      </div>`;
    const sideHTML = `
      <div class="layout-sidebar-sidebar">
        ${sideSecs.map(s => renderSidebarSection(s)).join('')}
      </div>`;
    html = `<div class="layout-sidebar-container">${headerHTML + mainHTML + sideHTML}</div>`;
  }
  else if (S.layout === 'minimal') {
    const contacts = renderContacts('minimal');
    html = `
    <div class="layout-minimal-header">
      <div class="layout-minimal-header-content">
        ${photoHTML ? `<div class="cv-photo-container">${photoHTML}</div>` : ''}
        <div class="layout-minimal-meta">
          <div class="cv-name">${name}</div>
          ${title ? `<div class="cv-title">${title}</div>` : ''}
          <div class="cv-contacts-line">${contacts}</div>
        </div>
      </div>
    </div>
    <div class="layout-minimal-body">
      ${S.sectionOrder.map(s => renderSection(s, { accent: a })).join('')}
    </div>`;
  }
  else if (S.layout === 'modern-split') {
    const contacts = renderContacts('modern-split');
    html = `
    <div class="layout-modern-container">
      <div class="layout-modern-left-bar"></div>
      <div class="layout-modern-content">
        <div class="layout-modern-header">
          <div class="layout-modern-header-content">
            ${photoHTML ? `<div class="cv-photo-container">${photoHTML}</div>` : ''}
            <div class="layout-modern-meta">
              <div class="cv-name">${name}</div>
              ${title ? `<div class="cv-title">${title}</div>` : ''}
              <div class="cv-contacts-line">${contacts}</div>
            </div>
          </div>
        </div>
        <div class="layout-modern-body">
          ${S.sectionOrder.map(s => renderSection(s, { accent: a, chipStyle: 'pill' })).join('')}
        </div>
      </div>
      <div class="layout-modern-right-bar"></div>
    </div>`;
  }
  else if (S.layout === 'elegant') {
    const contacts = renderContacts('elegant');
    html = `
    <div class="layout-elegant-top-bar"></div>
    <div class="layout-elegant-header">
      ${photoHTML ? `<div class="layout-elegant-photo">${photoHTML}</div>` : ''}
      <div class="cv-name">${name}</div>
      ${title ? `<div class="cv-title">${title}</div>` : ''}
      <div class="cv-contacts-line">${contacts}</div>
    </div>
    <div class="layout-elegant-body">
      ${S.sectionOrder.map(s => renderSection(s, { accent: a })).join('')}
    </div>
    <div class="layout-elegant-bottom-bar"></div>`;
  }

  // Prevent redundant DOM updates (but always render if DOM is empty to recover from any external wipe)
  if (html && (html !== lastRenderedHTML || !doc.innerHTML || doc.innerHTML.trim() === '')) {
    doc.innerHTML = html;
    lastRenderedHTML = html;
  }

  // Trigger Smart Resume Intelligence System analysis (debounced)
  if (window.ResumeIntel && window.ResumeIntel.Core) {
    if (!window.ResumeIntel.Core.debouncedAnalyze) {
      window.ResumeIntel.Core.debouncedAnalyze = window.ResumeIntel.Utils.debounce(() => {
        window.ResumeIntel.Core.analyzeResume();
      }, 400);
    }
    window.ResumeIntel.Core.debouncedAnalyze();
  }
}

function getSectionWrapByIcon(iconClass) {
  const icon = document.querySelector(`.cv-section-wrap i.${iconClass}`);
  return icon ? icon.closest('.cv-section-wrap') : null;
}

function patchPreview(elementId, value) {
  // 1. Personal details
  if (elementId === 'f_name') {
    document.querySelectorAll('.cv-name').forEach(el => {
      el.textContent = value || 'Your Name';
    });
  } else if (elementId === 'f_title') {
    document.querySelectorAll('.cv-title').forEach(el => {
      el.textContent = value;
      el.style.display = value ? '' : 'none';
    });
  } else if (elementId === 'f_summary') {
    document.querySelectorAll('.cv-sum').forEach(el => {
      el.textContent = value;
      const wrap = el.closest('.cv-section-wrap');
      if (wrap) wrap.style.display = value ? '' : 'none';
    });
  }
  // 2. Contacts
  else if (['f_email', 'f_phone', 'f_city', 'f_country', 'f_linkedin', 'f_website', 'f_github'].includes(elementId)) {
    const layouts = ['classic', 'minimal', 'elegant', 'modern-split'];
    layouts.forEach(l => {
      document.querySelectorAll(`.layout-${l} .cv-contacts-line`).forEach(el => {
        el.innerHTML = renderContacts(l);
      });
    });
    // Sidebar layouts contacts
    document.querySelectorAll('.layout-sidebar-contacts').forEach(el => {
      el.innerHTML = renderContacts('sidebar');
    });
  }
  // 3. Interests
  else if (elementId === 'f_interests') {
    if (S.layout === 'sidebar-l') {
      const el = document.querySelector('.layout-sidebar-sidebar .layout-sidebar-interests');
      if (el) el.textContent = value;
    } else {
      const sec = getSectionWrapByIcon('ti-heart');
      const el = sec ? sec.querySelector('.cv-interests-text') : null;
      if (el) el.textContent = value;
    }
  }
}

function patchEntryPreview(type, field, index, value) {
  let sec = null;
  const isSidebarCert = (type === 'cert' && S.layout === 'sidebar-l');

  if (type === 'lang') {
    if (S.layout === 'sidebar-l') {
      sec = document.querySelector('.layout-sidebar-sidebar');
    } else {
      sec = getSectionWrapByIcon('ti-language');
    }
  } else if (isSidebarCert) {
    sec = document.querySelector('.layout-sidebar-sidebar');
  } else {
    let iconClass = '';
    if (type === 'exp') iconClass = 'ti-briefcase';
    else if (type === 'edu') iconClass = 'ti-school';
    else if (type === 'cert') iconClass = 'ti-certificate';
    else if (type === 'award') iconClass = 'ti-trophy';
    sec = getSectionWrapByIcon(iconClass);
  }

  if (!sec) return;

  if (type === 'lang') {
    if (S.layout === 'sidebar-l') {
      const items = sec.querySelectorAll('.layout-sidebar-lang-item');
      const item = items[index];
      if (item) {
        const langState = S.langs[index];
        if (langState) {
          const nameSpan = item.querySelector('.layout-sidebar-lang-header span:first-child');
          const levelSpan = item.querySelector('.layout-sidebar-lang-level');
          const fill = item.querySelector('.layout-sidebar-lang-fill');
          if (nameSpan) nameSpan.textContent = langState.lang;
          if (levelSpan) levelSpan.textContent = langState.level;
          if (fill) {
            const pct = { Native: 100, Fluent: 85, Advanced: 70, Conversational: 55, Intermediate: 45, Beginner: 30 }[langState.level] || 50;
            fill.style.width = `${pct}%`;
          }
        }
      }
    } else {
      const chips = sec.querySelectorAll('.cv-sk-chip');
      const chip = chips[index];
      if (chip) {
        const langState = S.langs[index];
        if (langState) {
          chip.innerHTML = esc(langState.lang) + `<span class="cv-lang-level"> · ${esc(langState.level)}</span>`;
        }
      }
    }
    return;
  }

  if (isSidebarCert) {
    const items = sec.querySelectorAll('.layout-sidebar-cert-item');
    const item = items[index];
    if (item) {
      const certState = S.certs[index];
      if (certState) {
        const nameEl = item.querySelector('.layout-sidebar-cert-name');
        const issuerEl = item.querySelector('.layout-sidebar-cert-issuer');
        if (nameEl) nameEl.textContent = certState.name;
        if (issuerEl) {
          issuerEl.textContent = [certState.issuer, certState.year].filter(Boolean).join(' · ');
        }
      }
    }
    return;
  }

  const entries = sec.querySelectorAll('.cv-entry');
  const entry = entries[index];
  if (!entry) return;

  if (field === 'role' || field === 'degree' || field === 'name' || field === 'title') {
    const el = entry.querySelector('.cv-et');
    if (el) el.textContent = value || (field === 'role' ? 'Role' : field === 'degree' ? 'Degree' : '');
  } else if (field === 'company' || field === 'school' || field === 'issuer' || field === 'org') {
    const el = entry.querySelector('.cv-es');
    if (el) el.textContent = value;
  } else if (field === 'start' || field === 'end' || field === 'year') {
    const el = entry.querySelector('.cv-ed');
    if (el) {
      if (field === 'year') {
        el.textContent = value;
      } else {
        const item = type === 'exp' ? S.experience[index] : S.education[index];
        if (item) {
          el.textContent = [item.start, item.end].filter(Boolean).join(' – ');
        }
      }
    }
  } else if (field === 'desc') {
    let el = entry.querySelector('.cv-edesc');
    if (!el && value) {
      el = document.createElement('div');
      el.className = 'cv-edesc';
      entry.appendChild(el);
    }
    if (el) {
      el.innerHTML = fmtDesc(value);
      if (!value) el.remove();
    }
  }
}

function triggerIntelAnalysis() {
  if (window.ResumeIntel && window.ResumeIntel.Core) {
    if (!window.ResumeIntel.Core.debouncedAnalyze) {
      window.ResumeIntel.Core.debouncedAnalyze = window.ResumeIntel.Utils.debounce(() => {
        window.ResumeIntel.Core.analyzeResume();
      }, 400);
    }
    window.ResumeIntel.Core.debouncedAnalyze();
  }
}

const debouncedRenderImmediate = debounce(renderImmediate, 150);

function render() {
  const activeEl = document.activeElement;
  if (activeEl && activeEl.matches('input, textarea')) {
    // 1. Personal Details & Interests
    const id = activeEl.id;
    if (id && id.startsWith('f_')) {
      const val = activeEl.value;
      S[id] = val;
      patchPreview(id, val);
      debouncedSaveActiveResume();
      triggerIntelAnalysis();
      return;
    }
    
    // 2. Dynamic Entry Cards
    const card = activeEl.closest('.entry-card');
    if (card && card.parentElement) {
      const parentId = card.parentElement.id;
      const cards = Array.from(card.parentElement.querySelectorAll('.entry-card'));
      const index = cards.indexOf(card);
      
      let type = '';
      if (parentId === 'exp-list') type = 'exp';
      else if (parentId === 'edu-list') type = 'edu';
      else if (parentId === 'cert-list') type = 'cert';
      else if (parentId === 'award-list') type = 'award';
      else if (parentId === 'lang-list') type = 'lang';
      
      if (type && index !== -1) {
        const placeholder = (activeEl.placeholder || '').toLowerCase();
        let field = '';
        if (type === 'exp') {
          if (placeholder.includes('company')) field = 'company';
          else if (placeholder.includes('job title')) field = 'role';
          else if (placeholder.includes('start')) field = 'start';
          else if (placeholder.includes('end')) field = 'end';
          else if (placeholder.includes('bullet points')) field = 'desc';
        } else if (type === 'edu') {
          if (placeholder.includes('school')) field = 'school';
          else if (placeholder.includes('degree')) field = 'degree';
          else if (placeholder.includes('start')) field = 'start';
          else if (placeholder.includes('end')) field = 'end';
          else if (placeholder.includes('description')) field = 'desc';
        } else if (type === 'cert') {
          if (placeholder.includes('name')) field = 'name';
          else if (placeholder.includes('issuer')) field = 'issuer';
          else if (placeholder.includes('year')) field = 'year';
        } else if (type === 'award') {
          if (placeholder.includes('award')) field = 'title';
          else if (placeholder.includes('organization')) field = 'org';
          else if (placeholder.includes('year')) field = 'year';
        } else if (type === 'lang') {
          if (placeholder.includes('language')) field = 'lang';
        }
        
        if (field) {
          patchEntryPreview(type, field, index, activeEl.value);
          debouncedSaveActiveResume();
          triggerIntelAnalysis();
          return;
        }
      }
    }
  }
  
  // Fallback to full render
  debouncedRenderImmediate();
}

// ══════════════════════════════════════════════════════════
// MOBILE & DOWNLOAD
// ══════════════════════════════════════════════════════════
const mobToggle = document.getElementById('mobToggle');
if (mobToggle) {
  mobToggle.onclick = () => {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
    if (sidebar.classList.contains('open')) {
      mobToggle.innerHTML = '<i class="ti ti-eye"></i> Preview';
    } else {
      mobToggle.innerHTML = '<i class="ti ti-edit"></i> Edit';
    }
  };
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('open');
  const mobToggle = document.getElementById('mobToggle');
  if (mobToggle) {
    mobToggle.innerHTML = '<i class="ti ti-edit"></i> Edit';
  }
}

function doDownload() {
  openDownloadModal();
}
function openDownloadModal() {
  const modal = document.getElementById('downloadModal');
  const input = document.getElementById('pdfFileNameInput');
  if (modal && input) {
    const fName = gv('f_name').trim();
    let defaultName = 'CVcraft_Resume';
    if (fName) {
      defaultName = fName.replace(/\s+/g, '_') + '_Resume';
    }
    // Remove invalid filename symbols
    defaultName = defaultName.replace(/[^a-zA-Z0-9_\-]/g, '');
    input.value = defaultName;
    showModal(modal);
  }
}
function closeDownloadModal() {
  const modal = document.getElementById('downloadModal');
  if (modal) hideModal(modal);
}
async function generateAndSavePDF() {
  const input = document.getElementById('pdfFileNameInput');
  if (!input) return;

  let fileName = input.value.trim();
  
  // Strip duplicate .pdf suffixes first
  while (fileName.toLowerCase().endsWith('.pdf')) {
    fileName = fileName.substring(0, fileName.length - 4).trim();
  }
  
  // Then sanitize invalid filename symbols
  fileName = fileName.replace(/[^a-zA-Z0-9_\-]/g, '_');
  fileName = fileName.trim() || 'CVcraft_Resume';

  const downloadConfirmBtn = document.getElementById('downloadConfirmBtn');
  const originalBtnText = downloadConfirmBtn ? downloadConfirmBtn.innerHTML : '';

  // Show loading spinner immediately for instant user visual feedback
  if (downloadConfirmBtn) {
    downloadConfirmBtn.disabled = true;
    downloadConfirmBtn.innerHTML = `<i class="ti ti-loader animate-spin" style="margin-right: 4px;"></i> Preparing ATS-safe PDF...`;
  }

  const pickerOptions = {
    suggestedName: fileName + '.pdf',
    types: [{
      description: 'PDF Document',
      accept: {
        'application/pdf': ['.pdf'],
      },
    }],
  };

  try {
    // 1. Prompt user for save location and name on local OS
    if (typeof window.showSaveFilePicker === 'function') {
      const fileHandle = await window.showSaveFilePicker(pickerOptions);
      
      closeDownloadModal();
      
      const element = document.getElementById('cvDoc');
      const opt = {
        margin:       0,
        filename:     fileName + '.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      const h2p = (typeof window.html2pdf !== 'undefined') ? window.html2pdf : ((typeof html2pdf !== 'undefined') ? html2pdf : null);
      if (h2p) {
        const blob = await h2p().set(opt).from(element).output('blob');
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
        showToast('PDF Exported Successfully!');
      } else {
        throw new Error('html2pdf library not loaded');
      }
      
      if (downloadConfirmBtn) {
        downloadConfirmBtn.disabled = false;
        downloadConfirmBtn.innerHTML = originalBtnText;
      }
    } else {
      // Fallback for browsers that do not support showSaveFilePicker (like Firefox/Mobile)
      closeDownloadModal();
      
      const element = document.getElementById('cvDoc');
      const opt = {
        margin:       0,
        filename:     fileName + '.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      const h2p = (typeof window.html2pdf !== 'undefined') ? window.html2pdf : ((typeof html2pdf !== 'undefined') ? html2pdf : null);
      if (h2p) {
        await h2p().set(opt).from(element).save();
      } else {
        window.print();
      }
      
      if (downloadConfirmBtn) {
        downloadConfirmBtn.disabled = false;
        downloadConfirmBtn.innerHTML = originalBtnText;
      }
    }
  } catch (err) {
    const isAbort = err.name === 'AbortError';
    if (isAbort) {
      console.log('User canceled the save location picker.');
      // Restore button state so user can try again
      if (downloadConfirmBtn) {
        downloadConfirmBtn.disabled = false;
        downloadConfirmBtn.innerHTML = originalBtnText;
      }
    } else {
      console.error('File system write failed, falling back:', err);
      try {
        closeDownloadModal();
        const element = document.getElementById('cvDoc');
        const opt = {
          margin:       0,
          filename:     fileName + '.pdf',
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
          jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        const h2p = (typeof window.html2pdf !== 'undefined') ? window.html2pdf : ((typeof html2pdf !== 'undefined') ? html2pdf : null);
        if (h2p) {
          await h2p().set(opt).from(element).save();
        } else {
          window.print();
        }
      } catch (fallbackErr) {
        console.error('Fallback print failed:', fallbackErr);
      }
      
      if (downloadConfirmBtn) {
        downloadConfirmBtn.disabled = false;
        downloadConfirmBtn.innerHTML = originalBtnText;
      }
    }
  }
}
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}

// ══════════════════════════════════════════════════════════
// RESUMES LIFECYCLE & STORAGE
// ══════════════════════════════════════════════════════════
let resumes = [];
let activeResumeId = '';

function showConfirm(title, message) {
  return new Promise((resolve) => {
    const modal = document.getElementById('confirmModal');
    const titleEl = document.getElementById('confirmTitle');
    const msgEl = document.getElementById('confirmMessage');
    const confirmBtn = document.getElementById('confirmConfirmBtn');
    const cancelBtn = document.getElementById('confirmCancelBtn');

    if (!modal || !titleEl || !msgEl || !confirmBtn || !cancelBtn) {
      resolve(confirm(message));
      return;
    }

    titleEl.textContent = title;
    msgEl.textContent = message;
    showModal(modal);

    const cleanUp = () => {
      hideModal(modal);
      confirmBtn.onclick = null;
      cancelBtn.onclick = null;
    };

    confirmBtn.onclick = () => {
      cleanUp();
      resolve(true);
    };

    cancelBtn.onclick = () => {
      cleanUp();
      resolve(false);
    };
  });
}

function initResumes() {
  try {
    resumes = JSON.parse(localStorage.getItem('resumes')) || [];
    activeResumeId = localStorage.getItem('activeResumeId') || '';
  } catch (e) {
    resumes = [];
    activeResumeId = '';
  }

  // Intercept landing page selected template redirect
  const selectedTemplateId = localStorage.getItem('selected_template_id');
  if (selectedTemplateId) {
    localStorage.removeItem('selected_template_id');
    const template = window.TEMPLATE_REGISTRY ? window.TEMPLATE_REGISTRY[selectedTemplateId] : null;
    if (template) {
      const newResumeId = 'res-' + Date.now();
      const starterData = deepClone(template.starterData);
      starterData.templateId = template.id;
      starterData.templateVersion = template.version;

      const newResume = {
        id: newResumeId,
        name: template.label + ' Resume',
        data: starterData
      };

      resumes.push(newResume);
      activeResumeId = newResumeId;
      localStorage.setItem('resumes', JSON.stringify(resumes));
      localStorage.setItem('activeResumeId', activeResumeId);
    }
  }

  // If no resumes exist, initialize one (migrating legacy work if it exists)
  if (resumes.length === 0) {
    let legacyData = null;
    try {
      const legacySaved = localStorage.getItem('resume_state');
      if (legacySaved) legacyData = JSON.parse(legacySaved);
    } catch (e) { }

    const initialData = legacyData || deepClone(DEFAULT_BLANK_RESUME);
    const defaultResume = {
      id: 'res-' + Date.now(),
      name: 'My Resume',
      data: initialData
    };
    resumes.push(defaultResume);
    activeResumeId = defaultResume.id;
    localStorage.setItem('resumes', JSON.stringify(resumes));
    localStorage.setItem('activeResumeId', activeResumeId);
  }

  let active = resumes.find(r => r.id === activeResumeId);
  if (!active) {
    active = resumes[0];
    activeResumeId = active.id;
    localStorage.setItem('activeResumeId', activeResumeId);
  }

  loadState(active.data);
  loadResumeIntoDOM();
  renderResumesList();
}

function loadState(data) {
  for (let key in S) {
    if (S.hasOwnProperty(key)) delete S[key];
  }
  Object.assign(S, deepClone(DEFAULT_BLANK_RESUME), data);
}

function loadResumeIntoDOM() {
  const fields = [
    'f_name', 'f_title', 'f_summary', 'f_email', 'f_phone',
    'f_city', 'f_country', 'f_linkedin', 'f_website', 'f_github'
  ];
  fields.forEach(fid => {
    const el = document.getElementById(fid);
    if (fid === 'f_summary') {
      if (el) el.value = S[fid] || '';
    } else {
      if (el) el.setAttribute('value', S[fid] || '');
      if (el) el.value = S[fid] || '';
    }
  });

  const sliders = [
    { id: 'photoSize', valId: 'photoSizeVal', suffix: 'px' },
    { id: 'photoBR', valId: 'photoBRVal', suffix: '%' },
    { id: 'fontSizeR', valId: 'fontSizeV', suffix: '%', stateKey: 'fontSize' },
    { id: 'lineHR', valId: 'lineHV', suffix: '', stateKey: 'lineH', scale: 100 },
    { id: 'secGapR', valId: 'secGapV', suffix: 'px', stateKey: 'secGap' }
  ];

  sliders.forEach(s => {
    const el = document.getElementById(s.id);
    if (el) {
      const key = s.stateKey || s.id;
      let val = S[key];
      if (s.scale) val = Math.round(val * s.scale);
      el.value = val;

      const vEl = document.getElementById(s.valId);
      if (vEl) {
        let displayVal = S[key];
        if (key === 'lineH') displayVal = displayVal.toFixed(2);
        vEl.textContent = displayVal + s.suffix;
      }
    }
  });

  buildColorGrid();
  if (typeof buildTemplatePresets === 'function') {
    buildTemplatePresets();
  }
  buildLayoutGrid();
  buildFontGrid();
  buildEntries();
  buildSkillTags();
  buildLangs();
  buildReorderList();
  updatePhotoUI();

  if (typeof renderSkillSuggestions === 'function') {
    renderSkillSuggestions();
  }

  // ── Assistant panel visibility: respect user's hide/show choice ──────────
  // Only reset the panel to hidden when switching resumes (panel has no content)
  // or when the user explicitly hid it (_assistantVisible === false).
  // Never unconditionally reset — that erases the user's hide/show state.
  const rolePanel = document.getElementById('smart-role-panel');
  if (rolePanel) {
    const hasContent = rolePanel.innerHTML.trim() !== '';
    if (!hasContent) {
      // No content: keep it hidden (initial / blank state)
      rolePanel.style.display = 'none';
      window._assistantVisible = false;
      const bar = document.getElementById('smart-role-show-bar');
      if (bar) bar.style.display = 'none';
    } else if (window._assistantVisible === false) {
      // User explicitly hid it — keep it hidden and make sure the show-bar is visible
      rolePanel.style.display = 'none';
      if (typeof _updateAssistantShowBar === 'function') _updateAssistantShowBar(true);
    } else {
      // User had it open (or it's newly populated) — keep it visible
      rolePanel.style.display = 'block';
      if (typeof _updateAssistantShowBar === 'function') _updateAssistantShowBar(false);
    }
  }
}

function saveActiveResume() {
  try {
    const active = resumes.find(r => r.id === activeResumeId);
    if (active) {
      active.data = deepClone(S);
      localStorage.setItem('resumes', JSON.stringify(resumes));
    }
  } catch (err) {
    console.error('Failed to save resumes to localStorage:', err);
    if (err.name === 'QuotaExceededError' || err.code === 22) {
      showToast('Storage quota exceeded. Some changes may not be saved.');
    }
  }
}

const debouncedSaveActiveResume = debounce(saveActiveResume, SAVE_DEBOUNCE_MS);

function toggleResumesMenu(e) {
  if (e) e.stopPropagation();
  const dropdown = document.getElementById('resumesDropdown');
  const trigger = document.getElementById('resumesTrigger');
  if (dropdown) {
    const isOpen = dropdown.classList.toggle('open');
    if (trigger) trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }
}

function closeResumesDropdown() {
  const dropdown = document.getElementById('resumesDropdown');
  if (dropdown) {
    dropdown.classList.remove('open');
    const trigger = document.getElementById('resumesTrigger');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  }
}

function renderResumesList() {
  const list = document.getElementById('resumesList');
  if (!list) return;

  list.innerHTML = resumes.map(r => {
    const isActive = r.id === activeResumeId;
    return `
      <div class="resume-item ${isActive ? 'active' : ''}" tabindex="0" role="button" aria-label="${esc(r.name)}" onclick="switchResume('${r.id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault(); switchResume('${r.id}');}" data-id="${r.id}">
        <span class="resume-item-name" id="name-lbl-${r.id}">${esc(r.name)}</span>
        <div class="resume-item-actions">
          <button class="resume-item-btn" onclick="duplicateResume('${r.id}', event)" title="Duplicate" aria-label="Duplicate ${esc(r.name)}"><i class="ti ti-copy"></i></button>
          <button class="resume-item-btn" onclick="startRename('${r.id}', event)" title="Rename" aria-label="Rename ${esc(r.name)}"><i class="ti ti-pencil"></i></button>
          <button class="resume-item-btn btn-delete" onclick="deleteResume('${r.id}', event)" title="Delete" aria-label="Delete ${esc(r.name)}"><i class="ti ti-trash"></i></button>
        </div>
      </div>
    `;
  }).join('');

  const active = resumes.find(r => r.id === activeResumeId);
  const activeLabel = document.getElementById('activeResumeName');
  if (active && activeLabel) {
    activeLabel.textContent = active.name;
  }
}

function switchResume(id) {
  if (document.querySelector('.resume-rename-input')) return;

  activeResumeId = id;
  localStorage.setItem('activeResumeId', activeResumeId);

  const active = resumes.find(r => r.id === activeResumeId);
  if (active) {
    document.querySelectorAll('.entry-card[data-card-id]').forEach(el => {
      const cardId = el.getAttribute('data-card-id');
      if (cardId) destroyCard(cardId);
    });

    loadState(active.data);
    loadResumeIntoDOM();
    renderImmediate();
    setTimeout(zoomFit, 100);
  }

  renderResumesList();
  closeResumesDropdown();
}

function createNewResume(e) {
  if (e) e.stopPropagation();
  if (window.canDuplicateResume && !window.canDuplicateResume()) {
    if (window.showStorageWarning) window.showStorageWarning();
    showToast('Creation blocked. Storage limit reached.');
    return;
  }

  document.querySelectorAll('.entry-card[data-card-id]').forEach(el => {
    const cardId = el.getAttribute('data-card-id');
    if (cardId) destroyCard(cardId);
  });

  const newResume = {
    id: 'res-' + Date.now(),
    name: 'Untitled Resume',
    data: deepClone(DEFAULT_BLANK_RESUME)
  };

  resumes.push(newResume);
  activeResumeId = newResume.id;

  localStorage.setItem('resumes', JSON.stringify(resumes));
  localStorage.setItem('activeResumeId', activeResumeId);

  loadState(newResume.data);
  loadResumeIntoDOM();
  renderImmediate();
  renderResumesList();

  setTimeout(() => {
    startRename(newResume.id);
  }, 100);
}

async function deleteResume(id, e) {
  if (e) e.stopPropagation();

  if (resumes.length <= 1) {
    showToast("You must keep at least one resume.");
    return;
  }

  const target = resumes.find(r => r.id === id);
  if (!target) return;

  const confirmed = await showConfirm(
    "Delete Resume",
    `Are you sure you want to delete "${target.name}"?`
  );
  if (!confirmed) return;

  resumes = resumes.filter(r => r.id !== id);
  localStorage.setItem('resumes', JSON.stringify(resumes));

  if (activeResumeId === id) {
    activeResumeId = resumes[0].id;
    localStorage.setItem('activeResumeId', activeResumeId);

    const active = resumes.find(r => r.id === activeResumeId);
    loadState(active.data);
    loadResumeIntoDOM();
    renderImmediate();
  }

  renderResumesList();
}

function startRename(id, e) {
  if (e) e.stopPropagation();

  const label = document.getElementById(`name-lbl-${id}`);
  if (!label) return;

  const currentName = label.textContent;

  label.innerHTML = `
    <input type="text" class="resume-rename-input" value="${esc(currentName)}" 
           onclick="event.stopPropagation()" 
           onblur="finishRename('${id}', this.value)" 
           onkeydown="if(event.key==='Enter') this.blur(); if(event.key==='Escape') { this.value = '${esc(currentName)}'; this.blur(); }">
  `;

  const input = label.querySelector('input');
  if (input) {
    input.focus();
    input.select();
  }
}

function finishRename(id, newName) {
  newName = newName.trim();
  const active = resumes.find(r => r.id === id);
  if (active) {
    if (newName) active.name = newName;
    localStorage.setItem('resumes', JSON.stringify(resumes));
  }
  renderResumesList();
}

async function loadSampleData(e) {
  if (e) e.stopPropagation();

  const confirmed = await showConfirm(
    "Load Example Resume",
    "Are you sure you want to load the sample template data? This will overwrite current contents of this resume."
  );
  if (!confirmed) return;

  document.querySelectorAll('.entry-card[data-card-id]').forEach(el => {
    const cardId = el.getAttribute('data-card-id');
    if (cardId) destroyCard(cardId);
  });

  loadState(deepClone(DEFAULT_SAMPLE_RESUME));
  loadResumeIntoDOM();
  renderImmediate();

  closeResumesDropdown();
}

function duplicateResume(id, e) {
  if (e) e.stopPropagation();
  if (window.canDuplicateResume && !window.canDuplicateResume()) {
    if (window.showStorageWarning) window.showStorageWarning();
    showToast('Duplication blocked. Storage limit reached.');
    return;
  }
  const target = resumes.find(r => r.id === id);
  if (!target) return;

  const duplicated = {
    id: 'res-' + Date.now(),
    name: target.name + ' Copy',
    data: deepClone(target.data)
  };

  resumes.push(duplicated);
  activeResumeId = duplicated.id;

  localStorage.setItem('resumes', JSON.stringify(resumes));
  localStorage.setItem('activeResumeId', activeResumeId);

  loadState(duplicated.data);
  loadResumeIntoDOM();
  renderImmediate();
  renderResumesList();
  showToast('Resume Duplicated!');
}

function duplicateActiveResume(e) {
  if (e) e.stopPropagation();
  duplicateResume(activeResumeId);
}

function exportProject(e) {
  if (e) e.stopPropagation();
  const active = resumes.find(r => r.id === activeResumeId);
  if (!active) return;

  const projectData = {
    version: '1.0',
    name: active.name,
    data: active.data
  };

  const jsonString = JSON.stringify(projectData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = (active.name.replace(/\s+/g, '_') || 'Resume_Project') + '.cvcraft';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast('Resume File Saved!');

  closeResumesDropdown();
}

function mapExternalResumeData(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return deepClone(DEFAULT_BLANK_RESUME);
  }

  let src = obj;
  if (obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)) {
    src = obj.data;
  }

  const result = deepClone(DEFAULT_BLANK_RESUME);

  const safeStr = (v) => (typeof v === 'string' ? v : (v === null || v === undefined ? '' : String(v)));
  const safeNum = (v, fallback, min = -Infinity, max = Infinity) => {
    const num = Number(v);
    return isNaN(num) ? fallback : Math.max(min, Math.min(max, num));
  };

  const findVal = (keys, sourceObj = src) => {
    if (!sourceObj || typeof sourceObj !== 'object' || Array.isArray(sourceObj)) return undefined;
    for (const key of keys) {
      if (Object.prototype.hasOwnProperty.call(sourceObj, key) && sourceObj[key] !== undefined && sourceObj[key] !== null) {
        return sourceObj[key];
      }
      const lowerKey = key.toLowerCase();
      const actualKey = Object.keys(sourceObj).find(k => k.toLowerCase() === lowerKey);
      if (actualKey && Object.prototype.hasOwnProperty.call(sourceObj, actualKey) && sourceObj[actualKey] !== undefined && sourceObj[actualKey] !== null) {
        return sourceObj[actualKey];
      }
    }
    return undefined;
  };

  result.f_name = safeStr(findVal(['f_name', 'name', 'fullName', 'name_label', 'username']));
  result.f_title = safeStr(findVal(['f_title', 'title', 'label', 'jobTitle', 'designation']));
  result.f_summary = safeStr(findVal(['f_summary', 'summary', 'about', 'objective', 'bio', 'description']));
  result.f_email = safeStr(findVal(['f_email', 'email', 'mail']));
  result.f_phone = safeStr(findVal(['f_phone', 'phone', 'contact', 'telephone']));
  result.f_city = safeStr(findVal(['f_city', 'city']));
  result.f_country = safeStr(findVal(['f_country', 'country', 'region']));
  result.f_linkedin = safeStr(findVal(['f_linkedin', 'linkedin', 'linkedInUrl']));
  result.f_website = safeStr(findVal(['f_website', 'website', 'url', 'portfolio']));
  result.f_github = safeStr(findVal(['f_github', 'github', 'githubUrl']));

  const loc = findVal(['location'], src);
  if (loc && typeof loc === 'object' && !Array.isArray(loc)) {
    if (!result.f_city) result.f_city = safeStr(findVal(['city'], loc));
    if (!result.f_country) result.f_country = safeStr(findVal(['country', 'countryCode', 'region'], loc));
  }

  const basics = findVal(['basics'], src);
  if (basics && typeof basics === 'object' && !Array.isArray(basics)) {
    if (!result.f_name) result.f_name = safeStr(findVal(['name', 'fullName'], basics));
    if (!result.f_title) result.f_title = safeStr(findVal(['label', 'title', 'jobTitle'], basics));
    if (!result.f_summary) result.f_summary = safeStr(findVal(['summary', 'about', 'bio'], basics));
    if (!result.f_email) result.f_email = safeStr(findVal(['email'], basics));
    if (!result.f_phone) result.f_phone = safeStr(findVal(['phone'], basics));
    if (!result.f_website) result.f_website = safeStr(findVal(['url', 'website'], basics));

    const profiles = findVal(['profiles'], basics);
    if (Array.isArray(profiles)) {
      profiles.forEach(p => {
        const net = findVal(['network'], p);
        const url = findVal(['url'], p);
        if (net && url) {
          const nl = safeStr(net).toLowerCase();
          if (nl.includes('linkedin')) result.f_linkedin = safeStr(url);
          else if (nl.includes('github')) result.f_github = safeStr(url);
          else if (nl.includes('portfolio') || nl.includes('website')) result.f_website = safeStr(url);
        }
      });
    }
  }

  const rawSkills = findVal(['skills', 'skill']);
  if (Array.isArray(rawSkills)) {
    result.skills = rawSkills.map(s => {
      if (typeof s === 'string') return s;
      if (s && typeof s === 'object' && !Array.isArray(s)) {
        const name = safeStr(findVal(['name'], s));
        const keywords = findVal(['keywords'], s);
        if (keywords && Array.isArray(keywords)) {
          return [name, ...keywords.map(k => safeStr(k))].filter(Boolean).join(', ');
        }
        return name;
      }
      return '';
    }).map(safeStr).filter(Boolean);
  }

  const rawLangs = findVal(['langs', 'languages', 'language']);
  if (Array.isArray(rawLangs)) {
    result.langs = rawLangs.map(l => {
      if (typeof l === 'string') return { lang: safeStr(l), level: 'Fluent' };
      if (l && typeof l === 'object' && !Array.isArray(l)) {
        return {
          lang: safeStr(findVal(['lang', 'language', 'name'], l)),
          level: safeStr(findVal(['level', 'fluency', 'proficiency'], l) || 'Fluent')
        };
      }
      return null;
    }).filter(l => l && l.lang);
  }

  const rawWork = findVal(['experience', 'work', 'history', 'employment']);
  if (Array.isArray(rawWork)) {
    result.experience = rawWork.map(w => {
      if (!w || typeof w !== 'object' || Array.isArray(w)) return null;
      let descVal = findVal(['desc', 'description', 'summary', 'highlights'], w) || '';
      if (Array.isArray(descVal)) {
        descVal = descVal.map(h => {
          const s = safeStr(h);
          return s.startsWith('•') || s.startsWith('-') ? s : `• ${s}`;
        }).join('\n');
      } else {
        descVal = safeStr(descVal);
      }
      return {
        company: safeStr(findVal(['company', 'name', 'employer', 'organization'], w)),
        role: safeStr(findVal(['role', 'position', 'title', 'jobTitle'], w)),
        start: safeStr(findVal(['start', 'startDate', 'from'], w)),
        end: safeStr(findVal(['end', 'endDate', 'to'], w)),
        desc: descVal
      };
    }).filter(w => w && (w.company || w.role));
  }

  const rawEdu = findVal(['education', 'edu', 'academic']);
  if (Array.isArray(rawEdu)) {
    result.education = rawEdu.map(e => {
      if (!e || typeof e !== 'object' || Array.isArray(e)) return null;
      let descVal = findVal(['desc', 'description', 'summary', 'courses'], e) || '';
      if (Array.isArray(descVal)) {
        descVal = descVal.map(safeStr).join('\n');
      } else {
        descVal = safeStr(descVal);
      }
      return {
        school: safeStr(findVal(['school', 'institution', 'university', 'college'], e)),
        degree: safeStr(findVal(['degree', 'qualification', 'studyType', 'major'], e)),
        start: safeStr(findVal(['start', 'startDate', 'from'], e)),
        end: safeStr(findVal(['end', 'endDate', 'to'], e)),
        desc: descVal
      };
    }).filter(e => e && (e.school || e.degree));
  }

  const rawCerts = findVal(['certs', 'certifications', 'certificates', 'credentials']);
  if (Array.isArray(rawCerts)) {
    result.certs = rawCerts.map(c => {
      if (typeof c === 'string') return { name: safeStr(c), issuer: '', year: '' };
      if (c && typeof c === 'object' && !Array.isArray(c)) {
        return {
          name: safeStr(findVal(['name', 'title'], c)),
          issuer: safeStr(findVal(['issuer', 'institution', 'authority'], c)),
          year: safeStr(findVal(['year', 'date'], c))
        };
      }
      return null;
    }).filter(c => c && c.name);
  }

  const rawAwards = findVal(['awards', 'honors']);
  if (Array.isArray(rawAwards)) {
    result.awards = rawAwards.map(a => {
      if (typeof a === 'string') return { title: safeStr(a), org: '', year: '' };
      if (a && typeof a === 'object' && !Array.isArray(a)) {
        return {
          title: safeStr(findVal(['title', 'name'], a)),
          org: safeStr(findVal(['org', 'awarder', 'issuer', 'organization'], a)),
          year: safeStr(findVal(['year', 'date'], a))
        };
      }
      return null;
    }).filter(a => a && a.title);
  }

  const rawInts = findVal(['interests', 'hobbies']);
  if (Array.isArray(rawInts)) {
    result.interests = rawInts.map(i => {
      if (typeof i === 'string') return safeStr(i);
      if (i && typeof i === 'object' && !Array.isArray(i)) {
        return safeStr(findVal(['name'], i));
      }
      return '';
    }).filter(Boolean);
  } else if (typeof rawInts === 'string') {
    result.interests = rawInts.split(',').map(i => i.trim()).filter(Boolean);
  }

  const accentVal = findVal(['accent']);
  if (accentVal && typeof accentVal === 'string' && /^#[0-9a-fA-F]{3,6}$/.test(accentVal)) {
    result.accent = accentVal;
  }
  const layoutVal = findVal(['layout']);
  if (layoutVal && typeof layoutVal === 'string' && ['classic', 'sidebar-l', 'minimal', 'modern-split', 'elegant'].includes(layoutVal)) {
    result.layout = layoutVal;
  }
  const fontVal = findVal(['font']);
  if (fontVal && typeof fontVal === 'string') {
    result.font = fontVal;
  }
  const fontSizeVal = findVal(['fontSize']);
  if (fontSizeVal !== undefined) {
    result.fontSize = safeNum(fontSizeVal, 100, 30, 200);
  }
  const lineHVal = findVal(['lineH']);
  if (lineHVal !== undefined) {
    result.lineH = safeNum(lineHVal, 1.65, 0.5, 3.0);
  }
  const secGapVal = findVal(['secGap']);
  if (secGapVal !== undefined) {
    result.secGap = safeNum(secGapVal, 20, 0, 100);
  }
  const photoVal = findVal(['photo']);
  if (photoVal !== undefined) {
    result.photo = (typeof photoVal === 'string' && (photoVal.startsWith('data:image/') || photoVal.match(/^https?:\/\//i))) ? photoVal : null;
  }
  const photoSizeVal = findVal(['photoSize']);
  if (photoSizeVal !== undefined) {
    result.photoSize = safeNum(photoSizeVal, 76, 30, 200);
  }
  const photoBRVal = findVal(['photoBR']);
  if (photoBRVal !== undefined) {
    result.photoBR = safeNum(photoBRVal, 50, 0, 50);
  }

  return result;
}

function handleImportProject(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (evt) {
    try {
      const parsed = JSON.parse(evt.target.result);
      const mappedData = mapExternalResumeData(parsed);

      let importName = '';
      if (parsed.name) {
        importName = parsed.name;
      } else if (parsed.basics && parsed.basics.name) {
        importName = parsed.basics.name + "'s Resume";
      } else {
        importName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, ' ');
      }

      const importedResume = {
        id: 'res-' + Date.now(),
        name: importName,
        data: mappedData
      };

      resumes.push(importedResume);
      activeResumeId = importedResume.id;

      localStorage.setItem('resumes', JSON.stringify(resumes));
      localStorage.setItem('activeResumeId', activeResumeId);

      loadState(importedResume.data);
      loadResumeIntoDOM();
      renderImmediate();
      renderResumesList();
      showToast('Resume Uploaded & Filled!');
    } catch (err) {
      console.error(err);
      showToast('Error reading file. Make sure it is a valid .json or .cvcraft file.');
    }
  };
  reader.readAsText(file);
  e.target.value = ''; // Reset input
}

async function resetActiveResume(e) {
  if (e) e.stopPropagation();
  const confirmed = await showConfirm(
    "Reset Resume",
    "Are you sure you want to reset this resume to a blank slate? All your inputs will be lost."
  );
  if (!confirmed) return;

  const active = resumes.find(r => r.id === activeResumeId);
  if (active) {
    document.querySelectorAll('.entry-card[data-card-id]').forEach(el => {
      const cardId = el.getAttribute('data-card-id');
      if (cardId) destroyCard(cardId);
    });

    active.data = deepClone(DEFAULT_BLANK_RESUME);
    localStorage.setItem('resumes', JSON.stringify(resumes));
    loadState(active.data);
    loadResumeIntoDOM();
    renderImmediate();
    showToast('Resume Wiped to Blank!');
  }

  closeResumesDropdown();
}

function generateShareLink(e) {
  if (e) e.stopPropagation();

  // Synchronously persist latest state to active resume and clear debounce queue
  if (typeof debouncedSaveActiveResume !== 'undefined' && typeof debouncedSaveActiveResume.cancel === 'function') {
    debouncedSaveActiveResume.cancel();
  }
  if (typeof saveActiveResume === 'function') {
    saveActiveResume();
  }

  const active = resumes.find(r => r.id === activeResumeId);
  if (!active) return;

  try {
    // Clone the state and remove the base64 photo to keep URL length under browser limits
    const sharedData = deepClone(active.data);
    delete sharedData.photo;

    const jsonStr = JSON.stringify(sharedData);
    const base64Data = btoa(unescape(encodeURIComponent(jsonStr)));

    const url = new URL(window.location.href);
    url.searchParams.set('share', base64Data);

    navigator.clipboard.writeText(url.toString()).then(() => {
      showToast('Share Link Copied to Clipboard!');
    }).catch(err => {
      console.error(err);
      window.prompt("Copy share link:", url.toString());
    });
  } catch (err) {
    console.error(err);
    showToast('Error generating share link.');
  }

  closeResumesDropdown();
}

function checkUrlShareParam() {
  const urlParams = new URLSearchParams(window.location.search);
  const shareData = urlParams.get('share');
  if (!shareData) return;

  try {
    const decodedStr = decodeURIComponent(escape(atob(shareData)));
    const resumeData = JSON.parse(decodedStr);

    if (resumeData && typeof resumeData === 'object' && !Array.isArray(resumeData)) {
      const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.replaceState({ path: cleanUrl }, '', cleanUrl);

      // Route shared resume data through mapExternalResumeData() for sanitization
      const sanitizedData = mapExternalResumeData(resumeData);

      const sharedResume = {
        id: 'res-shared-' + Date.now(),
        name: 'Shared Resume',
        data: sanitizedData
      };

      resumes.push(sharedResume);
      activeResumeId = sharedResume.id;

      localStorage.setItem('resumes', JSON.stringify(resumes));
      localStorage.setItem('activeResumeId', activeResumeId);

      loadState(sharedResume.data);
      loadResumeIntoDOM();
      renderImmediate();
      renderResumesList();
      showToast('Shared Resume Loaded Successfully!');
    } else {
      showToast('Invalid share link data.');
    }
  } catch (err) {
    console.error('Failed to parse share URL data:', err);
    showToast('Invalid or expired share link.');
  }
}

// ══════════════════════════════════════════════════════════
// CROSS-TAB STATE SYNCHRONIZATION MERGER (BUG-10)
// ══════════════════════════════════════════════════════════
function handleCrossTabResumesUpdate(newValue) {
  let newResumes = [];
  try {
    newResumes = JSON.parse(newValue) || [];
  } catch (e) {
    return;
  }

  const incomingActive = newResumes.find(r => r.id === activeResumeId);
  const localActive = resumes.find(r => r.id === activeResumeId);

  if (!incomingActive || !localActive) {
    resumes = newResumes;
    renderResumesList();
    return;
  }

  // Compare active resume data to detect conflict on the same resume
  if (JSON.stringify(incomingActive.data) !== JSON.stringify(localActive.data)) {
    resumes = newResumes;

    // Load updated active resume state and refresh UI
    loadState(incomingActive.data);
    loadResumeIntoDOM();
    renderImmediate();
    renderResumesList();

    showToast('Resume refreshed with updates from another tab.');
  } else {
    // Keep our unsaved changes in S, but update other resumes in memory
    resumes = newResumes.map(r => {
      if (r.id === activeResumeId) {
        return { ...r, data: deepClone(S) };
      }
      return r;
    });
    renderResumesList();
  }
}
window.handleCrossTabResumesUpdate = handleCrossTabResumesUpdate;

function init() {
  initResumes();
  // Render the resume preview after loading state
  renderImmediate();
  checkUrlShareParam();
  buildStepBar();

  // Print hooks to cleanly isolate states (BUG-02)
  window.addEventListener('beforeprint', () => {
    document.body.classList.add('print-mode');
  });
  window.addEventListener('afterprint', () => {
    document.body.classList.remove('print-mode');
  });

  // Initialize cross-tab conflict banner & heartbeats (BUG-10)
  if (typeof initConflictBanner === 'function') {
    initConflictBanner();
  }
  if (typeof updateTabHeartbeat === 'function') {
    updateTabHeartbeat();
    setInterval(updateTabHeartbeat, 3000);
  }

  window.addEventListener('storage', (e) => {
    if (e.key === 'cvcraft_active_tabs') {
      try {
        const activeTabs = JSON.parse(e.newValue) || {};
        if (typeof checkConflicts === 'function') {
          checkConflicts(activeTabs);
        }
      } catch (err) {}
    }
    if (e.key === 'resumes' && e.newValue !== null) {
      if (typeof handleCrossTabResumesUpdate === 'function') {
        handleCrossTabResumesUpdate(e.newValue);
      }
    }
  });

  // Keyboard navigation support for saved resumes menu dropdown
  const dropdown = document.getElementById('resumesDropdown');
  if (dropdown) {
    dropdown.addEventListener('keydown', (e) => {
      if (!dropdown.classList.contains('open')) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        closeResumesDropdown();
        const trigger = document.getElementById('resumesTrigger');
        if (trigger) trigger.focus();
        return;
      }

      // If typing in the rename input, do not intercept ArrowUp/ArrowDown
      if (document.activeElement && document.activeElement.tagName === 'INPUT' && document.activeElement.type === 'text') {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          return;
        }
      }

      // Find all focusable items in the menu
      const focusable = Array.from(dropdown.querySelectorAll('input, button:not([style*="display:none"]), .resume-item[tabindex="0"]'))
        .filter(el => {
          const style = window.getComputedStyle(el);
          return el.tabIndex !== -1 && !el.disabled && style.display !== 'none' && style.visibility !== 'hidden';
        });

      if (focusable.length === 0) return;

      const activeIndex = focusable.indexOf(document.activeElement);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = (activeIndex + 1) % focusable.length;
        focusable[next].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = (activeIndex - 1 + focusable.length) % focusable.length;
        focusable[prev].focus();
      }
    });
  }

  setTimeout(zoomFit, 200);
}

window.addEventListener('resize', () => setTimeout(zoomFit, 100));
init();
