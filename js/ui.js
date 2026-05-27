// ══════════════════════════════════════════════════════════
// COLOR / LAYOUT / FONT WIDGET BUILDERS
// ══════════════════════════════════════════════════════════
function buildColorGrid(){
  document.getElementById('colorGrid').innerHTML=COLORS.map(c=>`
    <div class="c-swatch ${c===S.accent?'active':''}" style="background:${c}" onclick="setAccent('${c}',this)" title="${c}"></div>`).join('');
}
function setAccent(c,el){
  S.accent=c;
  document.querySelectorAll('.c-swatch').forEach(s=>s.classList.remove('active'));
  if(el)el.classList.add('active');
  const preview = document.getElementById('customColorPreview');
  if(preview) preview.style.background = c;
  buildLayoutGrid();
  renderImmediate();
}
function setCustomColor(v){
  if(/^#[0-9a-fA-F]{6}$/.test(v)){setAccent(v,null);}
}

function buildLayoutGrid(){
  document.getElementById('layoutGrid').innerHTML=LAYOUTS.map(l=>`
    <div class="layout-opt ${l.id===S.layout?'active':''}" onclick="setLayout('${l.id}',this)" title="${l.name}">
      <div class="lt">${layoutThumb(l.id)}</div>
      <div class="ln">${l.name}</div>
    </div>`).join('');
}
function layoutThumb(id){
  const c=S.accent;
  const thumbs={
    'classic':`<div style="position:absolute;top:0;left:0;right:0;height:14px;background:${c}"></div><div style="position:absolute;top:16px;left:4px;right:4px;height:2px;background:#ddd"></div><div style="position:absolute;top:21px;left:4px;right:4px;height:1px;background:#eee"></div><div style="position:absolute;top:25px;left:4px;right:4px;height:1px;background:#eee"></div>`,
    'sidebar-l':`<div style="position:absolute;top:0;left:0;bottom:0;width:14px;background:${c}"></div><div style="position:absolute;top:4px;left:18px;right:4px;height:2px;background:#ddd"></div><div style="position:absolute;top:10px;left:18px;right:4px;height:1px;background:#eee"></div><div style="position:absolute;top:14px;left:18px;right:4px;height:1px;background:#eee"></div>`,
    'minimal':`<div style="position:absolute;top:6px;left:4px;right:4px;height:3px;background:${c};border-radius:1px"></div><div style="position:absolute;top:12px;left:4px;right:4px;height:1px;background:#e0e0e0"></div><div style="position:absolute;top:16px;left:4px;right:4px;height:1px;background:#eee"></div><div style="position:absolute;top:20px;left:4px;right:4px;height:1px;background:#eee"></div>`,
    'modern-split':`<div style="position:absolute;top:0;left:0;bottom:0;width:18px;background:${c}"></div><div style="position:absolute;top:0;right:0;bottom:0;width:18px;background:${c};opacity:.2"></div><div style="position:absolute;top:8px;left:22px;right:22px;height:2px;background:#ddd"></div><div style="position:absolute;top:14px;left:22px;right:22px;height:1px;background:#eee"></div>`,
    'elegant':`<div style="position:absolute;top:0;left:0;right:0;height:3px;background:${c}"></div><div style="position:absolute;bottom:0;left:0;right:0;height:2px;background:${c};opacity:.3"></div><div style="position:absolute;top:8px;left:4px;right:4px;height:2px;background:#ddd"></div><div style="position:absolute;top:14px;left:4px;right:4px;height:1px;background:#eee"></div>`,
  };
  return thumbs[id]||'';
}
function setLayout(id,el){
  S.layout=id;
  document.querySelectorAll('.layout-opt').forEach(o=>o.classList.remove('active'));
  if(el)el.classList.add('active');
  // rebuild thumbs with new color
  buildLayoutGrid();
  document.querySelectorAll('.layout-opt').forEach(o=>{
    if(o.dataset&&o.onclick&&o.getAttribute('onclick')&&o.getAttribute('onclick').includes(id))o.classList.add('active');
  });
  document.querySelector(`.layout-opt[onclick*="${id}"]`)?.classList.add('active');
  renderImmediate();
}

function buildFontGrid(){
  document.getElementById('fontGrid').innerHTML=FONTS.map(f=>`
    <div class="font-opt ${f.id===S.font?'active':''}" onclick="setFont('${f.id}',this)">
      <div class="fo-preview" style="font-family:'${f.id}'">${f.preview}</div>
      <div class="fo-name">${f.label}</div>
    </div>`).join('');
}
function setFont(id,el){
  S.font=id;
  document.querySelectorAll('.font-opt').forEach(o=>o.classList.remove('active'));
  if(el)el.classList.add('active');
  renderImmediate();
}

function setFontSize(v){S.fontSize=+v;document.getElementById('fontSizeV').textContent=v+'%';renderImmediate();}
function setLineH(v){S.lineH=+v/100;document.getElementById('lineHV').textContent=(+v/100).toFixed(2);renderImmediate();}
function setSecGap(v){S.secGap=+v;document.getElementById('secGapV').textContent=v+'px';renderImmediate();}

// ══════════════════════════════════════════════════════════
// REORDER / VISIBILITY
// ══════════════════════════════════════════════════════════
function buildReorderList(){
  const list=document.getElementById('reorderList');
  if(!list)return;
  list.innerHTML=S.sectionOrder.map((sec,i)=>`
    <div class="reorder-item" draggable="true" data-sec="${sec}" data-idx="${i}">
      <i class="ti ti-grip-vertical ri-handle"></i>
      <i class="ti ${SEC_ICONS[sec]||'ti-circle'}"></i>
      <span>${SEC_LABELS[sec]||sec}</span>
      <i class="ti ${S.sectionVis[sec]?'ti-eye':'ti-eye-off'} ri-vis ${S.sectionVis[sec]?'':'off'}" onclick="toggleVis('${sec}',this)"></i>
    </div>`).join('');
  
  list.querySelectorAll('.reorder-item').forEach(item=>{
    item.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/plain',item.dataset.idx);item.style.opacity='.5';});
    item.addEventListener('dragend',()=>{item.style.opacity='1';list.querySelectorAll('.reorder-item').forEach(i=>i.classList.remove('drag-over'));});
    item.addEventListener('dragover',e=>{e.preventDefault();item.classList.add('drag-over');});
    item.addEventListener('dragleave',()=>item.classList.remove('drag-over'));
    item.addEventListener('drop',e=>{
      e.preventDefault();
      const from=+e.dataTransfer.getData('text/plain');
      const to=+item.dataset.idx;
      if(from===to)return;
      const arr=S.sectionOrder;
      const moved=arr.splice(from,1)[0];
      arr.splice(to,0,moved);
      buildReorderList(); renderImmediate();
    });
  });
}

function toggleVis(sec,el){
  S.sectionVis[sec]=!S.sectionVis[sec];
  el.classList.toggle('ti-eye',S.sectionVis[sec]);
  el.classList.toggle('ti-eye-off',!S.sectionVis[sec]);
  el.classList.toggle('off',!S.sectionVis[sec]);
  renderImmediate();
}

// ══════════════════════════════════════════════════════════
// DYNAMIC ENTRY CARD BUILDERS (LISTS)
// ══════════════════════════════════════════════════════════
function buildEntries(){
  const expList = document.getElementById('exp-list');
  if(expList) {
    expList.innerHTML=S.experience.map((e,i)=>`
      <div class="entry-card">
        <div class="ec-hdr"><div class="ec-title"><i class="ti ti-briefcase"></i>Experience ${i+1}</div>
          <div class="ec-actions"><button class="ic-btn del" onclick="removeEntry('exp',${i})" title="Remove"><i class="ti ti-trash"></i></button></div>
        </div>
        <div class="form-group"><input type="text" placeholder="Company" aria-label="Experience ${i+1} Company" value="${esc(e.company)}" oninput="S.experience[${i}].company=this.value;render()"></div>
        <div class="form-group"><input type="text" placeholder="Job Title" aria-label="Experience ${i+1} Job Title" value="${esc(e.role)}" oninput="S.experience[${i}].role=this.value;render()"></div>
        <div class="two-col">
          <div class="form-group"><input type="text" placeholder="Start" aria-label="Experience ${i+1} Start Date" value="${esc(e.start)}" oninput="S.experience[${i}].start=this.value;render()"></div>
          <div class="form-group"><input type="text" placeholder="End / Present" aria-label="Experience ${i+1} End Date" value="${esc(e.end)}" oninput="S.experience[${i}].end=this.value;render()"></div>
        </div>
        <div class="form-group" style="position:relative">
          <textarea id="exp-desc-${i}" placeholder="• Bullet points (one per line)…" aria-label="Experience ${i+1} Description" oninput="S.experience[${i}].desc=this.value;render()">${esc(e.desc)}</textarea>
          <div style="display:flex; justify-content:flex-end; margin-top:4.5px">
            <button class="btn btn-outline btn-sm" style="padding: 3.5px 7.5px; font-size: 0.72rem; display: flex; align-items: center; gap: 4.5px; border-radius: 6px; border-color: rgba(255,255,255,0.08); background: rgba(255,255,255,0.02);" onclick="enhanceBulletPoint(${i}, event)">
              <i class="ti ti-sparkles" style="font-size: 11px; color: var(--accent);"></i> Enhance Bullets
            </button>
          </div>
        </div>
      </div>`).join('');
  }

  const eduList = document.getElementById('edu-list');
  if(eduList) {
    eduList.innerHTML=S.education.map((e,i)=>`
      <div class="entry-card">
        <div class="ec-hdr"><div class="ec-title"><i class="ti ti-school"></i>Education ${i+1}</div>
          <div class="ec-actions"><button class="ic-btn del" onclick="removeEntry('edu',${i})" title="Remove"><i class="ti ti-trash"></i></button></div>
        </div>
        <div class="form-group"><input type="text" placeholder="School / University" aria-label="Education ${i+1} School / University" value="${esc(e.school)}" oninput="S.education[${i}].school=this.value;render()"></div>
        <div class="form-group"><input type="text" placeholder="Degree / Field of Study" aria-label="Education ${i+1} Degree / Field of Study" value="${esc(e.degree)}" oninput="S.education[${i}].degree=this.value;render()"></div>
        <div class="two-col">
          <div class="form-group"><input type="text" placeholder="Start" aria-label="Education ${i+1} Start Date" value="${esc(e.start)}" oninput="S.education[${i}].start=this.value;render()"></div>
          <div class="form-group"><input type="text" placeholder="End" aria-label="Education ${i+1} End Date" value="${esc(e.end)}" oninput="S.education[${i}].end=this.value;render()"></div>
        </div>
        <div class="form-group"><textarea placeholder="Description (optional)…" aria-label="Education ${i+1} Description" oninput="S.education[${i}].desc=this.value;render()">${esc(e.desc)}</textarea></div>
      </div>`).join('');
  }

  const certList = document.getElementById('cert-list');
  if(certList) {
    certList.innerHTML=S.certs.map((c,i)=>`
      <div class="entry-card">
        <div class="ec-hdr"><div class="ec-title"><i class="ti ti-certificate"></i>Cert ${i+1}</div>
          <div class="ec-actions"><button class="ic-btn del" onclick="removeEntry('cert',${i})" title="Remove"><i class="ti ti-trash"></i></button></div>
        </div>
        <div class="form-group"><input type="text" placeholder="Certificate Name" aria-label="Certification ${i+1} Name" value="${esc(c.name)}" oninput="S.certs[${i}].name=this.value;render()"></div>
        <div class="two-col">
          <div class="form-group"><input type="text" placeholder="Issuer" aria-label="Certification ${i+1} Issuer" value="${esc(c.issuer)}" oninput="S.certs[${i}].issuer=this.value;render()"></div>
          <div class="form-group"><input type="text" placeholder="Year" aria-label="Certification ${i+1} Year" value="${esc(c.year)}" oninput="S.certs[${i}].year=this.value;render()"></div>
        </div>
      </div>`).join('');
  }

  const awardList = document.getElementById('award-list');
  if(awardList) {
    awardList.innerHTML=S.awards.map((a,i)=>`
      <div class="entry-card">
        <div class="ec-hdr"><div class="ec-title"><i class="ti ti-trophy"></i>Award ${i+1}</div>
          <div class="ec-actions"><button class="ic-btn del" onclick="removeEntry('award',${i})" title="Remove"><i class="ti ti-trash"></i></button></div>
        </div>
        <div class="form-group"><input type="text" placeholder="Award / Achievement" aria-label="Award ${i+1} Name" value="${esc(a.title)}" oninput="S.awards[${i}].title=this.value;render()"></div>
        <div class="two-col">
          <div class="form-group"><input type="text" placeholder="Organization" aria-label="Award ${i+1} Organization" value="${esc(a.org)}" oninput="S.awards[${i}].org=this.value;render()"></div>
          <div class="form-group"><input type="text" placeholder="Year" aria-label="Award ${i+1} Year" value="${esc(a.year)}" oninput="S.awards[${i}].year=this.value;render()"></div>
        </div>
      </div>`).join('');
  }
}

function buildSkillTags(){
  const area=document.getElementById('skills-area');
  const input=document.getElementById('skill-input');
  if(!area||!input)return;
  area.querySelectorAll('.s-tag').forEach(t=>t.remove());
  S.skills.forEach((s,i)=>{
    const tag=document.createElement('div');
    tag.className='s-tag';
    tag.innerHTML=`${esc(s)}<span class="rx" onclick="S.skills.splice(${i},1);buildSkillTags();renderImmediate()">×</span>`;
    area.insertBefore(tag,input);
  });
}

function buildLangs(){
  const levels=['Native','Fluent','Advanced','Conversational','Intermediate','Beginner'];
  const langList = document.getElementById('lang-list');
  if(!langList)return;
  langList.innerHTML=S.langs.map((l,i)=>`
    <div class="entry-card" style="padding:9px">
      <div class="two-col" style="margin-bottom:5px">
        <input type="text" placeholder="Language" aria-label="Language ${i+1} Name" value="${esc(l.lang)}" oninput="S.langs[${i}].lang=this.value;render()">
        <div class="custom-select-container">
          <button type="button" class="custom-select-trigger" aria-haspopup="listbox" aria-expanded="false" aria-label="Language ${i+1} Proficiency Level" onclick="toggleCustomSelect(this, event)">
            <span class="custom-select-label">${l.level}</span>
            <i class="ti ti-chevron-down custom-select-arrow"></i>
          </button>
          <div class="custom-select-options">
            ${levels.map(lv=>`
              <div class="custom-select-option ${l.level===lv?'active':''}" onclick="selectCustomOption(this, '${lv}', ${i}, event)">
                ${lv}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      <button class="ic-btn del" style="width:100%;border-radius:5px" onclick="S.langs.splice(${i},1);buildLangs();renderImmediate()"><i class="ti ti-trash"></i> Remove</button>
    </div>`).join('');
}
