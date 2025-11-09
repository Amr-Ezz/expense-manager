import { NextResponse } from "next/server";
import { getRate } from "@/lib/exchange";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from || !to) {
    return NextResponse.json({ error: "Missing 'from' or 'to' parameters" }, { status: 400 });
  }

  try {
    const rate = await getRate(from.toUpperCase(), to.toUpperCase());
    return NextResponse.json({ rate });
  } catch (err: any) {
    console.error("Exchange API error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch exchange rate" }, { status: 500 });
  }
}
