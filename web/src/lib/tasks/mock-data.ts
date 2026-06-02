import type { Task, TaskCategory } from "./types";

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

export const MOCK_TASKS: Task[] = [
	{
		id: "task-1",
		title: "Design 5 carousel posts for product launch",
		description:
			"Need on-brand carousel templates for Instagram and LinkedIn ahead of our membership relaunch. Frosted UI palette provided. Deliver Figma source files plus exported PNGs.",
		category: "design",
		budget: 350,
		budgetLabel: "$350",
		deadline: "Jun 12, 2026",
		status: "open",
		seller: { name: "Maya Chen", handle: "@mayac" },
		applicants: 4,
	},
	{
		id: "task-2",
		title: "Build Whop checkout webhook handler",
		description:
			"Small Node service to verify Whop webhooks and sync membership events into our CRM. Must include idempotency and structured logging.",
		category: "development",
		budget: 800,
		budgetLabel: "$800",
		deadline: "Jun 18, 2026",
		status: "open",
		seller: { name: "Jordan Blake", handle: "@jblake" },
		applicants: 7,
	},
	{
		id: "task-3",
		title: "Write launch email sequence (3 emails)",
		description:
			"Conversion-focused drip for a new tier launch. Tone: direct, creator-first, no fluff. Include subject lines and preview text.",
		category: "marketing",
		budget: 275,
		budgetLabel: "$275",
		deadline: "Jun 9, 2026",
		status: "open",
		seller: { name: "Alex Rivera", handle: "@arivera" },
		applicants: 2,
	},
	{
		id: "task-4",
		title: "Edit 12-minute course intro video",
		description:
			"Rough cut is done. Need pacing, lower thirds, light color grade, and captions. Export 1080p plus vertical cut for Shorts.",
		category: "content",
		budget: 450,
		budgetLabel: "$450",
		deadline: "Jun 15, 2026",
		status: "open",
		seller: { name: "Sam Okonkwo", handle: "@samok" },
		applicants: 5,
	},
	{
		id: "task-5",
		title: "Moderate community for launch week",
		description:
			"Cover Discord + in-app chat for 7 days. Escalation playbook provided. Daily summary report required.",
		category: "operations",
		budget: 500,
		budgetLabel: "$500",
		deadline: "Jun 8, 2026",
		status: "in_progress",
		seller: { name: "Priya Nair", handle: "@priyan" },
		applicants: 1,
	},
	{
		id: "task-6",
		title: "Landing page copy refresh",
		description:
			"Rewrite hero, features, and FAQ for a tasks marketplace positioning. SEO meta descriptions included.",
		category: "content",
		budget: 200,
		budgetLabel: "$200",
		deadline: "Jun 20, 2026",
		status: "open",
		seller: { name: "Elena Voss", handle: "@elenav" },
		applicants: 3,
	},
];

export function getTaskById(id: string): Task | undefined {
	return MOCK_TASKS.find((task) => task.id === id);
}

export function getCategoryLabel(category: TaskCategory): string {
	return (
		TASK_CATEGORIES.find((item) => item.value === category)?.label ?? category
	);
}
