// ══════════════════════════════════════════════════════════
// SECTION RENDERERS
// ══════════════════════════════════════════════════════════
function renderSection(sec,opts={}){
  const {titleStyle='',wrapStyle='',chipStyle='filled',accent='#1a1a2e'}=opts;
  const barColor=`color:${accent};border-bottom:2px solid ${accent};`;
  const vis=S.sectionVis[sec];if(!vis)return'';

  if(sec==='summary'){
    const sum=gv('f_summary');if(!sum)return'';
    return`<div style="${wrapStyle}">
      <div class="cvs-title" style="${barColor}${titleStyle}"><i class="ti ti-align-left" style="margin-right:5px;font-size:11px"></i>Profile</div>
      <p class="cv-sum" style="line-height:${S.lineH}">${sum}</p>
    </div>`;
  }
  if(sec==='experience'){
    if(!S.experience.length)return'';
    return`<div style="${wrapStyle}">
      <div class="cvs-title" style="${barColor}${titleStyle}"><i class="ti ti-briefcase" style="margin-right:5px;font-size:11px"></i>Experience</div>
      ${S.experience.map(e=>`<div class="cv-entry">
        <div class="cv-eh"><div class="cv-et">${e.role||'Role'}</div><div class="cv-ed" style="color:${accent}">${[e.start,e.end].filter(Boolean).join(' – ')}</div></div>
        <div class="cv-es">${e.company||''}</div>
        ${e.desc?`<div class="cv-edesc" style="line-height:${S.lineH}">${fmtDesc(e.desc)}</div>`:''}
      </div>`).join('')}
    </div>`;
  }
  if(sec==='education'){
    if(!S.education.length)return'';
    return`<div style="${wrapStyle}">
      <div class="cvs-title" style="${barColor}${titleStyle}"><i class="ti ti-school" style="margin-right:5px;font-size:11px"></i>Education</div>
      ${S.education.map(e=>`<div class="cv-entry">
        <div class="cv-eh"><div class="cv-et">${e.degree||'Degree'}</div><div class="cv-ed" style="color:${accent}">${[e.start,e.end].filter(Boolean).join(' – ')}</div></div>
        <div class="cv-es">${e.school||''}</div>
        ${e.desc?`<div class="cv-edesc" style="line-height:${S.lineH}">${fmtDesc(e.desc)}</div>`:''}
      </div>`).join('')}
    </div>`;
  }
  if(sec==='certifications'){
    const certs=S.certs.filter(c=>c.name);if(!certs.length)return'';
    return`<div style="${wrapStyle}">
      <div class="cvs-title" style="${barColor}${titleStyle}"><i class="ti ti-certificate" style="margin-right:5px;font-size:11px"></i>Certifications</div>
      ${certs.map(c=>`<div class="cv-entry">
        <div class="cv-eh"><div class="cv-et">${c.name}</div><div class="cv-ed" style="color:${accent}">${c.year||''}</div></div>
        <div class="cv-es">${c.issuer||''}</div>
      </div>`).join('')}
    </div>`;
  }
  if(sec==='skills'){
    if(!S.skills.length)return'';
    const chips=S.skills.map(s=>{
      if(chipStyle==='filled') return`<span class="cv-sk-chip" style="background:${accent};color:#fff">${s}</span>`;
      if(chipStyle==='outline') return`<span class="cv-sk-chip" style="border:1.5px solid ${accent};color:${accent}">${s}</span>`;
      if(chipStyle==='pill') return`<span class="cv-sk-chip" style="background:${accent}22;color:${accent}">${s}</span>`;
      return`<span class="cv-sk-chip" style="background:#f0f0f0;color:#333">${s}</span>`;
    }).join('');
    return`<div style="${wrapStyle}">
      <div class="cvs-title" style="${barColor}${titleStyle}"><i class="ti ti-tools" style="margin-right:5px;font-size:11px"></i>Skills</div>
      <div class="cv-sk">${chips}</div>
    </div>`;
  }
  if(sec==='languages'){
    const langs=S.langs.filter(l=>l.lang);if(!langs.length)return'';
    return`<div style="${wrapStyle}">
      <div class="cvs-title" style="${barColor}${titleStyle}"><i class="ti ti-language" style="margin-right:5px;font-size:11px"></i>Languages</div>
      <div class="cv-sk">${langs.map(l=>`<span class="cv-sk-chip" style="border:1.5px solid ${accent};color:${accent}">${l.lang}<span style="opacity:.6;font-weight:400"> · ${l.level}</span></span>`).join('')}</div>
    </div>`;
  }
  if(sec==='awards'){
    if(!S.awards.filter(a=>a.title).length)return'';
    return`<div style="${wrapStyle}">
      <div class="cvs-title" style="${barColor}${titleStyle}"><i class="ti ti-trophy" style="margin-right:5px;font-size:11px"></i>Awards</div>
      ${S.awards.filter(a=>a.title).map(a=>`<div class="cv-entry">
        <div class="cv-eh"><div class="cv-et">${a.title}</div><div class="cv-ed" style="color:${accent}">${a.year||''}</div></div>
        <div class="cv-es">${a.org||''}</div>
      </div>`).join('')}
    </div>`;
  }
  if(sec==='interests'){
    const ints=gv('f_interests');if(!ints)return'';
    return`<div style="${wrapStyle}">
      <div class="cvs-title" style="${barColor}${titleStyle}"><i class="ti ti-heart" style="margin-right:5px;font-size:11px"></i>Interests</div>
      <div style="font-size:.82em;opacity:.8;line-height:1.6">${ints}</div>
    </div>`;
  }
  return'';
}

