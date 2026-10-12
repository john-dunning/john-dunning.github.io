import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const commands = defineCollection({
	loader: glob({ pattern: "*.md", base: "./src/content/commands" }),
	schema: z.object({
		fileVersion: z.string(),
		name: z.string(),
		version: z.string(),
		id: z.string().optional(),
		type: z.string(),
		date: z.string(),
		timestamp: z.string(),
		summary: z.string(),
		files: z.array(z.string()),
	}),
});

export const collections = {
	commands
};
