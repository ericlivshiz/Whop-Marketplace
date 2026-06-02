import { CategoryBadge } from "@/components/tasks/category-badge";
import type { Task } from "@/lib/tasks/types";
import { Avatar, Card, Heading, Text } from "@whop/react/components";
import Link from "next/link";

export function TaskCard({ task }: { task: Task }) {
	return (
		<Link href={`/tasks/${task.id}`} className="block h-full">
			<Card
				size="2"
				variant="surface"
				className="flex h-full flex-col gap-4 transition-colors hover:border-blue-7"
			>
				<div className="flex items-start justify-between gap-3">
					<CategoryBadge category={task.category} />
					<Text size="2" weight="medium" className="text-blue-11 shrink-0">
						{task.budgetLabel}
					</Text>
				</div>

				<div className="flex flex-1 flex-col gap-2 pt-4">
					<Heading size="3" className="line-clamp-2">
						{task.title}
					</Heading>
					<Text size="2" color="gray" className="line-clamp-3">
						{task.description}
					</Text>
				</div>

				<div className="flex items-center justify-between gap-3 border-t border-gray-6 pt-3">
					<div className="flex items-center gap-2 min-w-0">
						<Avatar
							size="1"
							fallback={task.seller.name.slice(0, 1)}
							color="blue"
						/>
						<div className="min-w-0">
							<Text size="1" weight="medium" className="truncate">
								{task.seller.name}
							</Text>
							<Text size="1" color="gray" className="truncate">
								{task.seller.handle}
							</Text>
						</div>
					</div>
					<Text size="1" color="gray" className="shrink-0">
						{task.deadline}
					</Text>
				</div>
			</Card>
		</Link>
	);
}
