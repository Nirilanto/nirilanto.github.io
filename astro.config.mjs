// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// URL publique du site : à définir via SITE_URL (voir TODO-contenu.md).
const site = process.env.SITE_URL ?? 'https://example.com';

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'ignore',
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    react(),
    mdx(),
    sitemap({ i18n: { defaultLocale: 'fr', locales: { fr: 'fr-FR', en: 'en-US' } } }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
