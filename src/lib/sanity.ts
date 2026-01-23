// src/lib/sanity.ts
import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'

export const sanityClient = createClient({
  projectId: import.meta.env.SANITY_PROJECT_ID,
  dataset: import.meta.env.SANITY_DATASET,
  apiVersion: import.meta.env.SANITY_API_VERSION || '2024-01-01',
  useCdn: true,
  token: import.meta.env.SANITY_READ_TOKEN,
})

const builder = createImageUrlBuilder(sanityClient)
export const urlFor = (source: any) => builder.image(source)
