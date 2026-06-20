import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Message from "@/models/Message";
import Settings from "@/models/Settings";
import { sendContactEmail } from "@/lib/mailer";

export const dynamic = "force-dynamic";

// Public: receive a contact form submission, store it, and email a notification.
export async function POST(req) {
  try {
    const body = await req.json();
    const name = (body.name || "").toString().trim();
    const email = (body.email || "").toString().trim();
    const subject = (body.subject || "").toString().trim();
    const message = (body.message || "").toString().trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email and message are required." },
        { status: 400 }
      );
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }

    await connectDB();
    await Message.create({ name, email, subject, message });

    // try to send the email; don't fail the request if SMTP hiccups
    try {
      const settings = await Settings.findOne({ singleton: "main" }).lean();
      await sendContactEmail({ name, email, subject, message }, settings);
    } catch (mailErr) {
      console.warn("[api/contact] email send failed:", mailErr?.message);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/contact]", e);
    return NextResponse.json(
      { error: "Failed to send message." },
      { status: 500 }
    );
  }
}
