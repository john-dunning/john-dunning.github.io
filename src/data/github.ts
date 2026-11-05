export interface GithubProject {
	name: string;
	href: string;
	summary: string;
	links?: { label: string; href: string }[];
	npm?: string;
}

export const githubProjects: GithubProject[] = [
	{
		name: "QuicKey",
		href: "https://github.com/fwextensions/QuicKey",
		summary: "A 5-star-rated Chrome extension for switching tabs with a Quicksilver-style search or a most recently used menu.",
		links: [
			{ label: "homepage", href: "https://fwextensions.github.io/QuicKey/" },
			{ label: "chrome web store", href: "https://chrome.google.com/webstore/detail/quickey-%E2%80%93-the-quick-tab-s/ldlghkoiihaelfnggonhjnfiabmaficg" },
		],
	},
	{
		name: "wagtail-mcp",
		href: "https://github.com/fwextensions/wagtail-mcp",
		summary: "A basic MCP server that provides an LLM with read-only access to a Wagtail CMS instance.",
		npm: "wagtail-mcp",
	},
	{
		name: "fwidgets",
		href: "https://github.com/fwextensions/fwidgets",
		summary: "A library for adding basic UI functionality to a Figma plugin without writing any UI code. Think of it like adding a series of interactive prompts to a command line tool, similar to the wizard structure of something like create-react-app. fwidgets lets you show one UI element at a time to the user, awaiting their input and then responding to it, while keeping all of your code in the main thread.",
		npm: "fwidgets",
	},
	{
		name: "figma-await-ipc",
		href: "https://github.com/fwextensions/figma-await-ipc",
		summary: "A simple await-able replacement for postMessage() in Figma plugins.",
		npm: "figma-await-ipc",
	},
	{
		name: "quick-score",
		href: "https://github.com/fwextensions/quick-score",
		summary: "A string-scoring and fuzzy-matching library. It's based on the algorithm used in the Quicksilver macOS utility and is designed for smart auto-complete. It improves on the original algorithm by tuning the scoring for long strings, such as webpage titles or URLs, so that the order of the results makes more sense for a given search string.",
		links: [
			{ label: "demo", href: "https://fwextensions.github.io/quick-score-demo/" },
		],
		npm: "quick-score",
	},
];
