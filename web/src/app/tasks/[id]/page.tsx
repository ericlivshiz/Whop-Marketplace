import { TaskDetailView } from "@/components/tasks/task-detail-view";
import type { Id } from "@convex/_generated/dataModel";

export default async function TaskPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return <TaskDetailView taskId={id as Id<"tasks">} />;
}
