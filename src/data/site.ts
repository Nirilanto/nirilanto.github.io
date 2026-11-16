import type { Locale } from '../i18n';
import type { UiKey } from '../i18n';

/** Identité — contenu repris tel quel du profil (FR), traduit fidèlement en EN. */
export const site = {
  name: 'Venerand Nirilanto',
  firstName: 'Venerand',
  lastName: 'Nirilanto',
  email: 'rtnirilantov@gmail.com',
  linkedin: 'https://www.linkedin.com/in/venerand-nirilanto-36294a15b',
  /** [placeholder] — à fournir, voir TODO-contenu.md */
  github: null as string | null,
} as const;

interface Profile {
  /** Titre découpé : rôle principal puis spécialités. */
  titleParts: readonly [string, ...string[]];
  tagline: string;
  location: string;
}

export const profile: Record<Locale, Profile> = {
  fr: {
    titleParts: [
      'Ingénieur Logiciel Full Stack Senior',
      'Architecture Logicielle',
      'Développement Web & Mobile',
    ],
    tagline:
      'Développeur Fullstack JavaScript depuis 8 ans, je conçois des applications web et mobiles robustes, du besoin métier jusqu’à la mise en production.',
    location: 'Rennes, France',
  },
  en: {
    titleParts: [
      'Senior Full Stack Software Engineer',
      'Software Architecture',
      'Web & Mobile Development',
    ],
    tagline:
      'A Fullstack JavaScript developer for 8 years, I design robust web and mobile applications, from the business need through to production.',
    location: 'Rennes, France',
  },
};

export const nav: readonly { key: UiKey; hash: string }[] = [
  { key: 'nav.projects', hash: '#projets' },
  { key: 'nav.about', hash: '#a-propos' },
  { key: 'nav.experience', hash: '#experience' },
  { key: 'nav.education', hash: '#formation' },
];
