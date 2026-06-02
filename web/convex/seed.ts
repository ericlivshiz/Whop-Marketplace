import { internalMutation } from "./_generated/server";
import { v } from "convex/values";
const SEED_TASKS = [
	{
		title: "Design 5 carousel posts for product launch",
		description:
			"Need on-brand carousel templates for Instagram and LinkedIn ahead of our membership relaunch. Frosted UI palette provided. Deliver Figma source files plus exported PNGs.",
		category: "design" as const,
		budget: 350,
		deadlineOffsetDays: 10,
		poster: { name: "Maya Chen", handle: "@mayac" },
	},
	{
		title: "Build Whop checkout webhook handler",
		description:
			"Small Node service to verify Whop webhooks and sync membership events into our CRM. Must include idempotency and structured logging.",
		category: "development" as const,
		budget: 800,
		deadlineOffsetDays: 16,
		poster: { name: "Jordan Blake", handle: "@jblake" },
	},
	{
		title: "Write launch email sequence (3 emails)",
		description:
			"Conversion-focused drip for a new tier launch. Tone: direct, creator-first, no fluff. Include subject lines and preview text.",
		category: "marketing" as const,
		budget: 275,
		deadlineOffsetDays: 7,
		poster: { name: "Alex Rivera", handle: "@arivera" },
	},
	{
		title: "Edit 12-minute course intro video",
		description:
			"Rough cut is done. Need pacing, lower thirds, light color grade, and captions. Export 1080p plus vertical cut for Shorts.",
		category: "content" as const,
		budget: 450,
		deadlineOffsetDays: 13,
		poster: { name: "Sam Okonkwo", handle: "@samok" },
	},
	{
		title: "Moderate community for launch week",
		description:
			"Cover Discord + in-app chat for 7 days. Escalation playbook provided. Daily summary report required.",
		category: "operations" as const,
		budget: 500,
		deadlineOffsetDays: 6,
		status: "in_progress" as const,
		poster: { name: "Priya Nair", handle: "@priyan" },
	},
	{
		title: "Landing page copy refresh",
		description:
			"Rewrite hero, features, and FAQ for a tasks marketplace positioning. SEO meta descriptions included.",
		category: "content" as const,
		budget: 200,
		deadlineOffsetDays: 18,
		poster: { name: "Elena Voss", handle: "@elenav" },
	},
] as const;

export const seedMockTasks = internalMutation({
	args: {},
	returns: v.null(),
	handler: async (ctx) => {
		const existing = await ctx.db.query("tasks").first();
		if (existing) {
			return null;
		}

		const now = Date.now();
		const dayMs = 24 * 60 * 60 * 1000;

		for (const item of SEED_TASKS) {
			const handle = item.poster.handle;
			let profile = await ctx.db
				.query("profiles")
				.withIndex("by_handle", (q) => q.eq("handle", handle))
				.unique();

			if (!profile) {
				const userId = `seed_${handle.slice(1)}`;
				const profileId = await ctx.db.insert("profiles", {
					userId,
					name: item.poster.name,
					handle,
					createdAt: now,
				});
				profile = (await ctx.db.get(profileId))!;
			}

			const status = "status" in item ? item.status : ("open" as const);
			await ctx.db.insert("tasks", {
				posterId: profile.userId,
				title: item.title,
				description: item.description,
				category: item.category,
				budget: item.budget,
				deadline: now + item.deadlineOffsetDays * dayMs,
				status,
				createdAt: now,
			});
		}

		return null;
	},
});
