import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const inCookie = request.headers.get("cookie") || "";
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
  const cookie = [
    access ? `directus_access_token=${access}` : null,
    sess ? `directus_session=${sess}` : null,
    refresh ? `directus_refresh_token=${refresh}` : null,
  ].filter(Boolean).join("; ");
  const directusUrl = process.env.DIRECTUS_URL || "http://localhost:8055";

  try {
    // Извлекаем refresh token из куки и передаём явно в payload — Directus этого требует
    const cookieMap = Object.fromEntries(
      cookie
        .split(";")
        .map((c) => c.trim())
        .filter(Boolean)
        .map((c) => {
          const idx = c.indexOf("=");
          if (idx === -1) return [c, ""];
          const k = decodeURIComponent(c.slice(0, idx));
          const v = decodeURIComponent(c.slice(idx + 1));
          return [k, v];
        })
    );

    const refreshToken = cookieMap["directus_refresh_token"] || cookieMap["refresh_token"] || refresh || "";

    const r = await fetch(`${directusUrl}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: cookie,
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
      cache: "no-store",
      redirect: "manual",
    });

    const res = new NextResponse(JSON.stringify({ ok: true }), { status: 200 });

    // Прокидываем ВСЕ Set-Cookie от Directus, чтобы куки точно погасли
    // @ts-ignore - raw() доступен в node runtime
    const raw = r.headers?.raw?.();
    // @ts-ignore
    const setCookies: string[] | undefined = raw?.["set-cookie"];

    if (Array.isArray(setCookies)) {
      for (const c of setCookies) {
        res.headers.append("set-cookie", c);
      }
    } else {
      const single = r.headers.get("set-cookie");
      if (single) res.headers.append("set-cookie", single);
    }

    // Явно гасим типичные directus куки на localhost
    const toClear = [
      "directus_session",
      "directus_refresh_token",
      "directus_access_token",
      "access_token",
      "refresh_token",
      // Наши app_*
      "app_directus_session",
      "app_directus_refresh_token",
      "app_directus_access_token",
    ];
    for (const name of toClear) {
      res.cookies.set({
        name,
        value: "",
        maxAge: 0,
        path: "/",
        httpOnly: true,
        sameSite: "lax",
      });
      // Вариант с указанием домена 'localhost'
      const variants = [
        `Max-Age=0; Path=/; HttpOnly; SameSite=Lax`,
        `Max-Age=0; Path=/; HttpOnly; SameSite=None; Secure`,
        `Max-Age=0; Path=/; HttpOnly; SameSite=Lax; Domain=localhost`,
        `Max-Age=0; Path=/; HttpOnly; SameSite=None; Secure; Domain=localhost`,
        `Max-Age=0; Path=/; HttpOnly; SameSite=Lax; Domain=127.0.0.1`,
        `Max-Age=0; Path=/; HttpOnly; SameSite=None; Secure; Domain=127.0.0.1`,
      ];
      for (const v of variants) {
        res.headers.append("set-cookie", `${name}=; ${v}`);
      }
    }

    return res;
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}


