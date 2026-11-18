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
    'nav.top': 'Accueil',
    'nav.toc': 'Sommaire',
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
    'projects.title': 'Projets',
    'projects.titleOutline': 'phares',
    'projects.view': 'Lire l’étude de cas',
    'cursor.view': 'Voir',
    'projects.visual': '[placeholder] Visuel du projet — à fournir',
    'projects.visualAlt': 'Aperçu du projet',
    'projects.visualAnon': '[placeholder] Visuel anonymisé — à fournir',
    'others.title': 'Autres',
    'others.titleOutline': 'réalisations',
    'about.title': 'À',
    'about.titleOutline': 'propos',
    'about.strengths': 'Ce que j’apporte',
    'about.stack': 'Stack',
    'about.sectors': 'Secteurs',
    'experience.title': 'Expé',
    'experience.titleOutline': 'rience',
    'education.title': 'For',
    'education.titleOutline': 'mation',
    'contact.label': 'Contact',
    'contact.title': 'Travaillons',
    'contact.titleOutline': 'ensemble',
    'contact.email': 'Écrire un e-mail',
    'contact.call': 'Appeler',
    'contact.lead': 'Un projet, une mission ou une simple question ? Parlons-en.',
    'contact.mail': 'E-mail',
    'contact.phone': 'Téléphone',
    marquee: 'Web — Mobile — Architecture — Qualité — IA — ',
    'case.back': 'Tous les projets',
    'case.client': 'Client',
    'case.role': 'Rôle',
    'case.period': 'Période',
    'case.stack': 'Technologies',
    'case.problem': 'Problème',
    'case.constraints': 'Contraintes',
    'case.approach': 'Approche',
    'case.tradeoffs': 'Compromis',
    'case.result': 'Résultat',
    'case.next': 'Projet suivant',
    'case.placeholder': '[placeholder] Section à rédiger.',
    'case.anonymised': 'Projet sous confidentialité : contenus et visuels anonymisés.',
    'footer.top': 'Haut de page',
  },
  en: {
    'skip.content': 'Skip to content',
    'nav.main': 'Main navigation',
    'nav.mobile': 'Mobile navigation',
    'nav.home': 'home',
    'nav.top': 'Home',
    'nav.toc': 'On this page',
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
    'projects.title': 'Featured',
    'projects.titleOutline': 'projects',
    'projects.view': 'Read the case study',
    'cursor.view': 'View',
    'projects.visual': '[placeholder] Project visual — to be provided',
    'projects.visualAlt': 'Preview of the project',
    'projects.visualAnon': '[placeholder] Anonymised visual — to be provided',
    'others.title': 'Other',
    'others.titleOutline': 'work',
    'about.title': 'About',
    'about.titleOutline': 'me',
    'about.strengths': 'What I bring',
    'about.stack': 'Stack',
    'about.sectors': 'Sectors',
    'experience.title': 'Expe',
    'experience.titleOutline': 'rience',
    'education.title': 'Edu',
    'education.titleOutline': 'cation',
    'contact.label': 'Contact',
    'contact.title': 'Let’s work',
    'contact.titleOutline': 'together',
    'contact.email': 'Send an email',
    'contact.call': 'Call',
    'contact.lead': 'A project, a role or just a question? Let’s talk.',
    'contact.mail': 'Email',
    'contact.phone': 'Phone',
    marquee: 'Web — Mobile — Architecture — Quality — AI — ',
    'case.back': 'All projects',
    'case.client': 'Client',
    'case.role': 'Role',
    'case.period': 'Period',
    'case.stack': 'Technologies',
    'case.problem': 'Problem',
    'case.constraints': 'Constraints',
    'case.approach': 'Approach',
    'case.tradeoffs': 'Trade-offs',
    'case.result': 'Result',
    'case.next': 'Next project',
    'case.placeholder': '[placeholder] Section to be written.',
    'case.anonymised': 'Project under confidentiality: content and visuals anonymised.',
    'footer.top': 'Back to top',
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type UiKey = keyof (typeof ui)['fr'];

export const useTranslations = (locale: Locale) => (key: UiKey) => ui[locale][key];
