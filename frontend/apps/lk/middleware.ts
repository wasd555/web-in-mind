import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function isAuthenticated(req: NextRequest): Promise<boolean> {
  const cookie = req.headers.get("cookie") || "";
  const origin = req.nextUrl.origin;
  try {
    const res = await fetch(`${origin}/api/me`, {
      headers: { cookie },
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const path = url.pathname;

  // Если уже авторизован и идёт на /login или /register — отправляем в /dashboard
  if (path === "/login" || path === "/register") {
    const ok = await isAuthenticated(req);
    if (ok) {
      const dash = new URL("/dashboard", req.url);
      return NextResponse.redirect(dash);
    }
    return NextResponse.next();
  }

  const protectedPaths = [
    "/dashboard",
    "/videos",
    "/video",
    "/profile",
    "/subscription",
  ];

  const isProtected = protectedPaths.some((p) => path === p || path.startsWith(p + "/"));
  if (!isProtected) return NextResponse.next();

  const ok = await isAuthenticated(req);
  if (!ok) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/dashboard/:path*",
    "/videos/:path*",
    "/video/:path*",
    "/profile/:path*",
    "/subscription/:path*",
  ],
};


