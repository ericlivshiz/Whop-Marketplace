import { v } from "convex/values";

export const taskCategory = v.union(
	v.literal("design"),
	v.literal("development"),
	v.literal("marketing"),
	v.literal("content"),
	v.literal("operations"),
	v.literal("other"),
);

export const taskStatus = v.union(
	v.literal("open"),
	v.literal("in_progress"),
	v.literal("completed"),
);

export const applicationStatus = v.union(
	v.literal("pending"),
	v.literal("withdrawn"),
);

export const sellerValidator = v.object({
	name: v.string(),
	handle: v.string(),
});

export const taskValidator = v.object({
	id: v.string(),
	title: v.string(),
	description: v.string(),
	category: taskCategory,
	budget: v.number(),
	budgetLabel: v.string(),
	deadline: v.string(),
	status: taskStatus,
	seller: sellerValidator,
	applicants: v.optional(v.number()),
});

export const taskDetailValidator = v.object({
	task: taskValidator,
	currentUserHasApplied: v.boolean(),
	isOwnTask: v.boolean(),
});
