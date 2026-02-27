import { useState, useEffect, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');`;

const TEAMS = [
  {
    id: "tech", name: "Tech Startup Squad", emoji: "🚀",
    tagline: "Code, launch & grow your product", color: "#00e8ff",
    exampleIdeas: ["Build me a portfolio website", "Create a SaaS landing page", "Write a mobile app business plan"],
    bots: [
      { id: "codex", name: "CodeX", role: "Lead Engineer", emoji: "⚡", color: "#00e8ff",
        collaborate: `You are CodeX, expert full-stack engineer. Given a project idea and the other bots' work, write your part: complete working code (HTML/CSS/JS or whatever is needed), technical architecture, and implementation. Be thorough and write real working output.`,
        solo: `You are CodeX, expert full-stack engineer. Help the user with code, debugging, architecture, tech stack decisions, and technical problems. Give complete working code when asked.` },
      { id: "pixel", name: "PixelAI", role: "UI/UX Designer", emoji: "🎨", color: "#ff6fff",
        collaborate: `You are PixelAI, expert UI/UX designer. Given a project idea and other bots' work, contribute your part: design guidelines, CSS styles, color schemes, layout suggestions, user flow. Write complete CSS/styles if needed.`,
        solo: `You are PixelAI, expert UI/UX designer. Help the user with design decisions, wireframes, color palettes, user flows, and visual identity. Describe designs in detail or write CSS when needed.` },
      { id: "growth", name: "GrowthBot", role: "Growth Marketer", emoji: "📈", color: "#ffe44d",
        collaborate: `You are GrowthBot, expert growth marketer. Given a project idea and other bots' work, contribute your part: marketing strategy, content copy, SEO plan, launch strategy, user acquisition tactics. Write complete copy and strategy.`,
        solo: `You are GrowthBot, expert growth marketer. Help with SEO, marketing campaigns, content strategy, launch plans, social media, and user acquisition.` },
      { id: "lex", name: "LexAI", role: "Legal Advisor", emoji: "⚖️", color: "#4effa0",
        collaborate: `You are LexAI, AI legal advisor. Given a project idea and other bots' work, contribute your part: required legal documents, compliance notes, terms of service, privacy policy, legal risks. Write complete legal documents.`,
        solo: `You are LexAI, AI legal advisor. Help with contracts, legal documents, compliance, IP protection, business structure, and legal risks. Always recommend consulting a real lawyer for final decisions.` },
    ],
  },
  {
    id: "health", name: "MedCore Team", emoji: "🏥",
    tagline: "Health, wellness & medical guidance", color: "#4effa0",
    exampleIdeas: ["Create a personal fitness & diet plan", "Build a mental health app", "Write a health startup business plan"],
    bots: [
      { id: "clinai", name: "ClinAI", role: "Clinical Advisor", emoji: "🩺", color: "#4effa0",
        collaborate: `You are ClinAI, clinical health advisor. Given a health project idea and other bots' work, contribute your part: clinical protocols, medical content, health guidelines, evidence-based recommendations. Be thorough.`,
        solo: `You are ClinAI, clinical health advisor. Help users understand medical conditions, symptoms, treatment options, health plans, and clinical information. Always recommend consulting a licensed physician for personal medical decisions.` },
      { id: "regbot", name: "RegBot", role: "Health Regulatory Expert", emoji: "📋", color: "#00e8ff",
        collaborate: `You are RegBot, healthcare regulatory expert. Given a health project, contribute your part: regulatory requirements, HIPAA compliance, FDA considerations, health data privacy rules, compliance checklist.`,
        solo: `You are RegBot, healthcare regulatory expert. Help with FDA regulations, HIPAA, medical device compliance, health data privacy, and healthcare business regulations.` },
      { id: "healthdev", name: "HealthDev", role: "Health Tech Engineer", emoji: "💻", color: "#ffe44d",
        collaborate: `You are HealthDev, health tech engineer. Given a health project, contribute your part: technical implementation, health app code, EHR integration approach, health API design, data structures.`,
        solo: `You are HealthDev, health tech engineer. Help build digital health products, health apps, EHR integrations, FHIR APIs, and medical data systems.` },
      { id: "wellness", name: "WellBot", role: "Wellness Coach", emoji: "🧘", color: "#ff6fff",
        collaborate: `You are WellBot, wellness coach. Given a health project, contribute your part: wellness programs, lifestyle recommendations, mental health support strategies, nutrition plans, exercise routines.`,
        solo: `You are WellBot, expert wellness coach. Help with fitness plans, nutrition advice, mental health strategies, sleep improvement, stress management, and healthy habits.` },
    ],
  },
  {
    id: "legal", name: "Legal Eagles", emoji: "⚖️",
    tagline: "Legal documents, compliance & protection", color: "#ff9442",
    exampleIdeas: ["Draft an NDA for my business", "Write a freelance service agreement", "Create a privacy policy for my app"],
    bots: [
      { id: "contract", name: "ContractAI", role: "Contract Specialist", emoji: "📝", color: "#ff9442",
        collaborate: `You are ContractAI, contract specialist. Given a legal project and other bots' work, write your part: complete contract drafts, agreement templates, key clauses, and contract structure. Write the full document.`,
        solo: `You are ContractAI, contract specialist. Draft complete contracts, NDAs, service agreements, employment contracts, partnership agreements. Write full document templates when asked.` },
      { id: "bizlaw", name: "BizLaw", role: "Business Law Advisor", emoji: "🏛️", color: "#00e8ff",
        collaborate: `You are BizLaw, business law advisor. Given a legal project, contribute: business structure advice, legal entity recommendations, shareholder agreements, regulatory compliance requirements.`,
        solo: `You are BizLaw, business law advisor. Help with company formation, business structures, shareholder agreements, commercial law, and business disputes.` },
      { id: "iplaw", name: "IPGuard", role: "IP & Copyright Expert", emoji: "🔒", color: "#ffe44d",
        collaborate: `You are IPGuard, IP expert. Given a project, contribute: IP protection strategy, trademark/copyright considerations, IP clauses for contracts, licensing recommendations.`,
        solo: `You are IPGuard, IP expert. Help with trademark, copyright, patents, trade secrets, IP licensing, and protecting creative and technical work.` },
      { id: "complaw", name: "ComplyBot", role: "Compliance Officer", emoji: "✅", color: "#4effa0",
        collaborate: `You are ComplyBot, compliance officer. Given a project, contribute: compliance requirements checklist, GDPR/CCPA considerations, industry-specific regulations, data protection requirements.`,
        solo: `You are ComplyBot, compliance expert. Help with GDPR, CCPA, data protection, AML/KYC, financial regulations, and building compliance programs.` },
    ],
  },
  {
    id: "business", name: "Business Builders", emoji: "💼",
    tagline: "Strategy, finance & business planning", color: "#ffe44d",
    exampleIdeas: ["Write a complete business plan", "Create an investor pitch deck", "Build a financial model for my startup"],
    bots: [
      { id: "strategy", name: "StrategyAI", role: "Business Strategist", emoji: "♟️", color: "#ffe44d",
        collaborate: `You are StrategyAI, business strategist. Given a business idea and other bots' work, write your part: complete business strategy, market analysis, competitive landscape, go-to-market plan, business model canvas.`,
        solo: `You are StrategyAI, business strategist. Help with business models, market analysis, competitive strategy, business plans, and growth strategies.` },
      { id: "finance", name: "FinBot", role: "Financial Advisor", emoji: "💰", color: "#4effa0",
        collaborate: `You are FinBot, financial advisor. Given a business idea, contribute: financial projections, revenue model, funding requirements, cost structure, key financial metrics, break-even analysis.`,
        solo: `You are FinBot, financial advisor. Help with financial planning, budgeting, cash flow, fundraising, financial modeling, and investment decisions.` },
      { id: "pitch", name: "PitchPro", role: "Pitch & Fundraising Expert", emoji: "🎯", color: "#ff6fff",
        collaborate: `You are PitchPro, pitch expert. Given a business idea, contribute: investor pitch narrative, key selling points, pitch deck outline, elevator pitch, answers to common investor questions.`,
        solo: `You are PitchPro, pitch expert. Help craft investor pitches, pitch decks, elevator pitches, and fundraising strategies.` },
      { id: "hr", name: "PeopleBot", role: "HR & Team Building", emoji: "👥", color: "#00e8ff",
        collaborate: `You are PeopleBot, HR expert. Given a business idea, contribute: team structure recommendations, key hires needed, job descriptions, company culture framework, HR policies outline.`,
        solo: `You are PeopleBot, HR expert. Help with hiring strategies, job descriptions, team structures, company culture, and employee policies.` },
    ],
  },
  {
    id: "creative", name: "Creative Studio", emoji: "🎬",
    tagline: "Content, branding & creative campaigns", color: "#ff6fff",
    exampleIdeas: ["Create a full brand identity", "Write a content marketing strategy", "Build a social media campaign"],
    bots: [
      { id: "director", name: "DirectorAI", role: "Creative Director", emoji: "🎬", color: "#ff6fff",
        collaborate: `You are DirectorAI, creative director. Given a creative project and other bots' work, contribute: creative direction, brand positioning, visual identity guidelines, campaign concept, mood board description.`,
        solo: `You are DirectorAI, creative director. Help with brand strategy, creative vision, campaign concepts, visual identity, and brand positioning.` },
      { id: "inkbot", name: "InkBot", role: "Content Writer", emoji: "✍️", color: "#00e8ff",
        collaborate: `You are InkBot, expert content writer. Given a creative project, contribute: all written content including headlines, body copy, taglines, about page, product descriptions, email sequences. Write complete content.`,
        solo: `You are InkBot, content writer. Write blog posts, website copy, ad copy, email sequences, social posts, and any written content. Write complete content when asked.` },
      { id: "viral", name: "ViralBot", role: "Social Media Strategist", emoji: "📱", color: "#ffe44d",
        collaborate: `You are ViralBot, social media expert. Given a creative project, contribute: social media strategy, content calendar, platform-specific content ideas, hashtag strategy, community building plan.`,
        solo: `You are ViralBot, social media strategist. Help with content calendars, viral content ideas, platform strategies, and growing social media presence.` },
      { id: "seo", name: "SEOBot", role: "SEO Strategist", emoji: "🔍", color: "#4effa0",
        collaborate: `You are SEOBot, SEO expert. Given a creative project, contribute: keyword strategy, SEO-optimized content structure, meta descriptions, link building plan, content SEO recommendations.`,
        solo: `You are SEOBot, SEO expert. Help with keyword research, on-page SEO, content strategy, technical SEO, and ranking improvement.` },
    ],
  },
  {
    id: "engineering", name: "Engineering Corps", emoji: "⚙️",
    tagline: "Design, prototype & manufacture products", color: "#a78bfa",
    exampleIdeas: ["Design a smart IoT device", "Create a product specification document", "Plan manufacturing for my hardware product"],
    bots: [
      { id: "mechai", name: "MechAI", role: "Mechanical Engineer", emoji: "🔧", color: "#a78bfa",
        collaborate: `You are MechAI, mechanical engineer. Given an engineering project and other bots' work, contribute: mechanical design specs, materials selection, manufacturing approach, prototyping plan, dimensions and tolerances.`,
        solo: `You are MechAI, mechanical engineer. Help with product design, CAD guidance, prototyping, manufacturing processes, and materials selection.` },
      { id: "circuit", name: "CircuitBot", role: "Electrical Engineer", emoji: "⚡", color: "#ffe44d",
        collaborate: `You are CircuitBot, electrical engineer. Given an engineering project, contribute: electrical schematic overview, component selection, PCB design notes, power requirements, firmware architecture.`,
        solo: `You are CircuitBot, electrical engineer. Help with PCB design, embedded systems, IoT architecture, power systems, and electronic product development.` },
      { id: "projbot", name: "ProjBot", role: "Project Manager", emoji: "📐", color: "#4effa0",
        collaborate: `You are ProjBot, engineering project manager. Given an engineering project, contribute: project timeline, milestones, budget estimate, resource requirements, risk assessment, manufacturing partners list.`,
        solo: `You are ProjBot, engineering PM. Help with project timelines, resource planning, budgets, risk management, and getting products to market.` },
      { id: "supply", name: "SupplyBot", role: "Supply Chain Expert", emoji: "🏭", color: "#ff6fff",
        collaborate: `You are SupplyBot, supply chain expert. Given an engineering project, contribute: sourcing strategy, manufacturing options, supplier recommendations, logistics plan, import/export considerations, cost breakdown.`,
        solo: `You are SupplyBot, supply chain expert. Help with sourcing suppliers, manufacturing, quality control, logistics, and building efficient supply chains.` },
    ],
  },
];

const css = `
${FONTS}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#060a0e;--surface:#0d1318;--surface2:#121920;
  --border:rgba(255,255,255,0.07);--border2:rgba(255,255,255,0.12);
  --text:#e8edf2;--muted:#5a6a7a;--accent:#00e8ff;--accent2:#0070ff;
  --font-h:'Syne',sans-serif;--font-m:'DM Mono',monospace;
  --radius:16px;--radius-sm:10px;
}
html{-webkit-tap-highlight-color:transparent;}
body{background:var(--bg);color:var(--text);font-family:var(--font-h);overflow-x:hidden;}
::-webkit-scrollbar{width:3px;}
::-webkit-scrollbar-thumb{background:var(--border2);border-radius:4px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes glow{0%,100%{box-shadow:0 0 20px rgba(0,232,255,0.3)}50%{box-shadow:0 0 40px rgba(0,232,255,0.6)}}
@keyframes scaleIn{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}
@keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.fu{animation:fadeUp .5s cubic-bezier(.16,1,.3,1) both;}
.fu2{animation:fadeUp .5s .1s cubic-bezier(.16,1,.3,1) both;}
.fu3{animation:fadeUp .5s .18s cubic-bezier(.16,1,.3,1) both;}
.fi{animation:fadeIn .4s ease both;}
.si{animation:scaleIn .4s cubic-bezier(.16,1,.3,1) both;}

.splash{position:fixed;inset:0;z-index:9999;background:var(--bg);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;}
.splash-logo{font-size:3.2rem;font-weight:800;letter-spacing:-2px;animation:glow 2s ease infinite;}
.splash-logo span{color:var(--accent);}
.splash-tagline{font-family:var(--font-m);font-size:.75rem;color:var(--muted);letter-spacing:2px;text-transform:uppercase;animation:fadeIn 1s .3s ease both;}
.splash-dots{display:flex;gap:8px;animation:fadeIn .5s .6s ease both;opacity:0;}
.splash-dots span{width:6px;height:6px;border-radius:50%;background:var(--accent);animation:pulse 1.4s ease infinite;}
.splash-dots span:nth-child(2){animation-delay:.2s}
.splash-dots span:nth-child(3){animation-delay:.4s}
.dev-badge{position:absolute;bottom:40px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:10px;animation:fadeIn 1s 1.2s ease both;opacity:0;white-space:nowrap;}
.dev-label{font-size:.6rem;font-weight:700;letter-spacing:2px;color:var(--muted);text-transform:uppercase;font-family:var(--font-m);}
.dev-card{display:flex;align-items:center;gap:10px;background:rgba(255,255,255,0.04);border:1px solid rgba(0,232,255,0.2);border-radius:50px;padding:7px 18px 7px 7px;box-shadow:0 4px 24px rgba(0,232,255,0.1);}
.dev-card img{width:36px;height:36px;border-radius:50%;object-fit:cover;border:2px solid var(--accent);}
.dev-card span{font-family:var(--font-h);font-weight:700;font-size:.88rem;color:var(--text);}

.grid-bg{position:fixed;inset:0;pointer-events:none;z-index:0;background-image:linear-gradient(rgba(0,232,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,232,255,0.03) 1px,transparent 1px);background-size:40px 40px;}
.glow-orb{position:fixed;pointer-events:none;z-index:0;border-radius:50%;filter:blur(80px);opacity:0.12;}
.glow-orb-1{width:400px;height:400px;background:#00e8ff;top:-100px;right:-100px;}
.glow-orb-2{width:300px;height:300px;background:#0070ff;bottom:0;left:-100px;}

.lp{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;position:relative;z-index:1;}
.lb{width:100%;max-width:420px;background:rgba(13,19,24,0.8);backdrop-filter:blur(20px);border:1px solid var(--border2);border-radius:24px;padding:48px 40px;box-shadow:0 40px 80px rgba(0,0,0,.7);position:relative;overflow:hidden;}
.lb::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--accent),transparent);opacity:.5;}
.ll{font-size:2.6rem;font-weight:800;letter-spacing:-2px;margin-bottom:6px;line-height:1;}
.ll span{color:var(--accent);}
.ls{color:var(--muted);font-family:var(--font-m);font-size:.74rem;margin-bottom:36px;}
.llab{display:block;font-size:.68rem;font-weight:700;color:var(--muted);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px;}
.linp{width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:15px 16px;color:var(--text);font-family:var(--font-m);font-size:.9rem;outline:none;transition:border-color .2s;margin-bottom:6px;}
.linp:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(0,232,255,0.1);}
.linp.err{border-color:#ff4e4e;}
.err-msg{font-size:.7rem;color:#ff4e4e;font-family:var(--font-m);margin-bottom:12px;margin-top:2px;}
.lbtn{width:100%;padding:16px;background:linear-gradient(135deg,var(--accent),var(--accent2));color:#000;font-family:var(--font-h);font-weight:800;font-size:.95rem;border:none;border-radius:var(--radius-sm);cursor:pointer;transition:transform .15s,box-shadow .15s;margin-top:10px;}
.lbtn:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(0,232,255,.4);}
.ltog{text-align:center;margin-top:20px;font-size:.82rem;color:var(--muted);}
.ltog span{color:var(--accent);cursor:pointer;font-weight:700;}

.app{display:flex;min-height:100vh;position:relative;z-index:1;}
.main{flex:1;padding:36px 44px;overflow-y:auto;min-height:100vh;}
.sb{width:240px;min-height:100vh;background:rgba(13,19,24,0.95);backdrop-filter:blur(20px);border-right:1px solid var(--border);padding:28px 18px;display:flex;flex-direction:column;flex-shrink:0;position:sticky;top:0;height:100vh;overflow-y:auto;}
.sb-logo{font-size:1.4rem;font-weight:800;margin-bottom:32px;padding:0 10px;letter-spacing:-1px;}
.sb-logo span{color:var(--accent);}
.sb-sec{font-size:.62rem;font-weight:700;color:var(--muted);letter-spacing:2px;text-transform:uppercase;padding:0 10px;margin-bottom:10px;}
.sb-item{display:flex;align-items:center;gap:10px;padding:11px 14px;border-radius:var(--radius-sm);cursor:pointer;font-size:.85rem;font-weight:600;color:var(--muted);transition:all .2s;margin-bottom:3px;border:1px solid transparent;}
.sb-item:hover{background:var(--surface2);color:var(--text);}
.sb-item.act{background:rgba(0,232,255,.08);color:var(--accent);border-color:rgba(0,232,255,.15);}
.sb-bot{margin-top:auto;border-top:1px solid var(--border);padding-top:18px;}
.uc{display:flex;align-items:center;gap:10px;padding:11px 14px;border-radius:var(--radius-sm);background:var(--surface2);border:1px solid var(--border);}
.uav{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-weight:800;font-size:.8rem;color:#000;flex-shrink:0;}
.un{font-size:.82rem;font-weight:700;}
.ur{font-size:.68rem;color:var(--muted);font-family:var(--font-m);}
.lo{background:none;border:none;color:var(--muted);font-size:.76rem;cursor:pointer;margin-top:10px;padding:7px 14px;font-family:var(--font-h);font-weight:600;border-radius:8px;width:100%;text-align:left;transition:all .2s;}
.lo:hover{color:var(--text);background:var(--surface2);}

.pt{font-size:2rem;font-weight:800;letter-spacing:-1px;margin-bottom:6px;}
.ps{color:var(--muted);font-family:var(--font-m);font-size:.78rem;margin-bottom:36px;}
.tg{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px;}
.tc{border-radius:20px;padding:28px;cursor:pointer;border:1px solid var(--border);background:var(--surface);transition:transform .25s cubic-bezier(.16,1,.3,1),box-shadow .25s,border-color .25s;position:relative;overflow:hidden;}
.tc::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--cc),transparent);opacity:.8;}
.tc:hover{transform:translateY(-6px);border-color:var(--cc);box-shadow:0 20px 50px rgba(0,0,0,.5);}
.te{font-size:2.2rem;margin-bottom:14px;display:block;}
.tn{font-size:1.08rem;font-weight:800;margin-bottom:6px;}
.ttag{font-size:.75rem;color:var(--muted);margin-bottom:16px;font-family:var(--font-m);}
.bps{display:flex;gap:6px;flex-wrap:wrap;}
.bp{font-size:.68rem;font-family:var(--font-m);padding:4px 10px;border-radius:20px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);color:var(--muted);}
.tcta{display:inline-flex;align-items:center;gap:4px;margin-top:18px;font-size:.76rem;font-weight:700;color:var(--cc);}

.back{display:inline-flex;align-items:center;gap:6px;background:var(--surface);border:1px solid var(--border);color:var(--muted);cursor:pointer;font-family:var(--font-h);font-size:.82rem;font-weight:700;margin-bottom:24px;padding:9px 16px;border-radius:50px;transition:all .2s;}
.back:hover{color:var(--text);border-color:var(--border2);}
.th{display:flex;align-items:center;gap:16px;margin-bottom:28px;padding:24px 28px;border-radius:20px;background:var(--surface);border:1px solid var(--border);position:relative;overflow:hidden;}
.th::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--tc),transparent);opacity:.6;}
.the{font-size:2.8rem;}
.thn{font-size:1.5rem;font-weight:800;letter-spacing:-.5px;}
.tht{font-size:.76rem;color:var(--muted);font-family:var(--font-m);margin-top:3px;}

/* IDEA BOX */
.idea-box{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:28px;margin-bottom:24px;}
.idea-box h3{font-size:1rem;font-weight:800;margin-bottom:6px;}
.idea-box p{font-size:.76rem;color:var(--muted);font-family:var(--font-m);margin-bottom:16px;}
.idea-inp{width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px 16px;color:var(--text);font-family:var(--font-m);font-size:.88rem;outline:none;resize:none;transition:border-color .2s;line-height:1.6;}
.idea-inp:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(0,232,255,0.08);}
.example-chips{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;}
.chip{font-size:.7rem;font-family:var(--font-m);padding:5px 12px;border-radius:20px;border:1px solid var(--border2);color:var(--muted);cursor:pointer;transition:all .2s;background:var(--surface2);}
.chip:hover{color:var(--accent);border-color:var(--accent);}
.build-btn{margin-top:14px;padding:14px 28px;background:linear-gradient(135deg,var(--accent),var(--accent2));color:#000;font-family:var(--font-h);font-weight:800;font-size:.9rem;border:none;border-radius:var(--radius-sm);cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:8px;}
.build-btn:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(0,232,255,.4);}
.build-btn:disabled{opacity:.4;cursor:not-allowed;transform:none;box-shadow:none;}

/* PROGRESS */
.progress-wrap{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:28px;margin-bottom:24px;}
.progress-wrap h3{font-size:1rem;font-weight:800;margin-bottom:20px;}
.bot-step{display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid var(--border);}
.bot-step:last-child{border-bottom:none;}
.bot-step-emoji{font-size:1.5rem;width:40px;text-align:center;}
.bot-step-info{flex:1;}
.bot-step-name{font-size:.85rem;font-weight:700;}
.bot-step-label{font-size:.72rem;font-family:var(--font-m);color:var(--muted);margin-top:2px;}
.bot-step-status{font-size:.72rem;font-weight:700;padding:4px 12px;border-radius:20px;white-space:nowrap;}
.status-waiting{color:var(--muted);background:rgba(255,255,255,.04);border:1px solid var(--border);}
.status-working{color:var(--accent);background:rgba(0,232,255,0.08);border:1px solid rgba(0,232,255,0.2);animation:pulse 1.2s ease infinite;}
.status-done{color:#4effa0;background:rgba(78,255,160,0.08);border:1px solid rgba(78,255,160,0.2);}
.progress-bar-wrap{margin-top:20px;background:var(--surface2);border-radius:4px;height:4px;overflow:hidden;}
.progress-bar{height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2));border-radius:4px;transition:width .5s ease;}

/* RESULTS */
.results-wrap{margin-bottom:24px;}
.result-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;margin-bottom:14px;overflow:hidden;}
.result-card-header{padding:14px 18px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;transition:background .2s;}
.result-card-header:hover{background:var(--surface2);}
.result-card-title{display:flex;align-items:center;gap:10px;font-size:.88rem;font-weight:800;}
.result-card-body{padding:18px;border-top:1px solid var(--border);font-family:var(--font-m);font-size:.8rem;line-height:1.8;color:var(--text);white-space:pre-wrap;word-break:break-word;max-height:400px;overflow-y:auto;}
.copy-btn{padding:5px 12px;background:transparent;border:1px solid var(--border);color:var(--muted);font-size:.68rem;font-family:var(--font-h);font-weight:700;border-radius:6px;cursor:pointer;transition:all .2s;}
.copy-btn:hover{color:var(--accent);border-color:var(--accent);}
.reset-btn{padding:10px 18px;background:transparent;color:var(--muted);font-family:var(--font-h);font-weight:700;font-size:.78rem;border:1px solid var(--border);border-radius:8px;cursor:pointer;transition:all .2s;margin-top:16px;}
.reset-btn:hover{color:var(--text);border-color:var(--border2);}

/* BOT CARDS for solo chat */
.sec-title{font-size:.65rem;font-weight:700;color:var(--muted);letter-spacing:2px;text-transform:uppercase;margin-bottom:14px;display:flex;align-items:center;gap:8px;}
.sec-title::after{content:'';flex:1;height:1px;background:var(--border);}
.bot-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;margin-bottom:24px;}
.bot-card{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;cursor:pointer;transition:all .2s;position:relative;overflow:hidden;}
.bot-card::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:var(--bc);opacity:0;transition:opacity .2s;}
.bot-card:hover,.bot-card.sel{border-color:var(--bc);background:var(--surface2);transform:translateY(-2px);}
.bot-card.sel::after{opacity:1;}
.bot-card-emoji{font-size:1.5rem;margin-bottom:7px;}
.bot-card-name{font-size:.82rem;font-weight:800;margin-bottom:2px;}
.bot-card-role{font-size:.65rem;font-family:var(--font-m);color:var(--bc);}

/* CHAT */
.chat-panel{background:var(--surface);border:1px solid var(--border);border-radius:20px;overflow:hidden;margin-bottom:24px;animation:slideUp .3s cubic-bezier(.16,1,.3,1);}
.chat-header{padding:14px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;background:rgba(255,255,255,0.02);}
.chat-header-emoji{font-size:1.4rem;}
.chat-header-name{font-size:.9rem;font-weight:800;}
.chat-header-role{font-size:.68rem;font-family:var(--font-m);margin-top:1px;}
.chat-msgs{height:360px;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;}
.msg{display:flex;gap:8px;animation:slideUp .3s cubic-bezier(.16,1,.3,1);}
.msg.u{flex-direction:row-reverse;}
.mav{width:28px;height:28px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:800;}
.mb{max-width:82%;padding:10px 14px;border-radius:12px;font-size:.82rem;line-height:1.7;font-family:var(--font-m);white-space:pre-wrap;word-break:break-word;}
.msg.b .mb{background:var(--surface2);color:var(--text);border-radius:4px 12px 12px 12px;border:1px solid var(--border);}
.msg.u .mb{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#000;font-weight:500;border-radius:12px 4px 12px 12px;}
.typing{display:flex;align-items:center;gap:4px;padding:4px 0;}
.typing s{display:block;width:5px;height:5px;border-radius:50%;background:var(--muted);animation:pulse 1.2s ease infinite;}
.typing s:nth-child(2){animation-delay:.2s}
.typing s:nth-child(3){animation-delay:.4s}
.chat-input-row{padding:12px 16px;border-top:1px solid var(--border);display:flex;gap:8px;align-items:flex-end;background:rgba(255,255,255,0.01);}
.chat-inp{flex:1;background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:11px 13px;color:var(--text);font-family:var(--font-m);font-size:.83rem;outline:none;resize:none;transition:border-color .2s;line-height:1.5;}
.chat-inp:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(0,232,255,0.08);}
.send-btn{padding:11px 18px;background:linear-gradient(135deg,var(--accent),var(--accent2));color:#000;font-weight:800;font-size:.8rem;border:none;border-radius:var(--radius-sm);cursor:pointer;font-family:var(--font-h);flex-shrink:0;transition:all .2s;}
.send-btn:hover{transform:translateY(-1px);}
.send-btn:disabled{opacity:.35;cursor:not-allowed;transform:none;}

@media(max-width:860px){
  .main{padding:20px 16px 100px;}
  .sb{display:none;}
  .tg{grid-template-columns:1fr;gap:14px;}
  .pt{font-size:1.6rem;}
  .bot-cards{grid-template-columns:repeat(2,1fr);}
  .mob-nav{position:fixed;bottom:0;left:0;right:0;z-index:100;background:rgba(13,19,24,0.95);backdrop-filter:blur(20px);border-top:1px solid var(--border);display:flex;padding:12px 0 20px;}
  .mob-nav-item{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;font-size:.62rem;font-weight:700;color:var(--muted);cursor:pointer;transition:color .2s;text-transform:uppercase;}
  .mob-nav-item .nav-icon{font-size:1.3rem;}
  .mob-nav-item.act{color:var(--accent);}
}
@media(min-width:861px){.mob-nav{display:none;}}
`;

async function callClaude(systemPrompt, messages) {
  try {
    const res = await fetch("https://teamai-ashen.vercel.app/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: systemPrompt,
        messages,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.content?.[0]?.text || data.content?.map(b => b.text || "").join("") || "Sorry, no response received.";
  } catch (e) {
    return `Error: ${e.message}. Please check your internet connection.`;
  }
}

// ── SPLASH ──
function Splash({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="splash fi">
      <style>{css}</style>
      <div className="grid-bg" /><div className="glow-orb glow-orb-1" /><div className="glow-orb glow-orb-2" />
      <div className="splash-logo fu">Team<span>AI</span></div>
      <div className="splash-tagline fu2">Your AI-powered team, on demand</div>
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

// ── LOGIN ──
function Login({ onLogin }) {
  const [reg, setReg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passErr, setPassErr] = useState("");

  const go = (e) => {
    e.preventDefault();
    const eErr = !email ? "Email is required" : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "Enter a valid email (e.g. you@gmail.com)" : "";
    const pErr = pass.length < 6 ? "Password must be at least 6 characters" : "";
    setEmailErr(eErr); setPassErr(pErr);
    if (!eErr && !pErr) onLogin({ name: name || email.split("@")[0], email });
  };

  return (
    <div className="lp">
      <div className="grid-bg" /><div className="glow-orb glow-orb-1" /><div className="glow-orb glow-orb-2" />
      <div className="lb fu si">
        <div className="ll fu">Team<span>AI</span></div>
        <div className="ls fu2">// your AI-powered team, on demand</div>
        {reg && <><label className="llab">Your Name</label><input className="linp" placeholder="Jane Doe" value={name} onChange={e => setName(e.target.value)} /></>}
        <label className="llab">Email</label>
        <input className={`linp${emailErr ? " err" : ""}`} type="email" placeholder="you@gmail.com" value={email} onChange={e => { setEmail(e.target.value); setEmailErr(""); }} />
        {emailErr && <div className="err-msg">⚠ {emailErr}</div>}
        <label className="llab">Password</label>
        <input className={`linp${passErr ? " err" : ""}`} type="password" placeholder="min. 6 characters" value={pass} onChange={e => { setPass(e.target.value); setPassErr(""); }} onKeyDown={e => e.key === "Enter" && go(e)} />
        {passErr && <div className="err-msg">⚠ {passErr}</div>}
        <button className="lbtn" onClick={go}>{reg ? "Create Account →" : "Sign In →"}</button>
        <div className="ltog">{reg ? "Have an account? " : "New here? "}<span onClick={() => { setReg(!reg); setEmailErr(""); setPassErr(""); }}>{reg ? "Sign in" : "Register"}</span></div>
      </div>
    </div>
  );
}

function Sidebar({ user, page, setPage, team, onLogout }) {
  return (
    <div className="sb">
      <div className="sb-logo">Team<span>AI</span></div>
      <div className="sb-sec">Menu</div>
      <div className={`sb-item${page === "teams" ? " act" : ""}`} onClick={() => setPage("teams")}><span>🏠</span> Browse Teams</div>
      {team && <div className={`sb-item${page === "team" ? " act" : ""}`} onClick={() => setPage("team")}><span>{team.emoji}</span> {team.name}</div>}
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
      <div className={`mob-nav-item${page === "teams" ? " act" : ""}`} onClick={() => setPage("teams")}><span className="nav-icon">🏠</span><span>Teams</span></div>
      {team && <div className={`mob-nav-item${page === "team" ? " act" : ""}`} onClick={() => setPage("team")}><span className="nav-icon">{team.emoji}</span><span>Active</span></div>}
      <div className="mob-nav-item"><span className="nav-icon">👤</span><span>Profile</span></div>
    </div>
  );
}

// ── SOLO BOT CHAT ──
function BotChat({ bot, idea, prevResult }) {
  const context = `The user previously worked on: "${idea}". Previous team output summary: ${prevResult ? prevResult.substring(0, 300) : "none"}`;
  const [msgs, setMsgs] = useState([
    { role: "b", text: `Hi! I'm ${bot.name}, your ${bot.role}. I can help you improve or fix any specific part of the work. What would you like to change or improve?` }
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
    const reply = await callClaude(`${bot.solo}\n\nContext: ${context}`, [...history, { role: "user", content: q }]);
    setMsgs(m => [...m, { role: "b", text: reply }]);
    setLoading(false);
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <div className="chat-header-emoji">{bot.emoji}</div>
        <div>
          <div className="chat-header-name">{bot.name}</div>
          <div className="chat-header-role" style={{ color: bot.color }}>{bot.role}</div>
        </div>
      </div>
      <div className="chat-msgs">
        {msgs.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            <div className="mav" style={{ background: m.role === "u" ? "rgba(0,232,255,.15)" : `${bot.color}22`, color: m.role === "u" ? "var(--accent)" : bot.color }}>
              {m.role === "u" ? "U" : bot.name[0]}
            </div>
            <div className="mb">{m.text}</div>
          </div>
        ))}
        {loading && (
          <div className="msg b">
            <div className="mav" style={{ background: `${bot.color}22`, color: bot.color }}>{bot.name[0]}</div>
            <div className="mb"><div className="typing"><s /><s /><s /></div></div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className="chat-input-row">
        <textarea className="chat-inp" rows={2} placeholder={`Ask ${bot.name} to fix or improve something...`}
          value={inp} onChange={e => setInp(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} />
        <button className="send-btn" onClick={send} disabled={loading || !inp.trim()}>Send</button>
      </div>
    </div>
  );
}

// ── RESULT CARD ──
function ResultCard({ bot, content }) {
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard?.writeText(content); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="result-card">
      <div className="result-card-header" onClick={() => setOpen(o => !o)}>
        <div className="result-card-title">
          <span>{bot.emoji}</span>
          <span>{bot.name}</span>
          <span style={{ fontWeight: 400, color: "var(--muted)", fontSize: ".72rem", fontFamily: "var(--font-m)" }}>— {bot.role}</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button className="copy-btn" onClick={e => { e.stopPropagation(); copy(); }}>{copied ? "✓ Copied" : "Copy"}</button>
          <span style={{ color: "var(--muted)", fontSize: ".8rem" }}>{open ? "▲" : "▼"}</span>
        </div>
      </div>
      {open && <div className="result-card-body">{content}</div>}
    </div>
  );
}

// ── TEAM VIEW ──
function TeamView({ team, onBack }) {
  const [idea, setIdea] = useState("");
  const [phase, setPhase] = useState("idle"); // idle | building | done
  const [statuses, setStatuses] = useState({});
  const [results, setResults] = useState({}); // botId -> result text
  const [activeBot, setActiveBot] = useState(null);

  const total = team.bots.length;
  const doneCount = Object.values(statuses).filter(s => s === "done").length;
  const progress = total ? Math.round((doneCount / total) * 100) : 0;
  const allResultsText = Object.values(results).join("\n\n---\n\n");

  const setStatus = (id, s) => setStatuses(prev => ({ ...prev, [id]: s }));

  const build = async () => {
    if (!idea.trim()) return;
    setPhase("building");
    setResults({});
    setActiveBot(null);
    const init = {};
    team.bots.forEach(b => { init[b.id] = "waiting"; });
    setStatuses(init);

    let context = `The user's project idea: "${idea}"\n\nTeam progress so far:\n`;

    for (const bot of team.bots) {
      setStatus(bot.id, "working");
      const systemPrompt = `${bot.collaborate}\n\n${context}\n\nNow write YOUR complete contribution for this project. Be thorough and detailed.`;
      const result = await callClaude(systemPrompt, [{ role: "user", content: idea }]);
      setResults(prev => ({ ...prev, [bot.id]: result }));
      context += `\n\n${bot.name} (${bot.role}) contributed:\n${result.substring(0, 500)}...\n`;
      setStatus(bot.id, "done");
    }
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

      {/* IDEA INPUT */}
      {phase === "idle" && (
        <div className="idea-box fu2">
          <h3>💡 Drop your idea</h3>
          <p>Describe what you need. The whole team will work on it together and deliver a complete result.</p>
          <div className="example-chips">
            {team.exampleIdeas.map((ex, i) => (
              <span key={i} className="chip" onClick={() => setIdea(ex)}>{ex}</span>
            ))}
          </div>
          <textarea className="idea-inp" rows={5}
            placeholder="Describe your idea in as much detail as you want..."
            value={idea} onChange={e => setIdea(e.target.value)} />
          <button className="build-btn" onClick={build} disabled={!idea.trim()}>
            🚀 Let the team work on it
          </button>
        </div>
      )}

      {/* PROGRESS */}
      {(phase === "building" || phase === "done") && (
        <div className="progress-wrap fu">
          <h3>{phase === "done" ? "✅ Your team has finished!" : "⚙️ Your team is working..."}</h3>
          {team.bots.map(bot => (
            <div className="bot-step" key={bot.id}>
              <div className="bot-step-emoji">{bot.emoji}</div>
              <div className="bot-step-info">
                <div className="bot-step-name">{bot.name} <span style={{ color: bot.color, fontSize: ".7rem" }}>— {bot.role}</span></div>
                <div className="bot-step-label">{phase === "done" && results[bot.id] ? "Contribution ready" : "Working on their part..."}</div>
              </div>
              <span className={`bot-step-status status-${statuses[bot.id] || "waiting"}`}>
                {statuses[bot.id] === "done" ? "✓ Done" : statuses[bot.id] === "working" ? "Working..." : "Waiting"}
              </span>
            </div>
          ))}
          <div className="progress-bar-wrap"><div className="progress-bar" style={{ width: `${progress}%` }} /></div>
          {phase === "done" && <button className="reset-btn" onClick={reset}>🔄 Start New Project</button>}
        </div>
      )}

      {/* RESULTS */}
      {phase === "done" && Object.keys(results).length > 0 && (
        <div className="results-wrap fu">
          <div className="sec-title">📋 Team Results</div>
          {team.bots.map(bot => results[bot.id] && (
            <ResultCard key={bot.id} bot={bot} content={results[bot.id]} />
          ))}
        </div>
      )}

      {/* INDIVIDUAL BOT CHAT */}
      {phase === "done" && (
        <div className="fu">
          <div className="sec-title">🔧 Need to fix or improve something?</div>
          <div className="bot-cards">
            {team.bots.map(bot => (
              <div key={bot.id} className={`bot-card${activeBot?.id === bot.id ? " sel" : ""}`}
                style={{ "--bc": bot.color }}
                onClick={() => setActiveBot(activeBot?.id === bot.id ? null : bot)}>
                <div className="bot-card-emoji">{bot.emoji}</div>
                <div className="bot-card-name">{bot.name}</div>
                <div className="bot-card-role">{bot.role}</div>
              </div>
            ))}
          </div>
          {activeBot && <BotChat key={activeBot.id} bot={activeBot} idea={idea} prevResult={results[activeBot.id]} />}
        </div>
      )}
    </div>
  );
}

// ── TEAMS LIST ──
function Teams({ onSelect }) {
  return (
    <div>
      <div className="pt fu">Your AI-Powered Teams</div>
      <div className="ps fu2">// pick a team · drop your idea · get complete results</div>
      <div className="tg">
        {TEAMS.map((t, i) => (
          <div key={t.id} className="tc fu" style={{ "--cc": t.color, animationDelay: `${i * 0.08}s` }} onClick={() => onSelect(t)}>
            <span className="te">{t.emoji}</span>
            <div className="tn">{t.name}</div>
            <div className="ttag">{t.tagline}</div>
            <div className="bps">{t.bots.map(b => <span key={b.id} className="bp">{b.emoji} {b.name}</span>)}</div>
            <div className="tcta">Work with this team →</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── APP ROOT ──
export default function App() {
  const [splash, setSplash] = useState(true);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("teams");
  const [team, setTeam] = useState(null);

  if (splash) return <Splash onDone={() => setSplash(false)} />;
  if (!user) return (<><style>{css}</style><Login onLogin={u => setUser(u)} /></>);

  return (
    <div className="app">
      <style>{css}</style>
      <div className="grid-bg" /><div className="glow-orb glow-orb-1" /><div className="glow-orb glow-orb-2" />
      <Sidebar user={user} page={page} setPage={setPage} team={team}
        onLogout={() => { setUser(null); setTeam(null); setPage("teams"); }} />
      <div className="main">
        {page === "teams" && <Teams onSelect={t => { setTeam(t); setPage("team"); }} />}
        {page === "team" && team && <TeamView team={team} onBack={() => setPage("teams")} />}
      </div>
      <MobileNav page={page} setPage={setPage} team={team} />
    </div>
  );
}
