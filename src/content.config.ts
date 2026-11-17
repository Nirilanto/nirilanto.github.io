import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Identifiants de la forme « fr/track-advance » : langue puis slug. */
const projets = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projets' }),
  schema: z.object({
    title: z.string(),
    featured: z.boolean(),
    order: z.number(),
    client: z.string(),
    role: z.string().optional(),
    period: z.string().optional(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    anonymised: z.boolean().default(false),
    approach: z.array(z.string()).default([]),
    // À rédiger : absents, ils s'affichent comme [placeholder].
    problem: z.string().optional(),
    constraints: z.string().optional(),
    tradeoffs: z.string().optional(),
    result: z.string().optional(),
  }),
});

const experiences = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/experiences' }),
  schema: z.object({
    company: z.string(),
    order: z.number(),
    role: z.string(),
    period: z.string(),
    location: z.string(),
    summary: z.string(),
    bullets: z.array(z.string()),
  }),
});

export const collections = { projets, experiences };
