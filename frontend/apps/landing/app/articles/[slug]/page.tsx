import type { Metadata } from 'next';

const DIRECTUS = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://gmira.ru/directus';

async function fetchArticle(slug: string) {
  const res = await fetch(`${DIRECTUS}/items/articles?filter[slug][_eq]=${encodeURIComponent(slug)}&limit=1`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Failed to load');
  const json = await res.json();
  return (json?.data?.[0]) ?? null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const a = await fetchArticle(params.slug);
  const title = a?.title ? `${a.title} — Статьи` : 'Статья';
  const description = a?.excerpt ?? 'Материал из раздела Статьи';
  const images = a?.cover ? [{ url: `${DIRECTUS}/assets/${a.cover}`, width: 1200, height: 630 }] : [];
  return {
    title,
    description,
    openGraph: { title, description, images },
    twitter: { card: 'summary_large_image', title, description, images },
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await fetchArticle(params.slug);
  if (!article) {
    return (
      <section className="relative z-20 mx-auto max-w-3xl px-4 py-24">
        <h1 className="text-3xl font-semibold">Статья не найдена</h1>
      </section>
    );
  }
  return (
    <article className="relative z-20 mx-auto max-w-3xl px-4 py-24">
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">{article.title}</h1>
        {article.excerpt && <p className="text-lg text-gray-600">{article.excerpt}</p>}
      </header>
      {article.cover && (
        <div className="mb-8 aspect-video w-full rounded-2xl bg-gray-100 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${DIRECTUS}/assets/${article.cover}`} alt={article.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="prose prose-zinc max-w-none">
        {article.content ? (
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        ) : (
          <p>Содержимое в разработке.</p>
        )}
      </div>
    </article>
  );
}


