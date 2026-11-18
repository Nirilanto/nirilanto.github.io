---
title: 'Pampers'
featured: true
order: 3
client: 'Pampers Professional'
role: 'FullStack Developer'
period: 'February 2022 → January 2023'
summary: 'Redesign and maintenance of the Pampers website (product information, tools for parents, Pampers Club loyalty programme), deployed in several countries and languages (80% front-end).'
tags:
  - 'React'
  - 'Next.js'
  - 'Contentful'
  - 'Crowdin'
  - 'GraphQL'
  - 'REST'
anonymised: false
approach:
  - 'Built the React / Next.js interfaces from Figma mock-ups, working with the UX/UI designers.'
  - 'Implemented Contentful for centralised, localised content management.'
  - 'Dynamic localisation system with Contentful and Crowdin (GraphQL and REST APIs).'
  - 'CI/CD pipelines, JIRA / Azure DevOps integration and environment management (dev, UAT, pre-prod, prod).'
problem: 'One Pampers website for several countries and languages: product information, tools for parents and the Pampers Club loyalty programme. Content has to be managed and translated for each market without duplicating the site.'
constraints: 'Several countries and languages to serve, Figma mock-ups to follow together with the UX/UI designers, and four environments to keep aligned: dev, UAT, pre-prod and prod. A role that was 80% front-end.'
tradeoffs: 'Moving content out of the code to centralise it in Contentful and handing translations to Crowdin: a heavier integration up front, with two services and two kinds of API (GraphQL and REST) to connect, but content and languages are then managed in a single place.'
result: 'A year of redesign and maintenance, from February 2022 to January 2023: React / Next.js interfaces faithful to the mock-ups, content centralised and localised in Contentful, dynamic localisation with Crowdin, and automated deliveries across four environments.'
---
