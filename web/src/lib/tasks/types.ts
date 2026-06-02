export type TaskCategory =
	| "design"
	| "development"
	| "marketing"
	| "content"
	| "operations"
	| "other";

export type TaskStatus = "open" | "in_progress" | "completed";

export type Task = {
	id: string;
	title: string;
	description: string;
	category: TaskCategory;
	budget: number;
	budgetLabel: string;
	deadline: string;
	status: TaskStatus;
	seller: {
		name: string;
		handle: string;
	};
	applicants?: number;
};
