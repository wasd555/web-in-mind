export default function DashboardPage() {
    const sections = [
        {
            id: 1,
            title: "Видео",
            icon: "🎥",
            link: "/videos",
            description: "Смотрите вебинары и лекции",
            color: "from-green-400 to-blue-400",
        },
        {
            id: 2,
            title: "Профиль",
            icon: "👤",
            link: "/profile",
            description: "Личные данные и настройки",
            color: "from-blue-400 to-green-400",
        },
        {
            id: 3,
            title: "Подписка",
            icon: "💳",
            link: "/subscription",
            description: "Информация о подписке",
            color: "from-green-300 to-blue-300",
        },
    ];

    const recentVideos = [
        { id: 1, title: "Занятие 1", thumbnail: "https://placehold.co/300x180?text=Video+1" },
        { id: 2, title: "Занятие 2", thumbnail: "https://placehold.co/300x180?text=Video+2" },
        { id: 3, title: "Занятие 3", thumbnail: "https://placehold.co/300x180?text=Video+3" },
    ];

    return (
        <div className="py-10 space-y-12">
            {/* Приветствие */}
            <h1 className="text-3xl font-extrabold text-green-700 text-center">
                Добро пожаловать в GARmonia
            </h1>

            {/* Разделы */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {sections.map((section) => (
                    <a
                        key={section.id}
                        href={section.link}
                        className={`rounded-xl shadow-lg hover:shadow-2xl transition-shadow transform hover:scale-[1.02] duration-200 overflow-hidden bg-gradient-to-r ${section.color} p-6 text-white flex flex-col justify-between`}
                    >
                        <div className="text-4xl mb-4">{section.icon}</div>
                        <div>
                            <h2 className="text-xl font-semibold mb-1">{section.title}</h2>
                            <p className="text-sm opacity-90">{section.description}</p>
                        </div>
                    </a>
                ))}
            </div>

            {/* Последние видео */}
            <section>
                <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
                    Последние видео
                </h2>
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    {recentVideos.map((video) => (
                        <a
                            key={video.id}
                            href={`/video/${video.id}`}
                            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-transform hover:scale-[1.02] duration-200 overflow-hidden"
                        >
                            <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-full h-40 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800">{video.title}</h3>
                                <span className="text-green-600 text-sm font-medium">Смотреть →</span>
                            </div>
                        </a>
                    ))}
                </div>
            </section>
        </div>
    );
}