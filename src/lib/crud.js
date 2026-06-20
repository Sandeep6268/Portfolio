import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { deleteMedia } from "@/lib/cloudinary";

import Project from "@/models/Project";
import Skill from "@/models/Skill";
import Experience from "@/models/Experience";
import Service from "@/models/Service";
import Testimonial from "@/models/Testimonial";

/** Map URL resource segment -> mongoose model + media fields to clean up on delete. */
export const RESOURCES = {
  projects: { model: Project, mediaFields: ["media"] },
  skills: { model: Skill, mediaFields: [] },
  experiences: { model: Experience, mediaFields: [] },
  services: { model: Service, mediaFields: [] },
  testimonials: { model: Testimonial, mediaFields: ["avatar"] },
};

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

/** GET /api/admin/<resource> — list all (including disabled) for the admin. */
export async function listResource(resource) {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }
  const entry = RESOURCES[resource];
  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await connectDB();
  const items = await entry.model
    .find({})
    .sort({ order: 1, createdAt: 1 })
    .lean();
  return NextResponse.json({ items: JSON.parse(JSON.stringify(items)) });
}

/** POST /api/admin/<resource> — create one. */
export async function createResource(resource, req) {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }
  const entry = RESOURCES[resource];
  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await connectDB();
  const body = await req.json();
  delete body._id;
  const count = await entry.model.countDocuments();
  if (body.order == null) body.order = count;
  const created = await entry.model.create(body);
  return NextResponse.json({ item: JSON.parse(JSON.stringify(created)) }, { status: 201 });
}

/** PUT /api/admin/<resource>/<id> — update one. */
export async function updateResource(resource, id, req) {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }
  const entry = RESOURCES[resource];
  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await connectDB();
  const body = await req.json();
  delete body._id;
  const updated = await entry.model.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });
  if (!updated)
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  return NextResponse.json({ item: JSON.parse(JSON.stringify(updated)) });
}

/** DELETE /api/admin/<resource>/<id> — delete one + its cloudinary media. */
export async function deleteResource(resource, id) {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }
  const entry = RESOURCES[resource];
  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await connectDB();
  const doc = await entry.model.findById(id);
  if (!doc) return NextResponse.json({ error: "Item not found" }, { status: 404 });

  // cleanup attached cloudinary media
  for (const field of entry.mediaFields) {
    const m = doc[field];
    if (m && m.publicId) {
      await deleteMedia(m.publicId, m.type);
    }
  }
  await doc.deleteOne();
  return NextResponse.json({ ok: true });
}

/** POST /api/admin/<resource>/reorder — { ids: [...] } sets order by index. */
export async function reorderResource(resource, req) {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }
  const entry = RESOURCES[resource];
  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await connectDB();
  const { ids } = await req.json();
  if (!Array.isArray(ids))
    return NextResponse.json({ error: "ids array required" }, { status: 400 });
  await Promise.all(
    ids.map((id, idx) => entry.model.findByIdAndUpdate(id, { order: idx }))
  );
  return NextResponse.json({ ok: true });
}
