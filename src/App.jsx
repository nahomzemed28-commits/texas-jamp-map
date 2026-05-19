import { useState } from "react";
import { feature } from "topojson-client";
import { geoMercator, geoPath } from "d3-geo";
import usAtlas from "us-atlas/states-10m.json";
import { X, Phone, Mail, MapPin, FlaskConical, BookOpen, BarChart3, GraduationCap } from "lucide-react";

// ─── Tier Config ──────────────────────────────────────────────────────────────
const TIER = {
  1: { color: "#F59E0B", glow: "rgba(245,158,11,0.4)",  label: "Nationally Prominent" },
  2: { color: "#3B82F6", glow: "rgba(59,130,246,0.4)",  label: "Well-Established" },
  3: { color: "#10B981", glow: "rgba(16,185,129,0.4)",  label: "Established" },
  4: { color: "#A855F7", glow: "rgba(168,85,247,0.4)",  label: "Emerging / Newer" },
};

// ─── School Data ──────────────────────────────────────────────────────────────
const SCHOOLS = [
  {
    id: 1, name: "Baylor College of Medicine", shortName: "BCM",
    degree: "MD", tier: 1, location: "Houston, TX",
    website: "https://www.bcm.edu/education/school-of-medicine",
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
    website: "https://dellmed.utexas.edu",
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
    website: "https://lsom.uthscsa.edu",
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
    website: "https://med.uth.edu",
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
    website: "https://www.shsu.edu/colleges/com/",
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
    notes: "100% COMLEX Level 1 first-time pass rate (Class of 2026) · 10-year COCA accreditation · First new state-funded public DO school in US since 1977 · 99% residency placement",
    duals: ["DO/MPH (concurrent, 4–5 years online)"],
  },
  {
    id: 6, name: "Texas A&M Naresh K. Vashisht College of Medicine", shortName: "TAMU Med",
    degree: "MD", tier: 3, location: "Bryan/College Station, TX",
    website: "https://medicine.tamu.edu",
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
    notes: "Renamed Aug 9, 2025 (Naresh K. Vashisht gift) · Unique C2M ROTC-to-medicine track · Aggie early assurance (A2M) · 84.5% TX residents",
    duals: ["MD/PhD", "MD/MS (various disciplines)", "MD/MEd", "MD/ME (Engineering)"],
  },
  {
    id: 7, name: "Paul L. Foster School of Medicine (TTUHSC El Paso)", shortName: "Foster SOM",
    degree: "MD", tier: 3, location: "El Paso, TX",
    website: "https://ttuhsc.edu/foster-medicine/",
    lat: 31.7619, lng: -106.4850, dx: 0, dy: 0,
    jamp: { name: "Yoli Betancourt", phone: "915-215-4407", email: "Yolanda.Betancourt@ttuhsc.edu" },
    admissions: { mcat: "509", gpa: "3.83", classSize: "124", acceptRate: "2.7%" },
    grading: { preclinical: "Pass / Fail", clinical: "H / P / F" },
    curriculum: {
      structure: "Integrated; clinical presentations from Year 1",
      preclinical: "18 months",
      step1: "Required by July of MS2; must pass before entering clerkships",
    },
    specialties: [
      "US-Mexico border health & cross-border medicine",
      "Hispanic health disparities",
      "Primary care (~50% of graduates)",
      "Bilingual clinical training (Spanish-speaking patient population)",
    ],
    nih: { rank: "Not ranked", funding: "Limited (renamed 2009 after Paul Foster's $50M gift)" },
    notes: "Only allopathic school on US-Mexico border · Hispanic Serving Institution (HSI) · Univ Medical Center El Paso · Up to 10% OOS allowed",
    duals: ["MD/MPH (collaborative with UTHealth Houston SPH, within 4 years)"],
  },
  {
    id: 8, name: "TTUHSC School of Medicine (Lubbock)", shortName: "TTUHSC",
    degree: "MD", tier: 3, location: "Lubbock, TX",
    website: "https://ttuhsc.edu/medicine/",
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
    website: "https://com.uh.edu",
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
    website: "https://www.unthsc.edu/texas-college-of-osteopathic-medicine/",
    lat: 32.7431, lng: -97.3208, dx: 0, dy: 0,
    jamp: { name: "Lorena Marin", phone: "817-735-2475", email: "Lorena.Marin@unthsc.edu" },
    admissions: { mcat: "507", gpa: "3.77", classSize: "231", acceptRate: "~35% of interviewed" },
    grading: { preclinical: "Pass / Fail", clinical: "H / P / F" },
    curriculum: {
      structure: "Modified integrated systems; Year 2 is patient-presentation based (~1,000 diseases)",
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
    website: "https://www.utmb.edu/som",
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
    website: "https://som.utrgv.edu",
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
    website: "https://www.utsouthwestern.edu/education/medical-school/",
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
    website: "https://www.uttyler.edu/medicine/",
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
    notes: "Newest TX school (opened July 2023) · Smallest class in TX (40) · 95% TX residents · JAMP phased implementation: guaranteed admission begins 2026–2027 · ⚠️ JAMP coordinator email not confirmed — contact by phone",
    duals: ["MS in Biotechnology (concurrent)", "11 residency programs, 8 fellowships/internships"],
  },
];

// ─── Map Projection ───────────────────────────────────────────────────────────
const SVG_W = 800, SVG_H = 600;
const texasFeature = feature(usAtlas, usAtlas.objects.states).features.find(f => f.id === "48");
const projection  = geoMercator().fitExtent([[110, 90], [SVG_W - 110, SVG_H - 90]], texasFeature);
const TX_PATH     = geoPath(projection)(texasFeature);
const project     = (lng, lat) => { const [x, y] = projection([lng, lat]); return { x, y }; };


// ─── Root ─────────────────────────────────────────────────────────────────────
export default function TexasMedMap() {
  const [selected,   setSelected]   = useState(null);
  const [hovered,    setHovered]    = useState(null);
  const [hoverPos,   setHoverPos]   = useState({ x: 0, y: 0 });
  const [activeTab,  setActiveTab]  = useState("overview");
  const [tierFilter, setTierFilter] = useState(0);

  const visible = tierFilter === 0 ? SCHOOLS : SCHOOLS.filter(s => s.tier === tierFilter);

  function handleSelect(school) {
    setSelected(school);
    setActiveTab("overview");
    setHovered(null);
  }

  function handlePinEnter(school, e) {
    setHovered(school);
    setHoverPos({ x: e.clientX, y: e.clientY });
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "#060d1a", fontFamily: "'Geist Variable', system-ui, sans-serif", overflow: "hidden" }}>

      {/* ── Full-Screen Map ── */}
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        style={{ width: "100%", height: "100%", display: "block" }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="txFill" cx="45%" cy="40%" r="65%">
            <stop offset="0%"   stopColor="#0e2038" />
            <stop offset="100%" stopColor="#09162a" />
          </radialGradient>
          <filter id="txGlow" x="-8%" y="-8%" width="116%" height="116%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="pinGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="pinGlowSel" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="bgGrad" cx="50%" cy="48%" r="75%">
            <stop offset="0%"   stopColor="#0f2040" />
            <stop offset="45%"  stopColor="#09152a" />
            <stop offset="100%" stopColor="#030810" />
          </radialGradient>
          <radialGradient id="moonGlow" cx="50%" cy="48%" r="75%">
            <stop offset="0%"   stopColor="#2050a0" stopOpacity="0.28" />
            <stop offset="60%"  stopColor="#102060" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#102060" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background */}
        <rect width={SVG_W} height={SVG_H} fill="url(#bgGrad)" />

        {/* Ambient moon glow */}
        <rect width={SVG_W} height={SVG_H} fill="url(#moonGlow)" />

        {/* Star field — full canvas coverage */}
        {[
          [12,8],[42,28],[88,12],[120,55],[165,30],[198,18],[240,42],[310,40],[375,18],[420,35],[450,22],[500,10],[540,38],[560,48],[615,20],[650,42],[680,15],[720,30],[740,72],[775,18],[795,44],
          [8,70],[35,90],[55,110],[100,78],[140,95],[170,130],[220,80],[255,115],[290,95],[340,82],[380,118],[430,115],[475,78],[510,100],[555,88],[590,88],[635,110],[670,78],[710,140],[748,88],[780,95],[798,118],
          [18,155],[55,175],[95,185],[130,160],[175,195],[210,148],[250,210],[295,165],[330,188],[380,175],[415,200],[455,162],[510,195],[545,172],[585,198],[620,155],[650,168],[695,185],[730,162],[760,195],[790,168],
          [10,235],[45,255],[80,228],[115,248],[155,232],[195,258],[240,225],[280,248],[325,235],[370,255],[415,228],[460,250],[505,232],[550,258],[595,240],[635,255],[675,230],[712,252],[748,235],[778,255],[798,228],
          [22,290],[65,310],[108,285],[148,308],[195,292],[235,315],[275,290],[320,312],[365,295],[410,318],[455,292],[500,315],[545,298],[585,312],[625,288],[665,308],[705,292],[745,315],[778,298],[795,310],
          [15,365],[50,348],[90,372],[130,355],[168,378],[210,352],[255,368],[300,345],[345,372],[390,355],[435,378],[480,352],[525,368],[568,345],[610,372],[652,355],[695,378],[730,352],[762,368],[790,355],
          [30,420],[68,405],[108,428],[148,412],[188,435],[228,408],[268,432],[312,415],[355,438],[398,412],[440,435],[482,408],[525,432],[568,415],[610,438],[650,412],[692,435],[728,408],[758,428],[785,415],
          [18,478],[55,495],[95,470],[135,492],[175,475],[215,498],[258,472],[298,495],[340,478],[382,495],[425,470],[468,492],[510,475],[552,498],[595,472],[638,495],[678,472],[715,492],[750,478],[782,495],
          [40,540],[80,522],[120,545],[162,528],[205,552],[248,525],[290,548],[335,522],[378,545],[422,528],[465,552],[508,525],[552,548],[595,522],[638,545],[680,528],[718,548],[752,525],[778,545],[795,528],
          [25,582],[68,568],[110,585],[155,572],[200,588],[245,568],[292,585],[338,572],[385,588],[430,568],[478,585],[525,572],[572,588],[618,568],[665,585],[710,572],[750,588],[782,572],[798,585],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy}
            r={i % 7 === 0 ? 1.4 : i % 4 === 0 ? 1.0 : i % 2 === 0 ? 0.7 : 0.5}
            fill="white"
            opacity={i % 7 === 0 ? 0.35 : i % 4 === 0 ? 0.2 : i % 2 === 0 ? 0.12 : 0.07} />
        ))}

        {/* Texas — glow border */}
        <path d={TX_PATH} fill="none" stroke="#1d4ed8" strokeWidth="4" filter="url(#txGlow)" opacity="0.5" />
        {/* Texas — fill */}
        <path d={TX_PATH} fill="url(#txFill)" />
        {/* Texas — crisp edge */}
        <path d={TX_PATH} fill="none" stroke="#2563eb" strokeWidth="1.2" opacity="0.7" />
        {/* Texas — inner highlight top */}
        <path d={TX_PATH} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

        {/* Gulf label */}
        <text x="660" y="535" textAnchor="middle" fontSize="11" fill="#0f2e4a"
          fontStyle="italic" letterSpacing="1.5" style={{ userSelect: "none", pointerEvents: "none" }}>
          Gulf of Mexico
        </text>

        {/* ── Markers ── */}
        {SCHOOLS.map(school => {
          const pos   = project(school.lng, school.lat);
          const cx    = pos.x + (school.dx || 0);
          const cy    = pos.y + (school.dy || 0);
          const isSel = selected?.id === school.id;
          const isHov = hovered?.id  === school.id;
          const isVis = visible.some(s => s.id === school.id);
          const cfg   = TIER[school.tier];
          const r     = isSel ? 10 : isHov ? 9 : 7;

          return (
            <g
              key={school.id}
              onClick={() => handleSelect(school)}
              onMouseEnter={e => handlePinEnter(school, e)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer", opacity: isVis ? 1 : 0.08, transition: "opacity 0.25s" }}
            >
              {/* Outer glow ring */}
              <circle cx={cx} cy={cy} r={r + 5} fill={cfg.color} opacity={isSel || isHov ? 0.2 : 0.1} filter="url(#pinGlow)" />

              {/* Pulse ring when selected */}
              {isSel && <circle className="pulse-ring" cx={cx} cy={cy} r={r + 9} fill={cfg.color} opacity={0.15} />}

              {/* DO dashed outer ring */}
              {school.degree === "DO" && (
                <circle cx={cx} cy={cy} r={r + 5} fill="none"
                  stroke={cfg.color} strokeWidth="1.2" strokeDasharray="3 2" opacity={0.6} />
              )}

              {/* Main dot */}
              <circle cx={cx} cy={cy} r={r} fill={cfg.color}
                filter={isSel || isHov ? "url(#pinGlowSel)" : undefined}
                opacity={isSel || isHov ? 1 : 0.9} />

              {/* White center */}
              <circle cx={cx} cy={cy} r={r * 0.38} fill="white" opacity={0.95} />
            </g>
          );
        })}
      </svg>

      {/* ── Floating Header ── */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        padding: "22px 28px 56px",
        background: "linear-gradient(to bottom, rgba(5,9,18,0.98) 30%, transparent)",
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        pointerEvents: "none", zIndex: 10,
      }}>
        {/* Brand */}
        <div style={{ pointerEvents: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: "linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 18px rgba(99,102,241,0.45)",
            }}>
              <span style={{ color: "white", fontSize: 15, fontWeight: 900, letterSpacing: "-0.5px" }}>J</span>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
                <span style={{ fontSize: 17, fontWeight: 800, color: "#e2edf8", letterSpacing: "-0.02em" }}>JAMP</span>
                <span style={{ fontSize: 17, fontWeight: 300, color: "#3d6a91", letterSpacing: "-0.01em" }}>Medical Schools</span>
              </div>
              <div style={{ fontSize: 10, color: "#1e4d6a", letterSpacing: "0.12em", marginTop: 1 }}>
                14 PARTICIPATING INSTITUTIONS · TEXAS
              </div>
            </div>
          </div>
        </div>

        {/* Tier filter pills */}
        <div style={{ pointerEvents: "auto", display: "flex", gap: 6, alignItems: "center" }}>
          {[{ t: 0, label: "All" }, ...Object.entries(TIER).map(([t, c]) => ({ t: +t, label: `Tier ${t}`, color: c.color }))].map(item => {
            const active = tierFilter === item.t;
            return (
              <button key={item.t} onClick={() => setTierFilter(active ? 0 : item.t)} style={{
                padding: "5px 14px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                cursor: "pointer", border: "none", outline: "none",
                background: active ? (item.color ? `${item.color}22` : "rgba(59,130,246,0.15)") : "rgba(255,255,255,0.04)",
                color: active ? (item.color || "#3b82f6") : "#2d5a7a",
                boxShadow: active ? `0 0 12px ${item.color || "#3b82f6"}33, inset 0 0 0 1px ${item.color || "#3b82f6"}44` : "inset 0 0 0 1px rgba(255,255,255,0.07)",
                backdropFilter: "blur(12px)",
                transition: "all 0.18s",
              }}>
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Bottom Legend ── */}
      <div style={{
        position: "absolute", bottom: 24, left: 28,
        display: "flex", gap: 14, alignItems: "center",
        pointerEvents: "none", zIndex: 10,
      }}>
        {Object.entries(TIER).map(([t, cfg]) => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.color, boxShadow: `0 0 8px ${cfg.color}88` }} />
            <span style={{ fontSize: 10, color: "#2d5a7a", fontWeight: 600, letterSpacing: "0.04em" }}>T{t}</span>
          </div>
        ))}
        <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.07)", margin: "0 2px" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", border: "1.5px dashed #6b7280", opacity: 0.5 }} />
          <span style={{ fontSize: 10, color: "#2d5a7a", fontWeight: 600 }}>DO</span>
        </div>
      </div>

      {/* ── Hover Preview Card ── */}
      {hovered && !selected && (
        <HoverCard school={hovered} pos={hoverPos} />
      )}

      {/* ── Slide-in Detail Panel ── */}
      {selected && (
        <SchoolPanel
          school={selected}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

// ─── Hover Card ───────────────────────────────────────────────────────────────
function HoverCard({ school, pos }) {
  const cfg = TIER[school.tier];
  const W   = 248;
  // Keep card on screen
  const left = Math.min(pos.x + 16, window.innerWidth - W - 16);
  const top  = Math.max(pos.y - 140, 12);

  return (
    <div style={{
      position: "fixed", left, top, width: W,
      background: "rgba(6, 12, 24, 0.97)",
      border: `1px solid ${cfg.color}44`,
      borderRadius: 14, overflow: "hidden",
      boxShadow: `0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px ${cfg.color}18, 0 0 30px ${cfg.glow}`,
      pointerEvents: "none", zIndex: 40,
      animation: "fadeUp 0.12s ease-out",
    }}>
      {/* Color bar */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}44)` }} />

      {/* Header */}
      <div style={{ padding: "12px 14px 10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: cfg.color, textTransform: "uppercase", letterSpacing: "0.09em" }}>
            Tier {school.tier} · {cfg.label}
          </span>
          <span style={{
            marginLeft: "auto", fontSize: 10, fontWeight: 700, color: cfg.color,
            border: `1px solid ${cfg.color}55`, borderRadius: 5, padding: "1px 7px",
          }}>{school.degree}</span>
        </div>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#d4e8f8", margin: "0 0 3px", lineHeight: 1.35 }}>
          {school.name}
        </p>
        <p style={{ fontSize: 11, color: "#2d5a7a", margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
          <MapPin size={10} strokeWidth={2.5} color="#2d5a7a" />
          {school.location}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderTop: `1px solid rgba(255,255,255,0.05)` }}>
        {[
          { label: "MCAT",  value: school.admissions.mcat,      color: "#f59e0b" },
          { label: "GPA",   value: school.admissions.gpa,       color: "#10b981" },
          { label: "Class", value: school.admissions.classSize,  color: "#3b82f6" },
        ].map((s, i) => (
          <div key={s.label} style={{
            textAlign: "center", padding: "10px 4px",
            borderRight: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none",
          }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 9, color: "#2d5a7a", fontWeight: 600, marginTop: 3, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: "7px 14px", fontSize: 10, color: "#1a4060", textAlign: "right", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        Click to explore →
      </div>
    </div>
  );
}

// ─── School Panel ─────────────────────────────────────────────────────────────
function SchoolPanel({ school, activeTab, setActiveTab, onClose }) {
  const cfg  = TIER[school.tier];
  const tabs = [
    { id: "overview",   label: "Overview",   icon: <MapPin size={13} /> },
    { id: "admissions", label: "Admissions", icon: <BarChart3 size={13} /> },
    { id: "academics",  label: "Academics",  icon: <BookOpen size={13} /> },
    { id: "research",   label: "Research",   icon: <FlaskConical size={13} /> },
  ];

  return (
    <div style={{
      position: "fixed", top: 0, right: 0, bottom: 0, width: 440,
      background: "rgba(4, 9, 19, 0.98)",
      backdropFilter: "blur(32px)",
      borderLeft: `1px solid rgba(255,255,255,0.06)`,
      display: "flex", flexDirection: "column",
      zIndex: 50,
      boxShadow: "-20px 0 80px rgba(0,0,0,0.6)",
      animation: "slideIn 0.26s cubic-bezier(0.22,1,0.36,1)",
    }}>
      {/* Panel header */}
      <div style={{ padding: "24px 24px 0", flexShrink: 0, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#4d7fa8", transition: "all 0.15s",
          }}>
            <X size={15} strokeWidth={2.5} />
          </button>
          <span style={{
            fontSize: 11, fontWeight: 700, color: cfg.color,
            border: `1px solid ${cfg.color}55`, borderRadius: 6, padding: "3px 10px",
            letterSpacing: "0.06em",
          }}>{school.degree}</span>
        </div>

        {/* Tier badge */}
        <div style={{ fontSize: 10, fontWeight: 700, color: cfg.color, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 7 }}>
          Tier {school.tier} · {cfg.label}
        </div>

        {/* School name */}
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#ddeeff", margin: "0 0 4px", lineHeight: 1.25, letterSpacing: "-0.02em" }}>
          {school.name}
        </h2>
        <p style={{ fontSize: 12, color: "#2d5a7a", margin: "0 0 22px", display: "flex", alignItems: "center", gap: 5 }}>
          <MapPin size={11} strokeWidth={2} color="#2d5a7a" />
          {school.location}
        </p>

        {/* Tabs */}
        <div style={{ display: "flex" }}>
          {tabs.map(tab => {
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                flex: 1, padding: "9px 4px", background: "none", border: "none",
                borderBottom: active ? `2px solid ${cfg.color}` : "2px solid transparent",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                color: active ? cfg.color : "#2d5a7a",
                fontSize: 11, fontWeight: 600,
                transition: "all 0.15s",
              }}>
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
        {activeTab === "overview"   && <TabOverview   school={school} cfg={cfg} />}
        {activeTab === "admissions" && <TabAdmissions school={school} cfg={cfg} />}
        {activeTab === "academics"  && <TabAcademics  school={school} cfg={cfg} />}
        {activeTab === "research"   && <TabResearch   school={school} cfg={cfg} />}
      </div>
    </div>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#1e4d6a", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
        {title}
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value, highlight }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <span style={{ fontSize: 12, color: "#2d5a7a", fontWeight: 500, flexShrink: 0, marginRight: 12 }}>{label}</span>
      <span style={{ fontSize: 12, color: highlight || "#b0ccdf", fontWeight: 600, textAlign: "right", lineHeight: 1.4 }}>{value}</span>
    </div>
  );
}

function Pill({ children, color }) {
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: 20,
      fontSize: 11, fontWeight: 600, background: `${color}18`,
      color, border: `1px solid ${color}33`, marginRight: 6, marginBottom: 6,
    }}>{children}</span>
  );
}

function ContactCard({ label, value, href, icon }) {
  return (
    <a href={href} style={{
      display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
      background: "rgba(255,255,255,0.03)", borderRadius: 10,
      border: "1px solid rgba(255,255,255,0.06)",
      textDecoration: "none", marginBottom: 8, transition: "background 0.15s",
    }}>
      <div style={{ color: "#3b82f6", flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 10, color: "#2d5a7a", fontWeight: 600, marginBottom: 1 }}>{label}</div>
        <div style={{ fontSize: 12, color: "#7fb3d8", fontWeight: 600 }}>{value}</div>
      </div>
    </a>
  );
}

// ─── Tab Sources ──────────────────────────────────────────────────────────────
function TabSources({ links }) {
  return (
    <div style={{ marginTop: 28, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ fontSize: 9, fontWeight: 700, color: "#1a3d55", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>
        Sources
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {links.map((link, i) => (
          <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{
            display: "flex", alignItems: "center", gap: 8,
            textDecoration: "none", padding: "7px 10px",
            background: "rgba(255,255,255,0.02)", borderRadius: 7,
            border: "1px solid rgba(255,255,255,0.04)",
            transition: "background 0.15s",
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1e4d6a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            <span style={{ fontSize: 11, color: "#2d6a8a", fontWeight: 500, lineHeight: 1.4 }}>{link.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
function TabOverview({ school, cfg }) {
  return (
    <>
      <Section title="JAMP Coordinator">
        <div style={{ padding: "14px", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${cfg.color}22`, border: `1px solid ${cfg.color}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <GraduationCap size={16} color={cfg.color} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#d4e8f8" }}>{school.jamp.name}</div>
              <div style={{ fontSize: 10, color: "#2d5a7a" }}>JAMP Coordinator</div>
            </div>
          </div>
          <ContactCard label="Phone" value={school.jamp.phone} href={`tel:${school.jamp.phone}`} icon={<Phone size={14} />} />
          {school.jamp.email
            ? <ContactCard label="Email" value={school.jamp.email} href={`mailto:${school.jamp.email}`} icon={<Mail size={14} />} />
            : <div style={{ fontSize: 11, color: "#b45309", padding: "8px 14px", background: "rgba(180,83,9,0.08)", borderRadius: 8, border: "1px solid rgba(180,83,9,0.2)" }}>
                ⚠️ Email unconfirmed — contact by phone
              </div>
          }
        </div>
      </Section>

      <Section title="Key Notes">
        <p style={{ fontSize: 12, color: "#7fb3d8", lineHeight: 1.7, margin: 0 }}>{school.notes}</p>
      </Section>

      <TabSources links={[
        { label: "JAMP Participating Schools", url: "https://texasjamp.org/about/participating-schools.html" },
        { label: "texasjamp.org — Program Overview", url: "https://texasjamp.org" },
        { label: `${school.shortName} Official Website`, url: school.website },
      ]} />
    </>
  );
}

function TabAdmissions({ school, cfg }) {
  const stats = [
    { label: "MCAT",        value: school.admissions.mcat,       color: "#f59e0b", sub: "Median" },
    { label: "GPA",         value: school.admissions.gpa,        color: "#10b981", sub: "Overall" },
    { label: "Class Size",  value: school.admissions.classSize,  color: "#3b82f6", sub: "Students" },
    { label: "Accept Rate", value: school.admissions.acceptRate, color: "#a855f7", sub: "of applicants" },
  ];

  return (
    <>
      <Section title="Admissions Stats">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 4 }}>
          {stats.map(s => (
            <div key={s.label} style={{
              padding: "16px", borderRadius: 12, textAlign: "center",
              background: `${s.color}0d`, border: `1px solid ${s.color}28`,
            }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: s.color, lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#d4e8f8", marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 10, color: "#2d5a7a" }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Grading System">
        <InfoRow label="Preclinical" value={school.grading.preclinical} />
        <InfoRow label="Clinical"    value={school.grading.clinical} />
      </Section>

      <TabSources links={[
        { label: "TMDSAS — Texas Medical & Dental Schools Application Service", url: "https://www.tmdsas.com" },
        { label: "AAMC Data Snapshot — Entering Class Stats", url: "https://www.aamc.org/data-reports/students-residents/data/aamc-data-snapshot" },
        { label: `${school.shortName} Admissions Page`, url: school.website },
      ]} />
    </>
  );
}

function TabAcademics({ school, cfg }) {
  return (
    <>
      <Section title="Curriculum">
        <InfoRow label="Structure"         value={school.curriculum.structure} />
        <InfoRow label="Preclinical Phase" value={school.curriculum.preclinical} />
        <InfoRow label="Step 1 / COMLEX"   value={school.curriculum.step1} />
      </Section>

      <Section title="Notable Specialties">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {school.specialties.map((sp, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", background: "rgba(255,255,255,0.02)", borderRadius: 9, border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color, flexShrink: 0, marginTop: 4, boxShadow: `0 0 6px ${cfg.glow}` }} />
              <span style={{ fontSize: 12, color: "#7fb3d8", lineHeight: 1.5 }}>{sp}</span>
            </div>
          ))}
        </div>
      </Section>

      <TabSources links={[
        { label: `${school.shortName} Curriculum Overview`, url: school.website },
        { label: "USMLE — United States Medical Licensing Examination", url: "https://www.usmle.org" },
        { label: "NBOME — COMLEX-USA (for DO programs)", url: "https://www.nbome.org/comlex-usa/" },
      ]} />
    </>
  );
}

function TabResearch({ school, cfg }) {
  return (
    <>
      <Section title="NIH Funding">
        <div style={{ padding: "16px", borderRadius: 12, background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.18)", marginBottom: 4 }}>
          <InfoRow label="National Rank" value={school.nih.rank} highlight="#60a5fa" />
          <InfoRow label="Funding"       value={school.nih.funding} highlight="#60a5fa" />
        </div>
      </Section>

      <Section title="Dual Degree Programs">
        <div style={{ paddingTop: 4 }}>
          {school.duals.map((d, i) => (
            <Pill key={i} color={cfg.color}>{d}</Pill>
          ))}
        </div>
      </Section>

      <TabSources links={[
        { label: "Blue Ridge Institute for Medical Research — NIH Rankings", url: "https://www.brimr.org/NIH_Awards/NIH_Awards.htm" },
        { label: "NIH Research Portfolio Online Reporting Tools (RePORTER)", url: "https://reporter.nih.gov" },
        { label: `${school.shortName} Research Programs`, url: school.website },
      ]} />
    </>
  );
}
