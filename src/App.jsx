import { useState, useRef, useEffect } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');`;

const TEAMS = [
  {
    id: "tech",
    name: "Tech Startup Squad",
    emoji: "🚀",
    tagline: "Build your next unicorn",
    color: "#00e8ff",
    bots: [
      { id: "codex", name: "CodeX", role: "Lead Engineer", emoji: "⚡", color: "#00e8ff", prompt: "You are CodeX, an expert full-stack software engineer AI bot on the Tech Startup Squad. You help with code architecture, debugging, tech stack decisions, and development best practices. Be concise, technical, and helpful. Keep responses focused and practical." },
      { id: "pixel", name: "PixelAI", role: "UI/UX Designer", emoji: "🎨", color: "#ff6fff", prompt: "You are PixelAI, an expert UI/UX designer AI bot on the Tech Startup Squad. You help with product design, user flows, wireframes, design systems, and brand identity. Be creative, visual in your descriptions, and thoughtful." },
      { id: "growth", name: "GrowthBot", role: "Growth Marketer", emoji: "📈", color: "#ffe44d", prompt: "You are GrowthBot, an expert growth marketing AI bot on the Tech Startup Squad. You help with SEO, user acquisition, campaigns, funnels, and retention strategies. Be data-driven and give actionable advice." },
      { id: "lex", name: "LexAI", role: "Legal Advisor", emoji: "⚖️", color: "#4effa0", prompt: "You are LexAI, an AI legal advisor bot on the Tech Startup Squad. You help with startup legal questions, contracts, IP, incorporation, and compliance. Always remind users to consult a real lawyer for final decisions, but give useful guidance." },
    ],
  },
  {
    id: "health",
    name: "MedCore Team",
    emoji: "🏥",
    tagline: "Innovate in healthcare",
    color: "#4effa0",
    bots: [
      { id: "clinai", name: "ClinAI", role: "Clinical Advisor", emoji: "🩺", color: "#4effa0", prompt: "You are ClinAI, a clinical advisor AI bot on the MedCore Team. You help with clinical workflows, medical protocols, and patient care design. Always recommend consulting licensed physicians for medical decisions." },
      { id: "regbot", name: "RegBot", role: "Regulatory Expert", emoji: "📋", color: "#00e8ff", prompt: "You are RegBot, a healthcare regulatory expert AI bot on the MedCore Team. You help with FDA, HIPAA, CE marking, and medical device compliance questions. Be precise and thorough." },
      { id: "healthdev", name: "HealthDev", role: "Health Tech Engineer", emoji: "💻", color: "#ffe44d", prompt: "You are HealthDev, a health tech engineer AI bot on the MedCore Team. You help with EHR integration, FHIR APIs, HL7, and building compliant digital health products." },
    ],
  },
  {
    id: "creative",
    name: "Creative Studio",
    emoji: "🎬",
    tagline: "Build your creative brand",
    color: "#ff6fff",
    bots: [
      { id: "director", name: "DirectorAI", role: "Creative Director", emoji: "🎬", color: "#ff6fff", prompt: "You are DirectorAI, a creative director AI bot on the Creative Studio team. You help with brand strategy, creative vision, campaign concepts, and storytelling. Be bold, inspiring, and think big." },
      { id: "inkbot", name: "InkBot", role: "Content Writer", emoji: "✍️", color: "#00e8ff", prompt: "You are InkBot, a content writing AI bot on the Creative Studio team. You help with blog posts, scripts, ad copy, social captions, and email sequences. Be versatile and engaging." },
      { id: "viral", name: "ViralBot", role: "Social Media Manager", emoji: "📱", color: "#ffe44d", prompt: "You are ViralBot, a social media strategy AI bot on the Creative Studio team. You help with content calendars, trending formats, community growth, and platform-specific strategies." },
    ],
  },
  {
    id: "engineering",
    name: "Engineering Corps",
    emoji: "⚙️",
    tagline: "Design and build physical products",
    color: "#ff9442",
    bots: [
      { id: "mechai", name: "MechAI", role: "Mechanical Engineer", emoji: "🔧", color: "#ff9442", prompt: "You are MechAI, a mechanical engineering AI bot on the Engineering Corps team. You help with CAD guidance, prototyping strategies, manufacturing specs, and materials selection." },
      { id: "circuit", name: "CircuitBot", role: "Electrical Engineer", emoji: "⚡", color: "#ffe44d", prompt: "You are CircuitBot, an electrical engineering AI bot on the Engineering Corps team. You help with PCB design, embedded systems, IoT architecture, and power systems." },
      { id: "projbot", name: "ProjBot", role: "Project Manager", emoji: "📐", color: "#4effa0", prompt: "You are ProjBot, an engineering project manager AI bot on the Engineering Corps team. You help with timelines, resource planning, budgets, risk management, and vendor coordination." },
    ],
  },
];

