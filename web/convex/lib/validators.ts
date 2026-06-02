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

export const notificationType = v.union(
	v.literal("application_received"),
	v.literal("task_posted"),
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

export const applicationDtoValidator = v.object({
	id: v.string(),
	applicantName: v.string(),
	applicantHandle: v.string(),
	pitch: v.string(),
	portfolioUrl: v.optional(v.string()),
	createdAt: v.number(),
	status: applicationStatus,
});

const notificationBaseValidator = {
	id: v.string(),
	taskId: v.string(),
	taskTitle: v.string(),
	createdAt: v.number(),
	read: v.boolean(),
};

export const notificationDtoValidator = v.union(
	v.object({
		type: v.literal("application_received"),
		...notificationBaseValidator,
		applicantName: v.string(),
		applicantHandle: v.string(),
		pitch: v.string(),
		portfolioUrl: v.optional(v.string()),
	}),
	v.object({
		type: v.literal("task_posted"),
		...notificationBaseValidator,
		message: v.string(),
	}),
);

export const profileMineValidator = v.object({
	name: v.string(),
	handle: v.string(),
});
