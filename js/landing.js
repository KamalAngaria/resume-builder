/* ==========================================================================
   CV.craft PRO - Landing Page JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initParallax();
  initScrollAnimations();
  initScanSimulator();
  initLiveDemo();
  initTemplates();
});

/* --- Navbar Scroll State & Mobile Menu --- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggleBtn = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  // Change style on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      const isActive = navMenu.classList.toggle('active');
      toggleBtn.classList.toggle('active');
      
      // Prevent body scrolling when menu is open
      document.body.classList.toggle('nav-menu-open', isActive);
      
      // Animate icon cleanly
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        if (isActive) {
          icon.className = 'ti ti-x';
        } else {
          icon.className = 'ti ti-menu-2';
        }
      }
    });

    // Close mobile menu when clicking links
    const links = navMenu.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        toggleBtn.classList.remove('active');
        document.body.classList.remove('nav-menu-open');
        const icon = toggleBtn.querySelector('i');
        if (icon) {
          icon.className = 'ti ti-menu-2';
        }
      });
    });
  }
}

/* --- 3D Mouse Parallax Effect --- */
function initParallax() {
  const visualArea = document.querySelector('.hero-visual');
  const container = document.querySelector('.parallax-container');
  const cards = document.querySelectorAll('.resume-card');

  if (!visualArea || !container) return;

  // Disable 3D mouse parallax on mobile/tablet to save battery and optimize performance
  if (window.innerWidth <= 1024) return;

  visualArea.addEventListener('mousemove', (e) => {
    const rect = visualArea.getBoundingClientRect();
    // Mouse coords relative to visualArea (-0.5 to 0.5)
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Apply tilt to main container
    container.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;

    // Apply micro offsets to individual cards (higher depth floats more)
    cards.forEach((card) => {
      // Temporarily disable floating animation during mousemove for responsive control
      card.style.animation = 'none';

      // Read default translation depth
      let depth = 0;
      let defaultY = 0;
      let defaultX = 0;
      let defaultRotY = 0;
      let defaultRotX = 0;

      if (card.classList.contains('card-base')) {
        depth = 15;
        defaultRotY = -10;
        defaultRotX = 10;
      } else if (card.classList.contains('card-overlay-parser')) {
        depth = 45;
        defaultRotY = -5;
        defaultRotX = 10;
      } else if (card.classList.contains('card-overlay-score')) {
        depth = 75;
        defaultRotY = -12;
        defaultRotX = 8;
      }

      // Parallax offset
      const moveX = x * depth;
      const moveY = y * depth;

      card.style.transform = `translate3d(${moveX}px, ${moveY}px, ${depth}px) rotateY(${defaultRotY + x * 6}deg) rotateX(${defaultRotX - y * 6}deg)`;
    });
  });

  // Restore floating animations when mouse leaves visual area
  visualArea.addEventListener('mouseleave', () => {
    container.style.transform = `rotateY(0deg) rotateX(0deg)`;
    
    cards.forEach((card) => {
      card.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      
      // Re-enable CSS animations and reset transforms
      if (card.classList.contains('card-base')) {
        card.style.transform = 'translate3d(0, 0, 0) rotateY(-10deg) rotateX(10deg)';
        setTimeout(() => { card.style.animation = 'floatCard1 7s ease-in-out infinite'; }, 800);
      } else if (card.classList.contains('card-overlay-parser')) {
        card.style.transform = 'translate3d(0, 0, 40px) rotateY(-5deg) rotateX(10deg)';
        setTimeout(() => { card.style.animation = 'floatCard2 8s ease-in-out infinite'; }, 800);
      } else if (card.classList.contains('card-overlay-score')) {
        card.style.transform = 'translate3d(0, 0, 70px) rotateY(-12deg) rotateX(8deg)';
        setTimeout(() => { card.style.animation = 'floatCard3 6s ease-in-out infinite'; }, 800);
      }
    });
  });
}

/* --- Scroll-Reveal Animations using Intersection Observer --- */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.scroll-reveal');

  if (revealElements.length === 0) return;

  const observerOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => {
    revealObserver.observe(el);
  });
}

