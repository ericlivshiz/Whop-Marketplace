import { getCategoryLabel } from "@/lib/tasks/mock-data";
import type { TaskCategory } from "@/lib/tasks/types";
import { Badge } from "@whop/react/components";

const CATEGORY_COLORS: Record<
	TaskCategory,
	"blue" | "purple" | "green" | "orange" | "gray" | "cyan"
> = {
	design: "purple",
	development: "blue",
	marketing: "green",
	content: "orange",
	operations: "cyan",
	other: "gray",
};

export function CategoryBadge({
	category,
	className,
}: {
	category: TaskCategory;
	className?: string;
}) {
	return (
		<Badge
			color={CATEGORY_COLORS[category]}
			variant="soft"
			size="1"
			className={className}
		>
			{getCategoryLabel(category)}
		</Badge>
	);
}
