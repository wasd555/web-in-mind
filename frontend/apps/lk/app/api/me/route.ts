import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const inCookie = request.headers.get("cookie") || "";
  const reqUrl = new URL(request.url);
  const fields = reqUrl.searchParams.get("fields");
  // Собираем cookie для Directus из наших app_* кук
  const map = Object.fromEntries(
    inCookie
      .split(";")
      .map((c) => c.trim())
      .filter(Boolean)
      .map((c) => {
        const i = c.indexOf("=");
        if (i === -1) return [c, ""];
        return [decodeURIComponent(c.slice(0, i)), decodeURIComponent(c.slice(i + 1))];
      })
  );
  const sess = map["app_directus_session"];
  const refresh = map["app_directus_refresh_token"];
  const access = map["app_directus_access_token"];
  // Authorization предпочтительнее cookie для доступа
  const directusUrl = process.env.DIRECTUS_URL || "http://localhost:8055";
  try {
    // 1) Если есть access — используем Authorization
    if (access) {
      const r = await fetch(`${directusUrl}/users/me${fields ? `?fields=${encodeURIComponent(fields)}` : ""}`, {
        headers: { Authorization: `Bearer ${access}` },
        cache: "no-store",
      });
      if (r.ok) {
        const body = await r.text();
        return new NextResponse(body || "{}", { status: 200 });
      }
    }

    // 2) Иначе пробуем по session cookie
    if (sess) {
      const r = await fetch(`${directusUrl}/users/me${fields ? `?fields=${encodeURIComponent(fields)}` : ""}`, {
        headers: { cookie: `directus_session=${sess}` },
        cache: "no-store",
      });
      if (r.ok) {
        const body = await r.text();
        return new NextResponse(body || "{}", { status: 200 });
      }
    }

    // 3) Рефреш по refresh_token, если есть
    if (refresh) {
      try {
        const rr = await fetch(`${directusUrl}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refresh }),
          cache: "no-store",
        });
        if (rr.ok) {
          const txt = await rr.text();
          let json: any = {};
          try { json = txt ? JSON.parse(txt) : {}; } catch { json = {}; }
          const newAccess = json?.data?.access_token || json?.access_token;
          if (newAccess) {
            const me = await fetch(`${directusUrl}/users/me${fields ? `?fields=${encodeURIComponent(fields)}` : ""}`, {
              headers: { Authorization: `Bearer ${newAccess}` },
              cache: "no-store",
            });
            const body = await me.text();
            const res = new NextResponse(body || "{}", { status: me.status });
            if (me.ok) {
              res.cookies.set({ name: "app_directus_access_token", value: newAccess, httpOnly: true, sameSite: "lax", path: "/" });
            }
            return res;
          }
        }
      } catch {}
    }

    return new NextResponse("Unauthorized", { status: 401 });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}


