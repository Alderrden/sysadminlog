// src/utils/permalinks.ts
import slugify from 'limax';
import { SITE, APP_BLOG } from 'astrowind:config';

// Обрезает ведущие/замыкающие слэши
export const trimSlash = (s: string) => (s ?? '').replace(/^\/+|\/+$/g, '');

// Безопасная сборка путей
const createPath = (...params: (string | undefined | null)[]) => {
  const paths = params
    .map((el) => trimSlash(el || ''))
    .filter(Boolean)
    .join('/');
  return '/' + paths + (SITE.trailingSlash && paths ? '/' : '');
};

const BASE_PATHNAME = SITE.base || '/';

export const cleanSlug = (text = '') =>
  trimSlash(text)
    .split('/')
    .map((slug) => slugify(slug))
    .join('/');

export const BLOG_BASE = cleanSlug(APP_BLOG?.list?.pathname) || 'blog';
export const CATEGORY_BASE = cleanSlug(APP_BLOG?.category?.pathname);
export const TAG_BASE = cleanSlug(APP_BLOG?.tag?.pathname) || 'tag';

export const POST_PERMALINK_PATTERN =
  trimSlash(APP_BLOG?.post?.permalink) || `${BLOG_BASE}/%slug%`;

export const getCanonical = (path = ''): string | URL => {
  const url = String(new URL(path, SITE.site));
  if (SITE.trailingSlash == false && path && url.endsWith('/')) {
    return url.slice(0, -1);
  } else if (SITE.trailingSlash == true && path && !url.endsWith('/')) {
    return url + '/';
  }
  return url;
};

// Безопасная версия
export const getPermalink = (slug?: string, type = 'page'): string => {
  const s = typeof slug === 'string' ? slug : '';

  // Внешние ссылки/якоря — возвращаем как есть
  if (
    s.startsWith('https://') ||
    s.startsWith('http://') ||
    s.startsWith('://') ||
    s.startsWith('#') ||
    s.startsWith('javascript:')
  ) {
    return s;
  }

  let permalink: string;

  switch (type) {
    case 'home':
      permalink = createPath('/');
      break;

    case 'blog':
      permalink = createPath(BLOG_BASE);
      break;

    case 'asset':
      permalink = getAsset(s);
      break;

    case 'category':
      permalink = createPath(CATEGORY_BASE, trimSlash(s));
      break;

    case 'tag':
      permalink = createPath(TAG_BASE, trimSlash(s));
      break;

    case 'post': {
      const pattern = POST_PERMALINK_PATTERN || `${BLOG_BASE || 'blog'}/%slug%`;
      const slugPart = trimSlash(s);
      let path: string;    

      if (pattern.includes('%slug%')) {
        path = pattern.replace('%slug%', slugPart);
      } else {
        path = [trimSlash(pattern), slugPart].filter(Boolean).join('/');
      }    

      permalink = createPath(path);
      break;
    }


    case 'page':
    default:
      permalink = s ? createPath(s) : '#';
      break;
  }

  if (permalink === '#') return '#';
  return definitivePermalink(permalink);
};

export const getHomePermalink = (): string => getPermalink('/');

export const getBlogPermalink = (): string => getPermalink(BLOG_BASE || 'blog');

export const getAsset = (path: string): string =>
  '/' +
  [BASE_PATHNAME, path]
    .map((el) => trimSlash(el))
    .filter((el) => !!el)
    .join('/');

const definitivePermalink = (permalink: string): string => createPath(BASE_PATHNAME, permalink);

export const applyGetPermalinks = (menu: any = {}) => {
  if (Array.isArray(menu)) {
    return menu.map((item) => applyGetPermalinks(item));
  } else if (typeof menu === 'object' && menu !== null) {
    const obj: any = {};
    for (const key in menu) {
      if (key === 'href') {
        if (typeof menu[key] === 'string') {
          obj[key] = getPermalink(menu[key]);
        } else if (typeof menu[key] === 'object') {
          if (menu[key].type === 'home') {
            obj[key] = getHomePermalink();
          } else if (menu[key].type === 'blog') {
            obj[key] = getBlogPermalink();
          } else if (menu[key].type === 'asset') {
            obj[key] = getAsset(menu[key].url);
          } else if (menu[key].url) {
            obj[key] = getPermalink(menu[key].url, menu[key].type);
          }
        }
      } else {
        obj[key] = applyGetPermalinks(menu[key]);
      }
    }
    return obj;
  }
  return menu;
};
