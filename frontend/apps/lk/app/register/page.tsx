"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Пароли не совпадают");
            return;
        }

        try {
            const res = await fetch("http://localhost:8000/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Ошибка регистрации");
            }

            setSuccess("Регистрация успешна! Переход на страницу входа...");
            setTimeout(() => router.push("/login"), 1500);
        } catch (err: any) {
            setError(err.message);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-96px)] px-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md transform transition-all hover:scale-[1.01] duration-200">
                <h2 className="text-3xl font-extrabold text-center mb-6 text-green-700">
                    Регистрация
                </h2>
                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                {success && <p className="text-green-500 text-sm mb-4 text-center">{success}</p>}
                <form className="flex flex-col" onSubmit={handleRegister}>
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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Введите ваш email"
                            className="block w-full rounded-lg border-gray-300 p-3 shadow-sm focus:border-green-400 focus:ring-green-400 transition-colors"
                            required
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Введите пароль"
                            className="block w-full rounded-lg border-gray-300 p-3 shadow-sm focus:border-green-400 focus:ring-green-400 transition-colors"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            Повторите пароль
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Повторите пароль"
                            className="block w-full rounded-lg border-gray-300 p-3 shadow-sm focus:border-green-400 focus:ring-green-400 transition-colors"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 hover:scale-[1.02] transition-transform duration-200 font-semibold shadow-md"
                    >
                        Зарегистрироваться
                    </button>
                </form>
                <p className="text-sm text-center mt-6 text-gray-600">
                    Уже есть аккаунт?{" "}
                    <a href="/login" className="text-blue-500 hover:underline font-medium">
                        Войти
                    </a>
                </p>
            </div>
        </div>
    );
}