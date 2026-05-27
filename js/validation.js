// ══════════════════════════════════════════════════════════
// DATA RESTRICTION & VALIDATION SYSTEM
// ══════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  // Real-time input filtering
  sidebar.addEventListener('input', handleInput);

  // Validate on losing focus
  sidebar.addEventListener('blur', handleBlur, true);
});

function handleInput(e) {
  const target = e.target;
  if (!target.matches('input, textarea, select')) return;

  // 1. Sanitize characters in real-time
  sanitize(target);

  // 2. If it already has an error outline, re-validate to clear it immediately upon correction
  if (target.classList.contains('has-error')) {
    validate(target);
  }
}

function handleBlur(e) {
  const target = e.target;
  if (!target.matches('input, textarea, select')) return;

  // Validate format and check gibberish when the user leaves the field
  validate(target);
}

function sanitize(el) {
  const val = el.value;
  const id = el.id || '';
  const placeholder = (el.placeholder || '').toLowerCase();
  let cleaned = val;

  if (id === 'f_name' || id === 'f_city' || id === 'f_country' || 
      placeholder.includes('school') || placeholder.includes('degree') || 
      placeholder.includes('language') || placeholder.includes('company') || 
      placeholder.includes('role') || placeholder.includes('organization') || 
      placeholder.includes('issuer') || placeholder.includes('award') || 
      placeholder.includes('certificate')) {
    // Names, locations, schools, roles: allow letters, spaces, hyphens, periods, and apostrophes (Unicode-aware)
    cleaned = val.replace(/[^\p{L}\s.\-']/gu, '');
  } 
  else if (id === 'f_phone') {
    // Phone numbers: allow digits, spaces, plus sign, hyphens, parentheses
    cleaned = val.replace(/[^0-9+\-\s()]/g, '');
  } 
  else if (placeholder.includes('start') || placeholder.includes('end') || placeholder.includes('year')) {
    // Dates & years: allow digits, letters, spaces, hyphens, and slashes
    cleaned = val.replace(/[^a-zA-Z0-9\s\-\/]/g, '');
  } 
  else if (el.type === 'url' || id.includes('linkedin') || id.includes('website') || id.includes('github')) {
    // URLs/handles: reject all spaces
    cleaned = val.replace(/\s/g, '');
  }

  if (cleaned !== val) {
    const start = el.selectionStart;
    const end = el.selectionEnd;
    el.value = cleaned;
    const diff = val.length - cleaned.length;
    el.setSelectionRange(Math.max(0, start - diff), Math.max(0, end - diff));
  }
}

function validate(el) {
  const val = el.value.trim();
  const id = el.id || '';
  const type = el.type || '';
  const placeholder = (el.placeholder || '').toLowerCase();

  // Empty fields are cleared of errors (optional fields allowed, sanitization rules apply when they type)
  if (!val) {
    clearError(el);
    return true;
  }

  // 1. Email format check
  if (type === 'email' || id === 'f_email') {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(val)) {
      showError(el, 'Please enter a valid email address.');
      return false;
    }
  }

  // 2. Phone format check
  if (id === 'f_phone') {
    const digitCount = (val.match(/\d/g) || []).length;
    if (digitCount < 7) {
      showError(el, 'Phone number must contain at least 7 digits.');
      return false;
    }
  }

  // 3. Link / URL format check
  if (type === 'url' || id.includes('linkedin') || id.includes('website') || id.includes('github')) {
    const urlRegex = /(\.[a-zA-Z]{2,})|^\/[a-zA-Z0-9._\-]+/i;
    if (!urlRegex.test(val)) {
      showError(el, 'Please enter a valid URL or handle.');
      return false;
    }
  }

  // 4. Gibberish & repeating character checks for text fields
  if (id === 'f_name' || id === 'f_title' || id === 'f_summary' || id === 'f_city' || id === 'f_country' || 
      placeholder.includes('school') || placeholder.includes('degree') || placeholder.includes('company') || 
      placeholder.includes('role') || placeholder.includes('organization') || placeholder.includes('issuer') || 
      placeholder.includes('award') || placeholder.includes('certificate') || placeholder.includes('language') ||
      id === 'f_interests') {
    
    if (checkGibberish(val)) {
      showError(el, 'Please enter meaningful information.');
      return false;
    }
  }

  clearError(el);
  return true;
}

function checkGibberish(val) {
  if (val.length <= 3) {
    // Flag very short entries if they are just repeating letters (e.g. "xxx")
    return /^(.)\1+$/i.test(val);
  }

  // Rule 1: 4 or more identical consecutive characters (e.g., "aaaa")
  if (/(.)\1\1\1/i.test(val)) return true;

  // Rule 2: Single word length > 25 (pasted strings or random keys)
  const words = val.split(/\s+/);
  for (const w of words) {
    if (w.length > 25) return true;
    
    // Strip non-letters for word rules
    const cleanWord = w.replace(/[^a-zA-Z]/g, '');
    if (cleanWord.length > 4) {
      // Rule 3: Word > 4 characters with absolutely no vowels
      const hasVowels = /[aeiouyAEIOUY]/i.test(cleanWord);
      if (!hasVowels) {
        // Exclude common tech abbreviations
        const commonAcronyms = ['html', 'css', 'xml', 'js', 'json', 'rxjs', 'grpc', 'http', 'https', 'rest', 'sdk', 'api', 'sql', 'nosql', 'dbms', 'saas', 'iaas', 'paas', 'aws', 'gcp', 'ui', 'ux', 'qa', 'ci', 'cd', 'svn', 'git', 'mdn', 'w3c', 'npm', 'yarn', 'pnpm'];
        if (!commonAcronyms.includes(cleanWord.toLowerCase())) {
          return true;
        }
      }
      
      // Rule 4: 5 or more consecutive consonants (e.g. "qwrtp")
      if (/[bcdfghjklmnpqrstvwxz]{5,}/i.test(cleanWord)) {
        return true;
      }
    }

    // Rule 5: Repetitive subpatterns (e.g. "asdfasdfasdf")
    if (w.length >= 8) {
      for (let len = 2; len <= 4; len++) {
        const sub = w.substring(0, len);
        const rep = new RegExp(`^(${sub}){3,}$`, 'i');
        if (rep.test(w)) return true;
      }
    }
  }

  return false;
}

function showError(input, message) {
  input.classList.add('has-error');
  
  const parent = input.parentElement;
  if (!parent) return;

  let errEl = parent.querySelector('.error-msg');
  if (!errEl) {
    errEl = document.createElement('div');
    errEl.className = 'error-msg';
    parent.appendChild(errEl);
  }
  
  errEl.innerHTML = `<i class="ti ti-alert-circle" style="font-size: 13px;"></i> ${message}`;
}

function clearError(input) {
  input.classList.remove('has-error');
  const parent = input.parentElement;
  if (!parent) return;

  const errEl = parent.querySelector('.error-msg');
  if (errEl) {
    errEl.remove();
  }
}
