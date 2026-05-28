// ══════════════════════════════════════════════════════════
// ZOOM
// ══════════════════════════════════════════════════════════
let zoomLevel = 75;
function zoom(delta){zoomSet(Math.max(MIN_ZOOM,Math.min(MAX_ZOOM,zoomLevel+delta)));}
function zoomSet(v){
  zoomLevel=v;
  document.getElementById('zoomLabel').textContent=v+'%';
  document.getElementById('cvWrap').style.transform=`scale(${v/100})`;
  const doc = document.getElementById('cvDoc');
  const height = doc ? doc.offsetHeight : A4_HEIGHT_PX;
  document.getElementById('cvWrap').style.marginBottom=`${(v/100-1)*height}px`;
}
function zoomFit(){
  const panel=document.getElementById('previewScroll');
  if(!panel)return;
  const pw=panel.clientWidth-40;
  const fit=Math.floor((pw/A4_WIDTH_PX)*100);
  zoomSet(Math.max(MIN_ZOOM,Math.min(MAX_FIT_ZOOM,fit)));
}

// ══════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════
function debounce(func, wait) {
  let timeout;
  const debounced = function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
  debounced.cancel = () => {
    clearTimeout(timeout);
  };
  debounced.flush = () => {
    clearTimeout(timeout);
    func.apply(this);
  };
  return debounced;
}

function gv(id){return(document.getElementById(id)||{}).value||'';}
function fmtDesc(desc){
  if(!desc)return'';
  return desc.split('\n').map(l=>{
    const t=l.trim();if(!t)return'';
    if (t.startsWith('•') || t.startsWith('-')) {
      const cleaned = t.replace(/^[•\-]\s*/,'');
      return `<div class="cv-desc-bullet"><span class="cv-desc-bullet-marker">▸</span><span>${esc(cleaned)}</span></div>`;
    }
    return `<div class="cv-desc-text">${esc(t)}</div>`;
  }).join('');
}
function linkify(text, type) {
  if (!text) return '';
  let href = '';
  if (type === 'email') href = `mailto:${text}`;
  else if (type === 'phone') href = `tel:${text}`;
  else if (type === 'url') href = text.match(/^https?:\/\//i) ? text : `https://${text}`;
  
  if (href && href.trim().toLowerCase().startsWith('javascript:')) {
    href = '#';
  }

  if (href) {
    return `<a href="${esc(href)}" target="_blank" class="cv-link">${esc(text)}</a>`;
  }
  return esc(text);
}

function contactItem(icon, text, type) {
  if (!text) return '';
  const content = linkify(text, type);
  return `<span class="cv-contact-item"><i class="ti ${esc(icon)} cv-contact-icon"></i>${content}</span>`;
}

function renderContacts(layoutType) {
  const email = gv('f_email'), phone = gv('f_phone'), city = gv('f_city'), country = gv('f_country');
  const linkedin = gv('f_linkedin'), website = gv('f_website'), github = gv('f_github');
  const loc = [city, country].filter(Boolean).join(', ');

  const items = [
    { val: email, icon: 'ti-mail', type: 'email' },
    { val: phone, icon: 'ti-phone', type: 'phone' },
    { val: loc, icon: 'ti-map-pin', type: 'loc' },
    { val: linkedin, icon: 'ti-brand-linkedin', type: 'url' },
    { val: website, icon: 'ti-world', type: 'url' },
    { val: github, icon: 'ti-brand-github', type: 'url' }
  ].filter(item => item.val);

  if (layoutType === 'sidebar') {
    return items.map(item => {
      const content = linkify(item.val, item.type);
      return `<div class="layout-sidebar-contact-item"><i class="ti ${esc(item.icon)}"></i><span>${content}</span></div>`;
    }).join('');
  }

  const renderedItems = items.map(item => contactItem(item.icon, item.val, item.type));

  if (layoutType === 'classic') {
    return renderedItems.join('<span class="cv-contact-separator">|</span>');
  }
  if (layoutType === 'minimal') {
    return renderedItems.join('<span class="cv-contact-bullet">·</span>');
  }
  if (layoutType === 'elegant') {
    return renderedItems.join('&ensp;');
  }
  if (layoutType === 'modern-split') {
    return renderedItems.join('');
  }
  return renderedItems.join(' ');
}

function hsvToHex(h, s, v) {
  s /= 100;
  v /= 100;
  const k = (n) => (n + h / 60) % 6;
  const f = (n) => v * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  const r = Math.round(255 * f(5));
  const g = Math.round(255 * f(3));
  const b = Math.round(255 * f(1));
  return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
}

function hexToHsv(hex) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex.split("").map(c => c + c).join("");
  }
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, v = max;
  let d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max === min) {
    h = 0;
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
}

