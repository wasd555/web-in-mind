"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    function translateDirectusError(errData: any): string {
        try {
            const e = errData?.errors?.[0];
            const msg: string = e?.message || "Ошибка регистрации";
            const code: string = e?.extensions?.code || "";
            const lower = msg.toLowerCase();
            if (lower.includes("password") || lower.includes("format") || lower.includes("validation failed")) {
                return "Пароль не соответствует требованиям. Минимум 8 символов. Примеры: 'Qwerty123', 'Sunset_2025!'";
            }
            if (lower.includes("already exists") || code === "RECORD_NOT_UNIQUE") {
                return "Пользователь с таким email уже существует";
            }
            if (code === "INVALID_PAYLOAD") {
                return "Некорректные данные. Проверьте поля формы";
            }
            return msg;
        } catch {
            return "Ошибка регистрации";
        }
    }

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Пароли не совпадают");
            return;
        }

        if (password.length < 8) {
            setError("Пароль слишком короткий. Минимум 8 символов. Примеры: 'Qwerty123', 'Sunset_2025!'");
            return;
        }

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password,
                    first_name: firstName,
                    last_name: lastName
                })
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(translateDirectusError(data));
            }

            // Профиль подтянется при логине; здесь просто редиректим на /login

            setSuccess("Регистрация успешна! Переход на страницу входа...");
            setTimeout(() => router.push("/login"), 1500);
        } catch (err: any) {
            setError(err.message);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-96px)] px-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md transform transition-all hover:scale-[1.01] duration-200">
                <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-6 tracking-tight bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(180deg, #0ea5e9, #14b8a6)" }}>
                    Регистрация
                </h2>
                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                {success && <p className="text-green-500 text-sm mb-4 text-center">{success}</p>}
                <form className="flex flex-col" onSubmit={handleRegister}>
                    <div className="mb-5">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                            Имя
                        </label>
                        <input
                            id="firstName"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Введите ваше имя"
                            className="block w-full rounded-lg border-gray-300 p-3 shadow-sm focus:border-green-400 focus:ring-green-400 transition-colors"
                            required
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                            Фамилия
                        </label>
                        <input
                            id="lastName"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Введите вашу фамилию"
                            className="block w-full rounded-lg border-gray-300 p-3 shadow-sm focus:border-green-400 focus:ring-green-400 transition-colors"
                            required
                        />
                    </div>
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
                        <p className="mt-2 text-xs text-gray-500">Минимум 8 символов. Примеры: <span className="font-mono">Qwerty123</span>, <span className="font-mono">Sunset_2025!</span></p>
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
                        className="w-full px-3 py-3 rounded-full bg-gradient-to-r from-sky-500 to-teal-600 text-white shadow-sm hover:from-sky-400 hover:to-teal-500 transition-all font-semibold text-base"
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