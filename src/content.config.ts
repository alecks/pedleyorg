import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { normalizeTags, tagSlug } from "./lib/tags";

const blog = defineCollection({
	loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		tags: z
			.array(
				z
					.string()
					.trim()
					.min(1)
					.refine((tag) => {
						try {
							tagSlug(tag);
							return true;
						} catch {
							return false;
						}
					}, "Tags need at least one letter or number."),
			)
			.default([])
			.transform(normalizeTags),
		updatedDate: z.coerce.date().optional(),
	}),
});

export const collections = { blog };
