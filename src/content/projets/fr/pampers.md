---
title: 'Pampers'
featured: true
order: 3
client: 'Pampers Professional'
role: 'Développeur FullStack'
period: 'Février 2022 → janvier 2023'
summary: 'Refonte et maintenance du site Pampers (informations produits, outils pour les parents, programme de fidélité Pampers Club), déployé en plusieurs pays et plusieurs langues (80 % front-end).'
tags:
  - 'React'
  - 'Next.js'
  - 'Contentful'
  - 'Crowdin'
  - 'GraphQL'
  - 'REST'
anonymised: false
approach:
  - 'Développement des interfaces React / Next.js à partir des maquettes Figma, en lien avec les designers UX/UI.'
  - 'Mise en œuvre de Contentful pour la gestion centralisée et localisée des contenus.'
  - 'Système de localisation dynamique avec Contentful et Crowdin (API GraphQL et REST).'
  - 'Pipelines CI/CD, intégration JIRA / Azure DevOps et gestion des environnements (dev, UAT, préprod, prod).'
problem: 'Un même site Pampers pour plusieurs pays et plusieurs langues : informations produits, outils pour les parents et programme de fidélité Pampers Club. Les contenus doivent pouvoir être gérés et traduits pour chaque marché sans dupliquer le site.'
constraints: 'Plusieurs pays et plusieurs langues à servir, des maquettes Figma à respecter en lien avec les designers UX/UI, et quatre environnements à tenir alignés : dev, UAT, préprod et prod. Un rôle à 80 % front-end.'
tradeoffs: 'Sortir les contenus du code pour les centraliser dans Contentful et confier les traductions à Crowdin : l’intégration est plus lourde au départ, avec deux services et deux types d’API (GraphQL et REST) à faire dialoguer, mais les contenus et les langues se gèrent ensuite à un seul endroit.'
result: 'Un an de refonte et de maintenance, de février 2022 à janvier 2023 : des interfaces React / Next.js fidèles aux maquettes, des contenus centralisés et localisés dans Contentful, une localisation dynamique avec Crowdin, et des livraisons automatisées sur quatre environnements.'
---
