import nodemailer from "nodemailer";

/**
 * Build a transporter from admin Settings.smtp overrides, falling back to env.
 */
function resolveSmtp(settings) {
  const s = settings?.smtp || {};
  return {
    host: s.host || process.env.SMTP_HOST,
    port: Number(s.port || process.env.SMTP_PORT || 587),
    secure:
      typeof s.secure === "boolean"
        ? s.secure
        : process.env.SMTP_SECURE === "true",
    user: s.user || process.env.SMTP_USER,
    pass: s.pass || process.env.SMTP_PASS,
    fromEmail: s.fromEmail || process.env.SMTP_FROM_EMAIL || s.user || process.env.SMTP_USER,
    notifyEmail:
      s.notifyEmail ||
      settings?.contact?.email ||
      process.env.SMTP_USER,
  };
}

export async function sendContactEmail({ name, email, subject, message }, settings) {
  const cfg = resolveSmtp(settings);
  if (!cfg.host || !cfg.user || !cfg.pass) {
    throw new Error("SMTP is not configured");
  }

  const transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: { user: cfg.user, pass: cfg.pass },
  });

  const safe = (v) => String(v || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:auto;background:#1e1e1e;color:#f0f0f0;padding:24px;border-radius:12px;border:1px solid #333">
      <h2 style="color:#8189ff;margin-top:0">New Portfolio Message</h2>
      <p><strong>Name:</strong> ${safe(name)}</p>
      <p><strong>Email:</strong> ${safe(email)}</p>
      <p><strong>Subject:</strong> ${safe(subject)}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space:pre-wrap;background:#121212;padding:12px;border-radius:8px;border:1px solid #333">${safe(message)}</p>
    </div>`;

  await transporter.sendMail({
    from: `"Portfolio Contact" <${cfg.fromEmail}>`,
    to: cfg.notifyEmail,
    replyTo: email,
    subject: `[Portfolio] ${subject || "New message"} — from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
    html,
  });

  return true;
}

export default sendContactEmail;
