import { getCollection } from 'astro:content';
import type { Locale } from '../i18n';

const slugOf = (id: string) => id.split('/').slice(1).join('/');
const inLocale = (locale: Locale) => (entry: { id: string }) => entry.id.startsWith(`${locale}/`);

export async function getProjects(locale: Locale) {
  const entries = await getCollection('projets', inLocale(locale));
  return entries
    .map((entry) => ({ slug: slugOf(entry.id), ...entry.data }))
    .sort((a, b) => a.order - b.order);
}

export async function getFeaturedProjects(locale: Locale) {
  return (await getProjects(locale)).filter((project) => project.featured);
}

export async function getOtherProjects(locale: Locale) {
  return (await getProjects(locale)).filter((project) => !project.featured);
}

export async function getExperiences(locale: Locale) {
  const entries = await getCollection('experiences', inLocale(locale));
  return entries
    .map((entry) => ({ slug: slugOf(entry.id), ...entry.data }))
    .sort((a, b) => a.order - b.order);
}

export type Project = Awaited<ReturnType<typeof getProjects>>[number];
