// ══════════════════════════════════════════════════════════
// TABS & NAV
// ══════════════════════════════════════════════════════════
const TAB_IDS = ['info','work','edu','skills','sections','design','assist'];
let currentTab = 0;

function switchTab(i){
  currentTab = i; // Keep state in sync
  document.querySelectorAll('.tab').forEach((t,j)=>t.classList.toggle('active',j===i));
  document.querySelectorAll('.tab-body').forEach((b,j)=>b.classList.toggle('active',j===i));
  document.getElementById('stepLbl').textContent=`Step ${i+1} / ${TAB_IDS.length}`;
  document.getElementById('prevBtn').disabled = i===0;
  document.getElementById('nextBtn').textContent = i===TAB_IDS.length-1 ? '✓ Done' : 'Next ';
  buildStepBar();
}

// inject active styles with smooth fade & slide transitions
const styleEl = document.createElement('style');
styleEl.textContent = `
  .tab-body {
    display: none;
  }
  .tab-body.active {
    display: block;
    animation: tabFadeIn 0.28s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }
  @keyframes tabFadeIn {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(styleEl);

function navStep(dir){
  const next = Math.max(0, Math.min(TAB_IDS.length-1, currentTab+dir));
  switchTab(next);
  // scroll tab smoothly into view
  const tabs = document.querySelectorAll('.tab');
  tabs[next]&&tabs[next].scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
}

function buildStepBar(){
  const bar = document.getElementById('stepBar');
  if(!bar)return;
  bar.innerHTML = TAB_IDS.map((_,i)=>`<div class="step-seg ${i<=currentTab?'done':''}"></div>`).join('');
}

let cropper = null;
function handlePhoto(e){
  const f=e.target.files[0]; if(!f)return;
  const r=new FileReader();
  r.onload=ev=>{
    const cropModal = document.getElementById('cropModal');
    const cropImage = document.getElementById('cropImage');
    if(!cropModal || !cropImage) return;

    cropImage.src = ev.target.result;
    cropModal.style.display = 'flex';

    if(cropper) {
      cropper.destroy();
    }

    cropper = new Cropper(cropImage, {
      aspectRatio: 1,
      viewMode: 1,
      autoCropArea: 0.8,
      background: false
    });

    e.target.value = '';
  };
  r.readAsDataURL(f);
}
function applyCrop(){
  if(!cropper) return;
  const canvas = cropper.getCroppedCanvas({
    width: 300,
    height: 300
  });
  if(canvas) {
    S.photo = canvas.toDataURL('image/jpeg');
    updatePhotoUI();
    render();
  }
  closeCropModal();
}
function closeCropModal(){
  const cropModal = document.getElementById('cropModal');
  if(cropModal) {
    cropModal.style.display = 'none';
  }
  if(cropper) {
    cropper.destroy();
    cropper = null;
  }
}
function handleAvatarClick(e){
  if(S.photo) {
    openPhotoPreview(e);
  } else {
    document.getElementById('photo-input').click();
  }
}
function openPhotoPreview(e){
  const previewModal = document.getElementById('previewPhotoModal');
  const previewImage = document.getElementById('previewPhotoImage');
  if(!previewModal || !previewImage) return;

  previewImage.src = S.photo;
  previewImage.style.borderRadius = S.photoBR + '%';
  previewModal.style.display = 'flex';
}
function closePhotoPreview(){
  const previewModal = document.getElementById('previewPhotoModal');
  if(previewModal) {
    previewModal.style.display = 'none';
  }
}
function removePhoto(){S.photo=null;updatePhotoUI();render();}
function updatePhotoUI(){
  const c=document.getElementById('photoCircle');
  if(!c)return;
  c.innerHTML=S.photo?`<img src="${S.photo}" style="width:100%;height:100%;object-fit:cover">`:`<i class="ti ti-camera" style="font-size:1.6rem;color:var(--muted)"></i>`;
}
function setPhotoSize(v){
  S.photoSize=+v;
  document.getElementById('photoSizeVal').textContent=v+'px';
  document.getElementById('photoCircle').style.width=v+'px';
  document.getElementById('photoCircle').style.height=v+'px';
  document.getElementById('photoRing').style.width=v+'px';
  document.getElementById('photoRing').style.height=v+'px';
  render();
}
function setPhotoBR(v){
  S.photoBR=+v;
  document.getElementById('photoBRVal').textContent=v+'%';
  document.getElementById('photoCircle').style.borderRadius=v+'%';
  render();
}

// Photo resize drag
(()=>{
  const ring=document.getElementById('photoResizeRing');
  if(!ring)return;
  let dragging=false,startY=0,startSize=76;
  ring.addEventListener('mousedown',e=>{dragging=true;startY=e.clientY;startSize=S.photoSize;e.preventDefault();});
  document.addEventListener('mousemove',e=>{
    if(!dragging)return;
    const delta=startY-e.clientY;
    const newSize=Math.max(40,Math.min(130,startSize+delta));
    const sizeInput = document.getElementById('photoSize');
    if(sizeInput) sizeInput.value=newSize;
    setPhotoSize(newSize);
  });
  document.addEventListener('mouseup',()=>{dragging=false;});
})();

// ══════════════════════════════════════════════════════════
// ENTRIES
// ══════════════════════════════════════════════════════════
function addEntry(type){
  if(type==='exp') S.experience.push({company:'',role:'',start:'',end:'',desc:''});
  else if(type==='edu') S.education.push({school:'',degree:'',start:'',end:'',desc:''});
  else if(type==='cert') S.certs.push({name:'',issuer:'',year:''});
  else if(type==='award') S.awards.push({title:'',org:'',year:''});
  buildEntries(); render();
}
function removeEntry(type,i){
  if(type==='exp') S.experience.splice(i,1);
  else if(type==='edu') S.education.splice(i,1);
  else if(type==='cert') S.certs.splice(i,1);
  else if(type==='award') S.awards.splice(i,1);
  buildEntries(); render();
}
function handleSkillKey(e){
  if(e.key==='Enter'||e.key===','){
    e.preventDefault();
    const v=e.target.value.trim().replace(/,/g,'');
    if(v&&!S.skills.includes(v)){S.skills.push(v);buildSkillTags();render();}
    e.target.value='';
  }
}
function addLang(){S.langs.push({lang:'',level:'Beginner'});buildLangs();render();}

// ══════════════════════════════════════════════════════════
// CUSTOM COLOR PICKER MODAL
// ══════════════════════════════════════════════════════════
let pickerH = 0;
let pickerS = 100;
let pickerV = 100;

function openColorPickerModal() {
  const modal = document.getElementById('colorPickerModal');
  if (!modal) return;
  
  // Convert current S.accent hex to HSV
  const hsv = hexToHsv(S.accent);
  pickerH = hsv.h;
  pickerS = hsv.s;
  pickerV = hsv.v;
  
  // Set Hue slider value
  const slider = document.getElementById('colorHueSlider');
  if (slider) slider.value = pickerH;
  
  updatePickerUI();
  modal.style.display = 'flex';
}

function closeColorPickerModal() {
  const modal = document.getElementById('colorPickerModal');
  if (modal) modal.style.display = 'none';
}

function applyCustomColor() {
  const hex = hsvToHex(pickerH, pickerS, pickerV);
  S.accent = hex;
  
  // Deactivate swatches
  document.querySelectorAll('.c-swatch').forEach(s => s.classList.remove('active'));
  
  // Update preview trigger color
  const preview = document.getElementById('customColorPreview');
  if (preview) preview.style.background = hex;
  
  // Rebuild preview thumbnails
  buildLayoutGrid();
  
  render();
  closeColorPickerModal();
}

function updatePickerUI() {
  const pad = document.getElementById('colorPad');
  const pointer = document.getElementById('colorPointer');
  const preview = document.getElementById('pickerColorPreview');
  const hexInput = document.getElementById('pickerHexValue');
  
  if (!pad || !pointer || !preview || !hexInput) return;
  
  // Background of pad is pure hue
  pad.style.backgroundColor = hsvToHex(pickerH, 100, 100);
  
  // Place pointer
  pointer.style.left = `${pickerS}%`;
  pointer.style.top = `${100 - pickerV}%`;
  
  // Current hex value
  const hex = hsvToHex(pickerH, pickerS, pickerV);
  preview.style.backgroundColor = hex;
  hexInput.value = hex.toUpperCase();
}

function handlePickerHexInput(v) {
  if (/^#[0-9a-fA-F]{6}$/.test(v)) {
    const hsv = hexToHsv(v);
    pickerH = hsv.h;
    pickerS = hsv.s;
    pickerV = hsv.v;
    
    const slider = document.getElementById('colorHueSlider');
    if (slider) slider.value = pickerH;
    
    updatePickerUI();
  }
}

// Drag & Touch handlers for Saturation-Value box
document.addEventListener('DOMContentLoaded', () => {
  // Tab click bindings
  document.querySelectorAll('.tab').forEach((tab, index) => {
    tab.addEventListener('click', () => {
      switchTab(index);
      tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
  });

  const pad = document.getElementById('colorPad');
  if (!pad) return;
  
  let dragging = false;
  
  function handleColorDrag(e) {
    const rect = pad.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    let x = (clientX - rect.left) / rect.width;
    let y = (clientY - rect.top) / rect.height;
    
    x = Math.max(0, Math.min(1, x));
    y = Math.max(0, Math.min(1, y));
    
    pickerS = Math.round(x * 100);
    pickerV = Math.round((1 - y) * 100);
    
    updatePickerUI();
  }
  
  pad.addEventListener('mousedown', (e) => {
    dragging = true;
    handleColorDrag(e);
  });
  
  document.addEventListener('mousemove', (e) => {
    if (dragging) handleColorDrag(e);
  });
  
  document.addEventListener('mouseup', () => {
    dragging = false;
  });
  
  pad.addEventListener('touchstart', (e) => {
    dragging = true;
    handleColorDrag(e);
  });
  
  document.addEventListener('touchmove', (e) => {
    if (dragging) {
      e.preventDefault();
      handleColorDrag(e);
    }
  }, { passive: false });
  
  document.addEventListener('touchend', () => {
    dragging = false;
  });
  
  const hueSlider = document.getElementById('colorHueSlider');
  if (hueSlider) {
    hueSlider.addEventListener('input', (e) => {
      pickerH = parseInt(e.target.value);
      updatePickerUI();
    });
  }
  
  // Set initial preview background
  const preview = document.getElementById('customColorPreview');
  if (preview) preview.style.background = S.accent;
});

// ══════════════════════════════════════════════════════════
// CUSTOM SELECT DROPDOWNS
// ══════════════════════════════════════════════════════════
function toggleCustomSelect(trigger, event) {
  event.stopPropagation();
  const container = trigger.closest('.custom-select-container');
  const isOpen = container.classList.contains('open');
  
  // Close all other custom selects first
  document.querySelectorAll('.custom-select-container.open').forEach(c => {
    if (c !== container) {
      c.classList.remove('open');
    }
  });
  
  if (isOpen) {
    container.classList.remove('open');
  } else {
    container.classList.add('open');
  }
}

function selectCustomOption(optionEl, value, index, event) {
  event.stopPropagation();
  const container = optionEl.closest('.custom-select-container');
  
  // Update state
  S.langs[index].level = value;
  
  // Update active class in options
  container.querySelectorAll('.custom-select-option').forEach(opt => {
    opt.classList.toggle('active', opt === optionEl);
  });
  
  // Update trigger label
  const label = container.querySelector('.custom-select-label');
  if (label) label.textContent = value;
  
  // Close dropdown
  container.classList.remove('open');
  
  // Render CV preview
  render();
}

// Global click handler to close dropdowns when clicking outside
document.addEventListener('click', (e) => {
  document.querySelectorAll('.custom-select-container.open').forEach(c => {
    c.classList.remove('open');
  });
  const resDropdown = document.getElementById('resumesDropdown');
  if (resDropdown && resDropdown.classList.contains('open') && !resDropdown.contains(e.target)) {
    resDropdown.classList.remove('open');
  }
});

// ══════════════════════════════════════════════════════════
// SMART RESUME INTELLIGENCE SYSTEM HANDLERS
// ══════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  setupIntelligenceHandlers();
});

function setupIntelligenceHandlers() {
  const fTitle = document.getElementById('f_title');
  const suggestionsBox = document.getElementById('role-suggestions');
  if (fTitle && suggestionsBox) {
    let activeIndex = -1;
    let matches = [];

    const closeSuggestions = () => {
      suggestionsBox.style.display = 'none';
      fTitle.setAttribute('aria-expanded', 'false');
      activeIndex = -1;
    };

    const handleInput = async () => {
      const val = fTitle.value.trim();
      if (!val) {
        closeSuggestions();
        return;
      }

      // Determine category and lazy-load data
      const cat = window.ResumeIntel.LazyLoader.getCategoryForQuery(val);
      if (cat) {
        try {
          await window.ResumeIntel.LazyLoader.loadCategory(cat);
        } catch (err) {
          console.error(err);
        }
      }

      matches = window.ResumeIntel.RoleMatcher.matchRole(val);
      if (matches.length === 0) {
        closeSuggestions();
        return;
      }

      suggestionsBox.innerHTML = matches.map((m, idx) => `
        <div class="role-suggestion-item" role="option" id="opt-${idx}" tabindex="0" data-key="${m.key}" data-cat="${m.category}" style="padding: 10px 14px; font-size: 0.82rem; color: #fff; cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; justify-content: space-between; align-items: center; transition: background 0.15s;">
          <span style="font-weight: 500;">${window.ResumeIntel.Utils.esc(m.role.title)}</span>
          <span style="font-size: 0.65rem; color: var(--accent); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid var(--accent); padding: 2px 6px; border-radius: 4px; background: rgba(233, 69, 96, 0.05);">${m.category}</span>
        </div>
      `).join('');

      suggestionsBox.style.display = 'block';
      fTitle.setAttribute('aria-expanded', 'true');
      activeIndex = -1;

      // Attach click events
      suggestionsBox.querySelectorAll('.role-suggestion-item').forEach((item, idx) => {
        item.addEventListener('click', () => {
          selectRole(matches[idx]);
          closeSuggestions();
        });
      });
    };

    const debouncedInput = window.ResumeIntel.Utils.debounce(handleInput, 200);
    fTitle.addEventListener('input', debouncedInput);

    fTitle.addEventListener('keydown', (e) => {
      const items = suggestionsBox.querySelectorAll('.role-suggestion-item');
      if (suggestionsBox.style.display === 'block') {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          activeIndex = (activeIndex + 1) % items.length;
          highlightItem(items);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          activeIndex = (activeIndex - 1 + items.length) % items.length;
          highlightItem(items);
        } else if (e.key === 'Enter') {
          if (activeIndex >= 0 && activeIndex < matches.length) {
            e.preventDefault();
            selectRole(matches[activeIndex]);
            closeSuggestions();
          }
        } else if (e.key === 'Escape') {
          closeSuggestions();
          fTitle.focus();
        }
      }
    });

    const highlightItem = (items) => {
      items.forEach((item, idx) => {
        if (idx === activeIndex) {
          item.classList.add('highlighted');
          item.style.background = 'rgba(255,255,255,0.08)';
          item.focus();
          fTitle.setAttribute('aria-activedescendant', `opt-${idx}`);
        } else {
          item.classList.remove('highlighted');
          item.style.background = 'transparent';
        }
      });
    };

    // Close dropdown on click outside
    document.addEventListener('click', (e) => {
      if (e.target !== fTitle && !suggestionsBox.contains(e.target)) {
        closeSuggestions();
      }
    });
  }
}

function selectRole(match) {
  const panel = document.getElementById('smart-role-panel');
  if (!panel) return;

  const role = match.role;
  const roleKey = match.key;
  
  // Render summary suggestions
  const levels = ['fresher', 'mid', 'senior'];
  let summariesHtml = levels.map(level => {
    const variations = window.ResumeIntel.SummaryGenerator.generate(roleKey, level);
    return `
      <div style="margin-top: 8px;">
        <span style="font-size: 0.68rem; color: var(--accent); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">${level} Level</span>
        ${variations.map((v) => `
          <div class="summary-suggest-card" onclick="applySummaryText(this.textContent.trim())" style="background: #ffffff; border: 1px solid rgba(0,0,0,0.06); border-radius: 8px; padding: 10px; font-size: 0.78rem; color: #475569; line-height: 1.45; margin-top: 5px; cursor: pointer; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.02);" onmouseover="this.style.borderColor='var(--accent)'; this.style.color='#0f172a'; this.style.background='#f8fafc';" onmouseout="this.style.borderColor='rgba(0,0,0,0.06)'; this.style.color='#475569'; this.style.background='#ffffff';">
            ${v}
          </div>
        `).join('')}
      </div>
    `;
  }).join('');

  // Render skills suggestions
  const skillsHtml = role.skills.map(s => `
    <span class="kw-pill missing" onclick="addSkillFromSuggestions('${s.replace(/'/g, "\\'")}')" style="cursor: pointer; display: inline-flex; align-items: center; gap: 4px; background: rgba(0,0,0,0.02); border: 1px solid rgba(0,0,0,0.06); border-radius: 20px; padding: 4px 10px; font-size: 0.75rem; color: #475569; margin: 2px; transition: all 0.2s;" onmouseover="this.style.background='rgba(0,0,0,0.04)'; this.style.color='#0f172a';" onmouseout="this.style.background='rgba(0,0,0,0.02)'; this.style.color='#475569';"><i class="ti ti-plus" style="font-size:10px; color:var(--accent)"></i> ${s}</span>
  `).join('');

  panel.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid rgba(0,0,0,0.08); padding-bottom: 6px; margin-bottom: 8px;">
      <span style="font-size: 0.78rem; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 4px;"><i class="ti ti-sparkles" style="color:var(--accent); font-size: 13px;"></i> Assistant: ${role.title}</span>
      <button class="ic-btn" onclick="document.getElementById('smart-role-panel').style.display='none'" style="padding: 2px 6px; font-size: 0.65rem; background: rgba(0,0,0,0.03); border-radius: 4px; border: 1px solid rgba(0,0,0,0.08); color: #475569; cursor: pointer;"><i class="ti ti-x"></i> Hide</button>
    </div>
    <div>
      <span style="font-size: 0.7rem; color: #64748b; font-weight: 700; display: block; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Recommended Skills</span>
      <div style="display:flex; flex-wrap:wrap; gap: 4px; margin-bottom: 12px;">
        ${skillsHtml}
      </div>
      <span style="font-size: 0.7rem; color: #64748b; font-weight: 700; display: block; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Recommended Summaries <span style="font-weight: normal; text-transform: none; opacity: 0.6;">(Click to insert)</span></span>
      <div style="max-height: 180px; overflow-y: auto; padding-right: 4px; display: flex; flex-direction: column; gap: 4px;">
        ${summariesHtml}
      </div>
    </div>
  `;
  panel.style.display = 'block';

  // Render skill suggestions
  renderSkillSuggestions();
}

