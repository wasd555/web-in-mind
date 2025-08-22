import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const directusUrl = process.env.DIRECTUS_URL || "http://localhost:8055";
  try {
    const json = await request.json();
    // Отправляем только разрешённые поля; роль/статус проставит Directus через Access Policies (Presets)
    const payload = {
      email: json?.email,
      password: json?.password,
      first_name: json?.first_name,
      last_name: json?.last_name,
    };

    const r = await fetch(`${directusUrl}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    // Проксируем ответ стримом как есть, чтобы не падать на парсинге
    const res = new Response(r.body, { status: r.status });
    const ct = r.headers.get("content-type");
    if (ct) res.headers.set("content-type", ct);
    return res as NextResponse;
  } catch (e) {
    return NextResponse.json({ errors: [{ message: "Register proxy failed" }] }, { status: 500 });
  }
}


