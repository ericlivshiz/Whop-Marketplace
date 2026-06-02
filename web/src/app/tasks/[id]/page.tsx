import { TaskDetailView } from "@/components/tasks/task-detail-view";
import { getTaskById } from "@/lib/tasks/mock-data";
import { notFound } from "next/navigation";

export default async function TaskPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const task = getTaskById(id);

	if (!task) {
		notFound();
	}

	return <TaskDetailView task={task} />;
}
