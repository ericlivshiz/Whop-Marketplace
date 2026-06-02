import { CategoryBadge } from "@/components/tasks/category-badge";
import type { Task } from "@/lib/tasks/types";
import { Avatar, Card, Heading, Text } from "@whop/react/components";
import Link from "next/link";

function CalendarIcon() {
	return (
		<svg
			width="12"
			height="12"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			className="shrink-0 text-gray-9"
			aria-hidden
		>
			<rect x="3" y="4" width="18" height="18" rx="2" />
			<path d="M16 2v4M8 2v4M3 10h18" />
		</svg>
	);
}

export function TaskCard({ task }: { task: Task }) {
	return (
		<Link href={`/tasks/${task.id}`} className="group block h-full">
			<Card
				size="2"
				variant="surface"
				className="flex h-full flex-col overflow-hidden p-0 transition-all duration-200 hover:border-gray-8 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.35)]"
			>
				<div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
					<div className="flex items-center justify-between gap-3">
						<CategoryBadge category={task.category} />
						<Text
							size="3"
							weight="medium"
							className="shrink-0 tabular-nums tracking-tight"
						>
							{task.budgetLabel}
						</Text>
					</div>

					<div className="flex flex-col gap-2">
						<Heading
							size="3"
							className="line-clamp-2 leading-snug transition-colors group-hover:text-blue-11"
						>
							{task.title}
						</Heading>
						<Text
							size="2"
							color="gray"
							className="line-clamp-2 leading-relaxed"
						>
							{task.description}
						</Text>
					</div>
				</div>

				<div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-6 bg-gray-2 px-4 py-3 sm:px-5">
					<div className="flex min-w-0 items-center gap-2.5">
						<Avatar
							size="2"
							fallback={task.seller.name.slice(0, 1)}
							color="gray"
						/>
						<div className="min-w-0">
							<Text size="2" weight="medium" className="truncate">
								{task.seller.name}
							</Text>
							<Text size="1" color="gray" className="truncate">
								{task.seller.handle}
							</Text>
						</div>
					</div>
					<div className="flex shrink-0 items-center gap-1.5 text-gray-11">
						<CalendarIcon />
						<Text size="1" color="gray" className="whitespace-nowrap">
							{task.deadline}
						</Text>
					</div>
				</div>
			</Card>
		</Link>
	);
}