function applySummaryText(text) {
  const summaryEl = document.getElementById('f_summary');
  if (summaryEl) {
    summaryEl.value = text;
    render();
  }
}

function addSkillFromSuggestions(skillName) {
  if (!S.skills.includes(skillName)) {
    S.skills.push(skillName);
    buildSkillTags();
    render();
    renderSkillSuggestions();
  }
}

function addSkillFromJd(skillName) {
  if (!S.skills.includes(skillName)) {
    S.skills.push(skillName);
    buildSkillTags();
    render();
    if (window.ResumeIntel && window.ResumeIntel.Core) {
      window.ResumeIntel.Core.analyzeResume();
    }
  }
}

function renderSkillSuggestions() {
  const wrapper = document.getElementById('skills-suggestions-wrapper');
  const listEl = document.getElementById('skillsSuggestionsList');
  if (!wrapper || !listEl) return;

  if (!window.ResumeIntel || !window.ResumeIntel.SkillEngine) return;

  const recommendations = window.ResumeIntel.SkillEngine.recommend(S.skills);
  if (recommendations.length === 0) {
    wrapper.style.display = 'none';
  } else {
    listEl.innerHTML = recommendations.map(s => `
      <span class="kw-pill missing" onclick="addSkillFromSuggestions('${s.replace(/'/g, "\\'")}')" style="cursor: pointer; display: inline-flex; align-items: center; gap: 4px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 4px 10px; font-size: 0.75rem; color: rgba(255,255,255,0.7); margin: 2px; transition: all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.08)'; this.style.color='#fff';" onmouseout="this.style.background='rgba(255,255,255,0.04)'; this.style.color='rgba(255,255,255,0.7)';"><i class="ti ti-plus" style="font-size:10px; color:var(--accent)"></i> ${s}</span>
    `).join('');
    wrapper.style.display = 'block';
  }
}

function triggerJdAnalysis() {
  const text = document.getElementById('jdInputText').value;
  if (window.ResumeIntel && window.ResumeIntel.Core) {
    window.ResumeIntel.Core.scanJobDescription(text);
  }
}

function enhanceBulletPoint(index, event) {
  if (event) event.stopPropagation();
  const descEl = document.getElementById(`exp-desc-${index}`);
  if (!descEl) return;

  const originalText = descEl.value;
  if (!originalText.trim()) {
    showToast("Please enter some bullet points first.");
    return;
  }

  const lines = originalText.split('\n');
  const improvedLines = lines.map(line => {
    if (!line.trim()) return "";
    return window.ResumeIntel.BulletEngine.improve(line);
  }).filter(Boolean);

  const improvedText = improvedLines.join('\n');
  descEl.value = improvedText;
  S.experience[index].desc = improvedText;
  render();
  showToast("Bullet points improved!");
}
