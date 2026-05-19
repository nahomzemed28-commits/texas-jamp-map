import { useState, useMemo, useEffect } from "react";
import { feature } from "topojson-client";
import { geoMercator, geoPath } from "d3-geo";
import usAtlas from "us-atlas/states-10m.json";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { NumberTicker } from "@/components/ui/number-ticker";
import { BorderBeam } from "@/components/ui/border-beam";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { CosmicParallaxBg } from "@/components/ui/parallax-cosmic-background";
import {
  ChevronLeft, Phone, BarChart3, BookOpen, Star, FlaskConical,
  GraduationCap, Lightbulb, MapPin, X, Users, Mail,
  Bookmark, Info, ArrowUpDown, Scale,
} from "lucide-react";
import { Grainient } from "@/components/ui/grainient";
import { BorderGlow } from "@/components/ui/border-glow";

// ─── Tier Config ─────────────────────────────────────────────────────────────
const TIER = {
  1: { color: "#F59E0B", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.35)", label: "Nationally Prominent" },
  2: { color: "#3B82F6", bg: "rgba(59,130,246,0.12)",  border: "rgba(59,130,246,0.35)",  label: "Well-Established" },
  3: { color: "#10B981", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.35)",  label: "Established" },
  4: { color: "#A855F7", bg: "rgba(168,85,247,0.12)",  border: "rgba(168,85,247,0.35)",  label: "Emerging / Newer" },
};

