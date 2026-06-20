import { NextResponse } from "next/server";
import { getPortfolioData } from "@/lib/getData";

export const dynamic = "force-dynamic";

// Public: returns all enabled content for the portfolio.
export async function GET() {
  try {
    const data = await getPortfolioData();
    return NextResponse.json(data);
  } catch (e) {
    console.error("[api/portfolio]", e);
    return NextResponse.json(
      { error: "Failed to load portfolio data" },
      { status: 500 }
    );
  }
}
