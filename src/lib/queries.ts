// src/lib/queries.ts
// Единый набор GROQ-запросов без дублей

export const latestPostsQuery = `
*[_type == "post" && defined(slug.current)]
| order(publishedAt desc)[0...$limit]{
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  "cover": coalesce(cover, mainImage),
  "firstBodyImage": body[_type == "image"][0],
  "categories": categories[]->{ title, "slug": slug.current },
  "author": author->{ name }
}
`;

export const postsSlugsQuery = `
*[_type == "post" && defined(slug.current)]{
  "slug": slug.current
}
`;

export const postBySlugQuery = `
*[_type == "post" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  "cover": coalesce(cover, mainImage),
  "firstBodyImage": body[_type == "image"][0],
  body[],
  "categories": categories[]->{ title, "slug": slug.current },
  "author": author->{ name }
}
`;

/* Categories (расширенные поля для плиток) */
export const categoriesQuery = `
*[_type == "category"]
| order(coalesce(order, 999), title asc){
  title,
  "slug": slug.current,
  icon,
  colorFrom,
  colorTo,
  // для обратной совместимости можно хранить старое поле tint — вернём его тоже
  tint,
  description
}
`;


/* Слуги категорий (для getStaticPaths) */
export const categorySlugsQuery = `
*[_type == "category" && defined(slug.current)]{
  "slug": slug.current,
  title
}
`;
// алиас на старое имя, если где-то используется
export const categoriesSlugsQuery = categorySlugsQuery;

/* Одна категория по слагу (если нужно на странице) */
export const categoryBySlugQuery = `
*[_type == "category" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  description
}
`;

/* Посты по категории (без лимита, сортировка по дате) */
export const postsByCategoryQuery = `
*[
  _type == "post" &&
  defined(slug.current) &&
  $slug in categories[]->slug.current
]
| order(publishedAt desc){
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  "cover": coalesce(cover, mainImage),
  "firstBodyImage": body[_type == "image"][0],
  "categories": categories[]->{ title, "slug": slug.current },
  "author": author->{ name }
}
`;
