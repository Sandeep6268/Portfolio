import { updateResource, deleteResource } from "@/lib/crud";

export const dynamic = "force-dynamic";

export async function PUT(req, { params }) {
  return updateResource(params.resource, params.id, req);
}

export async function DELETE(req, { params }) {
  return deleteResource(params.resource, params.id);
}
