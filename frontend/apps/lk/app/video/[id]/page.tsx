import { getUser } from "../../../src/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import VideoPlayerClient from "./player";

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

export default async function VideoPage({ params }: { params: { id: string } }) {
    const user = await getUser();
    if (!user) redirect("/login");

    const videos = await fetchVideosServer();
    const video = videos.find((v) => v.name === params.id) || null;

    return <VideoPlayerClient video={video} />;
}