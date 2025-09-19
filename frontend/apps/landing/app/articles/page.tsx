import BentoGrid from "../../src/components/BentoGrid";
import { BentoCard } from "../../src/components/BentoCard";
import { directus, type Article } from "../../src/lib/directus";

async function fetchArticles(): Promise<Article[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://gmira.ru/directus'}/items/articles?filter[status][_eq]=published&sort[]=-published_at&limit=24`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`Failed to load articles: ${res.status}`);
    const data = await res.json();
    return data?.data ?? [];
  } catch (e) {
    console.error(e);
    return [];
  }
}

export default async function ArticlesPage() {
  const articles = await fetchArticles();

  return (
    <section className="relative z-20 mx-auto max-w-7xl px-4 py-24">
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">Статьи</h1>
      <p className="text-lg text-gray-600 mb-10 max-w-3xl">Подборка материалов в бенто-сетке. Контент загружается из Directus.</p>
      <BentoGrid>
        {articles.map((a, idx) => (
          <BentoCard
            key={a.id}
            title={a.title}
            subtitle={a.excerpt ?? ''}
            href={`/articles/${a.slug}`}
            variant="text"
            clampLines={3}
            colSpan={idx % 7 === 0 ? { base: 4, md: 2, lg: 2, xl: 2 } : { base: 4, md: 2, lg: 1, xl: 1 }}
            rowSpan={idx % 7 === 0 ? { base: 1, md: 1, lg: 2, xl: 2 } : { base: 1, md: 1, lg: 1, xl: 1 }}
            backgroundImageSrc={a.cover ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://gmira.ru/directus'}/assets/${a.cover}` : undefined}
            backgroundImageAlt={a.title}
            backgroundImageOpacity={a.cover ? 0.22 : undefined}
          />
        ))}
        {articles.length === 0 && (
          <BentoCard title="Пока нет статей" subtitle="Зайдите в Directus и создайте первую публикацию в коллекции articles." />
        )}
      </BentoGrid>
    </section>
  );
}


