import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "@/app/lib/db";
import { User } from "@/app/lib/userModel";


export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashed });
    await newUser.save();

    return NextResponse.json({ message: "User registered successfully" });
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
