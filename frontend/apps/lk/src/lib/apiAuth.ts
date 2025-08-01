export async function loginUser(email: string, password: string): Promise<string> {
    const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Ошибка входа");
    }

    const data = await res.json();
    localStorage.setItem("token", data.token); // Сохраняем JWT
    return data.token;
}

export function logoutUser() {
    localStorage.removeItem("token");
}