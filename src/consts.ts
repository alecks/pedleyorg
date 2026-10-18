interface Link {
	label: string;
	href?: string;
}

interface Project {
	name: string;
	year: string;
	description: string;
	href?: string;
	technologies?: string[];
}

interface Profile {
	name: string;
	heading: string;
	introduction: string;
	bio: string[];
	dotfiles: {
		label: string;
		href: string;
	};
	links: Link[];
	projects: Project[];
}

export const profile: Profile = {
	name: "Alex Pedley",
	heading: "Building things. Taking notes.",
	introduction:
		"Backend developer and Informatics student at the University of Edinburgh. Writing about software, systems, and other things I take interest to.",
	bio: [
		"I'm a software engineer from Scotland, currently pursuing an Informatics degree at the University of Edinburgh. I primarily write backend software, with considerable experience in Go, Java, Elixir and TypeScript. I have experience in infrastructure engineering, including Linux servers, containerisation, orchestration and service management.",

		"Working on side projects alongside my studies has led me to an obsession with Elixir: Phoenix LiveViews have made me love server-side rendering again. The feeling was almost as good as discovering goroutines. I tend to use whatever interests me at the time; Clojure and Rust have been some of the languages I randomly get into a habit of using.",
	],
	dotfiles: {
		label:
			"My dotfiles, if you're curious about my tiling WM setup (on both Linux and macOS)!",
		href: "https://github.com/alecks/dotfiles",
	},
	links: [
		{ label: "GitHub", href: "https://github.com/alecks" },
		{ label: "LinkedIn", href: "https://linkedin.com/in/alexmpedley" },
		{ label: "Email", href: "mailto:alex@pedley.org" },
	],
	projects: [
		{
			name: "depart.cloud",
			year: "2026",
			description:
				"Social hub for multiplayer OMSI 2. Elixir backend orchestrates servers, provides in-depth user administration, and analyses data from a hand-rolled game server to provide stats to players.",
			technologies: ["Elixir", "Phoenix", "Stripe", "Docker Compose"],
			href: "https://depart.cloud",
		},
		{
			name: "Relayed",
			year: "2026",
			description:
				"LSP-based live coding collaboration: any editor, from Helix to VS Code. CRDTs (conflict-free replicated data types) and file-tree syncing are used to achieve consistency, with new clients receiving snapshots from a nominated user.",
			technologies: ["Elixir", "TypeScript", "LSP"],
		},
		{
			name: "Digifilm",
			year: "2025",
			description:
				"Simple photography portfolio built with Cloudflare technologies. Uses R2 for image buckets, KV for album data. Dynamic with no server fees :)",
			technologies: ["TypeScript"],
			href: "https://github.com/alecks/digifilm",
		},
		{
			name: "passc",
			year: "2024",
			description:
				"CLI secrets manager with configurable libsodium encryption. Secure and reliable but perhaps not a Bitwarden replacement.",
			technologies: ["C", "libsodium", "SQLite3"],
			href: "https://github.com/alecks/passc",
		},
		{
			name: "Shutter",
			year: "2020",
			description:
				"An image upload service with a user dashboard, custom domain support, and Discord/ShareX integration.",
			technologies: ["Go", "PostgreSQL", "Redis"],
		},
		{
			name: "Slicer",
			year: "2020",
			description:
				"An initial attempt at a scalable chat platform. Learned to love and hate Kubernetes.",
			technologies: ["Go", "Kubernetes", "PostgreSQL", "Redis"],
			href: "https://github.com/open-slicer/cell",
		},
	],
};

export const SITE_TITLE = `${profile.name} / Writing`;
export const SITE_DESCRIPTION = profile.introduction;
