// src/lib/sanity-map.ts
import type { ImageUrlBuilder } from '@sanity/image-url'

type SanityPost = {
  title: string
  slug: string
  excerpt?: string
  cover?: any
  publishedAt?: string
  author?: { name?: string; picture?: any }
  categories?: { title?: string; slug?: string }[]
}

type GridImage = { src: string; alt?: string }
type GridAuthorImage = { src: string; alt?: string }
type GridAuthor = { name?: string; image?: GridAuthorImage }
type GridCategory = { title?: string; slug?: string }

type GridPost = {
  slug: string
  url: string
  data: {
    title: string
    excerpt?: string
    publishDate?: string
    image?: GridImage
    cover?: GridImage
    author?: GridAuthor
    categories?: GridCategory[]
  }
}

export function mapSanityToGrid(
  posts: SanityPost[],
  urlFor: (src: any) => ImageUrlBuilder,
  blogBase: string
): GridPost[] {
  return posts.map((p) => {
    const imageUrl = p.cover ? urlFor(p.cover).width(800).height(450).fit('crop').url() : undefined
    const authorImg = p.author?.picture ? urlFor(p.author.picture).width(96).height(96).fit('crop').url() : undefined

    return {
      slug: p.slug,
      url: `${blogBase}/${p.slug}`,
      data: {
        title: p.title,
        excerpt: p.excerpt,
        publishDate: p.publishedAt,
        image: imageUrl ? { src: imageUrl, alt: p.title } : undefined,
        cover: imageUrl ? { src: imageUrl, alt: p.title } : undefined,
        author: p.author?.name
          ? {
              name: p.author.name,
              image: authorImg ? { src: authorImg, alt: p.author.name } : undefined,
            }
          : undefined,
        categories: p.categories,
      },
    }
  })
}
