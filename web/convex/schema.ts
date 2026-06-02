import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import {
	applicationStatus,
	notificationType,
	taskCategory,
	taskStatus,
} from "./lib/validators";

export default defineSchema({
	profiles: defineTable({
		userId: v.string(),
		name: v.string(),
		handle: v.string(),
		createdAt: v.number(),
	})
		.index("by_userId", ["userId"])
		.index("by_handle", ["handle"]),

	tasks: defineTable({
		posterId: v.string(),
		title: v.string(),
		description: v.string(),
		category: taskCategory,
		budget: v.number(),
		deadline: v.number(),
		status: taskStatus,
		createdAt: v.number(),
		updatedAt: v.optional(v.number()),
	})
		.index("by_poster", ["posterId"])
		.index("by_status", ["status"])
		.index("by_status_and_category", ["status", "category"]),

	applications: defineTable({
		taskId: v.id("tasks"),
		applicantId: v.string(),
		status: applicationStatus,
		// Optional in schema for legacy rows; new applies require pitch in applications.apply.
		pitch: v.optional(v.string()),
		portfolioUrl: v.optional(v.string()),
		createdAt: v.number(),
	})
		.index("by_task", ["taskId"])
		.index("by_applicant", ["applicantId"])
		.index("by_task_and_applicant", ["taskId", "applicantId"]),

	notifications: defineTable({
		userId: v.string(),
		type: notificationType,
		taskId: v.id("tasks"),
		applicationId: v.optional(v.id("applications")),
		read: v.boolean(),
		createdAt: v.number(),
	})
		.index("by_user", ["userId"])
		.index("by_user_and_read", ["userId", "read"]),
});
