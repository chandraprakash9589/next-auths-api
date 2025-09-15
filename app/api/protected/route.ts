// app/api/protected/route.ts
import { verifyToken } from "@/app/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: "Invalid token" }, { status: 403 });

  return NextResponse.json({ message: "You accessed a protected route!" });
}