const css = `
${FONTS}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #080c10;
  --surface: #0d1318;
  --surface2: #121920;
  --border: rgba(255,255,255,0.07);
  --text: #e8edf2;
  --muted: #5a6a7a;
  --accent: #00e8ff;
  --font-h: 'Syne', sans-serif;
  --font-m: 'DM Mono', monospace;
}
body { background: var(--bg); color: var(--text); font-family: var(--font-h); }

@keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
@keyframes pulse { 0%,100%{opacity:1}50%{opacity:.3} }
.fu { animation: fadeUp .45s ease both; }
.fu2 { animation: fadeUp .45s .1s ease both; }
.fu3 { animation: fadeUp .45s .18s ease both; }

/* LOGIN */
.built-by { text-align:center; margin-top:20px; font-size:.72rem; font-weight:700;
  letter-spacing:1px; color:var(--accent); text-transform:uppercase;
  background:rgba(0,232,255,0.08); border:1px solid rgba(0,232,255,0.2);
  border-radius:20px; padding:5px 14px; display:inline-block; }
.lp { min-height:100vh; display:flex; align-items:center; justify-content:center;
  background: radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,232,255,0.07) 0%, transparent 70%), var(--bg);
  padding:24px; }
.lb { width:100%; max-width:400px; background:var(--surface); border:1px solid var(--border);
  border-radius:20px; padding:44px 36px; box-shadow:0 40px 80px rgba(0,0,0,.6); }
.ll { font-size:2.2rem; font-weight:800; letter-spacing:-1px; margin-bottom:4px; }
.ll span { color:var(--accent); }
.ls { color:var(--muted); font-family:var(--font-m); font-size:.75rem; margin-bottom:32px; }
.llab { display:block; font-size:.7rem; font-weight:600; color:var(--muted); letter-spacing:1px; text-transform:uppercase; margin-bottom:7px; }
.linp { width:100%; background:var(--surface2); border:1px solid var(--border); border-radius:10px;
  padding:13px 15px; color:var(--text); font-family:var(--font-m); font-size:.88rem;
  outline:none; transition:border-color .2s; margin-bottom:18px; }
.linp:focus { border-color:var(--accent); }
.lbtn { width:100%; padding:14px; background:var(--accent); color:#000; font-family:var(--font-h);
  font-weight:700; font-size:.9rem; border:none; border-radius:10px; cursor:pointer;
  transition:transform .15s, box-shadow .15s; margin-top:4px; }
.lbtn:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,232,255,.35); }
.ltog { text-align:center; margin-top:18px; font-size:.8rem; color:var(--muted); }
.ltog span { color:var(--accent); cursor:pointer; font-weight:600; }

/* APP */
.app { display:flex; min-height:100vh; }
.sb { width:230px; min-height:100vh; background:var(--surface); border-right:1px solid var(--border);
  padding:24px 16px; display:flex; flex-direction:column; flex-shrink:0; position:sticky; top:0; height:100vh; overflow-y:auto; }
.sb-logo { font-size:1.35rem; font-weight:800; margin-bottom:28px; padding:0 8px; }
.sb-logo span { color:var(--accent); }
.sb-sec { font-size:.65rem; font-weight:600; color:var(--muted); letter-spacing:1.5px; text-transform:uppercase; padding:0 8px; margin-bottom:8px; }
.sb-item { display:flex; align-items:center; gap:9px; padding:9px 12px; border-radius:10px; cursor:pointer;
  font-size:.85rem; font-weight:600; color:var(--muted); transition:all .15s; margin-bottom:2px; }
.sb-item:hover { background:var(--surface2); color:var(--text); }
.sb-item.act { background:rgba(0,232,255,.1); color:var(--accent); }
.sb-bot { margin-top:auto; border-top:1px solid var(--border); padding-top:16px; }
.uc { display:flex; align-items:center; gap:9px; padding:9px 12px; border-radius:10px; background:var(--surface2); }
.uav { width:30px; height:30px; border-radius:50%; background:linear-gradient(135deg,var(--accent),#0070ff);
  display:flex; align-items:center; justify-content:center; font-weight:700; font-size:.75rem; color:#000; flex-shrink:0; }
.un { font-size:.8rem; font-weight:600; }
.ur { font-size:.68rem; color:var(--muted); font-family:var(--font-m); }
.lo { background:none; border:none; color:var(--muted); font-size:.75rem; cursor:pointer;
  margin-top:8px; padding:5px 12px; font-family:var(--font-h); }
.lo:hover { color:var(--text); }

/* MAIN */
.main { flex:1; padding:36px 44px; overflow-y:auto; }
.pt { font-size:1.9rem; font-weight:800; letter-spacing:-.5px; margin-bottom:6px; }
.ps { color:var(--muted); font-family:var(--font-m); font-size:.78rem; margin-bottom:32px; }

/* TEAMS */
.tg { display:grid; grid-template-columns:repeat(auto-fill,minmax(270px,1fr)); gap:18px; }
.tc { border-radius:16px; padding:26px; cursor:pointer; border:1px solid var(--border);
  background:var(--surface); transition:transform .2s, box-shadow .2s, border-color .2s; position:relative; overflow:hidden; }
.tc::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:var(--cc); opacity:.7; }
.tc:hover { transform:translateY(-4px); border-color:var(--cc); box-shadow:0 16px 40px rgba(0,0,0,.4); }
.te { font-size:2rem; margin-bottom:12px; display:block; }
.tn { font-size:1.05rem; font-weight:700; margin-bottom:5px; }
.ttag { font-size:.76rem; color:var(--muted); margin-bottom:14px; font-family:var(--font-m); }
.bps { display:flex; gap:5px; flex-wrap:wrap; }
.bp { font-size:.68rem; font-family:var(--font-m); padding:3px 9px; border-radius:20px;
  border:1px solid rgba(255,255,255,.08); background:rgba(255,255,255,.03); color:var(--muted); }
.tcta { display:inline-block; margin-top:16px; font-size:.75rem; font-weight:700; color:var(--cc); }

/* TEAM DETAIL */
.back { display:inline-flex; align-items:center; gap:5px; background:none; border:none;
  color:var(--muted); cursor:pointer; font-family:var(--font-h); font-size:.82rem; font-weight:600;
  margin-bottom:24px; padding:0; transition:color .15s; }
.back:hover { color:var(--text); }
.th { display:flex; align-items:center; gap:14px; margin-bottom:28px; padding:22px 26px;
  border-radius:14px; background:var(--surface); border:1px solid var(--border); }
.the { font-size:2.5rem; }
.thn { font-size:1.4rem; font-weight:800; }
.tht { font-size:.76rem; color:var(--muted); font-family:var(--font-m); }
.bg { display:grid; grid-template-columns:repeat(auto-fill,minmax(210px,1fr)); gap:14px; margin-bottom:28px; }
.bc { background:var(--surface); border:1px solid var(--border); border-radius:13px; padding:20px; cursor:pointer; transition:all .2s; }
.bc:hover,.bc.sel { border-color:var(--bc); background:var(--surface2); }
.bc.sel { box-shadow:0 0 0 1px var(--bc); }
.be { font-size:1.6rem; margin-bottom:8px; }
.bname { font-size:.95rem; font-weight:700; margin-bottom:3px; }
.brole { font-size:.7rem; font-family:var(--font-m); color:var(--bc); margin-bottom:7px; }
.bspec { font-size:.72rem; color:var(--muted); line-height:1.55; }
.cbtn { display:inline-block; margin-top:12px; padding:6px 13px; border-radius:8px;
  font-size:.72rem; font-weight:700; cursor:pointer; border:1px solid var(--bc);
  color:var(--bc); background:transparent; font-family:var(--font-h); transition:all .15s; }
.cbtn:hover { background:var(--bc); color:#000; }

/* CHAT */
.ca { display:flex; gap:20px; height:580px; }
.cp { flex:1; background:var(--surface); border:1px solid var(--border); border-radius:14px; display:flex; flex-direction:column; overflow:hidden; }
.ch { padding:14px 18px; border-bottom:1px solid var(--border); display:flex; align-items:center; gap:10px; }
.che { font-size:1.4rem; }
.chn { font-size:.9rem; font-weight:700; }
.chr { font-size:.68rem; font-family:var(--font-m); color:var(--muted); }
.cms { flex:1; overflow-y:auto; padding:18px; display:flex; flex-direction:column; gap:12px; }
.cms::-webkit-scrollbar { width:3px; }
.cms::-webkit-scrollbar-thumb { background:var(--border); border-radius:4px; }
.msg { display:flex; gap:8px; animation:fadeUp .3s ease; }
.msg.u { flex-direction:row-reverse; }
.mav { width:28px; height:28px; border-radius:50%; flex-shrink:0; display:flex;
  align-items:center; justify-content:center; font-size:.72rem; font-weight:700; }
.mb { max-width:80%; padding:9px 13px; border-radius:11px; font-size:.82rem; line-height:1.6; font-family:var(--font-m); }
.msg.b .mb { background:var(--surface2); color:var(--text); border-radius:4px 11px 11px 11px; }
.msg.u .mb { background:var(--accent); color:#000; font-weight:500; border-radius:11px 4px 11px 11px; }
.cir { padding:14px; border-top:1px solid var(--border); display:flex; gap:9px; }
.ci { flex:1; background:var(--surface2); border:1px solid var(--border); border-radius:9px;
  padding:10px 13px; color:var(--text); font-family:var(--font-m); font-size:.82rem;
  outline:none; resize:none; transition:border-color .2s; }
.ci:focus { border-color:var(--accent); }
.sb2 { padding:10px 16px; background:var(--accent); color:#000; font-weight:700; font-size:.82rem;
  border:none; border-radius:9px; cursor:pointer; font-family:var(--font-h); flex-shrink:0; transition:opacity .15s; }
.sb2:disabled { opacity:.35; cursor:not-allowed; }
.typing { display:flex; align-items:center; gap:4px; }
.typing s { display:block; width:5px; height:5px; border-radius:50%; background:var(--muted); animation:pulse 1.2s ease infinite; }
.typing s:nth-child(2){animation-delay:.2s}
.typing s:nth-child(3){animation-delay:.4s}

/* SUMMARY */
.sp { width:280px; background:var(--surface); border:1px solid var(--border); border-radius:14px; display:flex; flex-direction:column; overflow:hidden; flex-shrink:0; }
.sph { padding:14px 18px; border-bottom:1px solid var(--border); font-weight:700; font-size:.87rem; }
.sph small { display:block; font-size:.67rem; color:var(--muted); font-family:var(--font-m); font-weight:400; margin-top:2px; }
.spb { flex:1; overflow-y:auto; padding:14px; font-size:.78rem; line-height:1.7; color:var(--muted); font-family:var(--font-m); }
.es { text-align:center; color:var(--muted); font-size:.75rem; padding:36px 14px; }
.genbtn { display:inline-block; margin-top:14px; padding:7px 14px; border-radius:8px;
  font-size:.72rem; font-weight:700; cursor:pointer; border:1px solid var(--accent);
  color:var(--accent); background:transparent; font-family:var(--font-h); transition:all .15s; }
.genbtn:hover { background:var(--accent); color:#000; }
.nt { text-align:center; color:var(--muted); padding:50px 0; font-family:var(--font-m); font-size:.8rem; }

@media(max-width:860px){
  .main{padding:20px 16px;}
  .sb{display:none;}
  .ca{flex-direction:column;height:auto;}
  .sp{width:100%;height:280px;}
}
`;

