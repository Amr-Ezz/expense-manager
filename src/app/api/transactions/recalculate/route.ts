// src/app/api/transactions/recalculate/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRate } from "@/lib/exchange";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId in request body" },
        { status: 400 }
      );
    }

    console.log(`🔄 Starting recalculation for user: ${userId}`);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { settings: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userCurrency = user.settings?.currency || "USD";
    console.log(`💰 User's preferred currency: ${userCurrency}`);

    const transactions = await prisma.transaction.findMany({
      where: { userId },
    });

    if (transactions.length === 0) {
      console.log("ℹ️ No transactions found for this user");
      return NextResponse.json(
        { message: "No transactions found for this user", currency: userCurrency },
        { status: 200 }
      );
    }

    console.log(`📊 Found ${transactions.length} transactions to recalculate`);

    const updatedTransactions = [];
    const errors = [];

    for (const tx of transactions) {
      const fromCurrency = tx.currency || "USD";

      try {
        // Skip conversion if currencies match
        if (fromCurrency === userCurrency) {
          const updatedTx = await prisma.transaction.update({
            where: { id: tx.id },
            data: {
              convertedAmount: tx.amount,
              convertedCurrency: userCurrency,
              rate: 1,
            },
          });

          console.log(`✅ Transaction ${tx.id}: ${tx.amount} ${fromCurrency} (no conversion needed)`);
          updatedTransactions.push(updatedTx);
          continue;
        }

        // Get exchange rate
        const rate = await getRate(fromCurrency, userCurrency);
        const convertedAmount = tx.amount * rate;

        const updatedTx = await prisma.transaction.update({
          where: { id: tx.id },
          data: {
            convertedAmount,
            convertedCurrency: userCurrency,
            rate,
          },
        });

        console.log(`✅ Transaction ${tx.id}: ${tx.amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${userCurrency} (rate: ${rate})`);
        updatedTransactions.push(updatedTx);

      } catch (err: any) {
        console.error(`❌ Error converting transaction ${tx.id} (${fromCurrency} -> ${userCurrency}):`, err.message);
        
        errors.push({
          transactionId: tx.id,
          fromCurrency,
          toCurrency: userCurrency,
          error: err.message
        });

        // Update with original amount if conversion fails
        try {
          await prisma.transaction.update({
            where: { id: tx.id },
            data: {
              convertedAmount: tx.amount,
              convertedCurrency: userCurrency,
              rate: 1,
            },
          });
          console.log(`⚠️ Transaction ${tx.id}: Fallback to original amount due to conversion error`);
        } catch (updateErr) {
          console.error(`❌ Failed to update transaction ${tx.id} with fallback:`, updateErr);
        }
      }
    }

    const response = {
      message: "Recalculation complete",
      currency: userCurrency,
      totalTransactions: transactions.length,
      successfullyConverted: updatedTransactions.length,
      errors: errors.length > 0 ? errors : undefined,
    };

    console.log(`✅ Recalculation complete:`, response);

    return NextResponse.json(response, { status: 200 });

  } catch (err: any) {
    console.error("❌ Currency recalculation error:", err);
    return NextResponse.json(
      { error: "Failed to recalculate currency", details: err.message },
      { status: 500 }
    );
  }
}