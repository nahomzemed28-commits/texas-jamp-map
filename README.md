# Texas JAMP Medical Schools — Interactive Explorer

An interactive map and data explorer for the 14 Texas medical schools participating in the **Joint Admissions Medical Program (JAMP)**. Built for pre-med students who want to research, compare, and contact schools in one place.

Live at: `http://localhost:5173` (dev) · `npm run build` → `dist/` (production)

---

## What Is JAMP?

JAMP (Joint Admissions Medical Program) is a state-funded Texas program that guarantees admission to a participating medical school for qualifying undergraduate students. It is administered by the University of Texas Health Science Center.

**Eligibility at a glance:**

| Requirement     | Criteria                                               |
|-----------------|--------------------------------------------------------|
| Residency       | Texas resident · US citizen or permanent resident      |
| Financial Need  | Pell-eligible (Student Aid Index: −1,500 to 7,000)    |
| Academic        | 3.40+ overall GPA · 3.25+ BCPM GPA                    |
| Application     | Opens May 1 · Closes October 1 (annual cycle)          |

2025 cohort: 150 scholars accepted from 364 applications (25% year-over-year increase).  
Full details: [texasjamp.org](https://texasjamp.org)

---

## Features

### Interactive Map
- **D3-geo SVG map** of Texas using US Census Bureau state boundaries (via `us-atlas`)
- Color-coded markers by tier (Nationally Prominent → Emerging)
- Hover tooltips show school name, degree type, MCAT median, GPA, and tier
- Tier-1 school labels always visible; all labels visible on hover/selection
- DO schools marked with a dashed ring to distinguish from MD

### School Detail Panel (4-tab layout)
Clicking a marker or list item opens a detail panel with four tabs:

| Tab          | Contents                                                   |
|--------------|------------------------------------------------------------|
| **Overview** | JAMP coordinator name, phone, and email · Key school notes |
| **Admissions** | Avg MCAT, GPA, class size, acceptance rate (animated) · Preclinical and clinical grading systems |
| **Academics** | Curriculum structure · Preclinical length · Step 1 / COMLEX timing · Notable specialties |
| **Research** | NIH funding rank and dollar amount · Dual degree programs (MD/PhD, MD/MPH, etc.) |

### Compare Mode
Pin up to 3 schools using the scale icon (⚖) in the detail panel. When 2+ schools are pinned, a **Compare** button appears in the header. The compare view shows an aligned side-by-side table of:
- MCAT, GPA, acceptance rate, class size
- Degree type, preclinical grading, Step 1 timing, NIH rank
- Rows where schools match are grayed out to highlight differences
- JAMP coordinator contacts for each pinned school

### Saved / Favorites
- Bookmark icon in the detail panel header saves a school to local storage
- **Saved** filter pill in the school list shows only bookmarked schools
- Persists across page refreshes via `localStorage`

### Search & Filter
- **Text search** by school name, short name, or city
- **Degree filter**: All / MD / DO
- **Tier filter**: T1 through T4 (click to toggle; click again to clear)
- **Sort**: Tier (default, grouped) · MCAT · GPA · Class Size
- When sorted by MCAT/GPA/Class Size, the list switches from tier groups to a ranked flat list

### JAMP Eligibility Widget
Click **JAMP Info** in the header for a popover summarizing the four eligibility requirements and application window.

### Mobile Layout
- Full-screen single-panel view on mobile (`< 768px`)
- **Bottom navigation bar**: Map · Schools · Detail (disabled until a school is selected)
- Desktop shows a split panel: map on left, 400px sidebar on right

---

## Data Coverage (14 Schools, 2025–2026)

| School | Short Name | Degree | Tier | Location |
|---|---|---|---|---|
| Baylor College of Medicine | BCM | MD | 1 | Houston |
| UT Southwestern Medical Center | UTSW | MD | 1 | Dallas |
| Dell Medical School (UT Austin) | Dell Med | MD | 2 | Austin |
| Long School of Medicine (UT Health SA) | Long SOM | MD | 2 | San Antonio |
| McGovern Medical School (UTHealth Houston) | McGovern | MD | 2 | Houston |
| Sealy School of Medicine (UTMB) | Sealy/UTMB | MD | 2 | Galveston |
| Texas A&M Naresh K. Vashisht COM | TAMU Med | MD | 3 | Bryan/College Station |
| Paul L. Foster School of Medicine (TTUHSC El Paso) | Foster SOM | MD | 3 | El Paso |
| TTUHSC School of Medicine (Lubbock) | TTUHSC | MD | 3 | Lubbock |
| Texas College of Osteopathic Medicine (TCOM) | TCOM | DO | 3 | Fort Worth |
| Fertitta Family College of Medicine (UH) | UH Med | MD | 4 | Houston |
| UT Rio Grande Valley School of Medicine | UTRGV Med | MD | 4 | Edinburg |
| Sam Houston State University COM | SHSU-COM | DO | 4 | Conroe |
| UT Tyler School of Medicine | UT Tyler | MD | 4 | Tyler |

**Tier definitions:**
- **Tier 1 — Nationally Prominent**: Top NIH funding, highest research output
- **Tier 2 — Well-Established**: Strong research + clinical programs, regional prominence
- **Tier 3 — Established**: Solid state schools with defined missions
- **Tier 4 — Emerging / Newer**: Founded 2016 or later; growing programs

**Data sources:** AAMC, TMDSAS, Blue Ridge Institute (NIH rankings), individual school websites, texasjamp.org (coordinator contacts). Statistics reflect the 2024–2025 entering class.

> **Note on UT Tyler:** Phased JAMP implementation per Texas SB 2123. Mentoring and internships active now; guaranteed admission begins 2026–2027 cycle.

---

## Tech Stack

| Layer          | Technology                                          |
|----------------|-----------------------------------------------------|
| Framework      | React 19 + Vite 8                                   |
| Map rendering  | D3-geo (`geoMercator` + `geoPath`) + `us-atlas`     |
| UI components  | shadcn/ui (Tooltip, ScrollArea, Input, Separator)   |
| Styling        | Tailwind CSS v4 + inline styles                     |
| Background     | Custom WebGL shader via `Grainient` component (OGL) |
| Splash screen  | `CosmicParallaxBg` (CSS star-field animation, 1.8s) |
| Animations     | `NumberTicker`, `BorderBeam`, `GlowingEffect`, `BorderGlow`, `AnimatedGradientText` |
| Icons          | Lucide React                                        |
| Font           | Geist Variable (`@fontsource-variable/geist`)       |
| Persistence    | `localStorage` (favorites only)                     |
| State          | React `useState` + `useMemo` (no external library)  |

---

## Project Structure

```
texas-map/
├── src/
│   ├── App.jsx                     ← entire application (single file)
│   ├── index.css                   ← Tailwind imports + CSS animations
│   ├── main.jsx                    ← React entry point
│   ├── lib/
│   │   └── utils.js                ← cn() helper (clsx + tailwind-merge)
│   └── components/ui/
│       ├── animated-gradient-text.jsx
│       ├── border-beam.jsx
│       ├── border-glow.jsx / .css
│       ├── glowing-effect.jsx
│       ├── grainient.jsx            ← WebGL background shader
│       ├── number-ticker.jsx
│       ├── parallax-cosmic-background.jsx
│       ├── scroll-area.jsx
│       ├── tooltip.jsx
│       └── ...
├── public/
├── package.json
├── vite.config.js
├── jsconfig.json                   ← path alias: @/ → src/
└── CLAUDE.md                       ← architecture notes for Claude Code
```

The parent directory also contains `texas_med_schools_map.jsx` — a standalone copy of `src/App.jsx` kept in sync manually.

---

## Architecture

**Everything in one file.** `src/App.jsx` contains all data, components, and logic. This is intentional — the project has no routing, no external API, and no state management library. React `useState` + `useMemo` handle all interactions.

### Component tree

```
TexasMedMap (root)
├── Grainient (WebGL bg, fixed)
├── CosmicParallaxBg (splash, unmounts after 1.8s)
├── JAMP Info Popover (conditional, absolute-positioned)
├── Header (logo + tier legend + JAMP Info + Compare button)
├── Body (flex row)
│   ├── SVG Map (D3-geo Texas + school markers with tooltips)
│   └── Side Panel (400px, one of three views)
│       ├── SchoolList (search / filter / sort + school rows)
│       │   └── SchoolRow × 14
│       ├── SchoolDetail (4-tab layout)
│       │   ├── TabOverview   (JAMP contact + notes)
│       │   ├── TabAdmissions (stats grid + grading)
│       │   ├── TabAcademics  (curriculum + specialties)
│       │   └── TabResearch   (NIH funding + dual degrees)
│       └── ComparePanel (side-by-side table, 2–3 schools)
└── Mobile Bottom Nav (Map | Schools | Detail)
```

### Data flow

- `SCHOOLS` array is the single source of truth — no API, no database
- `filteredSchools` (useMemo) applies search, tier, degree, favorites, and sort in one pass
- `compareList` is an array of school IDs (max 3) driving the compare view
- `favorites` is synced to `localStorage` on every toggle
- Hover state flows bidirectionally: hovering a map marker highlights the list row and vice versa

### Map projection

Uses `geoMercator().fitExtent()` to fit the Texas GeoJSON feature into an 800×600 SVG viewport. Texas is extracted from the `us-atlas` TopoJSON via `topojson-client`. No external map tile service is used. For dense areas (Houston has 3 nearby schools), markers are manually offset via `dx`/`dy` fields on each school object.

---

## Commands

```bash
npm run dev      # dev server at http://localhost:5173
npm run build    # production build → dist/
npm run preview  # serve the production build locally
npm run lint     # ESLint (react-hooks + react-refresh rules)
```

No test suite is configured.

---

## Updating School Data

All school data lives in the `SCHOOLS` array at the top of `src/App.jsx`. Each entry follows this shape:

```js
{
  id: 1,
  name: "Full school name",
  shortName: "Abbreviation",
  degree: "MD",          // or "DO"
  tier: 1,               // 1–4
  location: "City, TX",
  lat: 29.71, lng: -95.40,   // geographic coordinates
  dx: 0, dy: 0,              // SVG label pixel offset (tweak if labels overlap)
  jamp: {
    name: "Coordinator Full Name",
    phone: "XXX-XXX-XXXX",
    email: "email@domain.edu",  // null if unconfirmed
  },
  admissions: {
    mcat: "518.7",
    gpa: "3.93",
    classSize: "226",
    acceptRate: "3.7%",
  },
  grading: {
    preclinical: "Pass / Fail",
    clinical: "H / HP / P / F",
  },
  curriculum: {
    structure: "...",
    preclinical: "...",
    step1: "...",
  },
  specialties: ["...", "..."],
  nih: { rank: "...", funding: "..." },
  notes: "...",
  duals: ["MD/PhD", "MD/MPH"],
}
```

After editing `src/App.jsx`, copy it to the parent directory to keep both files in sync:

```bash
cp src/App.jsx ../texas_med_schools_map.jsx
```

---

## JAMP Coordinator Contacts (May 2025)

Sourced from [texasjamp.org/about/participating-schools.html](https://texasjamp.org/about/participating-schools.html).

| School | Coordinator | Phone | Email |
|---|---|---|---|
| BCM | Alexandra Gonzales | 713-798-4842 | alexandra.gonzales@bcm.edu |
| Dell Med (UT Austin) | Liliana Martinez | 512-495-5821 | Liliana.martinez@austin.utexas.edu |
| Long SOM (UT Health SA) | Ana Isabel Leos | 210-567-0304 | leosa3@uthscsa.edu |
| McGovern (UTHealth Houston) | Yolanda Bell | 713-500-5165 | yolanda.n.bell@uth.tmc.edu |
| SHSU-COM | Christopher Truong | 936-202-5208 | cat075@shsu.edu |
| Texas A&M Vashisht COM | Guillermo Canedo | 979-436-0232 | gcanedo@tamu.edu |
| Foster SOM (TTUHSC El Paso) | Yoli Betancourt | 915-215-4407 | Yolanda.Betancourt@ttuhsc.edu |
| TTUHSC Lubbock | Louis Perez / Monica Galindo | 806-743-2297 | *(not listed)* |
| UH Fertitta Family COM | Ashley Schwartz | 713-743-7047 | adschwar@central.uh.edu |
| TCOM (UNTHSC) | Lorena Marin | 817-735-2475 | Lorena.Marin@unthsc.edu |
| UTMB Sealy | LeTanya Neely | 409-772-3763 | ldneely@utmb.edu |
| UTRGV | Itzely Moreno-Ortiz | 956-296-1600 | itzely.ortiz01@utrgv.edu |
| UTSW | Jaclyn Young | 214-648-4476 | jaclyn.young@utsouthwestern.edu |
| UT Tyler | Tonny Williams | 903-877-7566 | ⚠️ email unconfirmed — use phone |

> **UT Tyler:** The JAMP website currently lists UT Tyler's coordinator email as UTMB's address (ldneely@utmb.edu) — likely a copy-paste error. Contact by phone until corrected.

---

## Known Limitations

- **No zoom/pan** on the SVG map — viewport is fixed at 800×600. Adjust `dx`/`dy` values per school if markers overlap after data updates.
- **Bundle size** is ~632 KB minified (205 KB gzipped), dominated by `us-atlas` TopoJSON and the OGL WebGL library. Consider lazy-loading if initial load time matters.
- **Admissions stats** are averaged across credible sources (TMDSAS, AAMC, Shemmassian, PremedCatalyst) for the 2024–2025 entering class. Individual school data may differ slightly depending on whether medians or averages are reported. Update annually.
- **No test suite** configured. Visual verification via `npm run dev` is the primary QA method.
