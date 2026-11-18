---
title: 'Track Advance'
featured: true
order: 1
client: 'Boccard'
role: 'Développeur Fullstack JavaScript'
period: 'Décembre 2025 → aujourd’hui'
summary: 'Développement de Track Advance, plateforme MES d’acquisition et de suivi de production pour les industries de procédé, en contexte réglementé.'
tags:
  - 'AG Grid'
  - 'API BFF'
  - 'Playwright'
  - 'Keycloak'
  - 'Claude Code'
anonymised: true
approach:
  - 'Modernisation des écrans de liste vers AG Grid (filtrage, tri et pagination côté serveur) et refonte du module recettes.'
  - 'Conception d’API BFF (rapports, items, statistiques, recettes) avec contrôle d’accès par ressource.'
  - 'Mise en place des tests de bout en bout Playwright, y compris les tests des droits d’accès et l’authentification Keycloak.'
  - 'Mise en place de l’IA dans l’équipe : configuration de Claude Code, skills réutilisables, équipe d’agents spécialisés (revue, tests, documentation) et contrôle automatique « prêt pour la revue ».'
problem: 'Track Advance suit la production d’industries de procédé : ses écrans de liste doivent rester exploitables quand les données s’accumulent, et chaque utilisateur ne doit voir que ce à quoi il a droit. Les écrans de liste existants et le module recettes devaient être modernisés.'
constraints: 'Un contexte réglementé : contrôle d’accès par ressource, authentification Keycloak et traçabilité. Chaque évolution doit pouvoir être vérifiée, y compris sur les droits d’accès, avant d’arriver en production.'
tradeoffs: 'Filtrer, trier et paginer côté serveur plutôt que dans le navigateur : plus de travail sur les API, mais des listes qui restent fluides quel que soit le volume. Une API BFF dédiée à l’interface : une couche de plus à maintenir, en échange d’écrans plus simples et d’un contrôle d’accès tenu à un seul endroit. Côté IA, les agents préparent la revue, les tests et la documentation, mais la validation reste humaine.'
result: 'Mission en cours. Les écrans de liste passent sur AG Grid, le module recettes est refondu, les API BFF appliquent les droits par ressource, et les parcours comme les droits d’accès sont couverts par des tests de bout en bout Playwright. L’équipe dispose d’un outillage IA partagé : skills réutilisables, agents spécialisés et contrôle automatique « prêt pour la revue ».'
---
