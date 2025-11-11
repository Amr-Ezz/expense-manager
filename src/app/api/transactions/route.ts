import { prisma } from "@/lib/prisma";
import { getRate } from "@/lib/exchange";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId, description, category, amount, type, date, currency } =
      await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        description,
        category,
        amount,
        type,
        date: date ? new Date(date) : new Date(),
        currency: currency || "USD",
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}
export async function GET(req: Request) {
    const {searchParams} = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return new Response(JSON.stringify({error: "Missing userId"}), {status: 400});
    }
    const transactions = await prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: "desc" },
    });
    return new Response(JSON.stringify(transactions), {status: 200});
}