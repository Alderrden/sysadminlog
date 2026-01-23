// src/navigation.ts
import { getBlogPermalink, getHomePermalink, getPermalink } from '~/utils/permalinks';

export const headerData = {
  links: [
    { text: 'Home', href: getHomePermalink() },
    { text: 'Blog', href: getBlogPermalink() },
    { text: 'Me', href: getPermalink('/me') },
    { text: 'Donate', href: getPermalink('/donate') },
  ],
  actions: [],
};

export const footerData = {
  links: [],            // без лишних колонок
  secondaryLinks: [],   // пусто
  socialLinks: [],      // пусто
  footNote: `© ${new Date().getFullYear()} sysadminlog · Based on Astro + AstroWind`,
};
