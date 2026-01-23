// src/lib/sanity-to-post.ts
type SanityPost = {
  title: string
  slug: string
  excerpt?: string
  cover?: any
}

export function mapSanityToPosts(
  sanityPosts: SanityPost[],
  urlFor: (src: any) => { width: (n: number) => any; height: (n: number) => any; fit: (m: string) => any; url: () => string }
) {
  return sanityPosts.map((p) => {
    const image = p.cover
      ? urlFor(p.cover).width(900).height(506).fit('crop').url()
      : undefined

    return {
      title: p.title,
      excerpt: p.excerpt || '',
      image,        // внешний URL из Sanity (http...)
      permalink: p.slug, // только slug — GridItem сам соберёт /blog/<slug>
    }
  })
}
