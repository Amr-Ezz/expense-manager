import { prisma } from "@/lib/prisma";

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