import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import flexokiDark from "./src/themes/flexoki/dark.json" with { type: "json" };
import flexokiLight from "./src/themes/flexoki/light.json" with { type: "json" };

export default defineConfig({
	site: process.env.SITE_URL || "https://pedley.org",
	integrations: [mdx(), sitemap()],
	redirects: { "/blog": "/" },
	markdown: {
		shikiConfig: {
			themes: {
				light: { ...flexokiLight, name: "flexoki-light" },
				dark: { ...flexokiDark, name: "flexoki-dark" },
			},
			defaultColor: false,
		},
	},
});
