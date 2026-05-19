# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server at http://localhost:5173
npm run build    # production build → dist/
npm run preview  # serve the production build locally
npm run lint     # ESLint (react-hooks + react-refresh rules)
```

There are no tests. No test runner is configured.

## Architecture

Everything lives in a single file: `src/App.jsx`. There is no routing, no state management library, and no CSS framework — all styling is inline.

### Data layer (top of App.jsx)

- **`TIER`** — object keyed 1–4 defining color, background, border, and label for each school tier.
- **`SCHOOLS`** — array of 14 hardcoded school objects. Each entry contains: `admissions`, `grading`, `curriculum`, `specialties`, `nih`, `jamp` (contact), `duals`, and SVG offset hints (`dx`, `dy`).

To add or update a school, edit the `SCHOOLS` array directly. There is no API or external data source.

### Map projection

The SVG map uses a custom linear projection (`project(lng, lat)`) that maps geographic coordinates to an 800×600 SVG viewport. The Texas border is a hardcoded polygon string (`TX_POLY`). No mapping library (Leaflet, Mapbox, etc.) is used.

### Component tree

```
TexasMedMap          ← root; owns selected / hovered / showAllLabels state
├── SVG map          ← renders TX_POLY + SCHOOLS markers inline
├── SchoolDetail     ← right panel when a school is selected
│   ├── Section      ← titled section wrapper
│   ├── InfoRow      ← label/value row
│   └── Badge        ← pill chip
└── SchoolList       ← right panel when nothing is selected; schools grouped by tier
```

### Styling convention

All styles are inline style objects. Hover effects that can't be done with inline styles (`:hover`, `::-webkit-scrollbar`, `@keyframes`) are injected via a `<style>` tag rendered inside `TexasMedMap`.

### Source file relationship

`texas_med_schools_map.jsx` in the parent directory (`Med School Prep/`) is the original standalone source. `src/App.jsx` is a copy of it used by the Vite dev server. Keep them in sync manually when making changes.
