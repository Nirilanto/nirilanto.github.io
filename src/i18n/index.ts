/** Internationalisation : français par défaut (sans préfixe), anglais sous /en. */
export const locales = ['fr', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'fr';

export const localeMeta: Record<
  Locale,
  { label: string; name: string; og: string; bcp47: string }
> = {
  fr: { label: 'FR', name: 'Français', og: 'fr_FR', bcp47: 'fr-FR' },
  en: { label: 'EN', name: 'English', og: 'en_US', bcp47: 'en-US' },
};

export const isLocale = (value: string | undefined): value is Locale =>
  locales.includes(value as Locale);

export const toLocale = (value: string | undefined): Locale =>
  isLocale(value) ? value : defaultLocale;

/** Préfixe un chemin interne selon la langue : ('en', '/#contact') → '/en/#contact'. */
export function localePath(locale: Locale, path = '/'): string {
  return locale === defaultLocale ? path : `/${locale}${path}`;
}

/** Chemin équivalent dans une autre langue, pour le sélecteur et les hreflang. */
export function switchLocalePath(pathname: string, to: Locale): string {
  const segments = pathname.split('/').filter(Boolean);
  if (isLocale(segments[0])) segments.shift();
  const rest = segments.join('/');
  const prefix = to === defaultLocale ? '' : `/${to}`;
  return `${prefix}/${rest}`;
}

const ui = {
  fr: {
    'skip.content': 'Aller au contenu',
    'nav.main': 'Navigation principale',
    'nav.mobile': 'Navigation mobile',
    'nav.home': 'accueil',
    'nav.projects': 'Projets',
    'nav.about': 'À propos',
    'nav.experience': 'Expérience',
    'nav.education': 'Formation',
    'nav.contact': 'Me contacter',
    'menu.open': 'Ouvrir le menu',
    'menu.close': 'Fermer le menu',
    'lang.switch': 'Langue',
    'theme.toLight': 'Passer au thème clair',
    'theme.toDark': 'Passer au thème sombre',
    'hero.label': 'Portfolio',
    'hero.projects': 'Voir les projets',
    'hero.portraitAlt': 'Portrait de Venerand Nirilanto',
    'hero.badge': 'Web • Mobile • Architecture • IA • ',
  },
  en: {
    'skip.content': 'Skip to content',
    'nav.main': 'Main navigation',
    'nav.mobile': 'Mobile navigation',
    'nav.home': 'home',
    'nav.projects': 'Projects',
    'nav.about': 'About',
    'nav.experience': 'Experience',
    'nav.education': 'Education',
    'nav.contact': 'Contact me',
    'menu.open': 'Open menu',
    'menu.close': 'Close menu',
    'lang.switch': 'Language',
    'theme.toLight': 'Switch to light theme',
    'theme.toDark': 'Switch to dark theme',
    'hero.label': 'Portfolio',
    'hero.projects': 'View projects',
    'hero.portraitAlt': 'Portrait of Venerand Nirilanto',
    'hero.badge': 'Web • Mobile • Architecture • AI • ',
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type UiKey = keyof (typeof ui)['fr'];

export const useTranslations = (locale: Locale) => (key: UiKey) => ui[locale][key];
