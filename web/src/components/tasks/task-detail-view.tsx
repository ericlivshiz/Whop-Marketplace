"use client";

import { AppShell } from "@/components/tasks/app-shell";
import { CategoryBadge } from "@/components/tasks/category-badge";
import type { Task } from "@/lib/tasks/types";
import {
	Avatar,
	Badge,
	Button,
	Card,
	DataList,
	Heading,
	Separator,
	Text,
} from "@whop/react/components";
import Link from "next/link";
import { useState } from "react";

export function TaskDetailView({ task }: { task: Task }) {
	const [applied, setApplied] = useState(false);

	return (
		<AppShell>
			<div className="flex flex-col gap-6">
				<Link href="/dashboard">
					<Button size="1" variant="ghost" color="gray" className="-ml-2 w-fit">
						← Back to tasks
					</Button>
				</Link>

				<div className="grid gap-6 lg:grid-cols-[1fr_280px]">
					<div className="flex flex-col gap-6">
						<div className="flex flex-col gap-3">
							<div className="flex flex-wrap items-center gap-2">
								<CategoryBadge category={task.category} />
								<Badge color="green" variant="soft" size="1">
									{task.status === "open" ? "Open" : task.status}
								</Badge>
							</div>
							<Heading size="7" className="pt-2">
								{task.title}
							</Heading>
							<Text size="3" color="gray">
								Posted by {task.seller.name} {task.seller.handle}
							</Text>
						</div>

						<Card size="3" variant="surface">
							<Heading size="4" className="mb-3">
								About this task
							</Heading>
							<Text size="3" className="leading-relaxed whitespace-pre-wrap">
								{task.description}
							</Text>
						</Card>
					</div>

					<aside className="flex flex-col gap-4">
						<Card size="3" variant="surface" className="flex flex-col gap-4">
							<div>
								<Text size="1" color="gray" weight="medium">
									Budget
								</Text>
								<Heading size="6" className="text-blue-11">
									{task.budgetLabel}
								</Heading>
							</div>

							<Separator />

							<DataList.Root size="2">
								<DataList.Item>
									<DataList.Label>Deadline</DataList.Label>
									<DataList.Value>{task.deadline}</DataList.Value>
								</DataList.Item>
								{task.applicants != null ? (
									<DataList.Item>
										<DataList.Label>Applicants</DataList.Label>
										<DataList.Value>{task.applicants}</DataList.Value>
									</DataList.Item>
								) : null}
							</DataList.Root>

							<Separator />

							<div className="flex items-center gap-3">
								<Avatar
									size="3"
									fallback={task.seller.name.slice(0, 1)}
									color="blue"
								/>
								<div>
									<Text size="2" weight="medium">
										{task.seller.name}
									</Text>
									<Text size="1" color="gray">
										{task.seller.handle}
									</Text>
								</div>
							</div>

							<Button
								size="2"
								variant="solid"
								color="blue"
								className="w-full"
								disabled={applied}
								onClick={() => setApplied(true)}
							>
								{applied ? "Application sent" : "Apply to task"}
							</Button>
							<Text size="1" color="gray" className="text-center">
								Payments and escrow ship in a later release.
							</Text>
						</Card>
					</aside>
				</div>
			</div>
		</AppShell>
	);
}