/* --- Section 2: ATS Layout Scanner Simulator --- */
function initScanSimulator() {
  const btnBad = document.getElementById('btnScanBad');
  const btnGood = document.getElementById('btnScanGood');
  const resumeBad = document.getElementById('resumeBad');
  const resumeGood = document.getElementById('resumeGood');
  const logPre = document.getElementById('logPre');

  if (!btnBad || !btnGood) return;

  function showBad() {
    btnBad.classList.add('active');
    btnGood.classList.remove('active');
    resumeBad.style.display = 'grid';
    resumeGood.style.display = 'none';
    
    logPre.className = 'log-pre red-text';
    logPre.innerHTML = `[SCANNING ERROR] Columns detected side-by-side.
[WARNING] Parser reads raw text left-to-right across lines:
"Figma 90% React 70% Johnathan Miller Senior Analyst Experienced..."
Result: Profile summary and skills merged. Chronological order broken.`;
  }

  function showGood() {
    btnGood.classList.add('active');
    btnBad.classList.remove('active');
    resumeGood.style.display = 'block';
    resumeBad.style.display = 'none';
    
    logPre.className = 'log-pre green-text';
    logPre.innerHTML = `[SCANNING SUCCESS] Reading order: Linear chronological document.
[PARSED RAW TEXT]:
Johnathan Miller | Senior Analyst
WORK EXPERIENCE
• Managed SQL Database administration for 4 core platforms.
Status: 100% Readable, 0 errors, UTF-8 verified.`;
  }

  btnBad.addEventListener('click', showBad);
  btnGood.addEventListener('click', showGood);

  // Initialize with bad state simulation showing the problem
  showBad();
}

/* --- Section 3: ATS Parser Sandbox Simulator --- */
function initLiveDemo() {
  const btnRestart = document.getElementById('btnRestartDemo');
  const termLog = document.getElementById('termLog');
  const termExtracted = document.getElementById('termExtracted');
  const termTags = document.getElementById('termTags');
  const docSecHeader = document.getElementById('docSecHeader');
  const docSecExperience = document.getElementById('docSecExperience');
  const docSecSkills = document.getElementById('docSecSkills');
  const highlights = document.querySelectorAll('.kw-hl');

  if (!termLog || !termExtracted) return;

  let demoTimeouts = [];
  let isDemoRunning = false;

  const demoText = {
    header: "Thomas Sterling\nSenior DevOps Specialist\n\n",
    experience: "EXPERIENCE\nLead DevOps - CoreSolutions (2021-2025)\n• Deployed Docker and Kubernetes microservices.\n• Built continuous CI/CD pipelines.\n• Managed databases on AWS.\n\n",
    skills: "SKILLS\nDocker, Kubernetes, CI/CD, Python, AWS, PostgreSQL"
  };

  function clearDemo() {
    demoTimeouts.forEach(clearTimeout);
    demoTimeouts = [];
    isDemoRunning = false;

    termLog.innerText = "";
    termExtracted.innerText = "";
    termTags.innerHTML = "";
    docSecHeader.classList.remove('active-parse');
    docSecExperience.classList.remove('active-parse');
    docSecSkills.classList.remove('active-parse');
    highlights.forEach(el => el.classList.remove('matched'));
  }

  function typeText(text, index, element, speed, callback) {
    if (index < text.length) {
      element.innerHTML += text[index] === '\n' ? '<br>' : text[index];
      
      // Auto-scroll terminal body
      const termBody = element.closest('.term-body') || document.querySelector('.term-body');
      if (termBody) {
        termBody.scrollTop = termBody.scrollHeight;
      }
      
      // Detect when keywords are being written in typewriter buffer
      if (text.substring(index - 5, index + 1).toLowerCase().includes("docker")) {
        highlightKeyword("docker");
      }
      if (text.substring(index - 4, index + 1).toLowerCase().includes("ci/cd")) {
        highlightKeyword("cicd");
      }

      const t = setTimeout(() => {
        typeText(text, index + 1, element, speed, callback);
      }, speed);
      demoTimeouts.push(t);
    } else if (callback) {
      callback();
    }
  }

  function highlightKeyword(kwKey) {
    const els = document.querySelectorAll(`.kw-hl[data-kw="${kwKey}"]`);
    els.forEach(el => el.classList.add('matched'));
    
    const tagName = kwKey === 'cicd' ? 'CI/CD' : 'Docker';
    if (!document.getElementById(`tag-${kwKey}`)) {
      const cap = document.createElement('span');
      cap.className = 'tag-capsule active';
      cap.id = `tag-${kwKey}`;
      cap.innerText = tagName;
      termTags.appendChild(cap);
    }
  }

  function runDemo() {
    if (isDemoRunning) return;
    clearDemo();
    isDemoRunning = true;

    termLog.innerHTML = `[PARSER] Initializing UTF-8 linear byte stream...`;
    
    let t1 = setTimeout(() => {
      docSecHeader.classList.add('active-parse');
      termLog.innerHTML = `[PARSER] Scanning Document Header...`;
      typeText(demoText.header, 0, termExtracted, 15, () => {
        docSecHeader.classList.remove('active-parse');
        
        let t2 = setTimeout(() => {
          docSecExperience.classList.add('active-parse');
          termLog.innerHTML = `[PARSER] Scanning Experience Blocks (Chronological)...`;
          typeText(demoText.experience, 0, termExtracted, 12, () => {
            docSecExperience.classList.remove('active-parse');

            let t3 = setTimeout(() => {
              docSecSkills.classList.add('active-parse');
              termLog.innerHTML = `[PARSER] Scanning Skills Section...`;
              typeText(demoText.skills, 0, termExtracted, 10, () => {
                docSecSkills.classList.remove('active-parse');

                termLog.innerHTML = `[PARSER] Extraction complete. 3/3 Core Sections Mapped.<br>[MATCH ENGINE] Match rating: High (98%)`;
                
                ["AWS", "Kubernetes", "Python", "PostgreSQL"].forEach(name => {
                  const key = name.toLowerCase();
                  if (!document.getElementById(`tag-${key}`)) {
                    const cap = document.createElement('span');
                    cap.className = 'tag-capsule active';
                    cap.id = `tag-${key}`;
                    cap.innerText = name;
                    termTags.appendChild(cap);
                  }
                });
                
                isDemoRunning = false;
              });
            }, 800);
            demoTimeouts.push(t3);
          });
        }, 800);
        demoTimeouts.push(t2);
      });
    }, 600);
    demoTimeouts.push(t1);
  }

  if (btnRestart) {
    btnRestart.addEventListener('click', () => {
      clearDemo();
      runDemo();
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runDemo();
      }
    });
  }, { threshold: 0.3 });

  const demoSection = document.querySelector('.demo-section');
  if (demoSection) {
    observer.observe(demoSection);
  }
}

