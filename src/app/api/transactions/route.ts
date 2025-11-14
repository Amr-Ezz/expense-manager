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

    // Fetch user's preferred currency from settings
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { settings: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userPreferredCurrency = user.settings?.currency || "USD";
    const transactionCurrency = currency || userPreferredCurrency;

    // Calculate converted amount based on user's preferred currency
    let convertedAmount = amount;
    let rate = 1;

    if (transactionCurrency !== userPreferredCurrency) {
      // Only convert if currencies are different
      try {
        rate = await getRate(transactionCurrency, userPreferredCurrency);
        convertedAmount = amount * rate;
      } catch (error) {
        console.error(`Failed to get rate ${transactionCurrency} -> ${userPreferredCurrency}:`, error);
        // Fall back to original amount if rate fetch fails
        convertedAmount = amount;
        rate = 1;
      }
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        description,
        category,
        amount,
        type,
        date: date ? new Date(date) : new Date(),
        currency: transactionCurrency, // Original currency
        convertedAmount, // Amount in user's preferred currency
        convertedCurrency: userPreferredCurrency,
        rate,
      },
    });

    console.log(`✅ Transaction created: ${amount} ${transactionCurrency} = ${convertedAmount} ${userPreferredCurrency} (rate: ${rate})`);

    return NextResponse.json(transaction, { status: 201 });

  } catch (error) {
    console.error("❌ Error creating transaction:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing userId" }), { status: 400 });
  }
  
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });
  
  return new Response(JSON.stringify(transactions), { status: 200 });
}