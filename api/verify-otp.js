// api/verify-otp.js
// Must share same otpStore — in production use Redis or a DB
// For Vercel serverless, import from a shared module or use Upstash Redis
const otpStore = global._otpStore || (global._otpStore = {});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: "Email and OTP required" });

  const key = email.toLowerCase();
  const record = otpStore[key];

  if (!record) return res.status(400).json({ error: "No OTP found. Please request a new code." });
  if (Date.now() > record.expires) {
    delete otpStore[key];
    return res.status(400).json({ error: "OTP has expired. Please request a new code." });
  }
  if (record.attempts >= 5) {
    delete otpStore[key];
    return res.status(400).json({ error: "Too many attempts. Please request a new code." });
  }
  if (record.otp !== otp.trim()) {
    otpStore[key].attempts += 1;
    return res.status(400).json({ error: `Incorrect code. ${5 - record.attempts} attempts remaining.` });
  }

  delete otpStore[key];
  return res.status(200).json({ success: true, message: "Verified successfully" });
}
