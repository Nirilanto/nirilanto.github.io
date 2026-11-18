---
title: 'Track Advance'
featured: true
order: 1
client: 'Boccard'
role: 'Fullstack JavaScript Developer'
period: 'December 2025 → present'
summary: 'Development of Track Advance, an MES platform for production data acquisition and tracking in the process industries, in a regulated context.'
tags:
  - 'AG Grid'
  - 'API BFF'
  - 'Playwright'
  - 'Keycloak'
  - 'Claude Code'
anonymised: true
approach:
  - 'Modernised list screens with AG Grid (server-side filtering, sorting and pagination) and reworked the recipes module.'
  - 'Designed BFF APIs (reports, items, statistics, recipes) with per-resource access control.'
  - 'Set up Playwright end-to-end tests, including access-rights tests and Keycloak authentication.'
  - 'Introduced AI in the team: Claude Code configuration, reusable skills, a team of specialised agents (review, tests, documentation) and an automatic “ready for review” check.'
problem: 'Track Advance tracks production for the process industries: its list screens have to stay usable as data builds up, and each user must only see what they are entitled to. The existing list screens and the recipes module needed modernising.'
constraints: 'A regulated context: per-resource access control, Keycloak authentication and traceability. Every change has to be verifiable, access rights included, before it reaches production.'
tradeoffs: 'Filtering, sorting and paginating on the server rather than in the browser: more work on the APIs, but lists that stay responsive whatever the volume. A BFF API dedicated to the interface: one more layer to maintain, in exchange for simpler screens and access control kept in a single place. On the AI side, agents prepare reviews, tests and documentation, but validation stays human.'
result: 'Ongoing engagement. List screens are moving to AG Grid, the recipes module has been reworked, the BFF APIs enforce per-resource rights, and user journeys as well as access rights are covered by Playwright end-to-end tests. The team shares an AI toolset: reusable skills, specialised agents and an automatic “ready for review” check.'
---
