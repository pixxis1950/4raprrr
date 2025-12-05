export type Category = 'RAPPERS' | 'TUTORIALS' | 'BEATS';

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Markdown content
  author: string;
  date: string;
  category: Category;
  tags: string[];
  imageUrl?: string;
}

export interface GeneratorParams {
  topic: string;
  category: Category;
  tone: string;
}

export const CATEGORY_COLORS: Record<Category, string> = {
  RAPPERS: 'bg-rap-purple',
  TUTORIALS: 'bg-rap-green',
  BEATS: 'bg-rap-pink',
};

export const CATEGORY_LABELS: Record<Category, string> = {
  RAPPERS: 'RAPEŘI',
  TUTORIALS: 'NÁVODY',
  BEATS: 'BEATY',
};