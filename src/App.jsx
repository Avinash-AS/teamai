import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────
// FONTS & GLOBAL CSS
// ─────────────────────────────────────────────
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400&display=swap');`;

// ─────────────────────────────────────────────
// DEFAULT TEAMS DATA
// ─────────────────────────────────────────────
const DEFAULT_TEAMS = [
  {
    id: "tech", name: "Tech Startup Squad", emoji: "🚀", tagline: "Code, launch & grow your product", color: "#00e8ff", isDefault: true,
    examples: ["Build a SaaS productivity app", "Create a portfolio website", "Design a mobile app for food delivery"],
    bots: [
      { id: "strategyai", name: "StrategyAI", role: "Business Strategist", emoji: "♟️", color: "#00e8ff", personality: "analytical, visionary",
        collaborate: `You are StrategyAI, an elite business strategist. Analyze the project idea and deliver: market research, target audience, business model, competitive analysis, revenue streams, and go-to-market strategy. Be thorough and specific.`,
        solo: `You are StrategyAI, elite business strategist. Help with market analysis, business models, competitive strategy, and business planning.` },
      { id: "pixelai", name: "PixelAI", role: "UI/UX Designer", emoji: "🎨", color: "#ff6fff", personality: "creative, detail-oriented",
        collaborate: `You are PixelAI, elite UI/UX designer. Based on the strategy above, design: complete design system, color palette, typography, UI component structure, user flows, wireframe descriptions, and UX guidelines.`,
        solo: `You are PixelAI, elite UI/UX designer. Help with design systems, user flows, wireframes, color palettes, and visual identity.` },
      { id: "codex", name: "CodeX", role: "Lead Engineer", emoji: "⚡", color: "#ffe44d", personality: "precise, solution-focused",
        collaborate: `You are CodeX, elite full-stack engineer. Based on the strategy and design above, write: complete working code implementation including HTML/CSS/JS or architecture blueprint, tech stack recommendations, and full README.md content.`,
        solo: `You are CodeX, elite full-stack engineer. Help with code, architecture, debugging, tech decisions, and implementation.` },
      { id: "growthbot", name: "GrowthBot", role: "Growth Marketer", emoji: "📈", color: "#4effa0", personality: "data-driven, creative",
        collaborate: `You are GrowthBot, elite growth marketer. Based on all work above, create: complete launch plan, marketing strategy, content calendar, SEO strategy, social media plan, user acquisition tactics, and KPIs.`,
        solo: `You are GrowthBot, elite growth marketer. Help with SEO, marketing campaigns, launch strategies, and user acquisition.` },
      { id: "lexai", name: "LexAI", role: "Legal Advisor", emoji: "⚖️", color: "#ff9442", personality: "precise, protective",
        collaborate: `You are LexAI, elite legal advisor. Based on the project above, provide: terms of service, privacy policy, legal compliance checklist, IP protection strategy, required licenses, and risk mitigation advice.`,
        solo: `You are LexAI, elite legal advisor. Help with contracts, legal documents, compliance, IP protection, and legal risk management.` },
    ],
  },
  {
    id: "health", name: "MedCore Team", emoji: "🏥", tagline: "Health, wellness & medical innovation", color: "#4effa0", isDefault: true,
    examples: ["Create a personal fitness plan", "Build a mental health app", "Write a health startup business plan"],
    bots: [
      { id: "clinai", name: "ClinAI", role: "Clinical Advisor", emoji: "🩺", color: "#4effa0", personality: "evidence-based, caring",
        collaborate: `You are ClinAI, elite clinical health advisor. Analyze the health project and deliver: clinical protocols, evidence-based recommendations, medical content, health guidelines, and patient safety considerations.`,
        solo: `You are ClinAI, clinical health advisor. Help with medical conditions, treatment options, health plans, and clinical guidance. Always recommend consulting a licensed physician for personal decisions.` },
      { id: "regbot", name: "RegBot", role: "Health Regulatory Expert", emoji: "📋", color: "#00e8ff", personality: "meticulous, compliance-focused",
        collaborate: `You are RegBot, elite healthcare regulatory expert. Based on the clinical plan above, provide: FDA/HIPAA compliance requirements, regulatory checklist, health data privacy rules, certification requirements.`,
        solo: `You are RegBot, healthcare regulatory expert. Help with HIPAA, FDA regulations, medical compliance, and health data privacy.` },
      { id: "healthdev", name: "HealthDev", role: "Health Tech Engineer", emoji: "💻", color: "#ffe44d", personality: "technical, innovative",
        collaborate: `You are HealthDev, elite health tech engineer. Based on above, provide: technical architecture for health platform, EHR/FHIR integration plan, health app development blueprint, data security implementation.`,
        solo: `You are HealthDev, health tech engineer. Help build digital health products, health apps, EHR integrations, and medical data systems.` },
      { id: "wellbot", name: "WellBot", role: "Wellness Coach", emoji: "🧘", color: "#ff6fff", personality: "motivating, holistic",
        collaborate: `You are WellBot, elite wellness coach. Based on all above, create: complete wellness program, lifestyle plan, nutrition guidelines, exercise routines, mental health strategies, and measurable wellness outcomes.`,
        solo: `You are WellBot, wellness coach. Help with fitness plans, nutrition, mental health strategies, sleep improvement, and healthy habits.` },
    ],
  },
  {
    id: "legal", name: "Legal Eagles", emoji: "⚖️", tagline: "Legal protection & compliance for everything", color: "#ff9442", isDefault: true,
    examples: ["Draft an NDA for my business", "Create a freelance service agreement", "Write a complete privacy policy"],
    bots: [
      { id: "contractai", name: "ContractAI", role: "Contract Specialist", emoji: "📝", color: "#ff9442", personality: "precise, thorough",
        collaborate: `You are ContractAI, elite contract specialist. Analyze the legal need and draft: complete contract with all necessary clauses, definitions, obligations, termination terms, and dispute resolution. Write the FULL document.`,
        solo: `You are ContractAI, contract specialist. Draft complete contracts, NDAs, service agreements, employment contracts. Write full documents when asked.` },
      { id: "bizlaw", name: "BizLaw", role: "Business Law Advisor", emoji: "🏛️", color: "#00e8ff", personality: "strategic, protective",
        collaborate: `You are BizLaw, elite business law advisor. Based on above contract, add: business structure recommendations, liability protections, regulatory compliance requirements, jurisdiction considerations.`,
        solo: `You are BizLaw, business law advisor. Help with company formation, business structures, commercial law, and business disputes.` },
      { id: "ipguard", name: "IPGuard", role: "IP & Copyright Expert", emoji: "🔒", color: "#ffe44d", personality: "protective, detail-focused",
        collaborate: `You are IPGuard, elite IP expert. Based on the project, provide: IP protection strategy, trademark/copyright clauses, IP ownership terms, licensing recommendations, infringement prevention.`,
        solo: `You are IPGuard, IP expert. Help with trademarks, copyrights, patents, IP licensing, and protecting creative work.` },
      { id: "complybot", name: "ComplyBot", role: "Compliance Officer", emoji: "✅", color: "#4effa0", personality: "systematic, thorough",
        collaborate: `You are ComplyBot, elite compliance officer. Based on all above, provide: complete compliance checklist, GDPR/CCPA requirements, data protection rules, industry-specific regulations, audit trail recommendations.`,
        solo: `You are ComplyBot, compliance expert. Help with GDPR, CCPA, data protection, financial regulations, and compliance programs.` },
    ],
  },
  {
    id: "business", name: "Business Builders", emoji: "💼", tagline: "Strategy, finance & business planning", color: "#ffe44d", isDefault: true,
    examples: ["Write a complete business plan", "Create an investor pitch deck", "Build a financial model for my startup"],
    bots: [
      { id: "stratai", name: "StrategyAI", role: "Business Strategist", emoji: "♟️", color: "#ffe44d", personality: "visionary, analytical",
        collaborate: `You are StrategyAI, elite business strategist. Analyze the business idea and deliver: executive summary, market opportunity, competitive landscape, business model canvas, SWOT analysis, strategic roadmap.`,
        solo: `You are StrategyAI, business strategist. Help with business models, market analysis, competitive strategy, and business planning.` },
      { id: "finbot", name: "FinBot", role: "Financial Advisor", emoji: "💰", color: "#4effa0", personality: "precise, data-driven",
        collaborate: `You are FinBot, elite financial advisor. Based on the strategy above, create: 3-year financial projections, revenue model breakdown, cost structure, funding requirements, unit economics, break-even analysis.`,
        solo: `You are FinBot, financial advisor. Help with financial planning, projections, fundraising, and financial modeling.` },
      { id: "pitchpro", name: "PitchPro", role: "Pitch & Fundraising Expert", emoji: "🎯", color: "#ff6fff", personality: "persuasive, compelling",
        collaborate: `You are PitchPro, elite pitch expert. Based on strategy and financials above, write: complete investor pitch narrative, slide-by-slide pitch deck content, elevator pitch, key investor FAQs with answers.`,
        solo: `You are PitchPro, pitch expert. Help craft investor pitches, pitch decks, elevator pitches, and fundraising strategies.` },
      { id: "peoplebot", name: "PeopleBot", role: "HR & Team Building", emoji: "👥", color: "#00e8ff", personality: "people-first, organized",
        collaborate: `You are PeopleBot, elite HR expert. Based on the business plan above, design: org structure, key hiring plan, job descriptions for critical roles, compensation framework, company culture blueprint, team onboarding plan.`,
        solo: `You are PeopleBot, HR expert. Help with hiring, job descriptions, team structures, company culture, and employee policies.` },
    ],
  },
  {
    id: "creative", name: "Creative Studio", emoji: "🎬", tagline: "Brand, content & creative campaigns", color: "#ff6fff", isDefault: true,
    examples: ["Create a full brand identity", "Write a content marketing strategy", "Build a social media launch campaign"],
    bots: [
      { id: "directorai", name: "DirectorAI", role: "Creative Director", emoji: "🎬", color: "#ff6fff", personality: "bold, visionary",
        collaborate: `You are DirectorAI, elite creative director. Analyze the creative brief and deliver: brand positioning, creative concept, visual identity guidelines, brand voice, campaign direction, mood board description.`,
        solo: `You are DirectorAI, creative director. Help with brand strategy, creative vision, campaign concepts, visual identity, and brand positioning.` },
      { id: "inkbot", name: "InkBot", role: "Content Writer", emoji: "✍️", color: "#00e8ff", personality: "persuasive, versatile",
        collaborate: `You are InkBot, elite content writer. Based on the creative direction above, write: ALL content including headlines, taglines, website copy, about section, product descriptions, email sequences, ad copy.`,
        solo: `You are InkBot, content writer. Write website copy, ad copy, email sequences, blog posts, and any written content.` },
      { id: "viralbot", name: "ViralBot", role: "Social Media Strategist", emoji: "📱", color: "#ffe44d", personality: "trend-savvy, engaging",
        collaborate: `You are ViralBot, elite social media strategist. Based on brand and content above, create: platform-specific strategies, 30-day content calendar, viral content ideas, hashtag strategy, community growth plan.`,
        solo: `You are ViralBot, social media strategist. Help with content calendars, viral content ideas, platform strategies, and growing social presence.` },
      { id: "seobot", name: "SEOBot", role: "SEO Strategist", emoji: "🔍", color: "#4effa0", personality: "analytical, systematic",
        collaborate: `You are SEOBot, elite SEO strategist. Based on all content above, provide: keyword strategy, SEO-optimized content structure, meta tags, link building plan, technical SEO checklist, ranking strategy.`,
        solo: `You are SEOBot, SEO expert. Help with keyword research, on-page SEO, content strategy, technical SEO, and ranking improvement.` },
    ],
  },
  {
    id: "engineering", name: "Engineering Corps", emoji: "⚙️", tagline: "Design, prototype & manufacture products", color: "#a78bfa", isDefault: true,
    examples: ["Design a smart IoT wearable device", "Create product specifications for a drone", "Plan manufacturing for a hardware startup"],
    bots: [
      { id: "mechai", name: "MechAI", role: "Mechanical Engineer", emoji: "🔧", color: "#a78bfa", personality: "precise, innovative",
        collaborate: `You are MechAI, elite mechanical engineer. Analyze the engineering project and deliver: mechanical design specs, materials selection, manufacturing process, prototyping plan, BOM (bill of materials), tolerances and dimensions.`,
        solo: `You are MechAI, mechanical engineer. Help with product design, materials, manufacturing processes, and prototyping.` },
      { id: "circuitbot", name: "CircuitBot", role: "Electrical Engineer", emoji: "⚡", color: "#ffe44d", personality: "methodical, detail-oriented",
        collaborate: `You are CircuitBot, elite electrical engineer. Based on mechanical specs above, provide: electrical schematic overview, component selection with part numbers, PCB design notes, power requirements, firmware architecture, connectivity specs.`,
        solo: `You are CircuitBot, electrical engineer. Help with PCB design, embedded systems, IoT, power systems, and electronics.` },
      { id: "projbot", name: "ProjBot", role: "Project Manager", emoji: "📐", color: "#4effa0", personality: "organized, risk-aware",
        collaborate: `You are ProjBot, elite engineering PM. Based on all specs above, create: detailed project timeline with milestones, budget breakdown, resource requirements, risk register, vendor/partner recommendations, launch checklist.`,
        solo: `You are ProjBot, engineering PM. Help with project timelines, budgets, risk management, and product launch planning.` },
      { id: "supplybot", name: "SupplyBot", role: "Supply Chain Expert", emoji: "🏭", color: "#ff6fff", personality: "efficient, global-minded",
        collaborate: `You are SupplyBot, elite supply chain expert. Based on all above, provide: global sourcing strategy, manufacturer recommendations by region, logistics plan, import/export requirements, quality control process, cost optimization.`,
        solo: `You are SupplyBot, supply chain expert. Help with sourcing, manufacturing, logistics, and supply chain optimization.` },
    ],
  },
];

