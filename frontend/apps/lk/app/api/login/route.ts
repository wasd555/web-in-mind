import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const directusUrl = process.env.DIRECTUS_URL || "http://localhost:8055";

  try {
    const body = await request.text();
    const r = await fetch(`${directusUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
      cache: "no-store",
      redirect: "manual",
    });

    const responseText = await r.text();
    let responseJson: any = {};
    try { responseJson = responseText ? JSON.parse(responseText) : {}; } catch { responseJson = {}; }
    const res = new NextResponse(responseText || "{}", { status: r.status });

    // Парсим directus куки и сохраняем их в наши app_* куки, чтобы не пересекаться с админкой Directus
    // @ts-ignore
    const raw = r.headers?.raw?.();
    // @ts-ignore
    const setCookies: string[] | undefined = raw?.["set-cookie"];
    const pairs: Record<string, string> = {};
    const list = Array.isArray(setCookies) ? setCookies : (r.headers.get("set-cookie") ? [r.headers.get("set-cookie") as string] : []);
    for (const c of list) {
      if (!c) continue;
      const segs = c.split(";");
      if (!segs.length) continue;
      const nv = segs[0];
      if (!nv) continue;
      const idx = nv.indexOf("=");
      if (idx === -1) continue;
      const name = nv.slice(0, idx).trim();
      const value = nv.slice(idx + 1).trim();
      if (!name) continue;
      pairs[name] = value;
    }

    const sess = pairs["directus_session"]; // signed session id
    const refresh = pairs["directus_refresh_token"] || responseJson?.data?.refresh_token || responseJson?.refresh_token || undefined; // refresh token
    const access = responseJson?.data?.access_token || responseJson?.access_token;

    if (sess) {
      res.cookies.set({ name: "app_directus_session", value: sess, httpOnly: true, sameSite: "lax", path: "/" });
    }
    if (refresh) {
      res.cookies.set({ name: "app_directus_refresh_token", value: refresh, httpOnly: true, sameSite: "lax", path: "/" });
    }
    if (access) {
      res.cookies.set({ name: "app_directus_access_token", value: access, httpOnly: true, sameSite: "lax", path: "/" });
    }

    return res;
  } catch (e) {
    return NextResponse.json({ errors: [{ message: "Login proxy failed" }] }, { status: 500 });
  }
}


