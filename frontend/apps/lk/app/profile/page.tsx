import ProtectedRoute from "../../src/components/ProtectedRoute";

export default function ProfilePage() {
    return (
            <div className="py-10 text-center">
                <h1 className="text-3xl font-extrabold text-green-700 mb-4">
                    Профиль пользователя
                </h1>
                <p className="text-gray-600 mb-6">
                    Здесь будут настройки аккаунта, данные профиля и информация о подписке.
                </p>
                <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
                    <p className="text-gray-700">Имя: <span className="font-medium">Иван Иванов</span></p>
                    <p className="text-gray-700 mt-2">Email: <span className="font-medium">ivan@example.com</span></p>
                    <button
                        className="mt-6 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition">
                        Редактировать профиль
                    </button>
                </div>
            </div>
    );
}