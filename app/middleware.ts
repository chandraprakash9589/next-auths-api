// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { verifyToken } from "./lib/auth";

// export function middleware(req: NextRequest) {
//   const token = req.headers.get("authorization")?.split(" ")[1];

//   // Protect only specific APIs
//   if (req.nextUrl.pathname.startsWith("/api/protected")) {
//     if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const decoded = verifyToken(token);
//     if (!decoded) {
//       return NextResponse.json({ error: "Invalid token" }, { status: 403 });
//     }
//   }
//   return NextResponse.next();
// }
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

export function middleware(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];

  // Protect only specific APIs
  if (req.nextUrl.pathname.startsWith("/api/protected")) {
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    // 🔹 Example: only allow admins
    if (req.nextUrl.pathname === "/api/protected/admin") {
      if (decoded.role !== "admin") {
        return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
      }
    }
  }

  return NextResponse.next();
}
