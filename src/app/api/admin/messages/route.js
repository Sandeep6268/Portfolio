import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import Message from "@/models/Message";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const items = await Message.find({}).sort({ createdAt: -1 }).lean();
  const unread = items.filter((m) => !m.read).length;
  return NextResponse.json({
    items: JSON.parse(JSON.stringify(items)),
    unread,
  });
}
