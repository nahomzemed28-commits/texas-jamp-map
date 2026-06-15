# Texas Medical Schools — Interactive Explorer

An interactive full-screen map of all **16 Texas medical schools**, built for pre-med students researching programs, comparing stats, and understanding which schools participate in **JAMP** (Joint Admissions Medical Program).

---

## What Is JAMP?

JAMP is a state-funded Texas program that guarantees admission to a participating medical school for qualifying undergraduate students, administered by the University of Texas Health Science Center.

**Eligibility at a glance:**

| Requirement | Criteria |
|---|---|
| Residency | Texas resident · US citizen or permanent resident |
| Financial Need | Pell-eligible (Student Aid Index: −1,500 to 7,000) |
| Academic | 3.40+ overall GPA · 3.25+ BCPM GPA |
| Application | Opens May 1 · Closes October 1 (annual cycle) |

Full details: [texasjamp.org](https://texasjamp.org)

---

## Features

### Interactive Map
- Full-screen dark map of Texas using D3-geo + US Census Bureau state boundaries (`us-atlas`)
- 16 school markers color-coded by tier (Nationally Prominent → Emerging)
- Night sky background with star field and ambient moon glow
- **Scroll-wheel zoom** with cursor-centered zoom behavior; +/−/⌂ buttons in corner

### Hover Preview Card
Hovering any marker shows a floating card with school name, tier, degree type, location, MCAT, GPA, class size, and a Non-JAMP badge for private schools.

### School Detail Panel (4-tab slide-in)
Clicking a marker opens a panel from the right:

| Tab | Contents |
|---|---|
| **Overview** | JAMP coordinator contact · Key school notes · Non-JAMP notice for private schools |
| **Admissions** | MCAT, GPA, class size, acceptance rate · Preclinical & clinical grading |
| **Academics** | Curriculum structure · Preclinical length · Step 1 / COMLEX timing · Specialties |
| **Research** | NIH funding rank & amount · Dual degree programs |

Each tab includes a **Sources** section linking to JAMP, TMDSAS, AAMC, Blue Ridge Institute, and the school's official website.

### JAMP-Only Toggle
A **"JAMP Only"** filter pill dims the 2 non-JAMP private schools so you can focus on the 14 JAMP-participating institutions.

### Tier Filter
Filter by Tier 1–4 to highlight schools by research prominence.

---

## Schools Covered (16 Total · 2025–2026 Data)

### JAMP Schools (14)

| School | Short Name | Degree | Tier | City |
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

### Non-JAMP Schools (2 · Private)

| School | Short Name | Degree | Tier | City |
|---|---|---|---|---|
| Anne Burnett Marion School of Medicine at TCU | TCU Burnett | MD | 3 | Fort Worth |
| University of the Incarnate Word SOM | UIWSOM | DO | 4 | San Antonio |

**Tier definitions:**
- **Tier 1 — Nationally Prominent**: Top NIH funding, highest research output
- **Tier 2 — Well-Established**: Strong research + clinical programs, regional prominence
- **Tier 3 — Established**: Solid programs with defined missions
- **Tier 4 — Emerging / Newer**: Founded 2015 or later; growing programs

---

## Getting Started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
```

No environment variables. No backend. No API keys.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Map rendering | D3-geo (`geoMercator` + `geoPath`) + `us-atlas` TopoJSON |
| Styling | Inline styles + Tailwind CSS v4 |
| UI components | shadcn/ui (Tooltip, ScrollArea, etc.) |
| Icons | Lucide React |
| Font | Geist Variable |

---

## Data Sources

All statistics reflect the **2024–2025 entering class**.

- **Admissions**: [AAMC](https://www.aamc.org/data-reports/students-residents/data/aamc-data-snapshot) · [TMDSAS](https://www.tmdsas.com) · individual school websites
- **NIH rankings**: [Blue Ridge Institute for Medical Research](https://www.brimr.org/NIH_Awards/NIH_Awards.htm)
- **JAMP coordinator contacts**: [texasjamp.org](https://texasjamp.org/about/participating-schools.html)

> **UT Tyler**: Phased JAMP implementation — guaranteed admission begins 2026–2027 cycle.
> **TCU Burnett & UIWSOM**: Private institutions; JAMP does not apply.

---

## License

MIT © 2025 Nahom Zemed