function esc(s){return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

let activeModalElements = [];
let modalFocusBackups = new Map();

function closeTransientUI() {
  // 1. Close resumesDropdown
  if (typeof window.closeResumesDropdown === 'function') {
    window.closeResumesDropdown();
  } else {
    const dropdown = document.getElementById('resumesDropdown');
    if (dropdown) {
      dropdown.classList.remove('open');
      const trigger = document.getElementById('resumesTrigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    }
  }

  // 2. Close mobile sidebar & overlay
  if (typeof window.closeSidebar === 'function') {
    window.closeSidebar();
  } else {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    const mobToggle = document.getElementById('mobToggle');
    if (mobToggle) {
      mobToggle.innerHTML = '<i class="ti ti-edit"></i> Edit';
    }
  }

  // 3. Close custom select dropdowns
  document.querySelectorAll('.custom-select-container.open').forEach(c => {
    c.classList.remove('open');
    const trigger = c.querySelector('.custom-select-trigger');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  });

  // 4. Close role suggestions & clear autocomplete timers
  const suggestionsBox = document.getElementById('role-suggestions');
  if (suggestionsBox) suggestionsBox.style.display = 'none';
  const fTitle = document.getElementById('f_title');
  if (fTitle) fTitle.setAttribute('aria-expanded', 'false');
  if (window.autocompleteDebounceTimer) {
    clearTimeout(window.autocompleteDebounceTimer);
    window.autocompleteDebounceTimer = null;
  }
}

function blockBackgroundTouch(e) {
  const isCard = e.target.closest('.modal-card');
  if (!isCard) {
    e.preventDefault();
  } else {
    const card = e.target.closest('.modal-card');
    if (card.scrollHeight <= card.clientHeight) {
      e.preventDefault();
    }
  }
}

function showModal(modal) {
  if (!modal) return;

  // 1. Close all transient UI elements first
  closeTransientUI();

  // 2. Track focus backup and active modal state
  modalFocusBackups.set(modal, document.activeElement);
  modal.style.display = 'flex';
  document.body.classList.add('modal-open');
  activeModalElements.push(modal);

  // 3. Block mobile touch scrolling leakage on background
  modal.addEventListener('touchmove', blockBackgroundTouch, { passive: false });
  modal._touchBlocker = blockBackgroundTouch;

  // 4. Accessibility hook: hide non-modal content from screen readers
  document.querySelectorAll('header, .app').forEach(el => {
    el.setAttribute('aria-hidden', 'true');
  });

  // 5. Backport dynamic overlay click to close unless explicitly disabled
  if (!modal._hasOverlayClickListener) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        if (modal.dataset.noOverlayClose === 'true') return;
        const cancelBtn = modal.querySelector('.btn-outline, button[onclick*="close"], button[onclick*="Cancel"], #confirmCancelBtn');
        if (cancelBtn) {
          cancelBtn.click();
        } else {
          hideModal(modal);
        }
      }
    });
    modal._hasOverlayClickListener = true;
  }

  // 6. Set focus on first focusable element inside the modal
  const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusable.length > 0) {
    const interactive = Array.from(focusable).find(el => !el.classList.contains('modal-overlay'));
    if (interactive) interactive.focus();
    else focusable[0].focus();
  }
}

function hideModal(modal) {
  if (!modal) return;
  modal.style.display = 'none';

  // 1. Clean up touch event block
  if (modal._touchBlocker) {
    modal.removeEventListener('touchmove', modal._touchBlocker);
    delete modal._touchBlocker;
  }

  activeModalElements = activeModalElements.filter(m => m !== modal);

  // 2. Restore background and body scrolling when no active modals remain
  if (activeModalElements.length === 0) {
    document.body.classList.remove('modal-open');
    document.querySelectorAll('header, .app').forEach(el => {
      el.removeAttribute('aria-hidden');
    });
  }

  // 3. Restore focus
  const backup = modalFocusBackups.get(modal);
  if (backup) {
    backup.focus();
    modalFocusBackups.delete(modal);
  }
}

