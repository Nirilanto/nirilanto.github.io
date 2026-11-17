# Contenu à fournir

Tout ce qui manque est affiché sur le site sous forme de `[placeholder]` visible. Rien n'a été inventé.

## Identité

- [ ] **GitHub** : URL du profil → `src/data/site.ts` (`github`). Tant qu'il est vide, la section Contact affiche un placeholder.
- [ ] **Adresse du site** : variable `SITE_URL` (URL canonique, sitemap, Open Graph). Par défaut `https://example.com`.

## Études de cas (projets phares)

Pour chacun des trois fichiers, en français **et** en anglais, ajouter dans l'en-tête les champs `problem`, `constraints`, `tradeoffs` et `result` :

- [ ] `src/content/projets/fr/track-advance.md` et `src/content/projets/en/track-advance.md`
- [ ] `src/content/projets/fr/comparecycle.md` et `src/content/projets/en/comparecycle.md`
- [ ] `src/content/projets/fr/pampers.md` et `src/content/projets/en/pampers.md`

Sections concernées :

- [ ] **Problème** (`problem`)
- [ ] **Contraintes** (`constraints`)
- [ ] **Compromis** (`tradeoffs`)
- [ ] **Résultat chiffré** (`result`)

La section « Approche » est déjà remplie avec les puces de l'expérience correspondante.

## Visuels

- [ ] Visuel de **Track Advance** — doit rester anonymisé.
- [ ] Visuel de **CompaRecycle**.
- [ ] Visuel de **Pampers**.

En attendant, un bloc gris légendé les remplace (accueil et étude de cas).

## Traductions à relire

La version anglaise a été traduite depuis le profil français : intitulés de postes, puces d'expérience, « Ce que j'apporte », paragraphe IA, diplômes (`src/content/**/en/`, `src/data/about.ts`, `src/data/site.ts`).

## Autres réalisations

- [ ] Les projets HaiRun (Municipales 2020, Roadzafer, Smart Predict) n'ont pas de durée dans le profil : aucune n'est affichée.
