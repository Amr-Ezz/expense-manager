import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    console.log("🧩 Login attempt:", { email, password });

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    // Force-trim and lowercase email
    const cleanedEmail = email.trim().toLowerCase();

    // Find user by email
    const user = await prisma.user.findFirst({
      where: {
        email: { equals: cleanedEmail, mode: "insensitive" }, // case-insensitive search
      },
    });

    console.log("🔍 Found user:", user ? user.email : "none");

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    console.log("✅ Password valid:", isValid);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: "Login successful", user: userWithoutPassword },
      { status: 200 }
    );
  } catch (error) {
    console.error("💥 Login error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
