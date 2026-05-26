// ══════════════════════════════════════════════════════════
// RESUME BUILDER INTELLIGENCE SYSTEM — JD ANALYZER
// ══════════════════════════════════════════════════════════
window.ResumeIntel = window.ResumeIntel || { data: {} };

window.ResumeIntel.JdAnalyzer = {
  stopWords: new Set([
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "arent", "as", "at",
    "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "cant", "cannot", "could",
    "did", "didnt", "do", "does", "doesnt", "doing", "dont", "down", "during", "each", "few", "for", "from", "further",
    "had", "hadnt", "has", "hasnt", "have", "havent", "having", "he", "hed", "hell", "hes", "her", "here", "heres",
    "hers", "herself", "him", "himself", "his", "how", "hows", "i", "id", "ill", "im", "ive", "if", "in", "into",
    "is", "isnt", "it", "its", "itself", "lets", "me", "more", "most", "mustnt", "my", "myself", "no", "nor", "not",
    "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own",
    "same", "shant", "she", "shed", "shell", "shes", "should", "shouldnt", "so", "some", "such", "than", "that",
    "thats", "the", "their", "theirs", "them", "themselves", "then", "there", "theres", "these", "they", "theyd",
    "theyll", "theyre", "theyve", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was",
    "wasnt", "we", "wed", "well", "were", "weve", "werent", "what", "whats", "when", "whens", "where", "wheres",
    "which", "while", "who", "whos", "whom", "why", "whys", "with", "wont", "would", "wouldnt", "you", "youd",
    "youll", "youre", "youve", "your", "yours", "yourself", "yourselves", "required", "experience", "role", "work",
    "job", "candidate", "responsibilities", "skills", "team", "working", "using", "plus", "years", "knowledge"
  ]),

  analyze(jdText) {
    if (!jdText) return [];

    const phraseGroups = [
      "machine learning",
      "design systems",
      "project management",
      "single page applications",
      "user interface",
      "user experience",
      "software engineering",
      "web development",
      "cloud computing",
      "data science",
      "continuous integration",
      "continuous deployment",
      "responsive design",
      "mobile development",
      "product management",
      "agile development"
    ];

    let textLower = jdText.toLowerCase();
    const extractedPhrases = [];

    // 1. Scan and extract phrase groups
    phraseGroups.forEach(phrase => {
      const regex = new RegExp(`\\b${phrase}\\b`, 'g');
      if (regex.test(textLower)) {
        extractedPhrases.push({ keyword: phrase, count: 1 });
        textLower = textLower.replace(regex, ' ');
      }
    });

    // 2. Clean remaining text and extract lowercase words
    const words = textLower
      .replace(/[^a-z0-9\s#\+-]/g, ' ') // Keep # (C#) and + (C++)
      .split(/\s+/)
      .map(w => w.trim())
      .filter(w => w.length > 1 && !this.stopWords.has(w));

    // Calculate frequencies
    const freq = {};
    words.forEach(w => {
      freq[w] = (freq[w] || 0) + 1;
    });

    const isTechSkill = (key) => {
      return /react|node|javascript|typescript|python|figma|css|html|aws|docker|sql|seo|analytics|design|ui|ux|machine learning|design systems|single page applications|user interface|user experience|software engineering|web development|cloud computing|data science|ci\/cd|continuous integration|continuous deployment|responsive design|mobile development/i.test(key);
    };

    // Combine
    const allKeywords = [...extractedPhrases];
    Object.keys(freq).forEach(key => {
      allKeywords.push({ keyword: key, count: freq[key] });
    });

    // Sort descending by frequency and weight
    const sortedKeywords = allKeywords.map(item => {
      let weight = item.count;
      
      // Technical skill boosts
      if (isTechSkill(item.keyword)) {
        weight *= 2.0;
      }
      
      return { keyword: item.keyword, weight };
    }).sort((a, b) => b.weight - a.weight);

    // Return top 15 parsed keywords
    return sortedKeywords.map(k => k.keyword).slice(0, 15);
  }
};
