export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "GEMINI_API_KEY is not configured",
      hint: "Add GEMINI_API_KEY in Vercel → Settings → Environment Variables, then redeploy"
    });
  }

  const { system, messages } = req.body;

  // Convert to Gemini format
  const geminiContents = messages.map(m => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }]
  }));

  const body = {
    ...(system ? { system_instruction: { parts: [{ text: system }] } } : {}),
    contents: geminiContents,
    generationConfig: { maxOutputTokens: 2000, temperature: 0.7 }
  };

  // Try models in order — first free one that works wins
  const MODELS = [
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
  ];

  // Helper: sleep ms
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  // Helper: call one model with retry
  async function tryModel(model, retries = 2) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    for (let attempt = 0; attempt <= retries; attempt++) {
      if (attempt > 0) await sleep(1500 * attempt); // wait before retry
      const geminiRes = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await geminiRes.json();
      if (geminiRes.ok) {
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return { ok: true, text };
      }
      // 429 = rate limit → retry or next model
      if (geminiRes.status === 429) {
        if (attempt < retries) continue;
        return { ok: false, status: 429, error: data.error?.message };
      }
      // 403 = bad key
      if (geminiRes.status === 403) {
        return { ok: false, status: 403, error: "Invalid API key — go to aistudio.google.com/app/apikey and create a new key in a NEW project, then update GEMINI_API_KEY in Vercel" };
      }
      return { ok: false, status: geminiRes.status, error: data.error?.message };
    }
    return { ok: false, status: 429, error: "Rate limit on all retries" };
  }

  // Try each model until one works
  let lastError = "";
  for (const model of MODELS) {
    const result = await tryModel(model);
    if (result.ok) {
      return res.status(200).json({ content: [{ type: "text", text: result.text }] });
    }
    lastError = result.error || `Failed on ${model}`;
    // If bad key, no point trying other models
    if (result.status === 403) {
      return res.status(403).json({ error: lastError, hint: "Create a fresh API key at aistudio.google.com/app/apikey" });
    }
    // If rate limit, try next model
    if (result.status === 429) continue;
    // Other errors — stop
    break;
  }

  return res.status(429).json({
    error: lastError,
    hint: "All models rate limited. Wait 1 minute and try again, or create a new API key at aistudio.google.com/app/apikey — make sure to choose 'Create API key in new project'"
  });
}
