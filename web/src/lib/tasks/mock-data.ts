import type { TaskCategory } from "./types";

export const TASK_CATEGORIES: {
	value: TaskCategory | "all";
	label: string;
}[] = [
	{ value: "all", label: "All" },
	{ value: "design", label: "Design" },
	{ value: "development", label: "Development" },
	{ value: "marketing", label: "Marketing" },
	{ value: "content", label: "Content" },
	{ value: "operations", label: "Operations" },
	{ value: "other", label: "Other" },
];

export const TASK_CATEGORY_OPTIONS = TASK_CATEGORIES.filter(
	(item): item is { value: TaskCategory; label: string } =>
		item.value !== "all",
);

export function getCategoryLabel(category: TaskCategory): string {
	return (
		TASK_CATEGORIES.find((item) => item.value === category)?.label ?? category
	);
}
