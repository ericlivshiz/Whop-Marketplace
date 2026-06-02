import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { applicationToDto } from "./lib/applicationDto";
import { requireAuth } from "./lib/auth";
import { notificationDtoValidator } from "./lib/validators";

export const listForCurrentUser = query({
	args: {},
	returns: v.array(notificationDtoValidator),
	handler: async (ctx) => {
		const user = await requireAuth(ctx);

		const notifications = await ctx.db
			.query("notifications")
			.withIndex("by_user", (q) => q.eq("userId", user._id))
			.collect();

		notifications.sort((a, b) => b.createdAt - a.createdAt);

		const results = [];
		for (const notification of notifications) {
			const task = await ctx.db.get(notification.taskId);
			if (!task) {
				continue;
			}

			const base = {
				id: notification._id,
				taskId: notification.taskId,
				taskTitle: task.title,
				createdAt: notification.createdAt,
				read: notification.read,
			};

			if (notification.type === "task_posted") {
				results.push({
					type: "task_posted" as const,
					...base,
					message: `${task.title} was posted!`,
				});
				continue;
			}

			if (!notification.applicationId) {
				continue;
			}

			const application = await ctx.db.get(notification.applicationId);
			if (!application) {
				continue;
			}

			const applicationDto = await applicationToDto(ctx, application);
			if (!applicationDto) {
				continue;
			}

			results.push({
				type: "application_received" as const,
				...base,
				applicantName: applicationDto.applicantName,
				applicantHandle: applicationDto.applicantHandle,
				pitch: applicationDto.pitch,
				...(applicationDto.portfolioUrl
					? { portfolioUrl: applicationDto.portfolioUrl }
					: {}),
			});
		}

		return results;
	},
});

export const unreadCount = query({
	args: {},
	returns: v.number(),
	handler: async (ctx) => {
		const user = await requireAuth(ctx);

		const unread = await ctx.db
			.query("notifications")
			.withIndex("by_user_and_read", (q) =>
				q.eq("userId", user._id).eq("read", false),
			)
			.collect();

		return unread.length;
	},
});

export const markRead = mutation({
	args: { notificationId: v.id("notifications") },
	returns: v.null(),
	handler: async (ctx, args) => {
		const user = await requireAuth(ctx);
		const notification = await ctx.db.get(args.notificationId);

		if (!notification || notification.userId !== user._id) {
			return null;
		}

		await ctx.db.patch(args.notificationId, { read: true });
		return null;
	},
});

export const markAllRead = mutation({
	args: {},
	returns: v.null(),
	handler: async (ctx) => {
		const user = await requireAuth(ctx);

		const unread = await ctx.db
			.query("notifications")
			.withIndex("by_user_and_read", (q) =>
				q.eq("userId", user._id).eq("read", false),
			)
			.collect();

		for (const notification of unread) {
			await ctx.db.patch(notification._id, { read: true });
		}

		return null;
	},
});
