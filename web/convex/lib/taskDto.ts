import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

export type TaskDto = {
	id: string;
	title: string;
	description: string;
	category: Doc<"tasks">["category"];
	budget: number;
	budgetLabel: string;
	deadline: string;
	status: Doc<"tasks">["status"];
	seller: {
		name: string;
		handle: string;
	};
	applicants?: number;
};

function formatBudget(budget: number): string {
	return `$${budget.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function formatDeadline(deadlineMs: number): string {
	return new Date(deadlineMs).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

export function toTaskDto(
	task: Doc<"tasks">,
	profile: Doc<"profiles">,
	applicantCount?: number,
): TaskDto {
	return {
		id: task._id,
		title: task.title,
		description: task.description,
		category: task.category,
		budget: task.budget,
		budgetLabel: formatBudget(task.budget),
		deadline: formatDeadline(task.deadline),
		status: task.status,
		seller: {
			name: profile.name,
			handle: profile.handle,
		},
		...(applicantCount !== undefined ? { applicants: applicantCount } : {}),
	};
}

export async function countApplicantsForTask(
	ctx: QueryCtx | MutationCtx,
	taskId: Id<"tasks">,
): Promise<number> {
	const applications = await ctx.db
		.query("applications")
		.withIndex("by_task", (q) => q.eq("taskId", taskId))
		.collect();
	return applications.filter((a) => a.status === "pending").length;
}
