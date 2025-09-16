import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "@/app/lib/db";
import { User } from "@/app/lib/userModel";
import { signToken } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = signToken({ id: user._id.toString(), role: user.role });

    return NextResponse.json({ token });
  } catch {
  return NextResponse.json({ error: "Login failed" }, { status: 500 });
}
}
