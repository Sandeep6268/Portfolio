import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import Message from "@/models/Message";

export const dynamic = "force-dynamic";

export async function PATCH(req, { params }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const body = await req.json();
  const updated = await Message.findByIdAndUpdate(
    params.id,
    { read: body.read !== false },
    { new: true }
  );
  if (!updated)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ item: JSON.parse(JSON.stringify(updated)) });
}

export async function DELETE(req, { params }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  await Message.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
