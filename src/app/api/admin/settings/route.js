import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import Settings from "@/models/Settings";
import { defaultSettings } from "@/lib/defaults";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  let settings = await Settings.findOne({ singleton: "main" }).lean();
  if (!settings) {
    const created = await Settings.create(defaultSettings());
    settings = created.toObject();
  }
  return NextResponse.json({ settings: JSON.parse(JSON.stringify(settings)) });
}

export async function PUT(req) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const body = await req.json();
  delete body._id;
  delete body.singleton;
  delete body.createdAt;
  delete body.updatedAt;
  delete body.__v;

  const updated = await Settings.findOneAndUpdate(
    { singleton: "main" },
    { $set: body },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return NextResponse.json({ settings: JSON.parse(JSON.stringify(updated)) });
}
