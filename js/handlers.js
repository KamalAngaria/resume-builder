// ══════════════════════════════════════════════════════════
// TABS & NAV
// ══════════════════════════════════════════════════════════
const TAB_IDS = ['info','work','edu','skills','sections','design'];
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
