import { prisma } from "@/lib/prisma";
import { getRate } from "@/lib/exchange";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount, currency, userCurrency, userId } = await req.json();

    if (!amount || !currency || !userCurrency || !userId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const rate = await getRate(currency, userCurrency);
    const convertedAmount = amount * rate;

    const transaction = await prisma.transaction.create({
      data: {
        amount,
        currency,
        convertedAmount,
        convertedCurrency: userCurrency,
        rate,
        userId,
      },
    });

    return NextResponse.json(transaction);
  } catch (error: any) {
    console.error("Error creating transaction:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
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