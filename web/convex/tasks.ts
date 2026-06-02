import { ConvexError, v } from "convex/values";
import { mutation, query, type QueryCtx } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import {
	ensureProfile,
	getOptionalAuthUser,
	getProfileByUserId,
	requireAuth,
} from "./lib/auth";
import { countApplicantsForTask, toTaskDto } from "./lib/taskDto";
import { taskCategory, taskDetailValidator, taskValidator } from "./lib/validators";

const TITLE_MAX = 200;
const DESCRIPTION_MAX = 5000;

function validateTitle(title: string) {
	const trimmed = title.trim();
	if (trimmed.length === 0) {
		throw new ConvexError("Title is required");
	}
	if (trimmed.length > TITLE_MAX) {
		throw new ConvexError(`Title must be at most ${TITLE_MAX} characters`);
	}
	return trimmed;
}

function validateDescription(description: string) {
	const trimmed = description.trim();
	if (trimmed.length === 0) {
		throw new ConvexError("Description is required");
	}
	if (trimmed.length > DESCRIPTION_MAX) {
		throw new ConvexError(
			`Description must be at most ${DESCRIPTION_MAX} characters`,
		);
	}
	return trimmed;
}

function validateBudget(budget: number) {
	if (!Number.isFinite(budget) || budget < 1) {
		throw new ConvexError("Budget must be at least $1");
	}
	return Math.round(budget);
}

function validateDeadline(deadlineMs: number) {
	const startOfToday = new Date();
	startOfToday.setHours(0, 0, 0, 0);
	if (deadlineMs < startOfToday.getTime()) {
		throw new ConvexError("Deadline must be today or in the future");
	}
	return deadlineMs;
}

async function taskToDtoWithPoster(
	ctx: QueryCtx,
	task: Doc<"tasks">,
	includeApplicants: boolean,
) {
	const profile = await getProfileByUserId(ctx, task.posterId);
	if (!profile) {
		return null;
	}
	const applicantCount = includeApplicants
		? await countApplicantsForTask(ctx, task._id)
		: undefined;
	return toTaskDto(task, profile, applicantCount);
}

export const listOpen = query({
	args: {},
	returns: v.array(taskValidator),
	handler: async (ctx) => {
		const tasks = await ctx.db
			.query("tasks")
			.withIndex("by_status", (q) => q.eq("status", "open"))
			.collect();

		tasks.sort((a, b) => b.createdAt - a.createdAt);

		const results = [];
		for (const task of tasks) {
			const dto = await taskToDtoWithPoster(ctx, task, false);
			if (dto) {
				results.push(dto);
			}
		}
		return results;
	},
});

export const get = query({
	args: { taskId: v.id("tasks") },
	returns: v.union(taskDetailValidator, v.null()),
	handler: async (ctx, args) => {
		const task = await ctx.db.get(args.taskId);
		if (!task) {
			return null;
		}

		const profile = await getProfileByUserId(ctx, task.posterId);
		if (!profile) {
			return null;
		}

		const applicantCount = await countApplicantsForTask(ctx, task._id);
		const authUser = await getOptionalAuthUser(ctx);

		let currentUserHasApplied = false;
		let isOwnTask = false;

		if (authUser) {
			isOwnTask = task.posterId === authUser._id;
			const existing = await ctx.db
				.query("applications")
				.withIndex("by_task_and_applicant", (q) =>
					q.eq("taskId", task._id).eq("applicantId", authUser._id),
				)
				.unique();
			currentUserHasApplied =
				existing !== null && existing.status === "pending";
		}

		return {
			task: toTaskDto(task, profile, applicantCount),
			currentUserHasApplied,
			isOwnTask,
		};
	},
});

export const listPostedByMe = query({
	args: {},
	returns: v.array(taskValidator),
	handler: async (ctx) => {
		const user = await requireAuth(ctx);

		const tasks = await ctx.db
			.query("tasks")
			.withIndex("by_poster", (q) => q.eq("posterId", user._id))
			.collect();

		tasks.sort((a, b) => b.createdAt - a.createdAt);

		const profile = await getProfileByUserId(ctx, user._id);
		if (!profile) {
			return [];
		}

		return tasks.map((task) => toTaskDto(task, profile));
	},
});

export const create = mutation({
	args: {
		title: v.string(),
		description: v.string(),
		category: taskCategory,
		budget: v.number(),
		deadline: v.number(),
	},
	returns: v.id("tasks"),
	handler: async (ctx, args) => {
		const user = await requireAuth(ctx);
		await ensureProfile(ctx, user);

		const title = validateTitle(args.title);
		const description = validateDescription(args.description);
		const budget = validateBudget(args.budget);
		const deadline = validateDeadline(args.deadline);
		const now = Date.now();

		return await ctx.db.insert("tasks", {
			posterId: user._id,
			title,
			description,
			category: args.category,
			budget,
			deadline,
			status: "open",
			createdAt: now,
		});
	},
});
