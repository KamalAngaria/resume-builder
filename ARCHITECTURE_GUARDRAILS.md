# ARCHITECTURE_GUARDRAILS.md
# CVcraft Pro — Agent & Developer Guardrails

> **READ THIS BEFORE TOUCHING ANY FILE.**
> This document defines the inviolable boundaries of the CVcraft Pro architecture.
> Any AI agent, developer, or automated task runner operating on this codebase
> must comply with every rule in this file. Violations create cascading failures,
> data loss, and ATS regressions that are extremely difficult to debug.

---

## 1. What You May NOT Change

### 1.1 Core State Schema

The resume state object is the single source of truth for the entire application.
**You may NOT rename, remove, or restructure any top-level key.**

```javascript
// FROZEN SCHEMA — do not alter key names or types
{
  id: String,              // UUID — never reassign after creation
  name: String,            // Resume display name
  template: String,        // Must be one of: VALID_TEMPLATES (see §4)
  colorScheme: String,     // Hex or named theme token
  fontFamily: String,      // One of: VALID_FONTS
  createdAt: Number,       // Unix timestamp ms — set once, never updated
  updatedAt: Number,       // Unix timestamp ms — updated on every save
  personal: {
    name: String,
    title: String,
    email: String,
    phone: String,
    location: String,
    website: String,
    summary: String,
    photo: String          // base64 data URI or empty string — NEVER null
  },
  sections: {
    experience: Array,     // See §1.2 for card schema
    education: Array,
    skills: Array,
    languages: Array,
    certifications: Array,
    projects: Array
  }
}
```

**If you need new data**, add a new optional key — never repurpose or rename an existing one.

---

### 1.2 Card (Entry) Schema

Every array in `sections` contains card objects with this frozen schema:

```javascript
{
  id: String,              // UUID — assigned at creation, NEVER regenerated
  order: Number,           // Integer sort index — must stay contiguous
  // ... section-specific fields below
}
```

Section-specific fields (Experience):
```javascript
{
  id, order,
  company: String,
  role: String,
  startDate: String,       // Format: "YYYY-MM" or empty string
  endDate: String,         // Format: "YYYY-MM" or "Present" or empty string
  location: String,
  description: String      // May contain newlines (\n) — render as <br> NOT as block elements
}
```

**You may NOT:**
- Change the date format
- Rename `role` to `title` or vice versa
- Replace the `description` string with an array of bullet strings

---

### 1.3 LocalStorage Schema

The application writes to exactly **one localStorage key**:

```
Key:   'resumes'
Value: JSON.stringify(Array<ResumeObject>)
```

**You may NOT:**
- Split this into multiple keys
- Add secondary localStorage keys without updating the BUG-07 quota guard
- Change the key name (this would orphan all existing user data)
- Store non-resume application state under this key

The active resume index (which resume is selected) is kept in **memory only** — never in localStorage.

---

## 2. Render Pipeline Boundaries

### 2.1 The `render()` Function Contract

`render()` is the **only function** that writes to `#cvDoc` innerHTML.

```
INPUT:  Current active resume state (read-only)
OUTPUT: Sets innerHTML of #cvDoc
SIDE EFFECTS: None — render() must be pure relative to state
```

**You may NOT:**
- Call `render()` from inside `render()` (no recursive renders)
- Modify state inside `render()`
- Write to any DOM element outside `#cvDoc` from inside `render()`
- Make async calls inside `render()`

**You MAY:**
- Call `render()` after state mutations (template swap, card add/delete, bulk import)
- Use targeted DOM patching for single-field updates (see BUG-02) — but this is additive, not a replacement

### 2.2 State Mutation Order

State mutations must follow this strict order:

```
1. Validate input
2. Update in-memory state object
3. Call saveActiveResume() OR queue it via debounce
4. Call render() or patch DOM
```

**Never render before saving.** A crash between render and save will create visible state that is not persisted.

### 2.3 Template Swap Contract

Template swaps must:
1. Destroy all card instances and event listeners (see BUG-03)
2. Update `state.template`
3. Clear `#cvDoc` innerHTML explicitly
4. Call `render()` with the new template
5. Re-attach all input listeners

**You may NOT** swap a template by patching the class on `#cvDoc` without going through this pipeline — partial class swaps leave mixed template CSS states.

---

## 3. Storage Guardrails

### 3.1 Write Protection

All `localStorage.setItem()` calls must go through `safeSave()` (see BUG-07 fix).

**Never call `localStorage.setItem()` directly.**

```javascript
// ❌ FORBIDDEN
localStorage.setItem('resumes', JSON.stringify(data));

// ✅ REQUIRED
safeSave('resumes', JSON.stringify(data));
```

### 3.2 Quota Budget

- Warn user at **4.5 MB** total localStorage usage
- Block new resume creation/duplication at **4.8 MB**
- The 5 MB quota is a hard browser limit — budget for it, not against it

### 3.3 Cross-Tab Safety

All storage writes must be compatible with the `storage` event listener (BUG-10 fix).
Never write a value that would cause an infinite re-sync loop:

```javascript
// Safe pattern: listener re-initialises but does NOT re-save
window.addEventListener('storage', (e) => {
  if (e.key === 'resumes') {
    initResumes(JSON.parse(e.newValue)); // read only — no write back
  }
});
```

---

## 4. Export Contract

### 4.1 PDF Export

The PDF export pipeline must produce output that satisfies:

