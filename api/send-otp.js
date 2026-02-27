// api/send-otp.js
// Stores OTP in memory (use Redis/DB for production)
const otpStore = {};

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  const otp = generateOTP();
  const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
  otpStore[email.toLowerCase()] = { otp, expires, attempts: 0 };

  try {
    // Send email via Resend
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "TeamAI <noreply@teamai.app>",
        to: email,
        subject: "Your TeamAI verification code",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;background:#060a0e;color:#e8edf2;padding:40px;border-radius:16px;">
            <div style="font-size:28px;font-weight:800;margin-bottom:8px;">Team<span style="color:#00e8ff">AI</span></div>
            <div style="color:#5a6a7a;font-size:13px;margin-bottom:32px;">Multi-agent AI collaboration platform</div>
            <div style="font-size:15px;margin-bottom:20px;">Your verification code is:</div>
            <div style="font-size:48px;font-weight:800;letter-spacing:12px;color:#00e8ff;
              background:rgba(0,232,255,.08);border:1px solid rgba(0,232,255,.2);
              border-radius:12px;padding:20px;text-align:center;margin-bottom:20px;">
              ${otp}
            </div>
            <div style="color:#5a6a7a;font-size:13px;">This code expires in 10 minutes. Do not share it with anyone.</div>
            <div style="margin-top:32px;color:#3a4a5a;font-size:12px;">Built by Avinash</div>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("Resend error:", err);
      return res.status(500).json({ error: "Failed to send email" });
    }

    return res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP error:", error);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
}
