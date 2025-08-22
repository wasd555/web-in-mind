import { headers } from "next/headers";

export async function getUser() {
    const incomingHeaders = await headers();
    const cookie = incomingHeaders.get("cookie") || "";
    const origin = process.env.NEXT_PUBLIC_APP_ORIGIN || "http://localhost:3002";
    const url = new URL("/api/me", origin);
    url.searchParams.set(
        "fields",
        [
            "id",
            "email",
            "first_name",
            "last_name",
            "avatar",
            "role.name",
        ].join(",")
    );
    const res = await fetch(url.toString(), {
        headers: { cookie },
        cache: "no-store",
    });
    if (!res.ok) return null;
    const raw = await res.json();
    const user = raw?.data ?? raw;
    return user;
}