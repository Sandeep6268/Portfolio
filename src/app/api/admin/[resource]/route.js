import { listResource, createResource } from "@/lib/crud";

export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  return listResource(params.resource);
}

export async function POST(req, { params }) {
  return createResource(params.resource, req);
}
