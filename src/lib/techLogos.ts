/**
 * Logos des technologies (Simple Icons), résolus par libellé à la compilation.
 * Sans logo connu, `getTechLogo` renvoie `undefined` : l'appelant affiche le texte seul.
 */
import {
  siAngular,
  siAnthropic,
  siApachekafka,
  siClaude,
  siContentful,
  siCss,
  siCrowdin,
  siCypress,
  siDocker,
  siElasticsearch,
  siFigma,
  siGit,
  siGithub,
  siGithubactions,
  siGitlab,
  siGraphql,
  siHtml5,
  siJavascript,
  siJenkins,
  siJest,
  siJira,
  siKeycloak,
  siKubernetes,
  siLeaflet,
  siLoopback,
  siMariadb,
  siModelcontextprotocol,
  siMongodb,
  siNestjs,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPusher,
  siReact,
  siSocketdotio,
  siSonarqubecloud,
  siTailwindcss,
  siTypescript,
  siVuedotjs,
} from 'simple-icons';

const logos: Record<string, { path: string; hex: string }> = {
  react: siReact,
  'react native': siReact,
  'vue.js': siVuedotjs,
  'next.js': siNextdotjs,
  typescript: siTypescript,
  tailwind: siTailwindcss,
  angular: siAngular,
  'node.js': siNodedotjs,
  nestjs: siNestjs,
  loopback: siLoopback,
  graphql: siGraphql,
  websocket: siSocketdotio,
  pusher: siPusher,
  postgresql: siPostgresql,
  mariadb: siMariadb,
  mongodb: siMongodb,
  elasticsearch: siElasticsearch,
  kafka: siApachekafka,
  cypress: siCypress,
  jest: siJest,
  docker: siDocker,
  kubernetes: siKubernetes,
  jenkins: siJenkins,
  'github actions': siGithubactions,
  'gitlab ci/cd': siGitlab,
  sonarcloud: siSonarqubecloud,
  keycloak: siKeycloak,
  leaflet: siLeaflet,
  contentful: siContentful,
  crowdin: siCrowdin,
  'claude code': siClaude,
  claude: siClaude,
  anthropic: siAnthropic,
  mcp: siModelcontextprotocol,
  javascript: siJavascript,
  html5: siHtml5,
  css: siCss,
  git: siGit,
  github: siGithub,
  figma: siFigma,
  jira: siJira,
};

/** Les logos presque noirs seraient illisibles en thème sombre : ils prennent la couleur du texte. */
const isDark = (hex: string) => {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b! < 0.3;
};

export function getTechLogo(name: string): { path: string; colour: string } | undefined {
  const logo = logos[name.toLowerCase()];
  if (!logo) return undefined;
  return { path: logo.path, colour: isDark(logo.hex) ? 'currentColor' : `#${logo.hex}` };
}