// ─── School Data ─────────────────────────────────────────────────────────────
const SCHOOLS = [
  {
    id: 1, name: "Baylor College of Medicine", shortName: "BCM",
    degree: "MD", tier: 1, location: "Houston, TX",
    lat: 29.7104, lng: -95.3972, dx: -28, dy: -18,
    jamp: { name: "Alexandra Gonzales", phone: "713-798-4842", email: "alexandra.gonzales@bcm.edu" },
    admissions: { mcat: "518.7", gpa: "3.93", classSize: "226", acceptRate: "3.7%" },
    grading: { preclinical: "Pass / Fail", clinical: "H / HP / P / MP / F" },
    curriculum: {
      structure: "Integrated, systems-based",
      preclinical: "18 months (compressed)",
      step1: "After 18-month foundational sciences phase, before clerkships",
    },
    specialties: [
      "Molecular & Human Genetics — #1 NIH nationally",
      "Pediatrics — #2 NIH nationally",
      "Neuroscience, Cancer, Cardiovascular research",
      "7 specialty career pathways (Space Medicine, Genomics, Global Health…)",
    ],
    nih: { rank: "#20 nationally · #1 in Texas", funding: "~$319M (2024)" },
    notes: "Private non-profit · 6 Nobel laureates · TX Medical Center (world's largest medical complex) · Only private school in this group",
    duals: ["MD/PhD (MSTP)", "MD/MPH", "MD/MBA (w/ Baylor Univ)", "MD/JD (w/ UH Law)", "MD/MS Biomed Informatics"],
  },
  {
    id: 2, name: "Dell Medical School (UT Austin)", shortName: "Dell Med",
    degree: "MD", tier: 2, location: "Austin, TX",
    lat: 30.2849, lng: -97.7341, dx: 0, dy: 0,
    jamp: { name: "Liliana Martinez", phone: "512-495-5821", email: "Liliana.martinez@austin.utexas.edu" },
    admissions: { mcat: "517", gpa: "3.85", classSize: "50", acceptRate: "0.88%" },
    grading: { preclinical: "Pass / Fail", clinical: "Competency-based P/F" },
    curriculum: {
      structure: "Leading EDGE — fully integrated (Explore, Design, Grow, Engage)",
      preclinical: "12 months (most accelerated in TX)",
      step1: "After the compressed 12-month preclinical phase",
    },
    specialties: [
      "Value-based care & health system innovation",
      "Community-centered medicine",
      "Social determinants of health",
      "Cross-disciplinary (engineering, law, business partnerships)",
    ],
    nih: { rank: "#54 nationally (jumped from #107 in 2023)", funding: ">$113M (UT Austin overall, 2024)" },
    notes: "Founded 2016 · Smallest class in TX (50) · Backed by UT Austin's full graduate ecosystem · Ascension Seton & Central Health affiliations",
    duals: ["MD/MBA", "MD/MPH", "MD/PhD"],
  },
  {
    id: 3, name: "Long School of Medicine (UT Health SA)", shortName: "Long SOM",
    degree: "MD", tier: 2, location: "San Antonio, TX",
    lat: 29.5091, lng: -98.5672, dx: 0, dy: 0,
    jamp: { name: "Ana Isabel Leos", phone: "210-567-0304", email: "leosa3@uthscsa.edu" },
    admissions: { mcat: "518", gpa: "3.89", classSize: "232", acceptRate: "4.22%" },
    grading: { preclinical: "Pass / Fail", clinical: "H / HP / P / F" },
    curriculum: {
      structure: "CIRCLE curriculum — integrated (Researchers, Clinicians, Leaders, Educators)",
      preclinical: "~18 months",
      step1: "Required before graduation; after pre-clerkship phase",
    },
    specialties: [
      "Neuroscience & Aging research — nationally recognized",
      "Military medicine (proximity to Joint Base San Antonio)",
      "South Texas underserved community care",
      "Clinical translational research",
    ],
    nih: { rank: "#49 nationally · #3 in Texas", funding: "~$125.4M (2024)" },
    notes: "3rd highest NIH in TX · 87.5% TX residents · South Texas Medical Center · Strong military pipeline (JBSA, Fort Sam Houston)",
    duals: ["MD/PhD (MSTP — NIH-funded, 8 students/yr)", "MD/MPH"],
  },
  {
    id: 4, name: "McGovern Medical School (UTHealth Houston)", shortName: "McGovern",
    degree: "MD", tier: 2, location: "Houston, TX",
    lat: 29.7198, lng: -95.4023, dx: 16, dy: 18,
    jamp: { name: "Yolanda Bell", phone: "713-500-5165", email: "yolanda.n.bell@uth.tmc.edu" },
    admissions: { mcat: "513", gpa: "3.90", classSize: "240", acceptRate: "3.93%" },
    grading: { preclinical: "Pass / Fail", clinical: "H / HP / P / BP / F" },
    curriculum: {
      structure: "Integrated, organ-system based; active learning & small groups",
      preclinical: "~18 months; clerkships begin spring of Year 2",
      step1: "Spring Year 2 transition (before clerkships)",
    },
    specialties: [
      "Neurosurgery — #7 NIH nationally",
      "Anesthesiology — #13 NIH nationally",
      "Neurology — #17 NIH nationally",
      "13 departments ranked top-50 nationally in NIH funding",
    ],
    nih: { rank: "#51 nationally (FY2024)", funding: "~$122M (2025)" },
    notes: "Largest class in TX (240) · Enrolls 40 JAMP students per class · TX Medical Center affiliation · Strong trauma, stroke, cancer programs",
    duals: ["MD/PhD", "MD/MPH", "MD/MBA", "MD/MS Biomed Informatics", "MD/MBE", "MD/OMFS"],
  },
  {
    id: 5, name: "Sam Houston State University COM", shortName: "SHSU-COM",
    degree: "DO", tier: 4, location: "Conroe, TX",
    lat: 30.3118, lng: -95.4561, dx: -16, dy: -20,
    jamp: { name: "Christopher Truong", phone: "936-202-5208", email: "cat075@shsu.edu" },
    admissions: { mcat: "506", gpa: "3.70", classSize: "110", acceptRate: "Not public" },
    grading: { preclinical: "Honors / Pass / Fail", clinical: "H / P / F" },
    curriculum: {
      structure: "Systems-based + Osteopathic Manipulative Medicine (OMM) woven throughout",
      preclinical: "2 years on-campus; Years 3–4 clinical rotations",
      step1: "COMLEX Level 1 after Year 2 (USMLE Step 1 optional)",
    },
    specialties: [
      "Osteopathic Manipulative Medicine (OMM)",
      "Rural & underserved community medicine",
      "Primary care pipeline",
      "Interprofessional education (nursing, allied health)",
    ],
    nih: { rank: "Not ranked", funding: "Not publicly available" },
    notes: "100% COMLEX Level 1 first-time pass rate (Class of 2026) · 10-year COCA accreditation (highest level) · First new state-funded public DO school in US since 1977 · 99% residency placement",
    duals: ["DO/MPH (concurrent, 4–5 years online)"],
  },
  {
    id: 6, name: "Texas A&M Naresh K. Vashisht College of Medicine", shortName: "TAMU Med",
    degree: "MD", tier: 3, location: "Bryan/College Station, TX",
    lat: 30.6280, lng: -96.3344, dx: 0, dy: 0,
    jamp: { name: "Guillermo Canedo", phone: "979-436-0232", email: "gcanedo@tamu.edu" },
    admissions: { mcat: "513", gpa: "3.86", classSize: "200", acceptRate: "3.29%" },
    grading: { preclinical: "Honors / Pass / Fail", clinical: "H / P / F" },
    curriculum: {
      structure: "Integrated, systems-based with clinical exposure before Step 1",
      preclinical: "18 months",
      step1: "After 18-month preclinical (some clinical exposure prior)",
    },
    specialties: [
      "Primary care — rural Central Texas focus",
      "Military medicine — Cadet to Medicine (C2M) track",
      "Community health",
      "Baylor Scott & White Health & CHI St. Joseph affiliations",
    ],
    nih: { rank: "Not in top 100", funding: "Not publicly isolated" },
    notes: "Renamed Aug 9, 2025 (Naresh K. Vashisht gift, approved Nov 2024) · Unique C2M ROTC-to-medicine track · Aggie early assurance (A2M) · 84.5% TX residents",
    duals: ["MD/PhD", "MD/MS (various disciplines)", "MD/MEd", "MD/ME (Engineering)"],
  },
  {
    id: 7, name: "Paul L. Foster School of Medicine (TTUHSC El Paso)", shortName: "Foster SOM",
    degree: "MD", tier: 3, location: "El Paso, TX",
    lat: 31.7619, lng: -106.4850, dx: 0, dy: 0,
    jamp: { name: "Yoli Betancourt", phone: "915-215-4407", email: "Yolanda.Betancourt@ttuhsc.edu" },
    admissions: { mcat: "509", gpa: "3.83", classSize: "124", acceptRate: "2.7%" },
    grading: { preclinical: "Pass / Fail", clinical: "H / P / F" },
    curriculum: {
      structure: "Integrated; clinical presentations from Year 1",
      preclinical: "18 months",
      step1: "Required by July of MS2; must pass before entering clerkships (MS3)",
    },
    specialties: [
      "US-Mexico border health & cross-border medicine",
      "Hispanic health disparities",
      "Primary care (~50% of graduates)",
      "Bilingual clinical training (Spanish-speaking patient population)",
    ],
    nih: { rank: "Not ranked", funding: "Limited (renamed in 2009 after Paul Foster's $50M gift)" },
    notes: "Only allopathic school on US-Mexico border · Hispanic Serving Institution (HSI) · Univ Medical Center El Paso affiliation · Up to 10% OOS allowed",
    duals: ["MD/MPH (collaborative with UTHealth Houston SPH, within 4 years)"],
  },
  {
    id: 8, name: "TTUHSC School of Medicine (Lubbock)", shortName: "TTUHSC",
    degree: "MD", tier: 3, location: "Lubbock, TX",
    lat: 33.5779, lng: -101.8552, dx: 0, dy: 0,
    jamp: { name: "Louis Perez / Monica Galindo", phone: "806-743-2297", email: null },
    admissions: { mcat: "512", gpa: "3.89", classSize: "182", acceptRate: "3.40%" },
    grading: { preclinical: "Pass / Fail", clinical: "H / HP / P / F" },
    curriculum: {
      structure: "Traditional with integrated elements; 3-year accelerated track available",
      preclinical: "2 years standard (3-year accelerated track available)",
      step1: "End of Year 2; passage required for promotion to Year 4",
    },
    specialties: [
      "Primary care — #19 US News nationally",
      "Rural medicine — #33 nationally for rural practice",
      "Family medicine — pioneered nation's first 3-year accelerated FM program",
      "Multi-campus training (Lubbock, Amarillo, Odessa/Midland)",
    ],
    nih: { rank: "Not ranked", funding: "Not publicly isolated" },
    notes: "95.6% TX residents · 3-year accelerated FM track is nationally unique · Multiple clinical campuses across West TX",
    duals: ["MD/PhD", "MD/MPH", "MD/MBA (Health Org Management, within 4 yrs)", "MD/JD (6-year program)"],
  },
  {
    id: 9, name: "Fertitta Family College of Medicine (UH)", shortName: "UH Med",
    degree: "MD", tier: 4, location: "Houston, TX",
    lat: 29.7199, lng: -95.3422, dx: 28, dy: -12,
    jamp: { name: "Ashley Schwartz", phone: "713-743-7047", email: "adschwar@central.uh.edu" },
    admissions: { mcat: "509", gpa: "3.68", classSize: "60", acceptRate: "1.25%" },
    grading: { preclinical: "Pass / Fail", clinical: "H / P / F" },
    curriculum: {
      structure: "Community-centered integrated; Longitudinal Primary Care from Day 1 of MS1",
      preclinical: "~2 years",
      step1: "Required before Phase 3 (Advanced Clerkships); 4–8 weeks dedicated prep time",
    },
    specialties: [
      "Underserved urban & rural care (core mission)",
      "Social determinants of health",
      "Health disparities",
      "Longitudinal primary care placements (weekly from MS1)",
    ],
    nih: { rank: "Not ranked (very new school)", funding: "Not publicly available" },
    notes: "Founded 2020 · Harris Health System (LBJ & Ben Taub — major safety-net hospitals) · Only MD school in Houston mission-focused on underserved · TMDSAS school",
    duals: ["UH graduate programs (available post-matriculation)"],
  },
  {
    id: 10, name: "Texas College of Osteopathic Medicine (TCOM)", shortName: "TCOM",
    degree: "DO", tier: 3, location: "Fort Worth, TX",
    lat: 32.7431, lng: -97.3208, dx: 0, dy: 0,
    jamp: { name: "Lorena Marin", phone: "817-735-2475", email: "Lorena.Marin@unthsc.edu" },
    admissions: { mcat: "507", gpa: "3.77", classSize: "231", acceptRate: "~35% of interviewed" },
    grading: { preclinical: "Pass / Fail", clinical: "H / P / F" },
    curriculum: {
      structure: "Modified integrated systems; Year 2 is 100+ patient-presentation based (~1,000 diseases)",
      preclinical: "2 years",
      step1: "COMLEX Level 1 after Year 2 (USMLE Step 1 optional)",
    },
    specialties: [
      "Primary care & family medicine pipeline",
      "Osteopathic Manipulative Medicine (OMM)",
      "Patient safety (CPPS certification — first school in US to mandate)",
      "One of largest DO programs in Texas",
    ],
    nih: { rank: "Not independently ranked", funding: "NIH NIMHD STAR Program (5U54MD006882)" },
    notes: "US News Tier 1 DO school · Highest COMLEX Level 1 avg among all US DO schools (2019, 2020, 2022) · First school globally to mandate CPPS patient safety cert",
    duals: ["DO/PhD", "DO/MPH", "DO/MS"],
  },
  {
    id: 11, name: "Sealy School of Medicine (UTMB Galveston)", shortName: "Sealy/UTMB",
    degree: "MD", tier: 2, location: "Galveston, TX",
    lat: 29.2903, lng: -94.7977, dx: 0, dy: 0,
    jamp: { name: "LeTanya Neely", phone: "409-772-3763", email: "ldneely@utmb.edu" },
    admissions: { mcat: "513", gpa: "3.84", classSize: "232", acceptRate: "4.22%" },
    grading: { preclinical: "Pass / Fail", clinical: "H / HP / P / F" },
    curriculum: {
      structure: "Integrated Medical Curriculum (IMC) — interdisciplinary, PBL/TBL/case-based",
      preclinical: "~2 years (integrated across organ systems)",
      step1: "After pre-clerkship phase; required for progression",
    },
    specialties: [
      "Infectious Disease & Tropical Medicine (Galveston National Lab — one of 2 BSL-4 labs in US)",
      "Marine & Environmental Medicine",
      "Biodefense research",
      "1 in 6 Texas physicians trained here",
    ],
    nih: { rank: "#41 nationally (top 2% of all NIH-funded institutions)", funding: "$156M+ (most recent public data)" },
    notes: "Oldest TX medical school (est. 1891) · 1 in 6 TX physicians trained at UTMB · Only school in US with BSL-4 national lab on campus · ~93% TX residents",
    duals: ["MD/PhD (MSTP — since 1983)", "MD/MPH (within 4 years)", "MD/MS", "MD/MBA (new, w/ UT McCombs, 2026)"],
  },
  {
    id: 12, name: "UT Rio Grande Valley School of Medicine", shortName: "UTRGV Med",
    degree: "MD", tier: 4, location: "Edinburg, TX",
    lat: 26.3017, lng: -98.1633, dx: 0, dy: 0,
    jamp: { name: "Itzely Moreno-Ortiz", phone: "956-296-1600", email: "itzely.ortiz01@utrgv.edu" },
    admissions: { mcat: "507", gpa: "3.74", classSize: "55", acceptRate: "1.15%" },
    grading: { preclinical: "Pass / No Pass", clinical: "Standard clinical evaluations" },
    curriculum: {
      structure: "Integrated 4-year; emphasis on early clinical exposure & non-competitive culture",
      preclinical: "21 months (includes dedicated Step 1 prep time)",
      step1: "After 21-month pre-clerkship; dedicated study window built in",
    },
    specialties: [
      "Border bicultural & bilingual medicine (unique nationally)",
      "Cancer health disparities ($18.4M NIH grant, 2024)",
      "Genomics & genetics research ($10.6M NIH grant)",
      "Diabetes & obesity research (high-burden region)",
    ],
    nih: { rank: "Not ranked · Rapidly growing", funding: "$36M+ in major grants (2023–2024)" },
    notes: "One of 25 national Mission schools · Only MD school in Lower Rio Grande Valley · Serves 1.3M+ underserved patients · 15,000 sq ft simulation hospital",
    duals: ["MD/MPH", "MD/PhD (MSTP)"],
  },
  {
    id: 13, name: "UT Southwestern Medical Center", shortName: "UTSW",
    degree: "MD", tier: 1, location: "Dallas, TX",
    lat: 32.8127, lng: -96.8384, dx: 0, dy: 0,
    jamp: { name: "Jaclyn Young", phone: "214-648-4476", email: "jaclyn.young@utsouthwestern.edu" },
    admissions: { mcat: "516", gpa: "3.89", classSize: "228", acceptRate: "3.96%" },
    grading: { preclinical: "Pass / Fail", clinical: "H / HP / P / F" },
    curriculum: {
      structure: "Integrated, systems-based; small group academic colleges all 4 years",
      preclinical: "18 months; clerkships begin January of MS2",
      step1: "6-week dedicated study window after preclinical, before clerkships start",
    },
    specialties: [
      "Cancer — Harold Simmons NCI-designated (only in North Texas; 1 of 57 in US)",
      "Cardiology, Neuroscience, Diabetes/Endocrinology",
      "12 specialties ranked by US News — most of any TX hospital",
      "#1 globally by Nature Index among healthcare institutions",
    ],
    nih: { rank: "#24 nationally", funding: ">$554M total research funding annually" },
    notes: "6 Nobel laureates · 24 NAS members · 25 NAM members · 6,200+ active research projects · Highest-ranked medical school in TX",
    duals: ["MD/PhD (MSTP — Perot Family Scholars, NIH-funded)", "MD/MPH", "MD/MBA"],
  },
  {
    id: 14, name: "UT Tyler School of Medicine", shortName: "UT Tyler",
    degree: "MD", tier: 4, location: "Tyler, TX",
    lat: 32.3513, lng: -95.3011, dx: 0, dy: 14,
    jamp: { name: "Tonny Williams", phone: "903-877-7566", email: null },
    admissions: { mcat: "505", gpa: "3.75", classSize: "40", acceptRate: "0.80%" },
    grading: { preclinical: "Pass / Fail", clinical: "Standard clinical evaluations" },
    curriculum: {
      structure: "Systems-based; 3 semesters foundational + clinical rotations",
      preclinical: "~18 months (3 semesters foundational sciences)",
      step1: "After foundational sciences phase (Semester 3 completion)",
    },
    specialties: [
      "Rural family medicine (primary mission)",
      "Primary care — East Texas underserved communities",
      "UT Health East Texas (10 hospitals, 90+ clinics across East TX)",
      "CHRISTUS Health affiliation (primary care focus)",
    ],
    nih: { rank: "Not ranked", funding: "Via UT Health Science Center programs" },
    notes: "Newest TX school (opened July 2023) · Smallest class in TX (40) · 95% TX residents · JAMP phased implementation: providing mentoring now, guaranteed admission begins 2026–2027 · ⚠️ JAMP coordinator email not confirmed — contact by phone",
    duals: ["MS in Biotechnology (concurrent)", "11 residency programs, 8 fellowships/internships"],
  },
];

