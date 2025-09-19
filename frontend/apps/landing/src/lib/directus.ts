export type Article = {
  id: string;
  status: 'draft' | 'published';
  slug: string;
  title: string;
  excerpt?: string | null;
  cover?: string | null; // file id
  content?: string | null; // markdown or rich text
  tags?: string[] | null;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
};
 
export const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://gmira.ru/directus';


