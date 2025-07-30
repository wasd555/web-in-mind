export default function LoginPage() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-96px)] px-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md transform transition-all hover:scale-[1.01] duration-200">
                <h2 className="text-3xl font-extrabold text-center mb-6 text-green-700">
                    Вход
                </h2>
                <form className="flex flex-col">
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