// sidebar section (for sidebar-l / sidebar-r layouts)
function renderSidebarSection(sec,accent){
  const vis=S.sectionVis[sec];if(!vis)return'';
  const stitle=`<div style="font-size:.58em;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:rgba(255,255,255,.55);margin-bottom:7px;margin-top:14px">${SEC_LABELS[sec]||sec}</div>`;
  
  if(sec==='skills'){
    if(!S.skills.length)return'';
    return stitle+`<div style="display:flex;flex-wrap:wrap;gap:4px">${S.skills.map(s=>`<span style="background:rgba(255,255,255,.15);color:#fff;font-size:.7em;padding:2px 8px;border-radius:12px">${s}</span>`).join('')}</div>`;
  }
  if(sec==='languages'){
    const langs=S.langs.filter(l=>l.lang);if(!langs.length)return'';
    return stitle+langs.map(l=>`
      <div style="margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;font-size:.76em;color:#fff;margin-bottom:3px"><span>${l.lang}</span><span style="opacity:.6;font-size:.66em">${l.level}</span></div>
        <div style="height:3px;background:rgba(255,255,255,.15);border-radius:2px"><div style="height:100%;border-radius:2px;background:#fff;width:${{Native:100,Fluent:85,Advanced:70,Conversational:55,Intermediate:45,Beginner:30}[l.level]||50}%"></div></div>
      </div>`).join('');
  }
  if(sec==='certifications'){
    const certs=S.certs.filter(c=>c.name);if(!certs.length)return'';
    return stitle+certs.map(c=>`<div style="font-size:.75em;color:rgba(255,255,255,.85);margin-bottom:6px"><div style="font-weight:600;margin-bottom:1px">${c.name}</div><div style="opacity:.6;font-size:.7em">${c.issuer}${c.year?' · '+c.year:''}</div></div>`).join('');
  }
  if(sec==='interests'){
    const ints=gv('f_interests');if(!ints)return'';
    return stitle+`<div style="font-size:.75em;color:rgba(255,255,255,.8);line-height:1.6">${ints}</div>`;
  }
  return'';
}

