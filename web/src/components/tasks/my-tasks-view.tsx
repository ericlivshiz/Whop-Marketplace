"use client";

import { AppShell } from "@/components/tasks/app-shell";
import { TaskCard } from "@/components/tasks/task-card";
import { api } from "@convex/_generated/api";
import {
	Button,
	Card,
	Heading,
	SegmentedControl,
	Spinner,
	Text,
} from "@whop/react/components";
import { useQuery } from "convex/react";
import Link from "next/link";
import { useState } from "react";

type MyTasksTab = "posted" | "applied";

export function MyTasksView() {
	const [tab, setTab] = useState<MyTasksTab>("posted");
	const postedTasks = useQuery(api.tasks.listPostedByMe);
	const appliedTasks = useQuery(api.applications.listAppliedByMe);

	const isLoading =
		tab === "posted" ? postedTasks === undefined : appliedTasks === undefined;
	const tasks = tab === "posted" ? postedTasks : appliedTasks;
	const postedCount = postedTasks?.length ?? 0;
	const appliedCount = appliedTasks?.length ?? 0;

	return (
		<AppShell>
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<Heading size="6">My tasks</Heading>
						<Text size="3" color="gray">
							Tasks you&apos;ve posted and work you&apos;ve applied for.
						</Text>
					</div>
					<Link href="/tasks/new">
						<Button size="2" variant="solid" color="blue">
							Post new task
						</Button>
					</Link>
				</div>

				<SegmentedControl.Root
					value={tab}
					onValueChange={(value) => setTab(value as MyTasksTab)}
				>
					<SegmentedControl.List>
						<SegmentedControl.Trigger value="posted">
							Posted ({postedCount})
						</SegmentedControl.Trigger>
						<SegmentedControl.Trigger value="applied">
							Applied ({appliedCount})
						</SegmentedControl.Trigger>
					</SegmentedControl.List>
				</SegmentedControl.Root>

				{isLoading ? (
					<div className="flex justify-center py-12">
						<Spinner size="3" />
					</div>
				) : !tasks || tasks.length === 0 ? (
					<Card size="3" variant="surface" className="py-12 text-center">
						<Heading size="4">Nothing here yet</Heading>
						<Text size="2" color="gray" className="mt-2">
							{tab === "posted"
								? "Post a task when you need help from the community."
								: "Browse open tasks and apply to start earning."}
						</Text>
					</Card>
				) : (
					<div className="grid gap-5 sm:grid-cols-2">
						{tasks.map((task) => (
							<TaskCard key={task.id} task={task} />
						))}
					</div>
				)}
			</div>
		</AppShell>
	);
}