function Login({ onLogin }) {
  const [reg, setReg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const go = (e) => { e.preventDefault(); if (email && pass) onLogin({ name: name || email.split("@")[0], email }); };
  return (
    <div className="lp">
      <style>{css}</style>
      <div className="lb fu">
        <div className="ll">Team<span>AI</span></div>
        <div className="ls">// your AI-powered team, on demand</div>
        {reg && <>
          <label className="llab">Your Name</label>
          <input className="linp" placeholder="Jane Doe" value={name} onChange={e => setName(e.target.value)} />
        </>}
        <label className="llab">Email</label>
        <input className="linp" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
        <label className="llab">Password</label>
        <input className="linp" type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && go(e)} />
        <button className="lbtn" onClick={go}>{reg ? "Create Account →" : "Sign In →"}</button>
        <div className="ltog">{reg ? "Have an account? " : "New here? "}<span onClick={() => setReg(!reg)}>{reg ? "Sign in" : "Register"}</span></div>
        <div style={{textAlign:"center", marginTop:"20px"}}>
          <span className="built-by">⚡ Built by Avinash</span>
        </div>
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

function ChatBot({ bot }) {
  const [msgs, setMsgs] = useState([{ role: "b", text: `Hi! I'm ${bot.name}, your ${bot.role}. How can I help?` }]);
  const [inp, setInp] = useState("");
  const [loading, setLoading] = useState(false);
  const end = useRef(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = async () => {
    if (!inp.trim() || loading) return;
    const q = inp.trim(); setInp(""); setLoading(true);
    setMsgs(m => [...m, { role: "u", text: q }]);
    try {
      const history = msgs.map(m => ({ role: m.role === "u" ? "user" : "assistant", content: m.text }));
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: bot.prompt,
          messages: [...history, { role: "user", content: q }]
        })
      });
      const d = await r.json();
      setMsgs(m => [...m, { role: "b", text: d.content?.[0]?.text || "Something went wrong." }]);
    } catch { setMsgs(m => [...m, { role: "b", text: "Connection error. Try again." }]); }
    setLoading(false);
  };

  return (
    <div className="cp">
      <div className="ch">
        <div className="che">{bot.emoji}</div>
        <div><div className="chn">{bot.name}</div><div className="chr" style={{ color: bot.color }}>{bot.role}</div></div>
      </div>
      <div className="cms">
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
        <div ref={end} />
      </div>
      <div className="cir">
        <textarea className="ci" rows={1} placeholder={`Ask ${bot.name}...`} value={inp}
          onChange={e => setInp(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} />
        <button className="sb2" onClick={send} disabled={loading || !inp.trim()}>Send</button>
      </div>
    </div>
  );
}