// Global modal keyboard event listener (Escape to close, Tab to trap focus)
window.addEventListener('keydown', (e) => {
  const activeModal = activeModalElements[activeModalElements.length - 1];
  if (!activeModal) return;

  if (e.key === 'Escape') {
    e.preventDefault();
    const cancelBtn = activeModal.querySelector('.btn-outline, button[onclick*="close"], button[onclick*="Cancel"], #confirmCancelBtn');
    if (cancelBtn) cancelBtn.click();
    else hideModal(activeModal);
    return;
  }

  if (e.key === 'Tab') {
    const focusable = Array.from(activeModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
      .filter(el => {
        const style = window.getComputedStyle(el);
        return el.tabIndex !== -1 && !el.disabled && style.display !== 'none' && style.visibility !== 'hidden';
      });
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        last.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  }
});

// ══════════════════════════════════════════════════════════
// QUOTA-SAFE STORAGE SYSTEM (BUG-07)
// ══════════════════════════════════════════════════════════
function getLocalStorageUsageKB() {
  let total = 0;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += (localStorage[key].length + key.length) * 2; // UTF-16 bytes
    }
  }
  return total / 1024;
}

function canDuplicateResume() {
  const usageKB = getLocalStorageUsageKB();
  return usageKB < 4500; // Warn/block duplication at 4.5 MB
}

function safeSave(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    const isQuotaError = e.name === 'QuotaExceededError' || 
                         e.code === 22 || 
                         e.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
                         e.message.indexOf('quota') !== -1;
    if (isQuotaError) {
      showStorageWarning();
      return false;
    } else {
      console.error('Storage error:', e);
      throw e;
    }
  }
}

function showStorageWarning() {
  let modal = document.getElementById('quotaModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'quotaModal';
    modal.className = 'modal-overlay';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'quotaTitle');
    modal.style.display = 'none';
    modal.onclick = () => hideModal(modal);
    modal.innerHTML = `
      <div class="modal-card" style="max-width: 420px; width: 90%; background: rgba(28, 28, 28, 0.95); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 14px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5); display: flex; flex-direction: column; overflow: hidden; padding: 0; gap: 0;" onclick="event.stopPropagation()">
        <div style="padding: 24px 24px 18px; display: flex; flex-direction: column; gap: 14px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: rgba(245, 158, 11, 0.12); display: flex; align-items: center; justify-content: center; color: #f59e0b; flex-shrink: 0;">
              <i class="ti ti-database-exclamation" style="font-size: 20px;"></i>
            </div>
            <h3 id="quotaTitle" style="font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 1.15rem; color: #fff; margin: 0;">Storage Limit Warning</h3>
          </div>
          <div>
            <p style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.88rem; color: rgba(255, 255, 255, 0.7); line-height: 1.55; margin: 0;">
              Storage is nearly full. Export old resumes as <strong>.cvcraft</strong> files to free up space, then delete them from the list.
            </p>
          </div>
        </div>
        <div style="background: rgba(0, 0, 0, 0.25); padding: 14px 24px; display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid rgba(255, 255, 255, 0.05); margin-top: 0;">
          <button class="btn btn-outline btn-sm" onclick="hideModal(document.getElementById('quotaModal'))">Close</button>
          <button class="btn btn-primary btn-sm" id="quotaExportBtn">Export Active</button>
          <button class="btn btn-primary btn-sm" id="quotaManageBtn">Manage Resumes</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('quotaExportBtn').onclick = () => {
      if (window.exportProject) {
        window.exportProject();
      }
      hideModal(modal);
    };

    document.getElementById('quotaManageBtn').onclick = () => {
      hideModal(modal);
      const dropdown = document.getElementById('resumesDropdown');
      if (dropdown && !dropdown.classList.contains('open') && window.toggleResumesMenu) {
        window.toggleResumesMenu();
      }
    };
  }
  showModal(modal);
}

// Universal interception via safe monkey-patching
const _origSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
  try {
    _origSetItem.call(localStorage, key, value);
  } catch (e) {
    const isQuotaError = e.name === 'QuotaExceededError' || 
                         e.code === 22 || 
                         e.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
                         e.message.indexOf('quota') !== -1;
    if (isQuotaError) {
      showStorageWarning();
    } else {
      console.error('Storage error:', e);
      throw e;
    }
  }
};

// Expose helpers globally
window.getLocalStorageUsageKB = getLocalStorageUsageKB;
window.canDuplicateResume = canDuplicateResume;
window.safeSave = safeSave;
window.showStorageWarning = showStorageWarning;

