import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { username, email, password, fullName, dateOfBirth } = await req.json();

    if (!username || !email || !password || !fullName || !dateOfBirth) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { name: username }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Operative ID or Email already registered" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: username,
        email,
        password: hashedPassword,
        fullName,
        dateOfBirth,
      },
    });

    return NextResponse.json(
      { message: "Account initialized successfully", user: { id: user.id, name: user.name, email: user.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "System failure during registration" },
      { status: 500 }
    );
  }
}
