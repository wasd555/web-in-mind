export async function loginUser(email: string, password: string): Promise<void> {
    const res = await fetch("http://localhost:8055/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.errors?.[0]?.message || "Ошибка входа");
    }
}

export async function logoutUser() {
    const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
    });
    if (!res.ok) throw new Error("Не удалось выполнить logout");
}