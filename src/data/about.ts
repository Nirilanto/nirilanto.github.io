import type { Locale } from '../i18n';

/** Contenu « À propos » et formation — repris du profil (FR), traduit fidèlement en EN. */
interface About {
  strengths: readonly { title: string; text: string }[];
  ai: { title: string; text: string };
  stack: readonly { label: string; items: readonly string[] }[];
  sectors: string;
  education: {
    school: string;
    place: string;
    field: string;
    degrees: readonly { name: string; year: string }[];
  };
}

const stackItems = {
  front: ['React', 'Vue.js', 'Next.js', 'React Native', 'TypeScript', 'AG Grid', 'Tailwind'],
  back: ['Node.js', 'NestJS', 'LoopBack', 'GraphQL', 'REST'],
  data: ['PostgreSQL', 'MariaDB', 'MongoDB', 'Elasticsearch', 'Kafka'],
  quality: [
    'Playwright',
    'Cypress',
    'Jest',
    'Docker',
    'GitHub Actions',
    'GitLab CI/CD',
    'SonarCloud',
  ],
} as const;

export const about: Record<Locale, About> = {
  fr: {
    strengths: [
      {
        title: 'Une vraie polyvalence front / back',
        text: 'Interfaces riches et performantes côté front, API solides et bien structurées côté back.',
      },
      {
        title: 'Une approche produit',
        text: 'Je travaille avec les Product Owners et les designers pour transformer un besoin en fonctionnalité utile, testée et maintenable.',
      },
      {
        title: 'La qualité comme réflexe',
        text: 'Tests de bout en bout, revue de code, intégration continue, code propre (SOLID, Clean Code).',
      },
      {
        title: 'L’habitude des environnements exigeants',
        text: 'Contextes réglementés, contrôle d’accès, traçabilité, sécurité.',
      },
    ],
    ai: {
      title: 'L’IA au service des équipes de développement',
      text: 'J’intègre l’IA dans le quotidien des développeurs de façon concrète et maîtrisée : configuration de Claude Code, création de skills et d’agents spécialisés (revue de code, tests, documentation), MCP, automatisation des tâches répétitives, toujours avec validation humaine et règles de sécurité claires.',
    },
    stack: [
      { label: 'Front', items: stackItems.front },
      { label: 'Back', items: stackItems.back },
      { label: 'Données', items: stackItems.data },
      { label: 'Qualité & DevOps', items: stackItems.quality },
      { label: 'Sécurité', items: ['Keycloak', 'Contrôle d’accès (CASL)'] },
    ],
    sectors: 'Industrie, e-commerce, grande consommation, SIG et applications terrain.',
    education: {
      school: 'École Nationale d’Informatique (ENI)',
      place: 'Fianarantsoa',
      field: 'Génie logiciel et Base de données',
      degrees: [
        { name: 'Master 2', year: '2017' },
        { name: 'Master 1', year: '2016' },
        { name: 'Licence', year: '2015' },
      ],
    },
  },
  en: {
    strengths: [
      {
        title: 'Real front / back versatility',
        text: 'Rich, high-performance interfaces on the front end, solid and well-structured APIs on the back end.',
      },
      {
        title: 'A product mindset',
        text: 'I work with Product Owners and designers to turn a need into a useful, tested and maintainable feature.',
      },
      {
        title: 'Quality as a reflex',
        text: 'End-to-end tests, code review, continuous integration, clean code (SOLID, Clean Code).',
      },
      {
        title: 'Used to demanding environments',
        text: 'Regulated contexts, access control, traceability, security.',
      },
    ],
    ai: {
      title: 'AI in the service of development teams',
      text: 'I bring AI into developers’ daily work in a concrete, controlled way: Claude Code configuration, creation of skills and specialised agents (code review, tests, documentation), MCP, automation of repetitive tasks, always with human validation and clear security rules.',
    },
    stack: [
      { label: 'Front', items: stackItems.front },
      { label: 'Back', items: stackItems.back },
      { label: 'Data', items: stackItems.data },
      { label: 'Quality & DevOps', items: stackItems.quality },
      { label: 'Security', items: ['Keycloak', 'Access control (CASL)'] },
    ],
    sectors: 'Industry, e-commerce, consumer goods, GIS and field applications.',
    education: {
      school: 'École Nationale d’Informatique (ENI)',
      place: 'Fianarantsoa',
      field: 'Software Engineering and Databases',
      degrees: [
        { name: 'Master’s degree, year 2 (Master 2)', year: '2017' },
        { name: 'Master’s degree, year 1 (Master 1)', year: '2016' },
        { name: 'Bachelor’s degree (Licence)', year: '2015' },
      ],
    },
  },
};
