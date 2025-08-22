import { getUser } from "../../src/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

type VideoItem = {
    name: string;
    availableResolutions: string[];
    hls: string;
};

async function fetchVideosServer(): Promise<VideoItem[]> {
    const headersList = await headers();
    const cookie = headersList.get("cookie") || "";
    try {
        const res = await fetch("http://localhost:8000/videos", {
            cache: "no-store",
            headers: { cookie },
        });
        if (!res.ok) return [];
        return await res.json();
    } catch (e) {
        return [];
    }
}

export default async function VideosPage() {
    const user = await getUser();
    if (!user) redirect("/login");

    const videos = await fetchVideosServer();

    return (
            <div className="py-10">
                <h1 className="text-3xl font-extrabold text-green-700 mb-8 text-center">Все видео</h1>
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
                                <img
                                    src={`https://placehold.co/300x180?text=${encodeURIComponent(video.name)}`}
                                    alt={video.name}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="p-4">
                                    <h2 className="text-lg font-semibold text-gray-800">{video.name}</h2>
                                    <span className="text-green-600 text-sm font-medium">Смотреть</span>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
    );
}