| Requirement | Rule |
|-------------|------|
| Page size | A4 (210mm × 297mm) default; US Letter as secondary option |
| Card boundaries | No card split across pages (`break-inside: avoid`) |
| Section headers | Never orphaned at page bottom (`break-after: avoid`) |
| Fonts | All fonts must be embedded or substituted — no missing-font boxes |
| Vector text | Text must be selectable in the PDF — no full-page bitmap rasterisation |

**You may NOT:**
- Introduce a new canvas-rasterisation step that processes the full document as a single bitmap (the BUG-01 regression)
- Remove the `break-inside` CSS rules for any performance reason
- Export a PDF where any text is unselectable

### 4.2 `.cvcraft` File Export

The `.cvcraft` file format is a renamed `.json` file containing a single `ResumeObject`.

**Frozen format:**
```json
{
  "cvcraft_version": "1",
  "resume": { /* ResumeObject — see §1.1 */ }
}
```

**You may NOT:**
- Change the `cvcraft_version` key name
- Compress, encode, or encrypt the file without bumping the version and providing a migration path
- Exclude any top-level key from the `resume` object in the export

### 4.3 Share Link (Base64) Export

- Share links must be generated after a synchronous `saveActiveResume()` call (see BUG-09)
- The `personal.photo` field must continue to be excluded from the base64 payload (URL length)
- All other fields must be included verbatim
- The URL format is: `{origin}?resume={base64_payload}` — the query key `resume` is frozen

---

## 5. ATS Rules — Non-Negotiable

These rules exist to protect users' job applications. ATS regressions are the most serious non-crash bug class in this codebase.

### 5.1 DOM Source Order

For every template, the DOM source order inside `#cvDoc` must follow this sequence:

```
1. Contact / Header block
2. Summary / Objective
3. Experience entries (in chronological order, most recent first)
4. Education entries
5. Skills / Languages
6. Certifications / Projects / Other sections
```

**Visual layout may differ** (columns, sidebars) using CSS `order`, `grid-area`, or `flex` — but DOM order must match the above.

### 5.2 Heading Hierarchy

- The resume holder's name must be the only `<h1>` on the page
- Section names (Experience, Education, etc.) must use `<h2>`
- Company/role titles must use `<h3>` or `<strong>` — not raw `<div>` text
- **Never use heading tags for decorative layout elements**

### 5.3 Forbidden ATS-Breaking Patterns

| Pattern | Why it breaks ATS | Status |
|---------|-------------------|--------|
| Text in `::before` / `::after` CSS pseudo-elements | Invisible to parsers | ❌ FORBIDDEN |
| Position: absolute text elements | Read out of flow order | ❌ FORBIDDEN |
| SVG text nodes for resume content | Not parsed as text | ❌ FORBIDDEN |
| CSS `content:` for dates or titles | Invisible to parsers | ❌ FORBIDDEN |
| Canvas-rendered text | Not text — it's pixels | ❌ FORBIDDEN |
| Inline `display:none` content (for ATS stuffing) | ATS spam violation | ❌ FORBIDDEN |

### 5.4 Validation Gate

Before merging any change that touches a template file, run the ATS plain-text check:

```javascript
// Must produce logical, unscrambled plain text
const plainText = document.getElementById('cvDoc').innerText;
// Assert: no sidebar content appears within experience block lines
```

---

## 6. What Agents May Freely Change

The following are explicitly in scope for modification without additional review:

- CSS visual styling within `templates.css` (colours, spacing, fonts — subject to ATS rules in §5)
- UI chrome outside `#cvDoc` (buttons, panels, sidebar editor layout)
- Adding new optional fields to the card schema (additive only — never rename/remove)
- Debounce timer durations (within 50ms–500ms range)
- Toast/notification copy and styling
- Adding new section types (following the existing card schema pattern)

---

## 7. Change Protocol

Before modifying any of the following files, document the change reason in a commit message that references the relevant BUG-XX report:

| File | Risk Level |
|------|------------|
| `state.js` / state management module | 🔴 Critical |
| `render.js` / `render()` function | 🔴 Critical |
| `storage.js` / localStorage layer | 🔴 Critical |
| `export.js` / PDF + share export | 🟠 Major |
| `templates.css` | 🟡 Moderate (ATS risk) |
| `templates/*.html` | 🟡 Moderate (ATS risk) |
| UI components outside `#cvDoc` | 🟢 Low |

---

## 8. Quick Reference — Absolute Hard Rules

```
❌ Never write to localStorage directly — always use safeSave()
❌ Never call render() from inside render()
❌ Never rename a frozen schema key
❌ Never rasterise the full document as a canvas bitmap for PDF
❌ Never place resume content in CSS pseudo-elements or SVG text
❌ Never allow a state write to proceed without error handling
❌ Never generate a share link before flushing pending saves
❌ Never swap templates without destroying card event listeners first

✅ Always maintain DOM source order per §5.1
✅ Always run ATS plain-text check after any template change
✅ Always add break-inside: avoid to new card/section types
✅ Always call destroyCard() before removeEntry() finalises
✅ Always clear pending debounce timers on tab/section navigation
✅ Always keep cvcraft_version in exported .cvcraft files
```

---

*Last updated: based on CVcraft Pro Aggressive Stress Test & Security Vulnerability Report.*
*Maintainer: update this file whenever a new architectural pattern is introduced.*
