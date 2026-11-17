import type { Locale } from '../i18n';
import type { UiKey } from '../i18n';

/** Identité — contenu repris tel quel du profil (FR), traduit fidèlement en EN. */
export const site = {
  name: 'Venerand Nirilanto',
  firstName: 'Venerand',
  lastName: 'Nirilanto',
  email: 'nirivenerand@gmail.com',
  /** Affichage, lien tel: et lien WhatsApp (même numéro). */
  phone: '+33 6 15 50 74 41',
  phoneHref: 'tel:+33615507441',
  whatsapp: 'https://wa.me/33615507441',
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

/** Texte du hero — repris de la bannière LinkedIn (FR), traduit fidèlement en EN. */
interface HeroCopy {
  experience: string;
  /** Phrase découpée : certains mots sont surlignés (doux) ou encadrés (plein). */
  statement: readonly { text: string; mark?: 'soft' | 'solid' }[];
  pillars: readonly { icon: 'layers' | 'code' | 'chart'; label: string }[];
}

export const heroCopy: Record<Locale, HeroCopy> = {
  fr: {
    experience: '+8 ans d’expérience',
    statement: [
      { text: 'Je conçois et développe des solutions digitales ' },
      { text: 'performantes,', mark: 'soft' },
      { text: ' ' },
      { text: 'évolutives', mark: 'solid' },
      { text: ' et ' },
      { text: 'durables.', mark: 'soft' },
    ],
    pillars: [
      { icon: 'layers', label: 'Architecture logicielle' },
      { icon: 'code', label: 'Développement Full Stack' },
      { icon: 'chart', label: 'Qualité & Impact' },
    ],
  },
  en: {
    experience: '8+ years of experience',
    statement: [
      { text: 'I design and build digital solutions that are ' },
      { text: 'high-performing,', mark: 'soft' },
      { text: ' ' },
      { text: 'scalable', mark: 'solid' },
      { text: ' and ' },
      { text: 'built to last.', mark: 'soft' },
    ],
    pillars: [
      { icon: 'layers', label: 'Software architecture' },
      { icon: 'code', label: 'Full Stack development' },
      { icon: 'chart', label: 'Quality & Impact' },
    ],
  },
};
