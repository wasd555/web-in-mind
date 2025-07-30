"use client";

import { useEffect, useState } from "react";

type VideoItem = {
    name: string;
    availableResolutions: string[];
    hls: string; // путь к master.m3u8
};

export default function VideosPage() {
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchVideos() {
            try {
                // Укажи сюда правильный URL API Gateway
                const res = await fetch("http://localhost:8000/videos");
                if (!res.ok) throw new Error("Ошибка загрузки видео");
                const data = await res.json();
                setVideos(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchVideos();
    }, []);

    if (loading) {
        return <div className="text-center mt-10">Загрузка списка видео...</div>;
    }

    return (
        <div className="py-10">
            <h1 className="text-3xl font-extrabold text-green-700 mb-8 text-center">
                Все видео
            </h1>

            {videos.length === 0 ? (
                <p className="text-center text-gray-600">Видео пока нет.</p>
            ) : (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    {videos.map((video) => (
                        <a
                            key={video.name}
                            href={`/video/${video.name}`}
                            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-transform hover:scale-[1.02] duration-200 overflow-hidden"
                        >
                            {/* Пока у нас нет превью-картинок, используем заглушку */}
                            <img
                                src={`https://placehold.co/300x180?text=${encodeURIComponent(video.name)}`}
                                alt={video.name}
                                className="w-full h-40 object-cover"
                            />
                            <div className="p-4">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    {video.name}
                                </h2>
                                <span className="text-green-600 text-sm font-medium">
                  Смотреть →
                </span>
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}