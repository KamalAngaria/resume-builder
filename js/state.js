// ══════════════════════════════════════════════════════════
// STATE
// ══════════════════════════════════════════════════════════
const DEFAULT_BLANK_RESUME = {
  photo: null, photoSize: 76, photoBR: 50,
  accent: '#535366', layout: 'classic', font: 'DM Sans', fontSize: 100, lineH: 1.65, secGap: 20,
  f_name: '', f_title: '', f_summary: '',
  f_email: '', f_phone: '', f_city: '', f_country: '', f_linkedin: '', f_website: '', f_github: '',
  skills: [],
  langs: [],
  experience: [],
  education: [],
  certs: [],
  awards: [],
  interests: [],
  sectionOrder: ['summary', 'experience', 'education', 'certifications', 'skills', 'languages', 'awards', 'interests'],
  sectionVis: { summary: true, experience: true, education: true, certifications: true, skills: true, languages: true, awards: false, interests: true }
};

const DEFAULT_SAMPLE_RESUME = {
  photo: null, photoSize: 76, photoBR: 50,
  accent: '#535366', layout: 'classic', font: 'DM Sans', fontSize: 100, lineH: 1.65, secGap: 20,
  f_name: 'Alex Johnson',
  f_title: 'Senior Product Designer',
  f_summary: 'Creative and detail-oriented Product Designer with 7+ years crafting digital experiences for top-tier tech companies. Passionate about user-centric design and building elegant interfaces that solve real problems.',
  f_email: 'alex@email.com',
  f_phone: '+1 234 567 890',
  f_city: 'New York',
  f_country: 'USA',
  f_linkedin: 'linkedin.com/in/alexj',
  f_website: 'alexjohnson.design',
  f_github: '',
  skills: ['Figma', 'Sketch', 'Prototyping', 'User Research', 'HTML/CSS', 'Design Systems', 'Wireframing', 'Adobe XD'],
  langs: [{ lang: 'English', level: 'Native' }, { lang: 'Spanish', level: 'Conversational' }],
  experience: [
    { company: 'TechFlow Inc.', role: 'Senior Product Designer', start: 'Jan 2021', end: 'Present', desc: '• Led redesign of core product increasing user retention by 34%\n• Managed a team of 3 junior designers across 2 product lines\n• Established design system used across 8 products\n• Collaborated with engineering on component library' },
    { company: 'PixelForge Studio', role: 'Product Designer', start: 'Mar 2018', end: 'Dec 2020', desc: '• Designed mobile-first interfaces for iOS and Android\n• Conducted 40+ user interviews driving key product decisions\n• Delivered 12 end-to-end product designs on schedule' }
  ],
  education: [
    { school: 'Parsons School of Design', degree: 'BFA Graphic Design', start: '2014', end: '2018', desc: "Dean's List. Specialized in UI/UX and interactive media." }
  ],
  certs: [
    { name: 'Google UX Design Professional Certificate', issuer: 'Coursera', year: '2022' }
  ],
  awards: [],
  interests: ['Photography', 'Travel', 'Open Source'],
  sectionOrder: ['summary', 'experience', 'education', 'certifications', 'skills', 'languages', 'awards', 'interests'],
  sectionVis: { summary: true, experience: true, education: true, certifications: true, skills: true, languages: true, awards: false, interests: true }
};

const S = JSON.parse(JSON.stringify(DEFAULT_BLANK_RESUME));
window.S = S;

// ══════════════════════════════════════════════════════════
// CONSTANTS
// ══════════════════════════════════════════════════════════
const COLORS = [
  '#535366', // Slate
  '#1C1C1C', // Charcoal
  '#2563eb', // Royal Blue
  '#0f766e', // Teal
  '#be123c'  // Bordeaux Red
];

const LAYOUTS = [
  { id: 'classic', name: 'Classic', thumb: 'classic' },
  { id: 'sidebar-l', name: 'Sidebar Left', thumb: 'sidebar-l' },
  { id: 'minimal', name: 'Minimal', thumb: 'minimal' },
  { id: 'modern-split', name: 'Modern Split', thumb: 'modern-split' },
  { id: 'elegant', name: 'Elegant', thumb: 'elegant' },
];

const FONTS = [
  { id: 'DM Sans', label: 'DM Sans', preview: 'Aa', style: 'sans-serif' },
  { id: 'Montserrat', label: 'Montserrat', preview: 'Aa', style: 'sans-serif' },
  { id: 'IBM Plex Sans', label: 'IBM Plex', preview: 'Aa', style: 'sans-serif' },
  { id: 'Playfair Display', label: 'Playfair', preview: 'Aa', style: 'serif' },
  { id: 'Merriweather', label: 'Merriweather', preview: 'Aa', style: 'serif' },
];

const SEC_LABELS = {
  summary: 'Summary', experience: 'Experience', education: 'Education',
  certifications: 'Certifications', skills: 'Skills', languages: 'Languages',
  awards: 'Awards', interests: 'Interests'
};
const SEC_ICONS = {
  summary: 'ti-align-left', experience: 'ti-briefcase', education: 'ti-school',
  certifications: 'ti-certificate', skills: 'ti-tools', languages: 'ti-language',
  awards: 'ti-trophy', interests: 'ti-heart'
};
