import { prisma } from "@/lib/prisma";
import { getRate } from "@/lib/exchange";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { settings: true },
  });

  const userCurrency = user?.settings?.currency || "USD";
  const transactions = await prisma.transaction.findMany({ where: { userId } });

  for (const tx of transactions) {
    const rate = await getRate(tx.currency, userCurrency);
    await prisma.transaction.update({
      where: { id: tx.id },
      data: {
        convertedAmount: tx.amount * rate,
        convertedCurrency: userCurrency,
        rate,
      },
    });
  }

  return NextResponse.json({ message: "Recalculated successfully" });
}
