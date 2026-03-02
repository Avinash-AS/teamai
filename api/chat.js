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

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  // Try both v1 and v1beta for each model
  const ATTEMPTS = [
    { version: "v1beta", model: "gemini-2.0-flash-lite" },
    { version: "v1beta", model: "gemini-1.5-flash" },
    { version: "v1",     model: "gemini-1.5-flash" },
    { version: "v1beta", model: "gemini-1.5-flash-8b" },
    { version: "v1",     model: "gemini-1.5-flash-8b" },
    { version: "v1",     model: "gemini-pro" },
  ];

  let lastError = "";

  for (const { version, model } of ATTEMPTS) {
    try {
      const url = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${apiKey}`;
      const geminiRes = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await geminiRes.json();

      if (geminiRes.ok) {
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return res.status(200).json({ content: [{ type: "text", text }] });
        }
      }

      const errMsg = data.error?.message || "";
      lastError = errMsg;

      // Bad API key — stop immediately
      if (geminiRes.status === 400 && errMsg.includes("API key not valid")) {
        return res.status(403).json({
          error: "Invalid API key",
          hint: "Your GEMINI_API_KEY is wrong. Go to aistudio.google.com/app/apikey → Create API key in new project → update in Vercel env vars → redeploy"
        });
      }

      // Model not found or rate limit — try next
      if (geminiRes.status === 404 || geminiRes.status === 429) {
        await sleep(300);
        continue;
      }

      // Any other error — try next
      continue;

    } catch (e) {
      lastError = e.message;
      continue;
    }
  }

  // All failed
  return res.status(500).json({
    error: lastError || "All models failed",
    hint: "Go to aistudio.google.com/app/apikey → click 'Create API key' → choose 'Create API key in NEW project' → paste new key in Vercel → redeploy"
  });
}
