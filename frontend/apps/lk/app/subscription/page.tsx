export default function SubscriptionPage() {
    return (
        <div className="py-10 text-center">
            <h1 className="text-3xl font-extrabold text-green-700 mb-4">
                Подписка
            </h1>
            <p className="text-gray-600 mb-6">
                Здесь вы сможете увидеть статус подписки, продлить или изменить тариф.
            </p>
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
                <p className="text-gray-700">
                    Текущий тариф: <span className="font-medium">Премиум</span>
                </p>
                <p className="text-gray-700 mt-2">
                    Действует до: <span className="font-medium">31.12.2025</span>
                </p>
                <button className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                    Управлять подпиской
                </button>
            </div>
        </div>
    );
}