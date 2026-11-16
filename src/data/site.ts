/** Identité et navigation — contenu repris tel quel du profil. */
export const site = {
  name: 'Venerand Nirilanto',
  firstName: 'Venerand',
  lastName: 'Nirilanto',
  title:
    'Ingénieur Logiciel Full Stack Senior | Architecture Logicielle | Développement Web & Mobile',
  titleParts: [
    'Ingénieur Logiciel Full Stack Senior',
    'Architecture Logicielle',
    'Développement Web & Mobile',
  ],
  tagline:
    'Développeur Fullstack JavaScript depuis 8 ans, je conçois des applications web et mobiles robustes, du besoin métier jusqu’à la mise en production.',
  location: 'Rennes, France',
  email: 'rtnirilantov@gmail.com',
  linkedin: 'https://www.linkedin.com/in/venerand-nirilanto-36294a15b',
  /** [placeholder] — à fournir, voir TODO-contenu.md */
  github: null as string | null,
  locale: 'fr-FR',
} as const;

export const nav = [
  { label: 'Projets', href: '/#projets' },
  { label: 'À propos', href: '/#a-propos' },
  { label: 'Expérience', href: '/#experience' },
  { label: 'Formation', href: '/#formation' },
] as const;
