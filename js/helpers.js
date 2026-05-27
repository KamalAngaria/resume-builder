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
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
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

function showModal(modal) {
  if (!modal) return;
  modalFocusBackups.set(modal, document.activeElement);
  modal.style.display = 'flex';
  document.body.classList.add('modal-open');
  activeModalElements.push(modal);

  // Set focus on first focusable input or button inside modal (skip backdrop if focused)
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
  activeModalElements = activeModalElements.filter(m => m !== modal);
  if (activeModalElements.length === 0) {
    document.body.classList.remove('modal-open');
  }
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
    const cancelBtn = activeModal.querySelector('.btn-outline, button[onclick*="close"], button[onclick*="Cancel"]');
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