function Summary({ team, botChats }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const hasChats = Object.keys(botChats).length > 0;

  const generate = async () => {
    setLoading(true);
    const context = Object.entries(botChats).map(([name, msgs]) => {
      const last = msgs.filter(m => m.role === "b").slice(-1)[0]?.text || "";
      return `${name}: ${last}`;
    }).join("\n\n");
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          messages: [{ role: "user", content: `Summarize these AI bot conversations from the "${team.name}" into a combined action plan. Be concise.\n\n${context}` }]
        })
      });
      const d = await r.json();
      setText(d.content?.[0]?.text || "");
    } catch { setText("Error generating summary."); }
    setLoading(false);
  };

  return (
    <div className="sp">
      <div className="sph">📋 Team Summary<small>Combined insights from all bots</small></div>
      <div className="spb">
        {loading && <div style={{ textAlign: "center", paddingTop: 40 }}>Generating...</div>}
        {!loading && !text && (
          <div className="es">
            Chat with bots to generate a combined action plan.
            {hasChats && <div><button className="genbtn" onClick={generate}>✨ Generate Summary</button></div>}
          </div>
        )}
        {text && <div style={{ whiteSpace: "pre-wrap" }}>{text}</div>}
      </div>
    </div>
  );
}

function TeamView({ team, onBack }) {
  const [activeBot, setActiveBot] = useState(null);
  const [botChats] = useState({});

  return (
    <div>
      <button className="back" onClick={onBack}>← Back to Teams</button>
      <div className="th fu"><div className="the">{team.emoji}</div>
        <div><div className="thn">{team.name}</div><div className="tht" style={{ color: team.color }}>{team.tagline}</div></div>
      </div>
      <div style={{ fontSize: ".82rem", fontWeight: 700, color: "var(--muted)", marginBottom: 14, letterSpacing: ".5px" }}>CHOOSE A BOT</div>
      <div className="bg fu2">
        {team.bots.map(bot => (
          <div key={bot.id} className={`bc${activeBot?.id === bot.id ? " sel" : ""}`} style={{ "--bc": bot.color }}>
            <div className="be">{bot.emoji}</div>
            <div className="bname">{bot.name}</div>
            <div className="brole">{bot.role}</div>
            <div className="bspec">{bot.specialty}</div>
            <button className="cbtn" onClick={() => setActiveBot(bot)}>Chat →</button>
          </div>
        ))}
      </div>
      {activeBot
        ? <div className="ca fu3">
            <ChatBot key={activeBot.id} bot={activeBot} />
            <Summary team={team} botChats={botChats} />
          </div>
        : <div className="nt">// select a bot above to start chatting</div>
      }
    </div>
  );
}