// ─────────────────────────────────────────────
// STORAGE HELPERS (localStorage for persistence)
// ─────────────────────────────────────────────
const Storage = {
  getProjects: () => { try { return JSON.parse(localStorage.getItem("teamai_projects") || "[]"); } catch { return []; } },
  saveProject: (p) => { const ps = Storage.getProjects().filter(x => x.id !== p.id); localStorage.setItem("teamai_projects", JSON.stringify([p, ...ps])); },
  deleteProject: (id) => { localStorage.setItem("teamai_projects", JSON.stringify(Storage.getProjects().filter(p => p.id !== id))); },
  getCustomTeams: () => { try { return JSON.parse(localStorage.getItem("teamai_custom_teams") || "[]"); } catch { return []; } },
  saveCustomTeam: (t) => { const ts = Storage.getCustomTeams().filter(x => x.id !== t.id); localStorage.setItem("teamai_custom_teams", JSON.stringify([...ts, t])); },
  deleteCustomTeam: (id) => { localStorage.setItem("teamai_custom_teams", JSON.stringify(Storage.getCustomTeams().filter(t => t.id !== id))); },
};

// ─────────────────────────────────────────────
// API CALL
// ─────────────────────────────────────────────
async function callClaude(systemPrompt, messages) {
  try {
    const res = await fetch("https://teamai-ashen.vercel.app/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        system: systemPrompt,
        messages,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.content?.[0]?.text || data.content?.map(b => b.text || "").join("") || "No response received.";
  } catch (e) {
    return `Error: ${e.message}`;
  }
}

// ─────────────────────────────────────────────
// ZIP DOWNLOAD
// ─────────────────────────────────────────────
async function downloadAsZip(projectTitle, results, bots) {
  // Build a simple zip-like structure as concatenated text files
  let content = `# ${projectTitle}\n# Generated by TeamAI\n\n`;
  bots.forEach(bot => {
    if (results[bot.id]) {
      content += `${"=".repeat(60)}\n## ${bot.name} — ${bot.role}\n${"=".repeat(60)}\n\n${results[bot.id]}\n\n`;
    }
  });
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${projectTitle.replace(/\s+/g, "-").toLowerCase()}-teamai.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const css = `
${FONTS}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#060a0e;--surface:#0d1318;--surface2:#121920;--surface3:#161f28;
  --border:rgba(255,255,255,0.07);--border2:rgba(255,255,255,0.13);
  --text:#e8edf2;--muted:#5a6a7a;--muted2:#3a4a5a;
  --accent:#00e8ff;--accent2:#0070ff;--green:#4effa0;--red:#ff4e4e;
  --font-h:'Syne',sans-serif;--font-m:'DM Mono',monospace;
  --r:16px;--r-sm:10px;--r-xs:7px;
}
html{-webkit-tap-highlight-color:transparent;scroll-behavior:smooth;}
body{background:var(--bg);color:var(--text);font-family:var(--font-h);overflow-x:hidden;}
::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:var(--border2);border-radius:4px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes glow{0%,100%{box-shadow:0 0 20px rgba(0,232,255,.3)}50%{box-shadow:0 0 50px rgba(0,232,255,.6)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
@keyframes workingPulse{0%,100%{background:rgba(0,232,255,.06)}50%{background:rgba(0,232,255,.14)}}
.fu{animation:fadeUp .45s cubic-bezier(.16,1,.3,1) both}
.fu2{animation:fadeUp .45s .08s cubic-bezier(.16,1,.3,1) both}
.fu3{animation:fadeUp .45s .16s cubic-bezier(.16,1,.3,1) both}
.fi{animation:fadeIn .4s ease both}
.si{animation:scaleIn .35s cubic-bezier(.16,1,.3,1) both}
.sui{animation:slideUp .3s cubic-bezier(.16,1,.3,1) both}

/* GRID BG */
.grid-bg{position:fixed;inset:0;pointer-events:none;z-index:0;
  background-image:linear-gradient(rgba(0,232,255,.025) 1px,transparent 1px),
  linear-gradient(90deg,rgba(0,232,255,.025) 1px,transparent 1px);
  background-size:40px 40px;}
.orb{position:fixed;pointer-events:none;z-index:0;border-radius:50%;filter:blur(80px);opacity:.1;}
.orb1{width:500px;height:500px;background:#00e8ff;top:-150px;right:-150px;}
.orb2{width:400px;height:400px;background:#0070ff;bottom:-100px;left:-100px;}

/* SPLASH */
.splash{position:fixed;inset:0;z-index:9999;background:var(--bg);
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;}
.splash-logo{font-size:3.4rem;font-weight:800;letter-spacing:-2px;animation:glow 2s ease infinite;}
.splash-logo span{color:var(--accent);}
.splash-sub{font-family:var(--font-m);font-size:.72rem;color:var(--muted);
  letter-spacing:3px;text-transform:uppercase;animation:fadeIn 1s .4s ease both;opacity:0;}
.splash-dots{display:flex;gap:8px;animation:fadeIn .5s .7s ease both;opacity:0;}
.splash-dots span{width:6px;height:6px;border-radius:50%;background:var(--accent);animation:pulse 1.4s ease infinite;}
.splash-dots span:nth-child(2){animation-delay:.2s}
.splash-dots span:nth-child(3){animation-delay:.4s}
.dev-badge{position:absolute;bottom:36px;left:50%;transform:translateX(-50%);
  display:flex;flex-direction:column;align-items:center;gap:8px;
  animation:fadeIn 1s 1.4s ease both;opacity:0;white-space:nowrap;}
.dev-label{font-size:.58rem;font-weight:700;letter-spacing:2.5px;color:var(--muted);
  text-transform:uppercase;font-family:var(--font-m);}
.dev-card{display:flex;align-items:center;gap:10px;
  background:rgba(255,255,255,.04);border:1px solid rgba(0,232,255,.2);
  border-radius:50px;padding:6px 18px 6px 6px;box-shadow:0 4px 24px rgba(0,232,255,.1);}
.dev-card img{width:34px;height:34px;border-radius:50%;object-fit:cover;border:2px solid var(--accent);}
.dev-card span{font-weight:700;font-size:.85rem;}

/* LOGIN */
.lp{min-height:100vh;display:flex;align-items:center;justify-content:center;
  padding:24px;position:relative;z-index:1;}
.lb{width:100%;max-width:400px;background:rgba(13,19,24,.85);backdrop-filter:blur(24px);
  border:1px solid var(--border2);border-radius:24px;padding:44px 38px;
  box-shadow:0 40px 80px rgba(0,0,0,.7);position:relative;overflow:hidden;}
.lb::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,var(--accent),transparent);opacity:.5;}
.ll{font-size:2.4rem;font-weight:800;letter-spacing:-1.5px;margin-bottom:4px;}
.ll span{color:var(--accent);}
.ls{color:var(--muted);font-family:var(--font-m);font-size:.7rem;margin-bottom:32px;}
.llab{display:block;font-size:.64rem;font-weight:700;color:var(--muted);
  letter-spacing:1.5px;text-transform:uppercase;margin-bottom:7px;}
.linp{width:100%;background:var(--surface2);border:1px solid var(--border);
  border-radius:var(--r-sm);padding:13px 15px;color:var(--text);
  font-family:var(--font-m);font-size:.88rem;outline:none;
  transition:border-color .2s;margin-bottom:5px;}
.linp:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(0,232,255,.08);}
.linp.err{border-color:var(--red);}
.err-msg{font-size:.68rem;color:var(--red);font-family:var(--font-m);margin-bottom:10px;}
.lbtn{width:100%;padding:14px;background:linear-gradient(135deg,var(--accent),var(--accent2));
  color:#000;font-family:var(--font-h);font-weight:800;font-size:.92rem;
  border:none;border-radius:var(--r-sm);cursor:pointer;
  transition:transform .15s,box-shadow .15s;margin-top:8px;}
.lbtn:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(0,232,255,.35);}
.ltog{text-align:center;margin-top:18px;font-size:.8rem;color:var(--muted);}
.ltog span{color:var(--accent);cursor:pointer;font-weight:700;}

/* APP SHELL */
.app{display:flex;min-height:100vh;position:relative;z-index:1;}
.main{flex:1;padding:32px 40px;overflow-y:auto;min-height:100vh;}

/* SIDEBAR */
.sb{width:240px;min-height:100vh;background:rgba(9,14,18,.97);backdrop-filter:blur(24px);
  border-right:1px solid var(--border);padding:24px 16px;
  display:flex;flex-direction:column;flex-shrink:0;position:sticky;top:0;height:100vh;overflow-y:auto;}
.sb-logo{font-size:1.3rem;font-weight:800;margin-bottom:28px;padding:0 8px;letter-spacing:-1px;}
.sb-logo span{color:var(--accent);}
.sb-sec{font-size:.58rem;font-weight:700;color:var(--muted2);letter-spacing:2px;
  text-transform:uppercase;padding:0 10px;margin:14px 0 8px;}
.sb-item{display:flex;align-items:center;gap:9px;padding:9px 12px;border-radius:var(--r-sm);
  cursor:pointer;font-size:.82rem;font-weight:600;color:var(--muted);
  transition:all .18s;margin-bottom:2px;border:1px solid transparent;}
.sb-item:hover{background:var(--surface2);color:var(--text);}
.sb-item.act{background:rgba(0,232,255,.08);color:var(--accent);border-color:rgba(0,232,255,.15);}
.sb-item .badge{margin-left:auto;font-size:.6rem;background:rgba(0,232,255,.15);
  color:var(--accent);padding:2px 7px;border-radius:20px;font-family:var(--font-m);}
.sb-bot{margin-top:auto;border-top:1px solid var(--border);padding-top:16px;}
.uc{display:flex;align-items:center;gap:9px;padding:10px 12px;
  border-radius:var(--r-sm);background:var(--surface2);border:1px solid var(--border);}
.uav{width:32px;height:32px;border-radius:50%;
  background:linear-gradient(135deg,var(--accent),var(--accent2));
  display:flex;align-items:center;justify-content:center;
  font-weight:800;font-size:.76rem;color:#000;flex-shrink:0;}
.un{font-size:.78rem;font-weight:700;}
.ur{font-size:.64rem;color:var(--muted);font-family:var(--font-m);}
.lo{background:none;border:none;color:var(--muted);font-size:.72rem;cursor:pointer;
  margin-top:8px;padding:6px 12px;font-family:var(--font-h);font-weight:600;
  border-radius:7px;width:100%;text-align:left;transition:all .2s;}
.lo:hover{color:var(--text);background:var(--surface2);}

/* PAGE HEADER */
.ph{margin-bottom:28px;}
.ph-title{font-size:1.9rem;font-weight:800;letter-spacing:-1px;margin-bottom:4px;}
.ph-sub{color:var(--muted);font-family:var(--font-m);font-size:.74rem;}

/* TEAMS GRID */
.tg{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;}
.tc{border-radius:18px;padding:24px;cursor:pointer;border:1px solid var(--border);
  background:var(--surface);transition:all .25s cubic-bezier(.16,1,.3,1);
  position:relative;overflow:hidden;}
.tc::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent,var(--cc),transparent);opacity:.9;}
.tc:hover{transform:translateY(-5px);border-color:var(--cc);
  box-shadow:0 20px 48px rgba(0,0,0,.5),0 0 0 1px var(--cc) inset;}
.tc-custom{border-style:dashed;}
.tc-badge{position:absolute;top:14px;right:14px;font-size:.6rem;font-weight:700;
  padding:3px 8px;border-radius:20px;background:rgba(255,255,255,.06);
  color:var(--muted);font-family:var(--font-m);}
.te{font-size:2rem;margin-bottom:12px;display:block;}
.tn{font-size:1rem;font-weight:800;margin-bottom:4px;}
.ttag{font-size:.72rem;color:var(--muted);margin-bottom:14px;font-family:var(--font-m);}
.bps{display:flex;gap:5px;flex-wrap:wrap;}
.bp{font-size:.64rem;font-family:var(--font-m);padding:3px 9px;border-radius:20px;
  border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.03);color:var(--muted);}
.tcta{display:inline-flex;align-items:center;gap:4px;margin-top:14px;
  font-size:.72rem;font-weight:700;color:var(--cc);}
.tc-del{position:absolute;bottom:12px;right:12px;background:none;border:none;
  color:var(--muted);cursor:pointer;font-size:.7rem;padding:4px 8px;
  border-radius:6px;transition:all .2s;font-family:var(--font-h);}
.tc-del:hover{color:var(--red);background:rgba(255,78,78,.1);}

/* BACK BUTTON */
.back{display:inline-flex;align-items:center;gap:6px;background:var(--surface);
  border:1px solid var(--border);color:var(--muted);cursor:pointer;
  font-family:var(--font-h);font-size:.78rem;font-weight:700;
  margin-bottom:20px;padding:8px 14px;border-radius:50px;transition:all .2s;}
.back:hover{color:var(--text);border-color:var(--border2);}

/* TEAM HEADER */
.th{display:flex;align-items:center;gap:14px;margin-bottom:24px;padding:20px 24px;
  border-radius:18px;background:var(--surface);border:1px solid var(--border);
  position:relative;overflow:hidden;}
.th::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,var(--tc),transparent);opacity:.7;}
.the{font-size:2.4rem;}
.thn{font-size:1.35rem;font-weight:800;letter-spacing:-.5px;}
.tht{font-size:.72rem;color:var(--muted);font-family:var(--font-m);margin-top:2px;}

/* IDEA BOX */
.idea-box{background:var(--surface);border:1px solid var(--border);
  border-radius:18px;padding:24px;margin-bottom:20px;}
.idea-box h3{font-size:.95rem;font-weight:800;margin-bottom:5px;}
.idea-box p{font-size:.72rem;color:var(--muted);font-family:var(--font-m);margin-bottom:14px;}
.chips{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:14px;}
.chip{font-size:.68rem;font-family:var(--font-m);padding:5px 11px;
  border-radius:20px;border:1px solid var(--border2);color:var(--muted);
  cursor:pointer;transition:all .2s;background:var(--surface2);}
.chip:hover{color:var(--accent);border-color:rgba(0,232,255,.4);}
.idea-inp{width:100%;background:var(--surface2);border:1px solid var(--border);
  border-radius:var(--r-sm);padding:13px 15px;color:var(--text);
  font-family:var(--font-m);font-size:.85rem;outline:none;resize:none;
  transition:border-color .2s;line-height:1.65;}
.idea-inp:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(0,232,255,.07);}
.build-btn{margin-top:12px;padding:13px 26px;
  background:linear-gradient(135deg,var(--accent),var(--accent2));
  color:#000;font-family:var(--font-h);font-weight:800;font-size:.88rem;
  border:none;border-radius:var(--r-sm);cursor:pointer;
  transition:all .2s;display:inline-flex;align-items:center;gap:7px;}
.build-btn:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(0,232,255,.35);}
.build-btn:disabled{opacity:.35;cursor:not-allowed;transform:none;box-shadow:none;}

/* PROGRESS */
.prog-wrap{background:var(--surface);border:1px solid var(--border);
  border-radius:18px;padding:24px;margin-bottom:20px;}
.prog-wrap h3{font-size:.95rem;font-weight:800;margin-bottom:18px;
  display:flex;align-items:center;gap:8px;}
.prog-wrap h3 .spin{display:inline-block;animation:spin 1s linear infinite;}
.bot-step{display:flex;align-items:center;gap:12px;padding:12px 0;
  border-bottom:1px solid var(--border);transition:background .3s;}
.bot-step:last-child{border-bottom:none;}
.bot-step.working{background:rgba(0,232,255,.04);border-radius:10px;
  padding:12px;margin:0 -12px;animation:workingPulse 2s ease infinite;}
.bot-step-emoji{font-size:1.4rem;width:36px;text-align:center;flex-shrink:0;}
.bot-step-info{flex:1;min-width:0;}
.bot-step-name{font-size:.82rem;font-weight:700;}
.bot-step-label{font-size:.68rem;font-family:var(--font-m);color:var(--muted);margin-top:1px;}
.status-pill{font-size:.68rem;font-weight:700;padding:4px 11px;
  border-radius:20px;white-space:nowrap;flex-shrink:0;}
.s-wait{color:var(--muted);background:rgba(255,255,255,.04);border:1px solid var(--border);}
.s-work{color:var(--accent);background:rgba(0,232,255,.08);
  border:1px solid rgba(0,232,255,.25);animation:pulse 1.2s ease infinite;}
.s-done{color:var(--green);background:rgba(78,255,160,.08);
  border:1px solid rgba(78,255,160,.25);}
.prog-bar-wrap{margin-top:18px;background:var(--surface2);border-radius:4px;height:3px;overflow:hidden;}
.prog-bar{height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2));
  border-radius:4px;transition:width .6s cubic-bezier(.16,1,.3,1);}
.prog-pct{font-size:.68rem;font-family:var(--font-m);color:var(--muted);
  text-align:right;margin-top:6px;}

/* RESULT CARDS */
.res-section h3{font-size:.62rem;font-weight:700;color:var(--muted);letter-spacing:2px;
  text-transform:uppercase;margin-bottom:12px;display:flex;align-items:center;gap:8px;}
.res-section h3::after{content:'';flex:1;height:1px;background:var(--border);}
.res-card{background:var(--surface);border:1px solid var(--border);
  border-radius:14px;margin-bottom:10px;overflow:hidden;
  transition:border-color .2s;}
.res-card:hover{border-color:var(--border2);}
.res-card-hdr{padding:13px 16px;display:flex;align-items:center;
  justify-content:space-between;cursor:pointer;
  transition:background .2s;user-select:none;}
.res-card-hdr:hover{background:rgba(255,255,255,.03);}
.res-card-title{display:flex;align-items:center;gap:9px;font-size:.84rem;font-weight:800;}
.res-card-role{font-weight:400;color:var(--muted);font-size:.7rem;font-family:var(--font-m);}
.res-card-actions{display:flex;gap:6px;align-items:center;}
.copy-btn{padding:4px 10px;background:transparent;border:1px solid var(--border);
  color:var(--muted);font-size:.65rem;font-family:var(--font-h);font-weight:700;
  border-radius:6px;cursor:pointer;transition:all .2s;}
.copy-btn:hover{color:var(--accent);border-color:rgba(0,232,255,.4);}
.copy-btn.copied{color:var(--green);border-color:rgba(78,255,160,.4);}
.chev{color:var(--muted);font-size:.75rem;transition:transform .2s;}
.chev.open{transform:rotate(180deg);}
.res-card-body{padding:16px;border-top:1px solid var(--border);
  font-family:var(--font-m);font-size:.78rem;line-height:1.8;
  color:#b8c8d8;white-space:pre-wrap;word-break:break-word;
  max-height:420px;overflow-y:auto;background:rgba(0,0,0,.15);}

/* ACTION BUTTONS */
.action-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px;margin-bottom:20px;}
.act-btn{padding:10px 20px;border-radius:var(--r-sm);font-family:var(--font-h);
  font-weight:800;font-size:.78rem;cursor:pointer;transition:all .2s;
  display:inline-flex;align-items:center;gap:6px;border:none;}
.act-btn-primary{background:linear-gradient(135deg,var(--green),#00c875);color:#000;}
.act-btn-primary:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(78,255,160,.3);}
.act-btn-sec{background:transparent;border:1px solid var(--border);color:var(--muted);}
.act-btn-sec:hover{color:var(--text);border-color:var(--border2);}
.act-btn-danger{background:transparent;border:1px solid rgba(255,78,78,.3);color:var(--red);}
.act-btn-danger:hover{background:rgba(255,78,78,.1);}

/* FIX WITH BOT */
.fix-sec h3{font-size:.62rem;font-weight:700;color:var(--muted);letter-spacing:2px;
  text-transform:uppercase;margin-bottom:12px;display:flex;align-items:center;gap:8px;}
.fix-sec h3::after{content:'';flex:1;height:1px;background:var(--border);}
.bot-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;margin-bottom:20px;}
.bot-card{background:var(--surface);border:1px solid var(--border);
  border-radius:12px;padding:14px;cursor:pointer;transition:all .2s;
  position:relative;overflow:hidden;}
.bot-card::after{content:'';position:absolute;bottom:0;left:0;right:0;
  height:2px;background:var(--bc);opacity:0;transition:opacity .2s;}
.bot-card:hover,.bot-card.sel{border-color:var(--bc);background:var(--surface2);
  transform:translateY(-2px);}
.bot-card.sel::after{opacity:1;}
.bc-emoji{font-size:1.4rem;margin-bottom:6px;}
.bc-name{font-size:.78rem;font-weight:800;margin-bottom:1px;}
.bc-role{font-size:.62rem;font-family:var(--font-m);color:var(--bc);}

/* CHAT */
.chat-panel{background:var(--surface);border:1px solid var(--border);
  border-radius:18px;overflow:hidden;margin-bottom:20px;animation:slideUp .3s cubic-bezier(.16,1,.3,1);}
.chat-hdr{padding:13px 18px;border-bottom:1px solid var(--border);
  display:flex;align-items:center;gap:9px;background:rgba(255,255,255,.02);}
.chat-hdr-emoji{font-size:1.3rem;}
.chat-hdr-name{font-size:.86rem;font-weight:800;}
.chat-hdr-role{font-size:.64rem;font-family:var(--font-m);margin-top:1px;}
.chat-msgs{height:340px;overflow-y:auto;padding:14px;
  display:flex;flex-direction:column;gap:10px;}
.msg{display:flex;gap:7px;animation:slideUp .25s cubic-bezier(.16,1,.3,1);}
.msg.u{flex-direction:row-reverse;}
.mav{width:26px;height:26px;border-radius:50%;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:800;}
.mb{max-width:83%;padding:9px 13px;border-radius:11px;font-size:.8rem;
  line-height:1.7;font-family:var(--font-m);white-space:pre-wrap;word-break:break-word;}
.msg.b .mb{background:var(--surface2);color:var(--text);
  border-radius:3px 11px 11px 11px;border:1px solid var(--border);}
.msg.u .mb{background:linear-gradient(135deg,var(--accent),var(--accent2));
  color:#000;font-weight:500;border-radius:11px 3px 11px 11px;}
.typing{display:flex;align-items:center;gap:4px;padding:3px 0;}
.typing s{display:block;width:5px;height:5px;border-radius:50%;
  background:var(--muted);animation:pulse 1.2s ease infinite;}
.typing s:nth-child(2){animation-delay:.2s}.typing s:nth-child(3){animation-delay:.4s}
.chat-inp-row{padding:11px 14px;border-top:1px solid var(--border);
  display:flex;gap:7px;align-items:flex-end;background:rgba(255,255,255,.01);}
.chat-inp{flex:1;background:var(--surface2);border:1px solid var(--border);
  border-radius:var(--r-sm);padding:10px 12px;color:var(--text);
  font-family:var(--font-m);font-size:.8rem;outline:none;resize:none;
  transition:border-color .2s;line-height:1.55;}
.chat-inp:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(0,232,255,.07);}
.send-btn{padding:10px 16px;background:linear-gradient(135deg,var(--accent),var(--accent2));
  color:#000;font-weight:800;font-size:.76rem;border:none;border-radius:var(--r-sm);
  cursor:pointer;font-family:var(--font-h);flex-shrink:0;transition:all .2s;}
.send-btn:hover{transform:translateY(-1px);}
.send-btn:disabled{opacity:.3;cursor:not-allowed;transform:none;}

/* DASHBOARD */
.proj-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px;}
.proj-card{background:var(--surface);border:1px solid var(--border);
  border-radius:14px;padding:18px;cursor:pointer;transition:all .2s;position:relative;}
.proj-card:hover{border-color:var(--border2);transform:translateY(-3px);}
.proj-card-emoji{font-size:1.6rem;margin-bottom:10px;}
.proj-card-title{font-size:.9rem;font-weight:800;margin-bottom:4px;}
.proj-card-team{font-size:.68rem;font-family:var(--font-m);color:var(--muted);margin-bottom:8px;}
.proj-card-idea{font-size:.72rem;color:var(--muted);font-family:var(--font-m);
  line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;
  -webkit-box-orient:vertical;overflow:hidden;}
.proj-card-date{font-size:.62rem;color:var(--muted2);font-family:var(--font-m);margin-top:10px;}
.proj-del{position:absolute;top:10px;right:10px;background:none;border:none;
  color:var(--muted);cursor:pointer;font-size:.8rem;padding:4px 7px;
  border-radius:6px;transition:all .2s;}
.proj-del:hover{color:var(--red);background:rgba(255,78,78,.1);}
.empty-state{text-align:center;padding:60px 20px;color:var(--muted);font-family:var(--font-m);font-size:.8rem;}
.empty-state .es-emoji{font-size:3rem;margin-bottom:16px;}

/* CUSTOM TEAM BUILDER */
.builder-box{background:var(--surface);border:1px solid var(--border);
  border-radius:18px;padding:24px;margin-bottom:20px;}
.builder-box h3{font-size:.95rem;font-weight:800;margin-bottom:6px;}
.builder-box p{font-size:.72rem;color:var(--muted);font-family:var(--font-m);margin-bottom:20px;}
.field-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;}
.field{display:flex;flex-direction:column;gap:6px;}
.field label{font-size:.64rem;font-weight:700;color:var(--muted);letter-spacing:1.5px;text-transform:uppercase;}
.finp{width:100%;background:var(--surface2);border:1px solid var(--border);
  border-radius:var(--r-sm);padding:11px 13px;color:var(--text);
  font-family:var(--font-m);font-size:.82rem;outline:none;transition:border-color .2s;}
.finp:focus{border-color:var(--accent);}
.finp-full{grid-column:1/-1;}
.bot-builder{border:1px solid var(--border);border-radius:12px;
  padding:16px;margin-bottom:10px;background:var(--surface2);position:relative;}
.bot-builder-hdr{display:flex;align-items:center;justify-content:space-between;
  margin-bottom:12px;}
.bot-builder-hdr span{font-size:.78rem;font-weight:800;
  color:var(--accent);font-family:var(--font-m);}
.bot-del-btn{background:none;border:none;color:var(--muted);
  cursor:pointer;font-size:.8rem;transition:color .2s;}
.bot-del-btn:hover{color:var(--red);}
.add-bot-btn{display:flex;align-items:center;gap:6px;background:transparent;
  border:1px dashed var(--border2);color:var(--muted);font-family:var(--font-h);
  font-size:.78rem;font-weight:700;padding:10px 16px;border-radius:var(--r-sm);
  cursor:pointer;transition:all .2s;width:100%;justify-content:center;margin-bottom:16px;}
.add-bot-btn:hover{color:var(--accent);border-color:rgba(0,232,255,.4);}

/* MOBILE */
@media(max-width:860px){
  .main{padding:18px 14px 90px;}
  .sb{display:none;}
  .tg{grid-template-columns:1fr;gap:12px;}
  .ph-title{font-size:1.5rem;}
  .bot-cards{grid-template-columns:repeat(2,1fr);}
  .field-row{grid-template-columns:1fr;}
  .mob-nav{position:fixed;bottom:0;left:0;right:0;z-index:100;
    background:rgba(9,14,18,.97);backdrop-filter:blur(24px);
    border-top:1px solid var(--border);display:flex;padding:10px 0 18px;}
  .mob-nav-item{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;
    font-size:.58rem;font-weight:700;color:var(--muted);cursor:pointer;
    transition:color .2s;text-transform:uppercase;}
  .mob-nav-item .ni{font-size:1.2rem;}
  .mob-nav-item.act{color:var(--accent);}
}
@media(min-width:861px){.mob-nav{display:none;}}
`;

// ─────────────────────────────────────────────
// SPLASH
// ─────────────────────────────────────────────
function Splash({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="splash fi">
      <style>{css}</style>
      <div className="grid-bg" /><div className="orb orb1" /><div className="orb orb2" />
      <div className="splash-logo fu">Team<span>AI</span></div>
      <div className="splash-sub fu2">Multi-agent AI collaboration platform</div>
      <div className="splash-dots fu3"><span /><span /><span /></div>
      <div className="dev-badge">
        <div className="dev-label">Developed by</div>
        <div className="dev-card">
          <img src="/avinash.jpg" alt="Avinash" />
          <span>Avinash</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────
function Login({ onLogin }) {
  const [reg, setReg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [eErr, setEErr] = useState("");
  const [pErr, setPErr] = useState("");

  const go = (e) => {
    e.preventDefault();
    const ee = !email ? "Email is required" : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "Enter a valid email address" : "";
    const pe = pass.length < 6 ? "Password must be at least 6 characters" : "";
    setEErr(ee); setPErr(pe);
    if (!ee && !pe) onLogin({ name: name || email.split("@")[0], email });
  };

  return (
    <div className="lp">
      <div className="grid-bg" /><div className="orb orb1" /><div className="orb orb2" />
      <div className="lb fu si">
        <div className="ll fu">Team<span>AI</span></div>
        <div className="ls fu2">// multi-agent AI collaboration platform</div>
        {reg && <><label className="llab">Your Name</label>
          <input className="linp" placeholder="Jane Doe" value={name} onChange={e => setName(e.target.value)} /></>}
        <label className="llab">Email</label>
        <input className={`linp${eErr ? " err" : ""}`} type="email" placeholder="you@gmail.com"
          value={email} onChange={e => { setEmail(e.target.value); setEErr(""); }} />
        {eErr && <div className="err-msg">⚠ {eErr}</div>}
        <label className="llab">Password</label>
        <input className={`linp${pErr ? " err" : ""}`} type="password" placeholder="min. 6 characters"
          value={pass} onChange={e => { setPass(e.target.value); setPErr(""); }}
          onKeyDown={e => e.key === "Enter" && go(e)} />
        {pErr && <div className="err-msg">⚠ {pErr}</div>}
        <button className="lbtn" onClick={go}>{reg ? "Create Account →" : "Sign In →"}</button>
        <div className="ltog">{reg ? "Have an account? " : "New here? "}
          <span onClick={() => { setReg(!reg); setEErr(""); setPErr(""); }}>{reg ? "Sign in" : "Register"}</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────
function Sidebar({ user, page, setPage, team, projects, onLogout }) {
  return (
    <div className="sb">
      <div className="sb-logo">Team<span>AI</span></div>
      <div className="sb-sec">Navigate</div>
      {[
        { id: "teams", icon: "🏠", label: "Browse Teams" },
        { id: "dashboard", icon: "📁", label: "My Projects", badge: projects.length || null },
        { id: "builder", icon: "🛠️", label: "Build a Team" },
      ].map(item => (
        <div key={item.id} className={`sb-item${page === item.id ? " act" : ""}`} onClick={() => setPage(item.id)}>
          <span>{item.icon}</span> {item.label}
          {item.badge ? <span className="badge">{item.badge}</span> : null}
        </div>
      ))}
      {team && <><div className="sb-sec">Active</div>
        <div className={`sb-item${page === "team" ? " act" : ""}`} onClick={() => setPage("team")}>
          <span>{team.emoji}</span> {team.name}
        </div></>}
      <div className="sb-bot">
        <div className="uc">
          <div className="uav">{user.name[0].toUpperCase()}</div>
          <div><div className="un">{user.name}</div><div className="ur">// member</div></div>
        </div>
        <button className="lo" onClick={onLogout}>← Sign out</button>
      </div>
    </div>
  );
}

function MobileNav({ page, setPage, team }) {
  return (
    <div className="mob-nav">
      {[
        { id: "teams", icon: "🏠", label: "Teams" },
        { id: "dashboard", icon: "📁", label: "Projects" },
        { id: "builder", icon: "🛠️", label: "Builder" },
        ...(team ? [{ id: "team", icon: team.emoji, label: "Active" }] : []),
      ].map(i => (
        <div key={i.id} className={`mob-nav-item${page === i.id ? " act" : ""}`} onClick={() => setPage(i.id)}>
          <span className="ni">{i.icon}</span><span>{i.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// BOT CHAT (solo)
// ─────────────────────────────────────────────
function BotChat({ bot, idea, prevResult }) {
  const [msgs, setMsgs] = useState([
    { role: "b", text: `Hi! I'm ${bot.name}, your ${bot.role}. I already worked on your project. What would you like to fix or improve?` }
  ]);
  const [inp, setInp] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = async () => {
    if (!inp.trim() || loading) return;
    const q = inp.trim(); setInp(""); setLoading(true);
    setMsgs(m => [...m, { role: "u", text: q }]);
    const history = msgs.map(m => ({ role: m.role === "u" ? "user" : "assistant", content: m.text }));
    const reply = await callClaude(
      `${bot.solo}\n\nProject context: "${idea}"\nYour previous output summary: ${(prevResult || "").substring(0, 400)}`,
      [...history, { role: "user", content: q }]
    );
    setMsgs(m => [...m, { role: "b", text: reply }]);
    setLoading(false);
  };

  return (
    <div className="chat-panel">
      <div className="chat-hdr">
        <div className="chat-hdr-emoji">{bot.emoji}</div>
        <div>
          <div className="chat-hdr-name">{bot.name}</div>
          <div className="chat-hdr-role" style={{ color: bot.color }}>{bot.role}</div>
        </div>
      </div>
      <div className="chat-msgs">
        {msgs.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            <div className="mav" style={{ background: m.role === "u" ? "rgba(0,232,255,.14)" : `${bot.color}20`, color: m.role === "u" ? "var(--accent)" : bot.color }}>
              {m.role === "u" ? "U" : bot.name[0]}
            </div>
            <div className="mb">{m.text}</div>
          </div>
        ))}
        {loading && (
          <div className="msg b">
            <div className="mav" style={{ background: `${bot.color}20`, color: bot.color }}>{bot.name[0]}</div>
            <div className="mb"><div className="typing"><s /><s /><s /></div></div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className="chat-inp-row">
        <textarea className="chat-inp" rows={2} placeholder={`Ask ${bot.name} to improve something...`}
          value={inp} onChange={e => setInp(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} />
        <button className="send-btn" onClick={send} disabled={loading || !inp.trim()}>Send</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// RESULT CARD
// ─────────────────────────────────────────────
function ResultCard({ bot, content }) {
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(content);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="res-card sui">
      <div className="res-card-hdr" onClick={() => setOpen(o => !o)}>
        <div className="res-card-title">
          <span>{bot.emoji}</span>
          <span>{bot.name}</span>
          <span className="res-card-role">— {bot.role}</span>
        </div>
        <div className="res-card-actions">
          <button className={`copy-btn${copied ? " copied" : ""}`} onClick={e => { e.stopPropagation(); copy(); }}>
            {copied ? "✓ Copied" : "Copy"}
          </button>
          <span className={`chev${open ? " open" : ""}`}>▼</span>
        </div>
      </div>
      {open && <div className="res-card-body">{content}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────
// TEAM VIEW (main workflow)
// ─────────────────────────────────────────────
function TeamView({ team, onBack, onSaveProject }) {
  const [idea, setIdea] = useState("");
  const [phase, setPhase] = useState("idle");
  const [statuses, setStatuses] = useState({});
  const [results, setResults] = useState({});
  const [activeBot, setActiveBot] = useState(null);

  const total = team.bots.length;
  const doneCount = Object.values(statuses).filter(s => s === "done").length;
  const progress = total ? Math.round((doneCount / total) * 100) : 0;

  const setStatus = (id, s) => setStatuses(p => ({ ...p, [id]: s }));

  const build = async () => {
    if (!idea.trim()) return;
    setPhase("building"); setResults({}); setActiveBot(null);
    const init = {}; team.bots.forEach(b => { init[b.id] = "waiting"; }); setStatuses(init);
    let context = `Project: "${idea}"\n\nTeam contributions so far:\n`;
    const allResults = {};
    for (const bot of team.bots) {
      setStatus(bot.id, "working");
      const result = await callClaude(
        `${bot.collaborate}\n\nContext from team:\n${context}\n\nDeliver your complete, detailed contribution now.`,
        [{ role: "user", content: idea }]
      );
      allResults[bot.id] = result;
      setResults(p => ({ ...p, [bot.id]: result }));
      context += `\n${bot.name} (${bot.role}):\n${result.substring(0, 600)}\n---\n`;
      setStatus(bot.id, "done");
    }
    const project = {
      id: Date.now().toString(),
      teamId: team.id, teamName: team.name, teamEmoji: team.emoji,
      title: idea.substring(0, 60), idea, results: allResults,
      createdAt: new Date().toISOString(),
    };
    onSaveProject(project);
    setPhase("done");
  };

  const reset = () => { setPhase("idle"); setIdea(""); setStatuses({}); setResults({}); setActiveBot(null); };

  return (
    <div>
      <button className="back fu" onClick={onBack}>← Back</button>
      <div className="th fu" style={{ "--tc": team.color }}>
        <div className="the">{team.emoji}</div>
        <div>
          <div className="thn">{team.name}</div>
          <div className="tht" style={{ color: team.color }}>{team.tagline}</div>
        </div>
      </div>

      {phase === "idle" && (
        <div className="idea-box fu2">
          <h3>💡 What do you want to build?</h3>
          <p>Describe your idea. The entire team works on it together and delivers complete results.</p>
          <div className="chips">
            {team.examples?.map((ex, i) => (
              <span key={i} className="chip" onClick={() => setIdea(ex)}>{ex}</span>
            ))}
          </div>
          <textarea className="idea-inp" rows={5}
            placeholder="Describe your idea in as much detail as you like..."
            value={idea} onChange={e => setIdea(e.target.value)} />
          <button className="build-btn" onClick={build} disabled={!idea.trim()}>
            🚀 Let the team work on it
          </button>
        </div>
      )}

      {(phase === "building" || phase === "done") && (
        <div className="prog-wrap fu">
          <h3>
            {phase === "done" ? "✅ Team has finished!" : <><span className="spin">⚙️</span> Team is working in real-time...</>}
          </h3>
          {team.bots.map(bot => (
            <div key={bot.id} className={`bot-step${statuses[bot.id] === "working" ? " working" : ""}`}>
              <div className="bot-step-emoji">{bot.emoji}</div>
              <div className="bot-step-info">
                <div className="bot-step-name">{bot.name}
                  <span style={{ color: bot.color, fontSize: ".66rem", fontWeight: 400, marginLeft: 6 }}>— {bot.role}</span>
                </div>
                <div className="bot-step-label">
                  {statuses[bot.id] === "working" ? "Working on their contribution..." :
                   statuses[bot.id] === "done" ? "Contribution complete" : "Waiting for team..."}
                </div>
              </div>
              <span className={`status-pill ${statuses[bot.id] === "done" ? "s-done" : statuses[bot.id] === "working" ? "s-work" : "s-wait"}`}>
                {statuses[bot.id] === "done" ? "✓ Done" : statuses[bot.id] === "working" ? "Working..." : "Waiting"}
              </span>
            </div>
          ))}
          <div className="prog-bar-wrap"><div className="prog-bar" style={{ width: `${progress}%` }} /></div>
          <div className="prog-pct">{progress}% complete</div>
        </div>
      )}

      {phase === "done" && Object.keys(results).length > 0 && (
        <>
          <div className="action-row fu">
            <button className="act-btn act-btn-primary" onClick={() => downloadAsZip(idea.substring(0, 40), results, team.bots)}>
              ⬇ Download All Results
            </button>
            <button className="act-btn act-btn-sec" onClick={reset}>🔄 New Project</button>
          </div>

          <div className="res-section fu">
            <h3>📋 Team Results</h3>
            {team.bots.map(bot => results[bot.id] && (
              <ResultCard key={bot.id} bot={bot} content={results[bot.id]} />
            ))}
          </div>

          <div className="fix-sec fu">
            <h3>🔧 Fix or Improve Something</h3>
            <div className="bot-cards">
              {team.bots.map(bot => (
                <div key={bot.id} className={`bot-card${activeBot?.id === bot.id ? " sel" : ""}`}
                  style={{ "--bc": bot.color }} onClick={() => setActiveBot(activeBot?.id === bot.id ? null : bot)}>
                  <div className="bc-emoji">{bot.emoji}</div>
                  <div className="bc-name">{bot.name}</div>
                  <div className="bc-role">{bot.role}</div>
                </div>
              ))}
            </div>
            {activeBot && <BotChat key={activeBot.id} bot={activeBot} idea={idea} prevResult={results[activeBot.id]} />}
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// TEAMS PAGE
// ─────────────────────────────────────────────
function TeamsPage({ onSelect, customTeams, onDeleteCustom }) {
  const allTeams = [...DEFAULT_TEAMS, ...customTeams];
  return (
    <div>
      <div className="ph fu">
        <div className="ph-title">Your AI-Powered Teams</div>
        <div className="ph-sub">// pick a team · drop your idea · get complete results from every expert</div>
      </div>
      <div className="tg">
        {allTeams.map((t, i) => (
          <div key={t.id} className={`tc fu${t.isDefault ? "" : " tc-custom"}`}
            style={{ "--cc": t.color, animationDelay: `${i * 0.06}s` }}>
            <span className="tc-badge">{t.isDefault ? "Default" : "Custom"}</span>
            <span className="te">{t.emoji}</span>
            <div className="tn">{t.name}</div>
            <div className="ttag">{t.tagline}</div>
            <div className="bps">{t.bots.map(b => <span key={b.id} className="bp">{b.emoji} {b.name}</span>)}</div>
            <div className="tcta" onClick={() => onSelect(t)}>Work with this team →</div>
            {!t.isDefault && (
              <button className="tc-del" onClick={e => { e.stopPropagation(); onDeleteCustom(t.id); }}>🗑</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// DASHBOARD (saved projects)
// ─────────────────────────────────────────────
function Dashboard({ projects, onOpen, onDelete }) {
  return (
    <div>
      <div className="ph fu">
        <div className="ph-title">My Projects</div>
        <div className="ph-sub">// {projects.length} saved project{projects.length !== 1 ? "s" : ""} — click to continue working</div>
      </div>
      {projects.length === 0 ? (
        <div className="empty-state fu2">
          <div className="es-emoji">📁</div>
          <div>No projects yet</div>
          <div style={{ marginTop: 8, color: "var(--muted2)" }}>Pick a team and build something!</div>
        </div>
      ) : (
        <div className="proj-grid fu2">
          {projects.map(p => (
            <div key={p.id} className="proj-card" onClick={() => onOpen(p)}>
              <button className="proj-del" onClick={e => { e.stopPropagation(); onDelete(p.id); }}>🗑</button>
              <div className="proj-card-emoji">{p.teamEmoji}</div>
              <div className="proj-card-title">{p.title}</div>
              <div className="proj-card-team">{p.teamName}</div>
              <div className="proj-card-idea">{p.idea}</div>
              <div className="proj-card-date">{new Date(p.createdAt).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// PROJECT VIEWER (open saved project)
// ─────────────────────────────────────────────
function ProjectViewer({ project, teams, onBack }) {
  const team = [...DEFAULT_TEAMS, ...teams].find(t => t.id === project.teamId) || {
    bots: Object.keys(project.results).map(id => ({ id, name: id, role: "", emoji: "🤖", color: "#00e8ff" }))
  };
  const [activeBot, setActiveBot] = useState(null);

  return (
    <div>
      <button className="back fu" onClick={onBack}>← Back to Projects</button>
      <div className="th fu" style={{ "--tc": "#00e8ff" }}>
        <div className="the">{project.teamEmoji}</div>
        <div>
          <div className="thn">{project.title}</div>
          <div className="tht">{project.teamName} · {new Date(project.createdAt).toLocaleDateString()}</div>
        </div>
      </div>

      <div className="action-row fu2">
        <button className="act-btn act-btn-primary"
          onClick={() => downloadAsZip(project.title, project.results, team.bots)}>
          ⬇ Download Results
        </button>
      </div>

      <div className="res-section fu2">
        <h3>📋 Saved Results</h3>
        {team.bots.map(bot => project.results[bot.id] && (
          <ResultCard key={bot.id} bot={bot} content={project.results[bot.id]} />
        ))}
      </div>

      <div className="fix-sec fu2">
        <h3>🔧 Continue Working with a Bot</h3>
        <div className="bot-cards">
          {team.bots.map(bot => project.results[bot.id] && (
            <div key={bot.id} className={`bot-card${activeBot?.id === bot.id ? " sel" : ""}`}
              style={{ "--bc": bot.color }} onClick={() => setActiveBot(activeBot?.id === bot.id ? null : bot)}>
              <div className="bc-emoji">{bot.emoji}</div>
              <div className="bc-name">{bot.name}</div>
              <div className="bc-role">{bot.role}</div>
            </div>
          ))}
        </div>
        {activeBot && <BotChat key={activeBot.id} bot={activeBot} idea={project.idea} prevResult={project.results[activeBot.id]} />}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CUSTOM TEAM BUILDER
// ─────────────────────────────────────────────
const BOT_COLORS = ["#00e8ff", "#ff6fff", "#ffe44d", "#4effa0", "#ff9442", "#a78bfa"];
const BOT_EMOJIS = ["⚡", "🎨", "📈", "⚖️", "💰", "🎯", "🔧", "📋", "✍️", "🔍", "👥", "🏛️"];

function TeamBuilder({ onSave }) {
  const [team, setTeam] = useState({ name: "", emoji: "🤖", tagline: "", color: "#00e8ff" });
  const [bots, setBots] = useState([{ id: "b1", name: "", role: "", emoji: "⚡", color: "#00e8ff", collaborate: "", solo: "" }]);
  const [saved, setSaved] = useState(false);

  const addBot = () => setBots(b => [...b, {
    id: `b${Date.now()}`, name: "", role: "",
    emoji: BOT_EMOJIS[b.length % BOT_EMOJIS.length],
    color: BOT_COLORS[b.length % BOT_COLORS.length],
    collaborate: "", solo: ""
  }]);

  const updateBot = (id, field, val) => setBots(b => b.map(bot => bot.id === id ? { ...bot, [field]: val } : bot));
  const deleteBot = (id) => setBots(b => b.filter(bot => bot.id !== id));

  const save = () => {
    if (!team.name.trim() || bots.some(b => !b.name || !b.role)) return;
    const newTeam = {
      ...team, id: `custom_${Date.now()}`, isDefault: false,
      examples: ["Tell me about your project goals", "Help me plan this idea", "What should I focus on first?"],
      bots: bots.map(b => ({
        ...b,
        collaborate: b.collaborate || `You are ${b.name}, ${b.role}. Based on the project and previous team contributions, provide your complete expert analysis and recommendations.`,
        solo: b.solo || `You are ${b.name}, ${b.role}. Help the user with any questions related to your area of expertise.`,
      }))
    };
    onSave(newTeam);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="ph fu">
        <div className="ph-title">Build a Custom Team</div>
        <div className="ph-sub">// create your own AI team with custom experts</div>
      </div>

      <div className="builder-box fu2">
        <h3>Team Details</h3>
        <p>Define your team's name, identity and purpose.</p>
        <div className="field-row">
          <div className="field">
            <label>Team Name</label>
            <input className="finp" placeholder="My Dream Team" value={team.name}
              onChange={e => setTeam(t => ({ ...t, name: e.target.value }))} />
          </div>
          <div className="field">
            <label>Team Emoji</label>
            <input className="finp" placeholder="🚀" value={team.emoji}
              onChange={e => setTeam(t => ({ ...t, emoji: e.target.value }))} />
          </div>
          <div className="field finp-full">
            <label>Tagline</label>
            <input className="finp" placeholder="What does this team do?" value={team.tagline}
              onChange={e => setTeam(t => ({ ...t, tagline: e.target.value }))} />
          </div>
          <div className="field">
            <label>Team Color</label>
            <input className="finp" type="color" value={team.color}
              onChange={e => setTeam(t => ({ ...t, color: e.target.value }))} />
          </div>
        </div>
      </div>

      <div className="builder-box fu3">
        <h3>Team Members</h3>
        <p>Add AI experts to your team. Each bot will contribute to the final result.</p>
        {bots.map((bot, i) => (
          <div key={bot.id} className="bot-builder">
            <div className="bot-builder-hdr">
              <span>Bot #{i + 1}</span>
              {bots.length > 1 && <button className="bot-del-btn" onClick={() => deleteBot(bot.id)}>✕ Remove</button>}
            </div>
            <div className="field-row">
              <div className="field">
                <label>Name</label>
                <input className="finp" placeholder="e.g. DataBot" value={bot.name}
                  onChange={e => updateBot(bot.id, "name", e.target.value)} />
              </div>
              <div className="field">
                <label>Role</label>
                <input className="finp" placeholder="e.g. Data Analyst" value={bot.role}
                  onChange={e => updateBot(bot.id, "role", e.target.value)} />
              </div>
              <div className="field">
                <label>Emoji</label>
                <input className="finp" placeholder="📊" value={bot.emoji}
                  onChange={e => updateBot(bot.id, "emoji", e.target.value)} />
              </div>
              <div className="field">
                <label>Color</label>
                <input className="finp" type="color" value={bot.color}
                  onChange={e => updateBot(bot.id, "color", e.target.value)} />
              </div>
              <div className="field finp-full">
                <label>Expertise / Prompt (optional)</label>
                <input className="finp" placeholder="What is this bot an expert in?"
                  value={bot.collaborate} onChange={e => updateBot(bot.id, "collaborate", e.target.value)} />
              </div>
            </div>
          </div>
        ))}
        <button className="add-bot-btn" onClick={addBot}>+ Add Another Bot</button>
        <button className="act-btn act-btn-primary" onClick={save}
          disabled={!team.name.trim() || bots.some(b => !b.name || !b.role)}>
          {saved ? "✓ Team Saved!" : "💾 Save Team"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────
export default function App() {
  const [splash, setSplash] = useState(true);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("teams");
  const [team, setTeam] = useState(null);
  const [projects, setProjects] = useState(() => Storage.getProjects());
  const [customTeams, setCustomTeams] = useState(() => Storage.getCustomTeams());
  const [openProject, setOpenProject] = useState(null);

  const saveProject = (p) => { Storage.saveProject(p); setProjects(Storage.getProjects()); };
  const deleteProject = (id) => { Storage.deleteProject(id); setProjects(Storage.getProjects()); };
  const saveCustomTeam = (t) => { Storage.saveCustomTeam(t); setCustomTeams(Storage.getCustomTeams()); };
  const deleteCustomTeam = (id) => { Storage.deleteCustomTeam(id); setCustomTeams(Storage.getCustomTeams()); };

  const openSavedProject = (p) => { setOpenProject(p); setPage("project"); };

  if (splash) return <Splash onDone={() => setSplash(false)} />;
  if (!user) return (<><style>{css}</style><Login onLogin={u => setUser(u)} /></>);

  return (
    <div className="app">
      <style>{css}</style>
      <div className="grid-bg" /><div className="orb orb1" /><div className="orb orb2" />
      <Sidebar user={user} page={page} setPage={setPage} team={team} projects={projects}
        onLogout={() => { setUser(null); setTeam(null); setPage("teams"); }} />
      <div className="main">
        {page === "teams" && (
          <TeamsPage customTeams={customTeams}
            onSelect={t => { setTeam(t); setPage("team"); }}
            onDeleteCustom={deleteCustomTeam} />
        )}
        {page === "team" && team && (
          <TeamView team={team} onBack={() => setPage("teams")} onSaveProject={saveProject} />
        )}
        {page === "dashboard" && (
          <Dashboard projects={projects} onOpen={openSavedProject} onDelete={deleteProject} />
        )}
        {page === "project" && openProject && (
          <ProjectViewer project={openProject} teams={customTeams}
            onBack={() => { setOpenProject(null); setPage("dashboard"); }} />
        )}
        {page === "builder" && (
          <TeamBuilder onSave={t => { saveCustomTeam(t); setCustomTeams(Storage.getCustomTeams()); }} />
        )}
      </div>
      <MobileNav page={page} setPage={setPage} team={team} />
    </div>
  );
}
