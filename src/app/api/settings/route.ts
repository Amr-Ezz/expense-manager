import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const {searchParams} = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return new Response(JSON.stringify({error: "Missing userId"}), {status: 400});
    }
    const settings = await prisma.userSettings.findUnique({
        where: { userId }
    });
    if (!settings) {
        return new Response(JSON.stringify({error: "Settings not found"}), {status: 404});
    }
    return new Response(JSON.stringify(settings), {status: 200});
}
export async function PUT(req: Request) {
    const {userId, ...updates} = await req.json();

    if (!userId) {
        return new Response(JSON.stringify({error: "Missing userId"}), {status: 400});
    }
    try {
        const updatedSettings = await prisma.userSettings.upsert({
            where: { userId },
            update: updates,
            create: { userId, ...updates },
        });
        return new Response(JSON.stringify(updatedSettings), {status: 200});
    } catch (error) {
        return new Response(JSON.stringify({error: "Internal Server Error"}), {status: 500});
    }
}