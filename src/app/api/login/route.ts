import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  try {
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Missing email or password" }),
        { status: 400 }
      );
    }
    const user = await prisma.user.findUnique({
      where: { email },
      include: { settings: true },
    });
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        { status: 401 }
      );
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        { status: 401 }
      );
    }
    const { password: _, ...userWithoutPassword } = user;
    return new Response(JSON.stringify({ user: userWithoutPassword }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
