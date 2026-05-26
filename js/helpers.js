// ══════════════════════════════════════════════════════════
// ZOOM
// ══════════════════════════════════════════════════════════
let zoomLevel = 75;
function zoom(delta){zoomSet(Math.max(30,Math.min(150,zoomLevel+delta)));}
function zoomSet(v){
  zoomLevel=v;
  document.getElementById('zoomLabel').textContent=v+'%';
  document.getElementById('cvWrap').style.transform=`scale(${v/100})`;
  const doc = document.getElementById('cvDoc');
  const height = doc ? doc.offsetHeight : 1123;
  document.getElementById('cvWrap').style.marginBottom=`${(v/100-1)*height}px`;
}
function zoomFit(){
  const panel=document.getElementById('previewScroll');
  if(!panel)return;
  const pw=panel.clientWidth-40;
  const fit=Math.floor((pw/794)*100);
  zoomSet(Math.max(30,Math.min(120,fit)));
}

// ══════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════
function gv(id){return(document.getElementById(id)||{}).value||'';}
function fmtDesc(desc){
  if(!desc)return'';
  return desc.split('\n').map(l=>{
    const t=l.trim();if(!t)return'';
    return(t.startsWith('•')||t.startsWith('-'))
      ?`<div style="display:flex;gap:6px;margin-bottom:3px"><span style="flex-shrink:0;color:var(--cv-a)">▸</span><span>${t.replace(/^[•\-]\s*/,'')}</span></div>`
      :`<div style="margin-bottom:2px">${t}</div>`;
  }).join('');
}
function linkify(text, type) {
  if (!text) return '';
  let href = '';
  if (type === 'email') href = `mailto:${text}`;
  else if (type === 'phone') href = `tel:${text}`;
  else if (type === 'url') href = text.match(/^https?:\/\//i) ? text : `https://${text}`;
  
  if (href) {
    return `<a href="${href}" target="_blank" style="color:inherit;text-decoration:none;transition:opacity 0.15s;" onmouseover="this.style.opacity=0.7" onmouseout="this.style.opacity=1">${text}</a>`;
  }
  return text;
}

function contactItem(icon, text, type) {
  if (!text) return '';
  const content = linkify(text, type);
  return `<span style="display:inline-flex;align-items:center;gap:4px"><i class="ti ${icon}" style="font-size:12px;opacity:.8"></i>${content}</span>`;
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
