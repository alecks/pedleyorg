import type { CollectionEntry } from "astro:content";

export function normalizeTags(tags: string[]): string[] {
	const labels = new Map<string, string>();
	for (const value of tags) {
		const label = value.trim();
		const key = label.toLowerCase();
		if (!labels.has(key)) labels.set(key, label);
	}
	return [...labels.values()];
}

export function tagSlug(label: string): string {
	const slug = label
		.trim()
		.toLowerCase()
		.normalize("NFKD")
		.replace(/\p{M}/gu, "")
		.replace(/[^\p{L}\p{N}]+/gu, "-")
		.replace(/^-+|-+$/g, "");
	if (!slug)
		throw new Error(`Tag "${label}" needs at least one letter or number.`);
	return slug;
}

export function tagHref(label: string): string {
	return `/tags/${encodeURIComponent(tagSlug(label))}/`;
}

export interface Tag {
	label: string;
	slug: string;
}

export function collectTags(posts: CollectionEntry<"blog">[]): Tag[] {
	const tags = new Map<string, Tag>();
	for (const post of posts) {
		for (const label of post.data.tags) {
			const slug = tagSlug(label);
			const existing = tags.get(slug);
			if (existing && existing.label.toLowerCase() !== label.toLowerCase()) {
				throw new Error(
					`Tags "${existing.label}" and "${label}" share the URL /tags/${slug}/. Rename one tag.`,
				);
			}
			if (!existing) tags.set(slug, { label, slug });
		}
	}
	return [...tags.values()].sort((a, b) =>
		a.label.localeCompare(b.label, "en"),
	);
}