// ─── SVG Projection ───────────────────────────────────────────────────────────
const SVG_W = 800, SVG_H = 600;

const texasFeature = feature(usAtlas, usAtlas.objects.states).features.find(
  f => f.id === "48"
);

const projection = geoMercator().fitExtent(
  [[20, 20], [SVG_W - 20, SVG_H - 20]],
  texasFeature
);

const TX_PATH = geoPath(projection)(texasFeature);

const project = (lng, lat) => {
  const [x, y] = projection([lng, lat]);
  return { x, y };
};

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function TexasMedMap() {
  const [splash, setSplash]         = useState(true);
  const [selected, setSelected]     = useState(null);
  const [hovered, setHovered]       = useState(null);
  const [search, setSearch]         = useState("");
  const [tierFilter, setTierFilter] = useState(0);
  const [degreeFilter, setDegreeFilter] = useState("all");
  const [sortBy, setSortBy]         = useState("tier");
  const [mobileView, setMobileView] = useState("map");
  const [showJampInfo, setShowJampInfo] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [favorites, setFavorites]   = useState(() => {
    try { return JSON.parse(localStorage.getItem("jamp-favs") || "[]"); }
    catch { return []; }
  });
  const [showFavOnly, setShowFavOnly] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSplash(false), 1800);
    return () => clearTimeout(t);
  }, []);

  const handleSelect = (school) => {
    setSelected(prev => prev?.id === school.id ? null : school);
    setShowCompare(false);
    setMobileView("detail");
  };
  const handleClose = () => {
    setSelected(null);
    setMobileView("list");
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try { localStorage.setItem("jamp-favs", JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const toggleCompare = (id) => {
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 3) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const filteredSchools = useMemo(() => {
    const q = search.toLowerCase();
    let result = SCHOOLS.filter(s => {
      const matchSearch = !q ||
        s.name.toLowerCase().includes(q) ||
        s.shortName.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q);
      const matchTier   = tierFilter === 0 || s.tier === tierFilter;
      const matchDegree = degreeFilter === "all" || s.degree === degreeFilter;
      const matchFav    = !showFavOnly || favorites.includes(s.id);
      return matchSearch && matchTier && matchDegree && matchFav;
    });

    if (sortBy === "mcat") {
      result = [...result].sort((a, b) => parseFloat(b.admissions.mcat) - parseFloat(a.admissions.mcat));
    } else if (sortBy === "gpa") {
      result = [...result].sort((a, b) => parseFloat(b.admissions.gpa) - parseFloat(a.admissions.gpa));
    } else if (sortBy === "size") {
      result = [...result].sort((a, b) => parseInt(a.admissions.classSize) - parseInt(b.admissions.classSize));
    } else {
      result = [...result].sort((a, b) => a.tier - b.tier || a.name.localeCompare(b.name));
    }
    return result;
  }, [search, tierFilter, degreeFilter, sortBy, showFavOnly, favorites]);

  const compareSchools = useMemo(
    () => compareList.map(id => SCHOOLS.find(s => s.id === id)).filter(Boolean),
    [compareList]
  );

  const hasFilters = search || tierFilter !== 0 || degreeFilter !== "all" || showFavOnly;

  const rightPanel = showCompare && compareList.length >= 2
    ? "compare"
    : selected
      ? "detail"
      : "list";

  return (
    <TooltipProvider delayDuration={200}>
      <div className="dark flex flex-col h-dvh bg-[#06080e] text-[#E6EDF3] overflow-hidden font-sans relative">

        {/* ── WebGL background ── */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <Grainient
            color1="#1e3a6e" color2="#0f1e42" color3="#030712"
            timeSpeed={0.08} warpStrength={1.2} warpFrequency={4.0}
            warpSpeed={1.4} warpAmplitude={55} grainAmount={0.055}
            grainScale={2.5} grainAnimated={false} contrast={1.4}
            saturation={1.3} gamma={1.0} zoom={0.88} blendAngle={30}
            blendSoftness={0.18} rotationAmount={280} noiseScale={2.2}
            colorBalance={0.04}
          />
        </div>

        {/* ── Splash ── */}
        {splash && (
          <div className="cosmic-splash">
            <CosmicParallaxBg
              head="JAMP"
              text="Texas Medical Schools, 14 Programs, Your Future"
              loop={false}
            />
          </div>
        )}

        {/* ── JAMP Eligibility Popover ── */}
        {showJampInfo && (
          <div
            className="absolute top-14 right-4 z-50 w-72 rounded-xl shadow-2xl"
            style={{ background: "rgba(10,14,28,0.97)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
          >
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <h3 className="text-[13px] font-bold text-[#E6EDF3]">JAMP Eligibility</h3>
              <button onClick={() => setShowJampInfo(false)} className="text-[#6E7681] hover:text-[#E6EDF3] transition-colors cursor-pointer">
                <X size={14} />
              </button>
            </div>
            <div className="px-4 py-3 space-y-3">
              {[
                { label: "Residency", value: "Texas resident · US citizen or permanent resident" },
                { label: "Financial Need", value: "Pell-eligible (SAI −1,500 to 7,000)" },
                { label: "Academic", value: "3.40+ overall GPA · 3.25+ BCPM GPA" },
                { label: "Application Window", value: "Opens May 1 · Closes October 1" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[10px] text-[#6E7681] uppercase tracking-wider font-semibold mb-0.5">{label}</p>
                  <p className="text-[12px] text-[#E6EDF3] leading-relaxed">{value}</p>
                </div>
              ))}
              <div className="pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <p className="text-[11px] text-[#6E7681] leading-relaxed">
                  2025 cohort: 150 scholars from 364 applications (25% YoY increase)
                </p>
                <a
                  href="https://texasjamp.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#3B82F6] hover:underline mt-1 block"
                >
                  texasjamp.org →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ── Header ── */}
        <header
          className="flex items-center justify-between gap-4 px-5 py-3 border-b border-white/[0.07] shrink-0 relative overflow-hidden z-10"
          style={{ background: "linear-gradient(135deg, rgba(10,14,28,0.92) 0%, rgba(15,20,36,0.88) 100%)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
        >
          {/* Top accent line */}
          <div className="absolute top-0 inset-x-0 h-px pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent 0%, #3B82F6 35%, #A855F7 65%, transparent 100%)" }} />

          {/* Logo + title */}
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0 font-black text-[13px] text-white select-none"
              style={{ background: "linear-gradient(135deg, #1D4ED8 0%, #7C3AED 100%)", boxShadow: "0 0 18px rgba(59,130,246,0.30), 0 2px 6px rgba(0,0,0,0.5)" }}
            >
              Rx
            </div>
            <div>
              <h1 className="m-0 text-[16px] font-bold leading-tight">
                <AnimatedGradientText className="text-[16px] font-bold bg-transparent shadow-none px-0 py-0 backdrop-blur-none rounded-none dark:bg-transparent">
                  Texas JAMP Medical Schools
                </AnimatedGradientText>
              </h1>
              <p className="mt-0.5 text-[11px] text-[#6E7681]">14 programs · click a marker to explore</p>
            </div>
          </div>

          {/* Tier legend — display only on desktop */}
          <div className="hidden lg:flex gap-3 items-center flex-wrap">
            {Object.entries(TIER).map(([t, cfg]) => (
              <div key={t} className="flex items-center gap-1.5 text-[10px]">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: cfg.color }} />
                <span style={{ color: "#8B949E" }}>T{t} — {cfg.label}</span>
              </div>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            {compareList.length >= 2 && (
              <button
                onClick={() => { setShowCompare(v => !v); setSelected(null); setMobileView("list"); }}
                className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-md border transition-all cursor-pointer"
                style={showCompare
                  ? { background: "rgba(59,130,246,0.2)", borderColor: "#3B82F6", color: "#3B82F6" }
                  : { background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)", color: "#8B949E" }
                }
              >
                <Scale size={13} strokeWidth={2} />
                Compare ({compareList.length})
              </button>
            )}
            <button
              onClick={() => setShowJampInfo(v => !v)}
              className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-md border transition-all cursor-pointer"
              style={showJampInfo
                ? { background: "rgba(168,85,247,0.2)", borderColor: "#A855F7", color: "#A855F7" }
                : { background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)", color: "#8B949E" }
              }
            >
              <Info size={13} strokeWidth={2} />
              <span className="hidden sm:inline">JAMP Info</span>
            </button>
          </div>
        </header>

        {/* ── Body ── */}
        <div className="flex flex-1 overflow-hidden relative z-10 md:pb-0 pb-14">

          {/* ── Map Panel ── */}
          <div
            className={cn(
              "flex-1 relative overflow-hidden",
              mobileView !== "map" ? "hidden md:flex md:flex-col" : "flex flex-col"
            )}
            style={{ background: "#c8d8e8" }}
          >
            <svg
              viewBox="0 0 800 600"
              className="w-full h-full block"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="texasFill" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%"   stopColor="#e8f2fc" />
                  <stop offset="100%" stopColor="#d4e7f7" />
                </linearGradient>
                <filter id="pinShadow">
                  <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="rgba(0,30,60,0.35)" />
                </filter>
                <filter id="pinShadowSel">
                  <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="rgba(0,30,60,0.5)" />
                </filter>
              </defs>

              {/* Water / surrounding area */}
              <rect x="0" y="0" width="800" height="600" fill="#c8d8e8" />

              {/* Texas silhouette */}
              <path d={TX_PATH} fill="url(#texasFill)" stroke="#4a8ec2" strokeWidth="2" strokeLinejoin="round" />
              {/* Subtle top-highlight inner stroke */}
              <path d={TX_PATH} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1" strokeLinejoin="round" />

              {/* Geographic labels */}
              <text x="655" y="525" fontSize="12" fill="#8aafc8" fontStyle="italic" textAnchor="middle" letterSpacing="1">Gulf of Mexico</text>
              <text x="390" y="300" fontSize="52" fill="#d0e3f0" fontWeight="900" textAnchor="middle" letterSpacing="10" opacity="0.9">TEXAS</text>

              {/* ── School Pins ── */}
              {SCHOOLS.map(school => {
                const pos = project(school.lng, school.lat);
                const cx  = pos.x + (school.dx || 0);
                const cy  = pos.y + (school.dy || 0);

                const isSel      = selected?.id === school.id;
                const isHov      = hovered?.id  === school.id;
                const isFiltered = filteredSchools.some(s => s.id === school.id);
                const cfg = TIER[school.tier];

                // Pin dimensions — scale up on hover/select
                const R  = isSel ? 11 : isHov ? 10 : 8;   // head radius
                const H  = isSel ? 28 : isHov ? 25 : 20;  // total pin height (tip → head center)

                // The pin tip is at (cx, cy). Head center is at (cx, cy - H).
                const headCy = cy - H;

                // Teardrop path: tip at origin, head at (0, -H), radius R
                const pinPath = [
                  `M ${cx},${cy}`,
                  `C ${cx - R * 0.55},${cy - H * 0.35} ${cx - R},${cy - H * 0.65} ${cx - R},${headCy}`,
                  `A ${R},${R} 0 1,1 ${cx + R},${headCy}`,
                  `C ${cx + R},${cy - H * 0.65} ${cx + R * 0.55},${cy - H * 0.35} ${cx},${cy}`,
                  "Z",
                ].join(" ");

                // Label pill dimensions
                const labelText  = school.shortName;
                const labelW     = labelText.length * 6.8 + 14;
                const labelX     = cx - labelW / 2;
                const labelY     = cy + 5;  // sits just below the pin tip

                return (
                  <Tooltip key={school.id}>
                    <TooltipTrigger asChild>
                      <g
                        tabIndex={0}
                        role="button"
                        aria-label={school.name}
                        aria-pressed={isSel}
                        style={{ cursor: "pointer", opacity: isFiltered ? 1 : 0.18 }}
                        onClick={() => handleSelect(school)}
                        onKeyDown={e => (e.key === "Enter" || e.key === " ") && handleSelect(school)}
                        onMouseEnter={() => setHovered(school)}
                        onMouseLeave={() => setHovered(null)}
                        onFocus={() => setHovered(school)}
                        onBlur={() => setHovered(null)}
                      >
                        {/* Selected pulse ring at ground point */}
                        {isSel && (
                          <circle className="pulse-ring" cx={cx} cy={cy} r={14} fill={cfg.color} opacity={0.35} />
                        )}

                        {/* Pin body */}
                        <path
                          d={pinPath}
                          fill={cfg.color}
                          filter={isSel ? "url(#pinShadowSel)" : "url(#pinShadow)"}
                        />

                        {/* DO schools: dashed ring around pin head */}
                        {school.degree === "DO" && (
                          <circle
                            cx={cx} cy={headCy} r={R + 4}
                            fill="none"
                            stroke={cfg.color}
                            strokeWidth="1.5"
                            strokeDasharray="3 2"
                            opacity={0.7}
                          />
                        )}

                        {/* White inner circle on pin head */}
                        <circle cx={cx} cy={headCy} r={R * 0.42} fill="white" opacity={0.9} />

                        {/* Ground shadow ellipse */}
                        <ellipse cx={cx} cy={cy + 1} rx={4} ry={2} fill="rgba(0,30,60,0.2)" />

                        {/* Label pill — below pin tip */}
                        <g style={{ pointerEvents: "none" }}>
                          <rect
                            x={labelX} y={labelY}
                            width={labelW} height={15}
                            rx={4}
                            fill="white"
                            opacity={0.92}
                            stroke={cfg.color}
                            strokeWidth={isSel ? 1.2 : 0.6}
                          />
                          <text
                            x={cx} y={labelY + 10.5}
                            textAnchor="middle"
                            fontSize="8.5"
                            fontWeight="800"
                            fill={cfg.color}
                            letterSpacing="0.04em"
                            style={{ pointerEvents: "none" }}
                          >
                            {labelText}
                          </text>
                        </g>
                      </g>
                    </TooltipTrigger>

                    {/* ── Hover Preview Card ── */}
                    <TooltipContent
                      side="top"
                      sideOffset={12}
                      style={{
                        background: "white",
                        border: `2px solid ${cfg.color}`,
                        borderRadius: "14px",
                        padding: 0,
                        overflow: "hidden",
                        width: "260px",
                        boxShadow: "0 12px 40px rgba(0,30,80,0.22)",
                      }}
                    >
                      {/* Tier color bar */}
                      <div style={{ height: "4px", background: cfg.color }} />

                      {/* Card header */}
                      <div style={{ padding: "12px 14px 10px", background: cfg.bg }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                          <span style={{
                            fontSize: "10px", fontWeight: 700, color: cfg.color,
                            textTransform: "uppercase", letterSpacing: "0.06em",
                          }}>
                            Tier {school.tier} · {cfg.label}
                          </span>
                          <span style={{
                            marginLeft: "auto", fontSize: "10px", fontWeight: 700,
                            color: cfg.color, border: `1px solid ${cfg.border}`,
                            background: "white", borderRadius: "4px", padding: "1px 7px",
                          }}>
                            {school.degree}
                          </span>
                        </div>
                        <p style={{ fontSize: "14px", fontWeight: 800, color: "#0f2035", margin: 0, lineHeight: 1.3 }}>
                          {school.name}
                        </p>
                        <p style={{ fontSize: "12px", color: "#5a7a99", margin: "5px 0 0", display: "flex", alignItems: "center", gap: "4px" }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#5a7a99" strokeWidth="2.5">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                          </svg>
                          {school.location}
                        </p>
                      </div>

                      {/* Stats row */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderTop: `1px solid ${cfg.color}22` }}>
                        {[
                          { label: "MCAT",       value: school.admissions.mcat,       color: "#d97706", bg: "#fffbeb" },
                          { label: "GPA",        value: school.admissions.gpa,        color: "#059669", bg: "#f0fdf4" },
                          { label: "Class Size", value: school.admissions.classSize,  color: "#2563eb", bg: "#eff6ff" },
                        ].map((s, i) => (
                          <div key={s.label} style={{
                            textAlign: "center", padding: "10px 6px",
                            background: s.bg,
                            borderRight: i < 2 ? `1px solid ${cfg.color}18` : "none",
                          }}>
                            <div style={{ fontSize: "16px", fontWeight: 800, color: s.color }}>{s.value}</div>
                            <div style={{ fontSize: "10px", color: "#8aa5be", fontWeight: 600, marginTop: "2px" }}>{s.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Click hint */}
                      <div style={{
                        padding: "8px 14px", fontSize: "11px", color: "#6090b0",
                        display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "4px",
                        background: "#f8fbff", borderTop: "1px solid #e2edf6",
                      }}>
                        Click pin to explore details →
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </svg>
          </div>

          {/* ── Side Panel ── */}
          <div
            className={cn(
              "md:w-[420px] w-full border-l border-[#1a3a5c]/60 flex flex-col overflow-hidden md:shrink-0",
              mobileView === "map" ? "hidden md:flex" : "flex"
            )}
            style={{ background: "#07131f", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}
          >
            {rightPanel === "compare" && (
              <ComparePanel
                schools={compareSchools}
                onClose={() => setShowCompare(false)}
                onRemove={(id) => {
                  toggleCompare(id);
                  if (compareList.length <= 2) setShowCompare(false);
                }}
              />
            )}
            {rightPanel === "detail" && (
              <SchoolDetail
                school={selected}
                onClose={handleClose}
                isFav={favorites.includes(selected?.id)}
                onToggleFav={toggleFavorite}
                compareList={compareList}
                onToggleCompare={toggleCompare}
              />
            )}
            {rightPanel === "list" && (
              <SchoolList
                schools={filteredSchools}
                allSchools={SCHOOLS}
                onSelect={handleSelect}
                hovered={hovered}
                selected={selected}
                search={search}
                setSearch={setSearch}
                tierFilter={tierFilter}
                setTierFilter={setTierFilter}
                degreeFilter={degreeFilter}
                setDegreeFilter={setDegreeFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
                favorites={favorites}
                showFavOnly={showFavOnly}
                setShowFavOnly={setShowFavOnly}
                hasFilters={hasFilters}
                onClearFilters={() => { setSearch(""); setTierFilter(0); setDegreeFilter("all"); setShowFavOnly(false); }}
              />
            )}
          </div>
        </div>

        {/* ── Mobile Bottom Nav ── */}
        <div
          className="flex md:hidden fixed bottom-0 inset-x-0 z-20 border-t border-white/[0.07]"
          style={{ background: "rgba(8,11,20,0.97)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
        >
          {[
            { id: "map",    label: "Map",     icon: MapPin },
            { id: "list",   label: "Schools", icon: GraduationCap },
            { id: "detail", label: "Detail",  icon: BookOpen, disabled: !selected && !showCompare },
          ].map(({ id, label, icon: Icon, disabled }) => {
            const isActive = mobileView === id || (id === "detail" && showCompare && mobileView !== "map" && mobileView !== "list");
            return (
              <button
                key={id}
                disabled={!!disabled}
                onClick={() => {
                  if (disabled) return;
                  if (id === "detail" && showCompare) { setMobileView("list"); }
                  else setMobileView(id);
                }}
                className="flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-semibold transition-all cursor-pointer"
                style={{ color: isActive ? "#3B82F6" : "#6E7681", opacity: disabled ? 0.35 : 1 }}
              >
                <Icon size={18} strokeWidth={2} />
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}

// ─── School Detail Panel ──────────────────────────────────────────────────────
function SchoolDetail({ school, onClose, isFav, onToggleFav, compareList, onToggleCompare }) {
  const [tab, setTab] = useState("overview");
  const cfg = TIER[school.tier];
  const isCompared = compareList.includes(school.id);

  const tabs = [
    { id: "overview",   label: "Overview" },
    { id: "admissions", label: "Admissions" },
    { id: "academics",  label: "Academics" },
    { id: "research",   label: "Research" },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden panel-slide">
      {/* Tier color strip */}
      <div className="h-[3px] w-full shrink-0"
        style={{ background: `linear-gradient(90deg, ${cfg.color}00 0%, ${cfg.color} 25%, ${cfg.color} 75%, ${cfg.color}00 100%)` }} />

      {/* Top bar */}
      <div className="shrink-0 flex items-center gap-2 px-4 py-3 border-b border-[#1a3a5c]/60"
        style={{ background: "#06111c" }}>
        <button
          onClick={onClose}
          className="flex items-center gap-1 text-[11px] text-[#8B949E] hover:text-[#E6EDF3] transition-colors cursor-pointer shrink-0"
        >
          <ChevronLeft size={14} strokeWidth={2.5} /> All Schools
        </button>
        <Separator orientation="vertical" className="h-4 bg-[#30363D]" />
        <div className="flex gap-1.5 flex-wrap flex-1 min-w-0">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
            Tier {school.tier} · {cfg.label}
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-[#E6EDF3] bg-white/[0.07] border border-white/[0.12]">
            {school.degree}
          </span>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onToggleCompare(school.id)}
                className="transition-colors cursor-pointer"
                style={{ color: isCompared ? "#3B82F6" : "#6E7681" }}
              >
                <Scale size={15} strokeWidth={2} />
              </button>
            </TooltipTrigger>
            <TooltipContent className="bg-[#1C2333] border-[#30363D] text-[#E6EDF3] text-xs">
              {isCompared ? "Remove from compare" : "Add to compare"}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onToggleFav(school.id)}
                className="transition-colors cursor-pointer"
                style={{ color: isFav ? "#F59E0B" : "#6E7681" }}
              >
                <Bookmark size={15} strokeWidth={2} fill={isFav ? "#F59E0B" : "none"} />
              </button>
            </TooltipTrigger>
            <TooltipContent className="bg-[#1C2333] border-[#30363D] text-[#E6EDF3] text-xs">
              {isFav ? "Remove from saved" : "Save school"}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* School name */}
      <div className="px-4 pt-5 pb-4 border-b border-[#1a3a5c]/40 shrink-0">
        <h2 className="text-[20px] font-bold leading-snug text-white mb-2 tracking-tight">{school.name}</h2>
        <div className="flex items-center gap-1.5 text-[13px] text-[#7fb3e0]">
          <MapPin size={13} className="shrink-0" style={{ color: cfg.color }} />
          <span>{school.location}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="shrink-0 flex border-b border-[#1a3a5c]/60"
        style={{ background: "#06111c" }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex-1 py-3 text-[12px] font-semibold transition-all relative cursor-pointer tracking-wide",
              tab === t.id ? "text-white" : "text-[#4a7fa8] hover:text-[#7fb3e0]"
            )}
          >
            {t.label}
            {tab === t.id && (
              <span
                className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full"
                style={{ background: cfg.color }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <ScrollArea className="flex-1">
        <div className="pb-8">
          {tab === "overview"   && <TabOverview   school={school} cfg={cfg} />}
          {tab === "admissions" && <TabAdmissions school={school} cfg={cfg} />}
          {tab === "academics"  && <TabAcademics  school={school} cfg={cfg} />}
          {tab === "research"   && <TabResearch   school={school} cfg={cfg} />}
        </div>
      </ScrollArea>
    </div>
  );
}

function TabOverview({ school, cfg }) {
  return (
    <>
      <Section title="JAMP Contact" icon={Users}>
        <div className="rounded-xl p-4"
          style={{ background: "#0d2035", border: "1px solid #1e4a72" }}>
          <p className="font-bold text-white text-[15px] mb-3">{school.jamp.name}</p>
          <a href={`tel:${school.jamp.phone}`}
            className="flex items-center gap-2 text-[13px] font-mono mb-2 hover:underline"
            style={{ color: "#4da8f5" }}>
            <Phone size={13} className="shrink-0" />
            {school.jamp.phone}
          </a>
          {school.jamp.email && (
            <a href={`mailto:${school.jamp.email}`}
              className="flex items-center gap-2 text-[12px] hover:underline truncate"
              style={{ color: "#7fb3e0" }}>
              <Mail size={12} className="shrink-0" />
              {school.jamp.email}
            </a>
          )}
        </div>
      </Section>
      {school.notes && (
        <Section title="Key Notes" icon={Lightbulb}>
          <p className="text-[13px] text-[#a8cce8] leading-relaxed">{school.notes}</p>
        </Section>
      )}
    </>
  );
}

function TabAdmissions({ school }) {
  const parseNum = (val) => parseFloat(String(val).replace(/[^0-9.]/g, ""));
  const dp = (val) => {
    const s = String(val).replace(/[^0-9.]/g, "");
    return s.includes(".") ? s.split(".")[1]?.length ?? 0 : 0;
  };

  return (
    <>
      <Section title="Admissions Stats" icon={BarChart3}>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Avg MCAT",    value: school.admissions.mcat,       color: "#F59E0B", glow: "45 90 70" },
            { label: "Avg GPA",     value: school.admissions.gpa,        color: "#10B981", glow: "160 75 60" },
            { label: "Class Size",  value: school.admissions.classSize,  color: "#3B82F6", glow: "220 85 65" },
            { label: "Accept Rate", value: school.admissions.acceptRate, color: "#A855F7", glow: "270 80 65" },
          ].map(s => {
            const num = parseNum(s.value);
            const decimals = dp(s.value);
            return (
              <BorderGlow
                key={s.label}
                backgroundColor="#0a0f1c"
                glowColor={s.glow}
                colors={[s.color, s.color + "88", s.color + "44"]}
                glowIntensity={0.7}
                borderRadius={10}
                glowRadius={30}
                fillOpacity={0.2}
                className="fade-up"
              >
                <div className="p-3 flex flex-col gap-1">
                  <div className="text-[22px] font-bold leading-none" style={{ color: s.color }}>
                    {!isNaN(num) && s.label !== "Accept Rate"
                      ? <NumberTicker value={num} decimalPlaces={decimals} className="text-[22px] font-bold" />
                      : s.value
                    }
                  </div>
                  <p className="text-[10px] text-[#6E7681] uppercase tracking-wider font-semibold">{s.label}</p>
                </div>
              </BorderGlow>
            );
          })}
        </div>
      </Section>
      <Section title="Grading System" icon={BookOpen}>
        <div className="flex flex-col gap-1.5">
          <InfoRow label="Preclinical" value={school.grading.preclinical} />
          <InfoRow label="Clinical"    value={school.grading.clinical} />
        </div>
      </Section>
    </>
  );
}

function TabAcademics({ school, cfg }) {
  return (
    <>
      <Section title="Curriculum" icon={BookOpen}>
        <div className="flex flex-col gap-1.5">
          <InfoRow label="Structure"            value={school.curriculum.structure} />
          <InfoRow label="Preclinical Length"   value={school.curriculum.preclinical} />
          <InfoRow label="Step 1 / COMLEX"      value={school.curriculum.step1} />
        </div>
      </Section>
      <Section title="Notable Strengths & Specialties" icon={Star}>
        <div className="flex flex-col gap-2.5">
          {school.specialties.map((s, i) => (
            <div key={i} className="flex gap-3 text-[13px] text-[#c5e0f5] leading-relaxed">
              <span className="w-2 h-2 rounded-full shrink-0 mt-1"
                style={{ background: cfg.color, boxShadow: `0 0 8px ${cfg.color}` }} />
              <span>{s}</span>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

function TabResearch({ school }) {
  return (
    <>
      <Section title="NIH Research Funding" icon={FlaskConical}>
        <div className="rounded-xl p-4 flex flex-col gap-2"
          style={{ background: "#081d15", border: "1px solid #0f3d28" }}>
          <InfoRow label="National Rank" value={school.nih.rank} />
          <InfoRow label="Funding"       value={school.nih.funding} />
        </div>
      </Section>
      <Section title="Dual Degree Programs" icon={GraduationCap}>
        <div className="flex flex-wrap gap-2">
          {school.duals.map((d, i) => (
            <span key={i} className="text-[12px] text-[#7fb3e0] px-3 py-1.5 rounded-lg"
              style={{ background: "#0d2035", border: "1px solid #1e4a72" }}>
              {d}
            </span>
          ))}
        </div>
      </Section>
    </>
  );
}

// ─── Compare Panel ────────────────────────────────────────────────────────────
function ComparePanel({ schools, onClose, onRemove }) {
  const fields = [
    { label: "MCAT",        get: s => s.admissions.mcat },
    { label: "GPA",         get: s => s.admissions.gpa },
    { label: "Accept Rate", get: s => s.admissions.acceptRate },
    { label: "Class Size",  get: s => s.admissions.classSize },
    { label: "Degree",      get: s => s.degree },
    { label: "Preclinical", get: s => s.grading.preclinical },
    { label: "Step 1",      get: s => s.curriculum.step1.split(";")[0] },
    { label: "NIH Rank",    get: s => s.nih.rank },
  ];

  const cols = schools.length;

  return (
    <div className="flex flex-col h-full overflow-hidden panel-slide">
      <div className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-white/[0.07]"
        style={{ background: "rgba(255,255,255,0.025)" }}>
        <button onClick={onClose}
          className="flex items-center gap-1 text-[11px] text-[#8B949E] hover:text-[#E6EDF3] transition-colors cursor-pointer">
          <ChevronLeft size={14} strokeWidth={2.5} /> Back
        </button>
        <Separator orientation="vertical" className="h-4 bg-[#30363D]" />
        <span className="text-[12px] font-semibold text-[#E6EDF3]">
          Compare {cols} School{cols !== 1 ? "s" : ""}
        </span>
        <span className="text-[11px] text-[#6E7681] ml-1">· pin up to 3</span>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {/* School headers */}
          <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: `100px repeat(${cols}, 1fr)` }}>
            <div />
            {schools.map(s => {
              const cfg = TIER[s.tier];
              return (
                <div key={s.id} className="text-center">
                  <div className="text-[12px] font-bold leading-tight" style={{ color: cfg.color }}>{s.shortName}</div>
                  <div className="text-[10px] text-[#6E7681] mt-0.5">{s.degree}</div>
                  <button
                    onClick={() => onRemove(s.id)}
                    className="text-[10px] text-[#6E7681] hover:text-red-400 mt-1 transition-colors cursor-pointer"
                  >✕ remove</button>
                </div>
              );
            })}
          </div>

          {/* Data rows */}
          {fields.map(({ label, get }) => {
            const values = schools.map(get);
            const allSame = values.every(v => v === values[0]);
            return (
              <div key={label} className="grid gap-2 py-2.5 border-b border-white/[0.04]"
                style={{ gridTemplateColumns: `100px repeat(${cols}, 1fr)` }}>
                <span className="text-[10px] text-[#6E7681] uppercase tracking-wider font-semibold self-center leading-tight">
                  {label}
                </span>
                {values.map((v, i) => (
                  <span key={i} className="text-[11px] text-center leading-relaxed self-center"
                    style={{ color: allSame ? "#4B5563" : "#E6EDF3" }}>
                    {v}
                  </span>
                ))}
              </div>
            );
          })}

          {/* JAMP contacts */}
          <div className="mt-5 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-[10px] text-[#6E7681] uppercase tracking-wider font-semibold mb-3">JAMP Contact</p>
            <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
              {schools.map(s => (
                <div key={s.id} className="text-center rounded-lg p-2.5"
                  style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)" }}>
                  <p className="text-[11px] text-[#E6EDF3] font-semibold leading-tight">{s.jamp.name}</p>
                  <a href={`tel:${s.jamp.phone}`}
                    className="text-[10px] text-[#3B82F6] hover:underline block mt-1">
                    {s.jamp.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

// ─── School List Panel ────────────────────────────────────────────────────────
function SchoolList({
  schools, allSchools, onSelect, hovered, selected,
  search, setSearch, tierFilter, setTierFilter,
  degreeFilter, setDegreeFilter, sortBy, setSortBy,
  favorites, showFavOnly, setShowFavOnly,
  hasFilters, onClearFilters,
}) {
  const isTierSort = sortBy === "tier";
  const byTier = (tier) => schools.filter(s => s.tier === tier);

  const SORT_OPTIONS = [
    { value: "tier",  label: "Tier" },
    { value: "mcat",  label: "MCAT" },
    { value: "gpa",   label: "GPA" },
    { value: "size",  label: "Class Size" },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Search + filters */}
      <div className="shrink-0 px-4 pt-4 pb-3 border-b border-[#1a3a5c]/60 space-y-2.5" style={{ background: "#06111c" }}>
        <Input
          placeholder="Search schools, location…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="h-9 text-[13px] focus-visible:ring-[#2e7fd4]"
          style={{ background: "#0d2035", border: "1px solid #1e4a72", color: "#ddeeff" }}
        />
        <div className="flex gap-1.5 flex-wrap items-center">
          {["all", "MD", "DO"].map(d => (
            <button
              key={d}
              onClick={() => setDegreeFilter(d)}
              className={cn(
                "text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all cursor-pointer",
                degreeFilter === d
                  ? "bg-[#3B82F6]/20 border-[#3B82F6] text-[#3B82F6]"
                  : "bg-transparent border-white/10 text-[#8B949E] hover:border-white/25"
              )}
            >{d === "all" ? "All" : d}</button>
          ))}
          <div className="w-px bg-white/10 h-4" />
          {[1,2,3,4].map(t => (
            <Tooltip key={t}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setTierFilter(prev => prev === t ? 0 : t)}
                  className={cn(
                    "flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full border transition-all cursor-pointer",
                    tierFilter === t ? "text-white" : "bg-transparent border-white/10 text-[#8B949E] hover:border-white/25"
                  )}
                  style={tierFilter === t ? { background: TIER[t].color + "22", borderColor: TIER[t].color, color: TIER[t].color } : {}}
                >
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: TIER[t].color }} />
                  T{t}
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-[#1C2333] border-[#30363D] text-[#E6EDF3] text-xs">
                {TIER[t].label}
              </TooltipContent>
            </Tooltip>
          ))}
          <button
            onClick={() => setShowFavOnly(v => !v)}
            className={cn(
              "flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all cursor-pointer",
              showFavOnly
                ? "bg-[#F59E0B]/20 border-[#F59E0B] text-[#F59E0B]"
                : "bg-transparent border-white/10 text-[#8B949E] hover:border-white/25"
            )}
          >
            <Bookmark size={10} fill={showFavOnly ? "#F59E0B" : "none"} strokeWidth={2} />
            {favorites.length > 0 ? `Saved (${favorites.length})` : "Saved"}
          </button>
          {hasFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1 text-[10px] text-[#8B949E] hover:text-[#E6EDF3] transition-colors ml-auto cursor-pointer"
            >
              <X size={10} strokeWidth={2.5} /> Clear
            </button>
          )}
        </div>
        {/* Sort row */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#6E7681] flex items-center gap-1 shrink-0">
            <ArrowUpDown size={10} strokeWidth={2} /> Sort:
          </span>
          <div className="flex gap-1 flex-wrap">
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value)}
                className={cn(
                  "text-[10px] font-semibold px-2 py-0.5 rounded border transition-all cursor-pointer",
                  sortBy === opt.value
                    ? "bg-white/[0.08] border-white/20 text-[#E6EDF3]"
                    : "border-transparent text-[#6E7681] hover:text-[#8B949E]"
                )}
              >{opt.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="shrink-0 px-4 py-2 text-[12px] text-[#4a7fa8] border-b border-[#1a3a5c]/40 flex items-center gap-1">
        <span>{schools.length} of {allSchools.length} schools</span>
        {hasFilters && <span className="text-[#2e7fd4] font-semibold">· filtered</span>}
        <span className="ml-auto text-[#1a3a5c]">DO = dashed ring</span>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-3 py-3 space-y-4">
          {schools.length === 0 && (
            <div className="text-center py-12 text-[#6E7681] text-[12px]">
              No schools match your filters.
            </div>
          )}

          {isTierSort ? (
            [1,2,3,4].map(tier => {
              const group = byTier(tier);
              if (group.length === 0) return null;
              return (
                <div key={tier}>
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest mb-2 mt-1"
                    style={{ color: TIER[tier].color }}>
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: TIER[tier].color }} />
                    Tier {tier} — {TIER[tier].label}
                  </div>
                  <div className="space-y-1">
                    {group.map(school => <SchoolRow key={school.id} school={school} selected={selected} hovered={null} favorites={favorites} onSelect={onSelect} />)}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="space-y-1">
              {schools.map(school => <SchoolRow key={school.id} school={school} selected={selected} hovered={null} favorites={favorites} onSelect={onSelect} />)}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function SchoolRow({ school, selected, favorites, onSelect }) {
  const isSelected = selected?.id === school.id;
  const isFav = favorites.includes(school.id);
  const cfg = TIER[school.tier];

  return (
    <div className="relative rounded-lg" style={{ isolation: "isolate" }}>
      {isSelected && <GlowingEffect spread={30} glow disabled={false} proximity={60} borderWidth={1.5} color={cfg.color} />}
      {isSelected && <BorderBeam size={80} duration={5} colorFrom={cfg.color} colorTo={cfg.color + "33"} borderWidth={1} />}
      <button
        onClick={() => onSelect(school)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all cursor-pointer overflow-hidden relative",
          isSelected ? "" : "hover:bg-[#0d2035]"
        )}
        style={isSelected
          ? { background: `${cfg.color}18`, border: `1px solid ${cfg.color}55` }
          : { border: "1px solid transparent" }
        }
      >
        <span
          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-lg transition-opacity"
          style={{ background: cfg.color, opacity: isSelected ? 1 : 0 }}
        />
        <span className="w-2.5 h-2.5 rounded-full shrink-0 ml-1"
          style={{ background: cfg.color, boxShadow: isSelected ? `0 0 10px ${cfg.color}` : "none" }} />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-white truncate">{school.shortName}</p>
          <p className="text-[12px] text-[#4a7fa8] truncate">{school.location}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isFav && <Bookmark size={12} fill="#F59E0B" stroke="#F59E0B" />}
          <span className="text-[10px] font-bold px-2 py-0.5 rounded"
            style={{ color: cfg.color, background: `${cfg.color}18`, border: `1px solid ${cfg.color}44` }}>
            {school.degree}
          </span>
        </div>
      </button>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Section({ title, icon: Icon, children }) {
  return (
    <div className="px-4 py-4 border-b border-white/[0.06]">
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#5b8ab5] uppercase tracking-widest mb-3">
        {Icon && <Icon size={12} className="shrink-0" />}
        {title}
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 text-[13px] py-1">
      <span className="text-[#7fb3e0] shrink-0 font-medium">{label}</span>
      <span className="text-[#ddeeff] text-right leading-relaxed" style={{ maxWidth: "60%" }}>{value}</span>
    </div>
  );
}