function Teams({ onSelect }) {
  return (
    <div>
      <div className="pt fu">Find Your AI Team</div>
      <div className="ps fu2">// pick a domain · meet your bots · get to work</div>
      <div className="tg">
        {TEAMS.map((t, i) => (
          <div key={t.id} className="tc fu" style={{ "--cc": t.color, animationDelay: `${i * 0.07}s` }} onClick={() => onSelect(t)}>
            <span className="te">{t.emoji}</span>
            <div className="tn">{t.name}</div>
            <div className="ttag">{t.tagline}</div>
            <div className="bps">{t.bots.map(b => <span key={b.id} className="bp">{b.emoji} {b.name}</span>)}</div>
            <div className="tcta">Enter team →</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("teams");
  const [team, setTeam] = useState(null);

  if (!user) return <Login onLogin={u => setUser(u)} />;

  return (
    <div className="app">
      <style>{css}</style>
      <Sidebar user={user} page={page} setPage={setPage} team={team}
        onLogout={() => { setUser(null); setTeam(null); setPage("teams"); }} />
      <div className="main">
        {page === "teams" && <Teams onSelect={t => { setTeam(t); setPage("team"); }} />}
        {page === "team" && team && <TeamView team={team} onBack={() => setPage("teams")} />}
      </div>
    </div>
  );
}
