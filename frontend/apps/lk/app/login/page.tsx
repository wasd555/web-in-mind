"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../../src/lib/apiAuth";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            router.replace("/dashboard");
        }
    }, [router]);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        try {
            await loginUser(email, password);
            window.dispatchEvent(new Event("storage"));
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-96px)] px-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md transform transition-all hover:scale-[1.01] duration-200">
                <h2 className="text-3xl font-extrabold text-center mb-6 text-green-700">
                    Вход
                </h2>
                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                <form className="flex flex-col" onSubmit={handleLogin}>
                    <div className="mb-5">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Введите ваш email"
                            className="block w-full rounded-lg border-gray-300 p-3 shadow-sm focus:border-green-400 focus:ring-green-400 transition-colors"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Пароль
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Введите пароль"
                            className="block w-full rounded-lg border-gray-300 p-3 shadow-sm focus:border-green-400 focus:ring-green-400 transition-colors"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 hover:scale-[1.02] transition-transform duration-200 font-semibold shadow-md"
                    >
                        Войти
                    </button>
                </form>
                <p className="text-sm text-center mt-6 text-gray-600">
                    Нет аккаунта?{" "}
                    <a
                        href="/register"
                        className="text-blue-500 hover:underline font-medium"
                    >
                        Зарегистрируйтесь
                    </a>
                </p>
            </div>
        </div>
    );
}