// ══════════════════════════════════════════════════════════
// LAYOUT RENDERERS
// ══════════════════════════════════════════════════════════
function render(){
  const doc=document.getElementById('cvDoc');
  if(!doc)return;

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

  // Save to active resume in localStorage
  saveActiveResume();

  const a=S.accent,f=`'${S.font}',sans-serif`;
  const gap=S.secGap+'px';
  doc.style.fontSize=`${S.fontSize}%`;
  doc.style.fontFamily=f;
  doc.style.setProperty('--cv-a',a);
  doc.style.setProperty('--cv-f',f);

  const name=gv('f_name')||'Your Name';
  const title=gv('f_title');
  const email=gv('f_email'),phone=gv('f_phone'),city=gv('f_city'),country=gv('f_country');
  const linkedin=gv('f_linkedin'),website=gv('f_website'),github=gv('f_github');
  const loc=[city,country].filter(Boolean).join(', ');
  const photoHTML=S.photo?`<img src="${S.photo}" class="cv-photo" style="width:${S.photoSize}px;height:${S.photoSize}px;border-radius:${S.photoBR}%;cursor:pointer;" onclick="openPhotoPreview(event)">`:'';

  const sideSecs=['skills','languages','certifications','interests'];

  if(S.layout==='classic'){
    const contactLine=[
      contactItem('ti-mail',email,'email'),contactItem('ti-phone',phone,'phone'),
      contactItem('ti-map-pin',loc,'loc'),contactItem('ti-brand-linkedin',linkedin,'url'),
      contactItem('ti-world',website,'url'),contactItem('ti-brand-github',github,'url')
    ].filter(Boolean).join('<span style="opacity:.3;margin:0 4px">|</span>');
    doc.innerHTML=`
    <div style="background:${a};color:#fff;padding:28px 36px 22px">
      <div style="display:flex;gap:18px;align-items:center">
        ${photoHTML?`<div style="flex-shrink:0">${photoHTML}</div>`:''}
        <div>
          <div style="font-family:${f};font-size:1.9em;letter-spacing:-.5px;margin-bottom:3px">${name}</div>
          ${title?`<div style="font-size:.95em;opacity:.78;margin-bottom:10px">${title}</div>`:''}
          <div style="font-size:.75em;display:flex;flex-wrap:wrap;gap:6px;opacity:.85">${contactLine}</div>
        </div>
      </div>
    </div>
    <div style="padding:28px 36px;display:flex;flex-direction:column;gap:${gap}">
      ${S.sectionOrder.map(s=>renderSection(s,{accent:a})).join('')}
    </div>`;
  }
  else if(S.layout==='sidebar-l'||S.layout==='sidebar-r'){
    const isLeft=S.layout==='sidebar-l';
    const sideHTML=`
      <div style="width:220px;flex-shrink:0;background:${a};color:#fff;padding:28px 20px;min-height:1000px">
        ${photoHTML?`<div style="margin-bottom:14px;text-align:center">${photoHTML}</div>`:''}
        <div style="font-family:${f};font-size:1.25em;letter-spacing:-.3px;margin-bottom:3px;color:#fff">${name}</div>
        ${title?`<div style="font-size:.78em;opacity:.72;margin-bottom:14px">${title}</div>`:''}
        <div style="font-size:.7em;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:rgba(255,255,255,.55);margin-bottom:7px">Contact</div>
        ${[
          [email,'ti-mail','email'],[phone,'ti-phone','phone'],[loc,'ti-map-pin','loc'],
          [linkedin,'ti-brand-linkedin','url'],[website,'ti-world','url'],[github,'ti-brand-github','url']
        ].filter(([v])=>v).map(([v,ic,type])=>{
          const content = linkify(v, type);
          return `<div style="font-size:.73em;color:rgba(255,255,255,.82);margin-bottom:5px;display:flex;gap:6px;align-items:flex-start"><i class="ti ${ic}" style="font-size:11px;margin-top:2px;flex-shrink:0"></i><span>${content}</span></div>`;
        }).join('')}
        ${sideSecs.map(s=>renderSidebarSection(s,a)).join('')}
      </div>`;
    const mainHTML=`
      <div style="flex:1;padding:28px 24px;display:flex;flex-direction:column;gap:${gap}">
        ${S.sectionOrder.filter(s=>!sideSecs.includes(s)).map(s=>renderSection(s,{accent:a})).join('')}
      </div>`;
    doc.innerHTML=`<div style="display:flex;min-height:1050px">${isLeft?sideHTML+mainHTML:mainHTML+sideHTML}</div>`;
  }
  else if(S.layout==='minimal'){
    const contacts=[
      contactItem('ti-mail',email,'email'),contactItem('ti-phone',phone,'phone'),
      contactItem('ti-map-pin',loc,'loc'),contactItem('ti-brand-linkedin',linkedin,'url'),
      contactItem('ti-world',website,'url'),contactItem('ti-brand-github',github,'url')
    ].filter(Boolean).join(' &nbsp;·&nbsp; ');
    doc.innerHTML=`
    <div style="padding:36px 40px 24px;border-bottom:1px solid #e8e4dc">
      <div style="display:flex;gap:16px;align-items:center">
        ${photoHTML?`<div style="flex-shrink:0">${photoHTML}</div>`:''}
        <div>
          <div style="font-family:${f};font-size:2.2em;letter-spacing:-1px;color:${a};margin-bottom:3px">${name}</div>
          ${title?`<div style="font-size:.95em;color:#888;margin-bottom:8px">${title}</div>`:''}
          <div style="font-size:.75em;color:#777;display:flex;flex-wrap:wrap;gap:4px">${contacts}</div>
        </div>
      </div>
    </div>
    <div style="padding:28px 40px;display:flex;flex-direction:column;gap:${gap}">
      ${S.sectionOrder.map(s=>renderSection(s,{accent:a,titleStyle:'border-bottom:none;letter-spacing:2.5px;'})).join('')}
    </div>`;
  }
  else if(S.layout==='bold-header'){
    doc.innerHTML=`
    <div style="background:${a};padding:0">
      <div style="padding:36px 36px 28px;color:#fff">
        <div style="display:flex;gap:18px;align-items:flex-end">
          ${photoHTML?`<div style="flex-shrink:0">${photoHTML}</div>`:''}
          <div style="flex:1">
            <div style="font-family:${f};font-size:2.4em;letter-spacing:-.8px;margin-bottom:5px">${name}</div>
            ${title?`<div style="font-size:1em;opacity:.75;margin-bottom:12px;letter-spacing:.5px;text-transform:uppercase;font-size:.82em">${title}</div>`:''}
          </div>
           <div style="text-align:right;font-size:.74em;opacity:.9;line-height:2">${[contactItem('ti-mail',email,'email'),contactItem('ti-phone',phone,'phone'),contactItem('ti-map-pin',loc,'loc'),contactItem('ti-world',website,'url'),contactItem('ti-brand-linkedin',linkedin,'url'),contactItem('ti-brand-github',github,'url')].filter(Boolean).join('<br>')}</div>
        </div>
      </div>
      <div style="background:rgba(0,0,0,.15);height:3px"></div>
    </div>
    <div style="padding:28px 36px;display:flex;flex-direction:column;gap:${gap}">
      ${S.sectionOrder.map(s=>renderSection(s,{accent:a,chipStyle:'pill'})).join('')}
    </div>`;
  }
  else if(S.layout==='timeline'){
    const contacts=[contactItem('ti-mail',email,'email'),contactItem('ti-phone',phone,'phone'),contactItem('ti-map-pin',loc,'loc'),contactItem('ti-world',website,'url')].filter(Boolean).join('<span style="opacity:.3;margin:0 4px">|</span>');
    doc.innerHTML=`
    <div style="background:${a};padding:24px 36px;color:#fff;display:flex;align-items:center;gap:16px">
      ${photoHTML?`<div style="flex-shrink:0">${photoHTML}</div>`:''}
      <div>
        <div style="font-family:${f};font-size:1.8em;letter-spacing:-.4px">${name}</div>
        ${title?`<div style="opacity:.75;font-size:.88em;margin-top:2px">${title}</div>`:''}
        <div style="font-size:.73em;opacity:.8;margin-top:8px;display:flex;flex-wrap:wrap;gap:5px">${contacts}</div>
      </div>
    </div>
    <div style="padding:28px 36px;display:grid;grid-template-columns:1fr 1fr;gap:24px">
      <div style="display:flex;flex-direction:column;gap:${gap}">
        ${S.sectionOrder.filter((_,i)=>i%2===0).map(s=>renderSection(s,{accent:a})).join('')}
      </div>
      <div style="border-left:2px solid ${a}22;padding-left:24px;display:flex;flex-direction:column;gap:${gap}">
        ${S.sectionOrder.filter((_,i)=>i%2===1).map(s=>renderSection(s,{accent:a})).join('')}
      </div>
    </div>`;
  }
  else if(S.layout==='compact'){
    const contacts=[email,phone,loc,website,linkedin].filter(Boolean).join('  ·  ');
    doc.innerHTML=`
    <div style="background:${a};height:6px"></div>
    <div style="padding:20px 32px 14px;border-bottom:1px solid #eee">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
        <div style="display:flex;gap:12px;align-items:center">
          ${photoHTML?`<div style="flex-shrink:0">${photoHTML}</div>`:''}
          <div>
            <div style="font-family:${f};font-size:1.65em;color:${a};letter-spacing:-.4px">${name}</div>
            ${title?`<div style="font-size:.85em;color:#777;margin-top:2px">${title}</div>`:''}
          </div>
        </div>
        <div style="text-align:right;font-size:.72em;color:#666;line-height:1.9">${[linkify(email,'email'),linkify(phone,'phone'),loc,linkify(linkedin,'url')].filter(Boolean).join('<br>')}</div>
      </div>
    </div>
    <div style="padding:16px 32px;display:grid;grid-template-columns:1fr 1fr;gap:16px ${gap}">
      ${S.sectionOrder.map(s=>renderSection(s,{accent:a,wrapStyle:'',chipStyle:'outline'})).join('')}
    </div>`;
  }
  else if(S.layout==='modern-split'){
    doc.innerHTML=`
    <div style="display:flex;min-height:1050px">
      <div style="width:12px;background:${a}"></div>
      <div style="flex:1">
        <div style="padding:28px 28px 18px;background:#fafaf8;border-bottom:1px solid #eee">
          <div style="display:flex;gap:14px;align-items:center">
            ${photoHTML?`<div style="flex-shrink:0">${photoHTML}</div>`:''}
            <div>
              <div style="font-family:${f};font-size:1.85em;color:${a};letter-spacing:-.5px">${name}</div>
              ${title?`<div style="font-size:.88em;color:#888;margin-top:2px">${title}</div>`:''}
              <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:8px;font-size:.74em;color:#666">
                ${[contactItem('ti-mail',email,'email'),contactItem('ti-phone',phone,'phone'),contactItem('ti-map-pin',loc,'loc'),contactItem('ti-world',website,'url'),contactItem('ti-brand-linkedin',linkedin,'url')].filter(Boolean).join('')}
              </div>
            </div>
          </div>
        </div>
        <div style="padding:22px 28px;display:flex;flex-direction:column;gap:${gap}">
          ${S.sectionOrder.map(s=>renderSection(s,{accent:a,chipStyle:'pill'})).join('')}
        </div>
      </div>
      <div style="width:12px;background:${a};opacity:.2"></div>
    </div>`;
  }
  else if(S.layout==='elegant'){
    const contacts=[contactItem('ti-mail',email,'email'),contactItem('ti-phone',phone,'phone'),contactItem('ti-map-pin',loc,'loc'),contactItem('ti-world',website,'url')].filter(Boolean).join('&ensp;');
    doc.innerHTML=`
    <div style="height:4px;background:${a}"></div>
    <div style="padding:36px 44px 28px;text-align:center;border-bottom:1px solid #eee">
      ${photoHTML?`<div style="display:flex;justify-content:center;margin-bottom:12px">${photoHTML}</div>`:''}
      <div style="font-family:${f};font-size:2.2em;letter-spacing:-.5px;color:${a}">${name}</div>
      ${title?`<div style="font-size:.9em;color:#888;margin:5px 0 12px;letter-spacing:2px;text-transform:uppercase;font-size:.75em">${title}</div>`:''}
      <div style="font-size:.75em;color:#777;display:flex;flex-wrap:wrap;gap:6px;justify-content:center">${contacts}</div>
    </div>
    <div style="padding:28px 44px;display:flex;flex-direction:column;gap:${gap}">
      ${S.sectionOrder.map(s=>renderSection(s,{accent:a,titleStyle:'text-align:center;border-bottom:none;border-top:1px solid #e8e4dc;padding-top:16px;'})).join('')}
    </div>
    <div style="height:2px;background:${a};opacity:.25;margin:0 44px 20px"></div>`;
  }
  else if(S.layout==='creative'){
    doc.innerHTML=`
    <div style="background:${a};padding:32px 36px;color:#fff;clip-path:polygon(0 0,100% 0,100% 78%,0 100%);padding-bottom:50px">
      <div style="display:flex;gap:16px;align-items:center">
        ${photoHTML?`<div style="flex-shrink:0">${photoHTML}</div>`:''}
        <div>
          <div style="font-family:${f};font-size:2em;letter-spacing:-.5px">${name}</div>
          ${title?`<div style="opacity:.75;font-size:.88em;margin-top:4px">${title}</div>`:''}
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;font-size:.73em;opacity:.85">
            ${[contactItem('ti-mail',email,'email'),contactItem('ti-phone',phone,'phone'),contactItem('ti-map-pin',loc,'loc'),contactItem('ti-world',website,'url')].filter(Boolean).join('')}
          </div>
        </div>
      </div>
    </div>
    <div style="padding:0 36px 28px;margin-top:-12px;display:flex;flex-direction:column;gap:${gap}">
      ${S.sectionOrder.map(s=>renderSection(s,{accent:a,chipStyle:'filled'})).join('')}
    </div>`;
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

// ══════════════════════════════════════════════════════════
// MOBILE & DOWNLOAD
// ══════════════════════════════════════════════════════════
const mobToggle = document.getElementById('mobToggle');
if(mobToggle) {
  mobToggle.onclick=()=>{
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
    if(sidebar.classList.contains('open')) {
      mobToggle.innerHTML = '<i class="ti ti-eye"></i> Preview';
    } else {
      mobToggle.innerHTML = '<i class="ti ti-edit"></i> Edit';
    }
  };
}
function closeSidebar(){
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('open');
  const mobToggle = document.getElementById('mobToggle');
  if(mobToggle) {
    mobToggle.innerHTML = '<i class="ti ti-edit"></i> Edit';
  }
}

function doDownload(){
  openDownloadModal();
}
function openDownloadModal() {
  const modal = document.getElementById('downloadModal');
  const input = document.getElementById('pdfFileNameInput');
  if (modal && input) {
    const active = resumes.find(r => r.id === activeResumeId);
    const defaultName = active ? active.name.replace(/\s+/g, '_') : 'My_Resume';
    input.value = defaultName;
    modal.style.display = 'flex';
  }
}
function closeDownloadModal() {
  const modal = document.getElementById('downloadModal');
  if (modal) modal.style.display = 'none';
}
async function generateAndSavePDF() {
  const input = document.getElementById('pdfFileNameInput');
  if (!input) return;

  const fileName = input.value.trim() || 'My_Resume';
  const element = document.getElementById('cvDoc');
  if (!element) return;

  const downloadBtn = document.getElementById('downloadConfirmBtn');
  const origContent = downloadBtn.innerHTML;
  downloadBtn.disabled = true;
  downloadBtn.innerHTML = '<i class="ti ti-loader" style="animation: spin 1s linear infinite; display: inline-block;"></i> Generating...';

  // Add styles for spin animation if not present
  if (!document.getElementById('spinStyle')) {
    const style = document.createElement('style');
    style.id = 'spinStyle';
    style.textContent = '@keyframes spin { 100% { transform: rotate(360deg); } }';
    document.head.appendChild(style);
  }

  // html2pdf options
  const opt = {
    margin: 0,
    filename: fileName + '.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2.5, // high print quality
      useCORS: true,
      logging: false
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  try {
    if (window.showSaveFilePicker) {
      const pdfBlob = await html2pdf().set(opt).from(element).output('blob');
      
      const handle = await window.showSaveFilePicker({
        suggestedName: fileName + '.pdf',
        types: [{
          description: 'PDF Document',
          accept: { 'application/pdf': ['.pdf'] }
        }]
      });
      
      const writable = await handle.createWritable();
      await writable.write(pdfBlob);
      await writable.close();
      showToast('PDF Saved Successfully!');
    } else {
      await html2pdf().set(opt).from(element).save();
      showToast('PDF Download Started!');
    }
  } catch (err) {
    console.error(err);
    if (err.name !== 'AbortError') {
      showToast('Error generating PDF.');
    }
  } finally {
    downloadBtn.disabled = false;
    downloadBtn.innerHTML = origContent;
    closeDownloadModal();
  }
}
function showToast(msg){
  const t=document.getElementById('toast');
  if(!t)return;
  t.textContent=msg;t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3200);
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
    modal.style.display = 'flex';

    const cleanUp = () => {
      modal.style.display = 'none';
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

  // If no resumes exist, initialize one (migrating legacy work if it exists)
  if (resumes.length === 0) {
    let legacyData = null;
    try {
      const legacySaved = localStorage.getItem('resume_state');
      if (legacySaved) legacyData = JSON.parse(legacySaved);
    } catch(e){}
    
    const initialData = legacyData || JSON.parse(JSON.stringify(DEFAULT_BLANK_RESUME));
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
  Object.assign(S, JSON.parse(JSON.stringify(DEFAULT_BLANK_RESUME)), data);
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
  const rolePanel = document.getElementById('smart-role-panel');
  if (rolePanel) {
    rolePanel.style.display = 'none';
  }
}

function saveActiveResume() {
  const active = resumes.find(r => r.id === activeResumeId);
  if (active) {
    active.data = JSON.parse(JSON.stringify(S));
    localStorage.setItem('resumes', JSON.stringify(resumes));
  }
}

function toggleResumesMenu(e) {
  if (e) e.stopPropagation();
  const dropdown = document.getElementById('resumesDropdown');
  if (dropdown) {
    dropdown.classList.toggle('open');
  }
}

function renderResumesList() {
  const list = document.getElementById('resumesList');
  if (!list) return;

  list.innerHTML = resumes.map(r => {
    const isActive = r.id === activeResumeId;
    return `
      <div class="resume-item ${isActive ? 'active' : ''}" onclick="switchResume('${r.id}')" data-id="${r.id}">
        <span class="resume-item-name" id="name-lbl-${r.id}">${esc(r.name)}</span>
        <div class="resume-item-actions">
          <button class="resume-item-btn" onclick="duplicateResume('${r.id}', event)" title="Duplicate"><i class="ti ti-copy"></i></button>
          <button class="resume-item-btn" onclick="startRename('${r.id}', event)" title="Rename"><i class="ti ti-pencil"></i></button>
          <button class="resume-item-btn btn-delete" onclick="deleteResume('${r.id}', event)" title="Delete"><i class="ti ti-trash"></i></button>
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
    loadState(active.data);
    loadResumeIntoDOM();
    render();
    setTimeout(zoomFit, 100);
  }
  
  renderResumesList();
  
  const dropdown = document.getElementById('resumesDropdown');
  if (dropdown) dropdown.classList.remove('open');
}

function createNewResume(e) {
  if (e) e.stopPropagation();
  
  const newResume = {
    id: 'res-' + Date.now(),
    name: 'Untitled Resume',
    data: JSON.parse(JSON.stringify(DEFAULT_BLANK_RESUME))
  };
  
  resumes.push(newResume);
  activeResumeId = newResume.id;
  
  localStorage.setItem('resumes', JSON.stringify(resumes));
  localStorage.setItem('activeResumeId', activeResumeId);
  
  loadState(newResume.data);
  loadResumeIntoDOM();
  render();
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
    render();
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
  
  loadState(JSON.parse(JSON.stringify(DEFAULT_SAMPLE_RESUME)));
  loadResumeIntoDOM();
  render();
  
  const dropdown = document.getElementById('resumesDropdown');
  if (dropdown) dropdown.classList.remove('open');
}

function duplicateResume(id, e) {
  if (e) e.stopPropagation();
  const target = resumes.find(r => r.id === id);
  if (!target) return;

  const duplicated = {
    id: 'res-' + Date.now(),
    name: target.name + ' Copy',
    data: JSON.parse(JSON.stringify(target.data))
  };

  resumes.push(duplicated);
  activeResumeId = duplicated.id;

  localStorage.setItem('resumes', JSON.stringify(resumes));
  localStorage.setItem('activeResumeId', activeResumeId);

  loadState(duplicated.data);
  loadResumeIntoDOM();
  render();
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
  
  const dropdown = document.getElementById('resumesDropdown');
  if (dropdown) dropdown.classList.remove('open');
}

function mapExternalResumeData(obj) {
  let src = obj;
  if (obj && obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)) {
    src = obj.data;
  }

  const result = JSON.parse(JSON.stringify(DEFAULT_BLANK_RESUME));

  const findVal = (keys, sourceObj = src) => {
    if (!sourceObj || typeof sourceObj !== 'object') return undefined;
    for (const key of keys) {
      if (key in sourceObj && sourceObj[key] !== undefined && sourceObj[key] !== null) {
        return sourceObj[key];
      }
      const lowerKey = key.toLowerCase();
      const actualKey = Object.keys(sourceObj).find(k => k.toLowerCase() === lowerKey);
      if (actualKey && sourceObj[actualKey] !== undefined && sourceObj[actualKey] !== null) {
        return sourceObj[actualKey];
      }
    }
    return undefined;
  };

  result.f_name = findVal(['f_name', 'name', 'fullName', 'name_label', 'username']) || '';
  result.f_title = findVal(['f_title', 'title', 'label', 'jobTitle', 'designation']) || '';
  result.f_summary = findVal(['f_summary', 'summary', 'about', 'objective', 'bio', 'description']) || '';
  result.f_email = findVal(['f_email', 'email', 'mail']) || '';
  result.f_phone = findVal(['f_phone', 'phone', 'contact', 'telephone']) || '';
  result.f_city = findVal(['f_city', 'city']) || '';
  result.f_country = findVal(['f_country', 'country', 'region']) || '';
  result.f_linkedin = findVal(['f_linkedin', 'linkedin', 'linkedInUrl']) || '';
  result.f_website = findVal(['f_website', 'website', 'url', 'portfolio']) || '';
  result.f_github = findVal(['f_github', 'github', 'githubUrl']) || '';

  const loc = findVal(['location'], src);
  if (loc && typeof loc === 'object') {
    if (!result.f_city) result.f_city = findVal(['city'], loc) || '';
    if (!result.f_country) result.f_country = findVal(['country', 'countryCode', 'region'], loc) || '';
  }

  const basics = findVal(['basics'], src);
  if (basics && typeof basics === 'object') {
    if (!result.f_name) result.f_name = findVal(['name', 'fullName'], basics) || '';
    if (!result.f_title) result.f_title = findVal(['label', 'title', 'jobTitle'], basics) || '';
    if (!result.f_summary) result.f_summary = findVal(['summary', 'about', 'bio'], basics) || '';
    if (!result.f_email) result.f_email = findVal(['email'], basics) || '';
    if (!result.f_phone) result.f_phone = findVal(['phone'], basics) || '';
    if (!result.f_website) result.f_website = findVal(['url', 'website'], basics) || '';
    
    const profiles = findVal(['profiles'], basics);
    if (Array.isArray(profiles)) {
      profiles.forEach(p => {
        const net = findVal(['network'], p);
        const url = findVal(['url'], p);
        if (net && url) {
          const nl = net.toLowerCase();
          if (nl.includes('linkedin')) result.f_linkedin = url;
          else if (nl.includes('github')) result.f_github = url;
          else if (nl.includes('portfolio') || nl.includes('website')) result.f_website = url;
        }
      });
    }
  }

  const rawSkills = findVal(['skills', 'skill']);
  if (Array.isArray(rawSkills)) {
    result.skills = rawSkills.map(s => {
      if (typeof s === 'string') return s;
      if (s && typeof s === 'object') {
        const name = findVal(['name'], s);
        const keywords = findVal(['keywords'], s);
        if (keywords && Array.isArray(keywords)) {
          return [name, ...keywords].filter(Boolean).join(', ');
        }
        return name || '';
      }
      return '';
    }).filter(Boolean);
  }

  const rawLangs = findVal(['langs', 'languages', 'language']);
  if (Array.isArray(rawLangs)) {
    result.langs = rawLangs.map(l => {
      if (typeof l === 'string') return { lang: l, level: 'Fluent' };
      if (l && typeof l === 'object') {
        return {
          lang: findVal(['lang', 'language', 'name'], l) || '',
          level: findVal(['level', 'fluency', 'proficiency'], l) || 'Fluent'
        };
      }
      return null;
    }).filter(l => l && l.lang);
  }

  const rawWork = findVal(['experience', 'work', 'history', 'employment']);
  if (Array.isArray(rawWork)) {
    result.experience = rawWork.map(w => {
      if (!w || typeof w !== 'object') return null;
      let descVal = findVal(['desc', 'description', 'summary', 'highlights'], w) || '';
      if (Array.isArray(descVal)) {
        descVal = descVal.map(h => h.startsWith('•') || h.startsWith('-') ? h : `• ${h}`).join('\n');
      }
      return {
        company: findVal(['company', 'name', 'employer', 'organization'], w) || '',
        role: findVal(['role', 'position', 'title', 'jobTitle'], w) || '',
        start: findVal(['start', 'startDate', 'from'], w) || '',
        end: findVal(['end', 'endDate', 'to'], w) || '',
        desc: descVal
      };
    }).filter(w => w && (w.company || w.role));
  }

  const rawEdu = findVal(['education', 'edu', 'academic']);
  if (Array.isArray(rawEdu)) {
    result.education = rawEdu.map(e => {
      if (!e || typeof e !== 'object') return null;
      let descVal = findVal(['desc', 'description', 'summary', 'courses'], e) || '';
      if (Array.isArray(descVal)) {
        descVal = descVal.join('\n');
      }
      return {
        school: findVal(['school', 'institution', 'university', 'college'], e) || '',
        degree: findVal(['degree', 'qualification', 'studyType', 'major'], e) || '',
        start: findVal(['start', 'startDate', 'from'], e) || '',
        end: findVal(['end', 'endDate', 'to'], e) || '',
        desc: descVal
      };
    }).filter(e => e && (e.school || e.degree));
  }

  const rawCerts = findVal(['certs', 'certifications', 'certificates', 'credentials']);
  if (Array.isArray(rawCerts)) {
    result.certs = rawCerts.map(c => {
      if (typeof c === 'string') return { name: c, issuer: '', year: '' };
      if (c && typeof c === 'object') {
        return {
          name: findVal(['name', 'title'], c) || '',
          issuer: findVal(['issuer', 'institution', 'authority'], c) || '',
          year: findVal(['year', 'date'], c) || ''
        };
      }
      return null;
    }).filter(c => c && c.name);
  }

  const rawAwards = findVal(['awards', 'honors']);
  if (Array.isArray(rawAwards)) {
    result.awards = rawAwards.map(a => {
      if (typeof a === 'string') return { title: a, org: '', year: '' };
      if (a && typeof a === 'object') {
        return {
          title: findVal(['title', 'name'], a) || '',
          org: findVal(['org', 'awarder', 'issuer', 'organization'], a) || '',
          year: findVal(['year', 'date'], a) || ''
        };
      }
      return null;
    }).filter(a => a && a.title);
  }

  const rawInts = findVal(['interests', 'hobbies']);
  if (Array.isArray(rawInts)) {
    result.interests = rawInts.map(i => {
      if (typeof i === 'string') return i;
      if (i && typeof i === 'object') {
        return findVal(['name'], i) || '';
      }
      return '';
    }).filter(Boolean);
  } else if (typeof rawInts === 'string') {
    result.interests = rawInts.split(',').map(i => i.trim()).filter(Boolean);
  }

  const styleKeys = ['accent', 'layout', 'font', 'fontSize', 'lineH', 'secGap', 'photo', 'photoSize', 'photoBR'];
  styleKeys.forEach(k => {
    if (k in src && src[k] !== undefined && src[k] !== null) {
      result[k] = src[k];
    }
  });

  return result;
}

function handleImportProject(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
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
      render();
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
    active.data = JSON.parse(JSON.stringify(DEFAULT_BLANK_RESUME));
    localStorage.setItem('resumes', JSON.stringify(resumes));
    loadState(active.data);
    loadResumeIntoDOM();
    render();
    showToast('Resume Wiped to Blank!');
  }
  
  const dropdown = document.getElementById('resumesDropdown');
  if (dropdown) dropdown.classList.remove('open');
}

function generateShareLink(e) {
  if (e) e.stopPropagation();
  const active = resumes.find(r => r.id === activeResumeId);
  if (!active) return;

  try {
    // Clone the state and remove the base64 photo to keep URL length under browser limits
    const sharedData = JSON.parse(JSON.stringify(active.data));
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

  const dropdown = document.getElementById('resumesDropdown');
  if (dropdown) dropdown.classList.remove('open');
}

function checkUrlShareParam() {
  const urlParams = new URLSearchParams(window.location.search);
  const shareData = urlParams.get('share');
  if (!shareData) return;

  try {
    const decodedStr = decodeURIComponent(escape(atob(shareData)));
    const resumeData = JSON.parse(decodedStr);
    
    if (resumeData && typeof resumeData === 'object') {
      const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.replaceState({ path: cleanUrl }, '', cleanUrl);

      const sharedResume = {
        id: 'res-shared-' + Date.now(),
        name: 'Shared Resume',
        data: resumeData
      };
      
      resumes.push(sharedResume);
      activeResumeId = sharedResume.id;
      
      localStorage.setItem('resumes', JSON.stringify(resumes));
      localStorage.setItem('activeResumeId', activeResumeId);
      
      loadState(sharedResume.data);
      loadResumeIntoDOM();
      render();
      renderResumesList();
      showToast('Shared Resume Loaded Successfully!');
    }
  } catch (err) {
    console.error('Failed to parse share URL data:', err);
    showToast('Invalid or expired share link.');
  }
}

// ══════════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════════
function init(){
  initResumes();
  checkUrlShareParam();
  buildStepBar();
  setTimeout(zoomFit, 200);
}

window.addEventListener('resize',()=>setTimeout(zoomFit,100));
init();
