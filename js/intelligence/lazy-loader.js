// ══════════════════════════════════════════════════════════
// RESUME BUILDER INTELLIGENCE SYSTEM — LAZY LOADER
// ══════════════════════════════════════════════════════════
window.ResumeIntel = window.ResumeIntel || { data: {} };

window.ResumeIntel.LazyLoader = {
  _loaded: {},
  _inFlight: {}, // Caches active loading Promises

  loadCategory(category) {
    if (!category) return Promise.resolve();
    if (this._loaded[category]) return Promise.resolve();
    if (this._inFlight[category]) return this._inFlight[category]; // Reuse in-flight promise

    this._inFlight[category] = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `js/intelligence/data/${category}.js`;
      script.async = true;
      
      script.onload = () => {
        this._loaded[category] = true;
        delete this._inFlight[category];
        resolve();
      };
      
      script.onerror = () => {
        delete this._inFlight[category];
        reject(new Error(`Failed to load category data: ${category}`));
      };
      
      document.head.appendChild(script);
    });

    return this._inFlight[category];
  },

  // Map user role text to categories
  getCategoryForQuery(query) {
    const q = (query || '').toLowerCase().trim();
    if (!q) return null;

    if (/developer|engineer|coder|programmer|architect|data|scientist|qa|devops|security|analyst/i.test(q)) {
      return 'tech';
    }
    if (/design|illustrator|artist|ui|ux|creative|photograph|video|animat/i.test(q)) {
      return 'design';
    }
    if (/manager|analyst|accountant|financial|audit|consultant|executive|sales|hr|recruit|admin/i.test(q)) {
      return 'business';
    }
    if (/marketing|seo|writer|copy|content|media|ads|social/i.test(q)) {
      return 'marketing';
    }
    return null;
  }
};
