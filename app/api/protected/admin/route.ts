// app/api/protected/admin/route.ts
import { verifyToken } from "@/app/lib/auth";
import { NextResponse, NextRequest } from "next/server";

interface DecodedToken {
  id: string;
  role: string;
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = verifyToken(token) as DecodedToken | null;

  if (!decoded) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  if (decoded.role !== "admin") {
    return NextResponse.json(
      { error: "Forbidden: Admins only" },
      { status: 403 }
    );
  }

  return NextResponse.json({ message: "Welcome, Admin!" });
}
