import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
	ensureProfile,
	getProfileByUserId,
	requireAuth,
} from "./lib/auth";
import { toTaskDto } from "./lib/taskDto";
import { taskValidator } from "./lib/validators";

export const apply = mutation({
	args: { taskId: v.id("tasks") },
	returns: v.null(),
	handler: async (ctx, args) => {
		const user = await requireAuth(ctx);
		await ensureProfile(ctx, user);

		const task = await ctx.db.get(args.taskId);
		if (!task) {
			throw new ConvexError("Task not found");
		}
		if (task.status !== "open") {
			throw new ConvexError("This task is no longer accepting applications");
		}
		if (task.posterId === user._id) {
			throw new ConvexError("You cannot apply to your own task");
		}

		const existing = await ctx.db
			.query("applications")
			.withIndex("by_task_and_applicant", (q) =>
				q.eq("taskId", args.taskId).eq("applicantId", user._id),
			)
			.unique();

		if (existing?.status === "pending") {
			throw new ConvexError("You have already applied to this task");
		}

		await ctx.db.insert("applications", {
			taskId: args.taskId,
			applicantId: user._id,
			status: "pending",
			createdAt: Date.now(),
		});

		return null;
	},
});

export const listAppliedByMe = query({
	args: {},
	returns: v.array(taskValidator),
	handler: async (ctx) => {
		const user = await requireAuth(ctx);

		const applications = await ctx.db
			.query("applications")
			.withIndex("by_applicant", (q) => q.eq("applicantId", user._id))
			.collect();

		const pending = applications
			.filter((a) => a.status === "pending")
			.sort((a, b) => b.createdAt - a.createdAt);

		const results = [];
		for (const application of pending) {
			const task = await ctx.db.get(application.taskId);
			if (!task) {
				continue;
			}
			const posterProfile = await getProfileByUserId(ctx, task.posterId);
			if (!posterProfile) {
				continue;
			}
			results.push(toTaskDto(task, posterProfile));
		}

		return results;
	},
});