/* --- Section 4: Template Showcase Tab Selector & 3D Tilt --- */
function initTemplates() {
  const buttons = document.querySelectorAll('.template-selector-btn');
  const cards = document.querySelectorAll('.tmpl-mockup-card');
  const wrapper = document.querySelector('.template-preview-wrapper');

  if (buttons.length === 0 || cards.length === 0) return;

  // Handle Tab Switch
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Deactivate all buttons
      buttons.forEach(b => b.classList.remove('active'));
      // Activate clicked
      btn.classList.add('active');

      // Get target key
      const key = btn.getAttribute('data-template');
      
      // Deactivate all mockup cards
      cards.forEach(card => card.classList.remove('active'));
      
      // Activate matching card
      const targetId = 'tmpl' + key.charAt(0).toUpperCase() + key.slice(1);
      const activeCard = document.getElementById(targetId);
      if (activeCard) {
        activeCard.classList.add('active');
      }
    });
  });

  // Handle 3D Tilt Parallax on Active Mockup Card
  if (wrapper && window.innerWidth > 1024) {
    wrapper.addEventListener('mousemove', (e) => {
      const activeCard = wrapper.querySelector('.tmpl-mockup-card.active');
      if (!activeCard) return;

      const rect = wrapper.getBoundingClientRect();
      // Mouse coordinates mapped relative to container center (-0.5 to 0.5)
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      // Apply 3D perspective rotation tilt with smooth transitions
      activeCard.style.transition = 'transform 0.1s ease-out, opacity 0.5s ease';
      activeCard.style.transform = `rotateY(${x * 16}deg) rotateX(${-y * 16}deg) translateZ(10px)`;
      
      // Dynamic shine highlight based on mouse position
      const doc = activeCard.querySelector('.tmpl-doc');
      if (doc) {
        // Simple linear shift highlight to simulate light reflections
        doc.style.background = `linear-gradient(${135 + x * 30}deg, #ffffff 0%, #fbfbfc 60%, #f5f5f7 100%)`;
      }
    });

    wrapper.addEventListener('mouseleave', () => {
      const activeCard = wrapper.querySelector('.tmpl-mockup-card.active');
      if (!activeCard) return;

      // Reset card layout positioning smoothly
      activeCard.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease';
      activeCard.style.transform = 'rotateY(0deg) rotateX(0deg) translateZ(0)';
      
      const doc = activeCard.querySelector('.tmpl-doc');
      if (doc) {
        doc.style.background = '#ffffff';
      }
    });
  }
}
