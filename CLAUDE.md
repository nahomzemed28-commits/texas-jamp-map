# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Commands

```bash
npm run dev      # dev server at http://localhost:5173
npm run build    # production build → dist/
npm run preview  # serve the production build locally
npm run lint     # ESLint (react-hooks + react-refresh rules)
```

No test suite is configured. Visual verification via `npm run dev` is the primary QA method.

## Architecture

Everything lives in one file: **`src/App.jsx`**. No routing, no state management library, no CSS framework — all styles are inline objects.

### Data layer

- **`TIER`** — object keyed 1–4 with `color`, `glow`, and `label` for each tier.
- **`SCHOOLS`** — array of 16 school objects (14 JAMP + 2 non-JAMP). Each has `isJAMP: boolean`, `jamp` (coordinator object or `null` for non-JAMP), `admissions`, `grading`, `curriculum`, `specialties`, `nih`, `duals`, `website`, and map offset hints `dx`/`dy`.

To add or update a school, edit `SCHOOLS` directly. No API or external data source.

### Map projection

Uses **D3-geo** (`geoMercator().fitExtent()`) projecting the Texas GeoJSON feature (extracted from `us-atlas` TopoJSON via `topojson-client`) into an 800×600 SVG viewport. `project(lng, lat)` converts geographic coordinates to SVG pixel positions.

Zoom state (`vb`) is a `{ x, y, w, h }` viewBox object updated by scroll-wheel (non-passive listener) and +/−/⌂ buttons.

### Component tree

```
TexasMedMap
├── Star field SVG (full-screen, position:absolute, pointerEvents:none)
├── Map SVG (D3-geo Texas + school markers)
│   ├── Texas path (glow + fill + crisp edge)
│   └── School markers (glowing circles, tier-colored)
├── Floating header (brand + JAMP-only toggle + tier filter pills)
├── Bottom legend
├── Zoom controls (+/−/⌂)
├── HoverCard (fixed, follows cursor)
└── SchoolPanel (slide-in from right)
    ├── TabOverview   (JAMP coordinator or Non-JAMP notice + key notes)
    ├── TabAdmissions (stats grid + grading system)
    ├── TabAcademics  (curriculum + specialties)
    └── TabResearch   (NIH funding + dual degrees)
    Each tab ends with a TabSources section.
```

### Key state

| State | Type | Purpose |
|---|---|---|
| `selected` | school \| null | Opens SchoolPanel |
| `hovered` | school \| null | Shows HoverCard |
| `hoverPos` | `{x,y}` | Screen coords for HoverCard |
| `tierFilter` | 0–4 | 0 = All tiers |
| `showJampOnly` | bool | Dims non-JAMP schools |
| `vb` | `{x,y,w,h}` | SVG viewBox for zoom |

### Source sync

After editing `src/App.jsx`, copy to the parent directory:

```bash
cp src/App.jsx ../texas_med_schools_map.jsx
```
