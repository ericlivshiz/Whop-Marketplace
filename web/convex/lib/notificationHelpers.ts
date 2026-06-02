import type { Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";

export async function createApplicationNotification(
	ctx: MutationCtx,
	args: {
		posterId: string;
		taskId: Id<"tasks">;
		applicationId: Id<"applications">;
		createdAt: number;
	},
) {
	await ctx.db.insert("notifications", {
		userId: args.posterId,
		type: "application_received",
		taskId: args.taskId,
		applicationId: args.applicationId,
		read: false,
		createdAt: args.createdAt,
	});
}

export async function createTaskPostedNotification(
	ctx: MutationCtx,
	args: {
		userId: string;
		taskId: Id<"tasks">;
		createdAt: number;
	},
) {
	await ctx.db.insert("notifications", {
		userId: args.userId,
		type: "task_posted",
		taskId: args.taskId,
		read: false,
		createdAt: args.createdAt,
	});
}
