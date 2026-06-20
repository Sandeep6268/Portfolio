import { reorderResource } from "@/lib/crud";

export const dynamic = "force-dynamic";

export async function POST(req, { params }) {
  return reorderResource(params.resource, req);
}
