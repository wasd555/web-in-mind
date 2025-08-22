import { getUser } from "../../src/lib/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const user = await getUser();
    if (!user) redirect("/login");

    return (
            <div className="py-10 text-center">
                <h1 className="text-3xl font-extrabold text-green-700 mb-4">
                    Профиль пользователя
                </h1>
                <p className="text-gray-600 mb-6">
                    Здесь будут настройки аккаунта, данные профиля и информация о подписке.
                </p>
                <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
                    <div className="flex items-center gap-4 justify-center mb-4">
                        {user?.avatar ? (
                            <img src={`http://localhost:8055/assets/${user.avatar}`} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">{(user?.first_name?.[0] || "?").toUpperCase()}</div>
                        )}
                        <div className="text-left">
                            <p className="text-gray-900 font-semibold">{user?.first_name ?? "—"} {user?.last_name ?? ""}</p>
                            <p className="text-gray-600 text-sm">{user?.email ?? "—"}</p>
                        </div>
                    </div>
                    {user?.role?.name && (
                        <p className="text-gray-700">Роль: <span className="font-medium">{user.role.name}</span></p>
                    )}
                    <button
                        className="mt-6 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition">
                        Редактировать профиль
                    </button>
                </div>
            </div>
    );
}