"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

type VideoItem = {
    name: string;
    availableResolutions: string[];
    hls: string;
};

export default function VideoPlayerClient({ video }: { video: VideoItem | null }) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (!video || !videoRef.current) return;

        const videoElement = videoRef.current;
        let hls: Hls | null = null;
        let player: Plyr | null = null;

        if (Hls.isSupported() && video.hls.endsWith(".m3u8")) {
            hls = new Hls();
            hls.loadSource(`http://localhost:8000${video.hls}`);
            hls.attachMedia(videoElement);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                const availableQualities = hls?.levels.map((l) => l.height).sort((a, b) => b - a);
                const uniqueQualities: (number | string)[] = Array.from(new Set(availableQualities));
                uniqueQualities.unshift("Auto");

                player = new Plyr(videoElement, {
                    controls: ["play", "progress", "current-time", "mute", "volume", "settings", "fullscreen"],
                    settings: ["quality", "speed"],
                    quality: {
                        default: "Auto",
                        options: uniqueQualities,
                        forced: true,
                        onChange: (newQuality: string | number) => {
                            if (!hls || !videoRef.current) return;
                            if (newQuality === "Auto") {
                                hls.currentLevel = -1;
                            } else {
                                const qualityNumber = Number(newQuality);
                                hls.levels.forEach((level, levelIndex) => {
                                    if (level.height === qualityNumber) {
                                        const currentTime = videoRef.current!.currentTime;
                                        hls.currentLevel = levelIndex;
                                        hls.startLoad();
                                        videoRef.current!.currentTime = currentTime;
                                    }
                                });
                            }
                        },
                    },
                });
            });
        } else {
            videoElement.src = `http://localhost:8000${video.hls}`;
            player = new Plyr(videoElement);
        }

        return () => {
            if (hls) hls.destroy();
            if (player) player.destroy();
        };
    }, [video]);

    if (!video) {
        return <div className="text-center mt-10 text-red-500">Видео не найдено.</div>;
    }

    return (
        <div className="py-10 max-w-4xl mx-auto px-4">
            <h1 className="text-3xl font-extrabold text-green-700 mb-6 text-center">{video.name}</h1>
            <video
                ref={videoRef}
                className="w-full rounded-lg shadow-md"
                controls
                playsInline
                poster="https://placehold.co/600x400?text=Video"
            />
        </div>
    );
}


