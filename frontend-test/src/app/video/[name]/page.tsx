"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Hls from "hls.js";
import { API_URL } from "@/lib/config";

export default function VideoPlayerPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const params = useParams();
  const videoName = Array.isArray(params?.name) ? params.name[0] : params?.name;

  useEffect(() => {
    if (!videoName || !videoRef.current) return;

    const video = videoRef.current;
    const videoSrc = `${API_URL}/videos/${videoName}/master.m3u8`;

    let hls: Hls | null = null;
    let player: any = null;

    const initPlayer = async () => {
      const { default: Plyr } = await import("plyr");
      await import("plyr/dist/plyr.css");

      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          player = new Plyr(video, {
            controls: [
              "play",
              "progress",
              "current-time",
              "mute",
              "volume",
              "settings",
              "fullscreen",
            ],
          });
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoSrc;
        player = new Plyr(video, {
          controls: [
            "play",
            "progress",
            "current-time",
            "mute",
            "volume",
            "settings",
            "fullscreen",
          ],
        });
      }
    };

    initPlayer();

    return () => {
      if (hls) hls.destroy();
      if (player) player.destroy();
    };
  }, [videoName]);

  return (
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">{videoName}</h1>
        <video
          ref={videoRef}
          className="w-full max-w-4xl rounded shadow aspect-video object-contain bg-black"
          controls
        />
      </main>
  );
}