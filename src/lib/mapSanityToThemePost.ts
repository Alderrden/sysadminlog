// src/lib/mapSanityToThemePost.ts
// ВАЖНО: без default-экспортов. Только именованные.
type SanityImage = any;

export type SanityPost = {
  title: string;
  slug: string;
  excerpt?: string;
  cover?: SanityImage;
  firstBodyImage?: SanityImage;
  publishedAt?: string;
  _createdAt?: string;
  author?: { name?: string };
  categories?: { title?: string; slug?: string }[];
};

type ThemeTag = { title: string; slug: string };
type ThemeCategory = { title: string; slug: string };

const DEFAULT_IMAGE = '/assets/images/default.png';

export function mapSanityPostToTheme(
  p: SanityPost,
  urlFor: (src: any) => {
    width: (n: number) => any;
    height: (n: number) => any;
    fit: (m: string) => any;
    auto: (m: string) => any;
    url: () => string;
  }
) {
  const source = p.cover || p.firstBodyImage;
  const image = source
    ? urlFor(source).width(900).height(506).fit('crop').auto('format').url()
    : DEFAULT_IMAGE;

  const category: ThemeCategory | undefined =
    p.categories?.length ? { title: p.categories[0]?.title || '', slug: p.categories[0]?.slug || '' } : undefined;

  const tags: ThemeTag[] | undefined =
    p.categories?.length ? p.categories.map((c) => ({ title: c?.title || '', slug: c?.slug || '' })) : undefined;

  return {
    title: p.title,
    excerpt: p.excerpt || '',
    image,                 // внешний URL или локальный fallback
    permalink: p.slug,     // только slug — /blog/<slug> собирается в теме
    publishDate: p.publishedAt || p._createdAt,
    author: p.author?.name,
    category,
    tags,
    metadata: undefined,
    content: undefined,
  };
}

export function mapSanityPostsToTheme(
  sanityPosts: SanityPost[],
  urlFor: (src: any) => {
    width: (n: number) => any;
    height: (n: number) => any;
    fit: (m: string) => any;
    auto: (m: string) => any;
    url: () => string;
  }
) {
  return sanityPosts.map((p) => mapSanityPostToTheme(p, urlFor));
}
