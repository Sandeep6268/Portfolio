import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const session = await requireAdmin();
    const { currentPassword, newPassword } = await req.json();
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters." },
        { status: 400 }
      );
    }
    await connectDB();
    const admin = await Admin.findById(session.id);
    if (!admin) {
      return NextResponse.json({ error: "Admin not found." }, { status: 404 });
    }
    const ok = await bcrypt.compare(currentPassword || "", admin.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 401 }
      );
    }
    admin.passwordHash = await bcrypt.hash(newPassword, 10);
    await admin.save();
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e.status === 401)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    console.error("[api/admin/password]", e);
    return NextResponse.json({ error: "Failed." }, { status: 500 });
  }
}
