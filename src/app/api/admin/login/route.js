import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
import { createToken, setAuthCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    await connectDB();
    const normalized = email.toLowerCase().trim();
    let admin = await Admin.findOne({ email: normalized });

    // Bootstrap: if no admin exists yet, create one from env on first login attempt.
    if (!admin) {
      const adminCount = await Admin.countDocuments();
      if (adminCount === 0 && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
        const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
        admin = await Admin.create({
          email: process.env.ADMIN_EMAIL.toLowerCase().trim(),
          passwordHash: hash,
          name: "Admin",
        });
        // re-fetch by requested email in case it differs from env
        if (admin.email !== normalized) {
          admin = await Admin.findOne({ email: normalized });
        }
      }
    }

    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const token = await createToken({ id: admin._id.toString(), email: admin.email });
    await setAuthCookie(token);

    return NextResponse.json({ ok: true, email: admin.email, name: admin.name });
  } catch (e) {
    console.error("[api/admin/login]", e);
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
