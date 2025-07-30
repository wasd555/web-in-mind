"use client";

import { useEffect, useState } from "react";
import { getVideos } from "../lib/api";
import { VideoCard } from "../components/VideoCard";

type Video = {
  name: string;
  availableResolutions: string[];
  hls: string;
};

export default function HomePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVideos()
      .then((data) => {
        setVideos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки видео:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4 text-center">Загрузка...</div>;

  return (
      <main className="p-6">
        <h1 className="text-3xl font-bold mb-6">GARmonia — Видео</h1>
        <div className="grid gap-4">
          {videos.length === 0 ? (
              <p>Видео пока нет</p>
          ) : (
              videos.map((video) => (
                <VideoCard key={video.name} name={video.name} />
              ))
          )}
        </div>
      </main>
  );
}