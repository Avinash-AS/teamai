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

  const { system, messages, stream } = req.body;

  // Convert Anthropic-style messages → Gemini format
  // Gemini uses "user" / "model" (not "assistant")
  const geminiContents = messages.map(m => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }]
  }));

  const body = {
    ...(system ? { system_instruction: { parts: [{ text: system }] } } : {}),
    contents: geminiContents,
    generationConfig: { maxOutputTokens: 2000, temperature: 0.7 }
  };

  try {
    if (stream) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:streamGenerateContent?alt=sse&key=${apiKey}`;
      const geminiRes = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!geminiRes.ok) {
        const err = await geminiRes.json().catch(() => ({}));
        return res.status(geminiRes.status).json({
          error: err.error?.message || "Gemini API error",
          hint: geminiRes.status === 403 ? "Invalid API key" : geminiRes.status === 429 ? "Rate limit — wait a moment" : ""
        });
      }

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const reader = geminiRes.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n")) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                // Re-emit in Anthropic-compatible format (App.jsx stays unchanged)
                res.write(`data: ${JSON.stringify({ type: "content_block_delta", delta: { text } })}\n\n`);
              }
            } catch {}
          }
        }
      }
      res.write("data: [DONE]\n\n");
      res.end();

    } else {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`;
      const geminiRes = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await geminiRes.json();

      if (!geminiRes.ok) {
        return res.status(geminiRes.status).json({
          error: data.error?.message || "Gemini API error",
          hint: geminiRes.status === 403 ? "Invalid API key — check GEMINI_API_KEY in Vercel env vars" :
                geminiRes.status === 429 ? "Free tier rate limit hit — wait 1 minute and retry" : ""
        });
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";

      // Return in Anthropic-compatible format — App.jsx works with zero changes
      return res.status(200).json({ content: [{ type: "text", text }] });
    }

  } catch (error) {
    console.error("Handler error:", error);
    return res.status(500).json({ error: error.message });
  }
}
