export default function LoginPage() {
  return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-green-800">Вход</h2>
          <form className="flex flex-col gap-4">
            <input
                type="email"
                placeholder="Email"
                className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                maxLength={50}
                required
            />
            <input
                type="password"
                placeholder="Пароль"
                className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                maxLength={30}
                required
            />
            <button
                type="submit"
                className="bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors"
            >
              Войти
            </button>
          </form>
          <p className="text-sm text-center mt-4">
            Нет аккаунта?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              Зарегистрируйтесь
            </a>
          </p>
        </div>
      </div>
  );
}