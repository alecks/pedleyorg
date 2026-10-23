import { z } from "astro/zod";
import siteData from "../data/site.json";
import projectData from "../data/projects.json";

const text = z.string().trim().min(1);
// CMS optional text fields may be omitted or saved as empty strings.
const optionalText = z
	.string()
	.trim()
	.nullish()
	.transform((value) => value || undefined);
const linkSchema = z.object({
	label: text,
	href: optionalText,
});
const siteSchema = z.object({
	name: text,
	heading: optionalText,
	introduction: text,
	title: optionalText,
	description: optionalText,
	repositoryUrl: optionalText,
	links: z.array(linkSchema).default([]),
});
const projectSchema = z.object({
	name: text,
	year: text,
	description: text,
	href: optionalText,
	technologies: z.array(text).default([]),
});

export type Site = z.infer<typeof siteSchema>;
export type Project = z.infer<typeof projectSchema>;

export const site = siteSchema.parse(siteData);
// Preserve the editor's project order.
export const projects = z.array(projectSchema).parse(projectData);
export const SITE_TITLE = site.title ?? `${site.name} / Writing`;
export const SITE_DESCRIPTION = site.description ?? site.introduction;
