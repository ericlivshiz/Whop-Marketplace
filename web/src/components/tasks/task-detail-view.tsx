"use client";

import { AppShell } from "@/components/tasks/app-shell";
import { ApplyToTaskDialog } from "@/components/tasks/apply-to-task-dialog";
import { CategoryBadge } from "@/components/tasks/category-badge";
import { TaskApplicationsPanel } from "@/components/tasks/task-applications-panel";
import { getCategoryLabel } from "@/lib/tasks/mock-data";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import {
	Avatar,
	Badge,
	Button,
	Card,
	Heading,
	Spinner,
	Text,
} from "@whop/react/components";
import { useQuery } from "convex/react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useState } from "react";

function StatTile({
	icon,
	label,
	value,
}: {
	icon: React.ReactNode;
	label: string;
	value: string | number;
}) {
	return (
		<div className="flex flex-col gap-2 rounded-xl border border-gray-6 bg-gray-2 p-3.5">
			<div className="flex items-center gap-2 text-gray-9">{icon}</div>
			<div>
				<Text size="1" color="gray" weight="medium">
					{label}
				</Text>
				<Text size="2" weight="medium" className="mt-0.5 block">
					{value}
				</Text>
			</div>
		</div>
	);
}

function CalendarIcon() {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			aria-hidden
		>
			<rect x="3" y="4" width="18" height="18" rx="2" />
			<path d="M16 2v4M8 2v4M3 10h18" />
		</svg>
	);
}

function UsersIcon() {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			aria-hidden
		>
			<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
			<circle cx="9" cy="7" r="4" />
			<path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
		</svg>
	);
}

export function TaskDetailView({ taskId }: { taskId: Id<"tasks"> }) {
	const detail = useQuery(api.tasks.get, { taskId });
	const [applyDialogOpen, setApplyDialogOpen] = useState(false);
	const [justApplied, setJustApplied] = useState(false);

	if (detail === undefined) {
		return (
			<AppShell>
				<div className="flex justify-center py-16">
					<Spinner size="3" />
				</div>
			</AppShell>
		);
	}

	if (detail === null) {
		notFound();
	}

	const { task, currentUserHasApplied, isOwnTask } = detail;
	const applied = currentUserHasApplied || justApplied;
	const showApplicantCount = isOwnTask && task.applicants != null;

	function handleApplySuccess() {
		setJustApplied(true);
	}

	return (
		<AppShell>
			<div className="flex flex-col gap-6">
				<Link href="/browse">
					<Button size="1" variant="ghost" color="gray" className="-ml-2 w-fit">
						← Back to tasks
					</Button>
				</Link>

				<div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:gap-10">
					<div className="flex min-w-0 flex-col gap-6">
						<div className="flex flex-col gap-3">
							<div className="flex flex-wrap items-center gap-2">
								<CategoryBadge category={task.category} />
								<Badge color="green" variant="soft" size="1">
									{task.status === "open" ? "Open" : task.status}
								</Badge>
								<Text size="1" color="gray">
									{getCategoryLabel(task.category)}
								</Text>
							</div>
							<Heading size="7" className="pt-1 leading-tight">
								{task.title}
							</Heading>
						</div>

						<Card size="3" variant="surface">
							<Heading size="4" className="mb-3">
								About this task
							</Heading>
							<Text size="3" className="leading-relaxed whitespace-pre-wrap">
								{task.description}
							</Text>
						</Card>

						{isOwnTask ? <TaskApplicationsPanel taskId={taskId} /> : null}
					</div>

					<aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
						<div className="relative overflow-hidden rounded-2xl border border-blue-6 bg-gradient-to-br from-blue-2 via-gray-2 to-gray-3 p-5">
							<div
								className="pointer-events-none absolute -right-6 -top-6 size-28 rounded-full bg-blue-4 opacity-50 blur-2xl"
								aria-hidden
							/>
							<div className="relative z-10">
								<Text
									size="1"
									color="gray"
									weight="medium"
									className="uppercase tracking-wide"
								>
									Task budget
								</Text>
								<Heading size="8" className="mt-1 text-blue-11">
									{task.budgetLabel}
								</Heading>
								<Text size="2" color="gray" className="mt-1">
									Fixed price · paid on completion
								</Text>
							</div>
						</div>

						<div
							className={`grid gap-3 ${showApplicantCount ? "grid-cols-2" : "grid-cols-1"}`}
						>
							<StatTile
								icon={<CalendarIcon />}
								label="Deadline"
								value={task.deadline}
							/>
							{showApplicantCount ? (
								<StatTile
									icon={<UsersIcon />}
									label="Applicants"
									value={task.applicants ?? 0}
								/>
							) : null}
						</div>

						<Card
							size="3"
							variant="surface"
							className="flex flex-col gap-4 p-4 sm:p-5"
						>
							<div>
								<Text
									size="1"
									color="gray"
									weight="medium"
									className="uppercase tracking-wide"
								>
									Posted by
								</Text>
								<div className="mt-3 flex items-center gap-3 rounded-xl border border-gray-6 bg-gray-2 p-3">
									<Avatar
										size="3"
										fallback={task.seller.name.slice(0, 1)}
										color="blue"
									/>
									<div className="min-w-0">
										<Text size="2" weight="medium" className="truncate">
											{task.seller.name}
										</Text>
										<Text size="2" color="gray" className="truncate">
											{task.seller.handle}
										</Text>
									</div>
								</div>
							</div>

							{isOwnTask ? (
								<Text size="2" color="gray" className="text-center leading-relaxed">
									This is your listing. Review applications in the panel
									above.
								</Text>
							) : applied ? (
								<div className="flex flex-col gap-2">
									<Button
										size="3"
										variant="solid"
										color="blue"
										className="w-full"
										disabled
									>
										Application sent ✓
									</Button>
									<Text size="1" color="gray" className="text-center leading-relaxed">
										The poster has been notified of your application.
									</Text>
								</div>
							) : (
								<div className="flex flex-col gap-2">
									<Button
										size="3"
										variant="solid"
										color="blue"
										className="w-full"
										disabled={task.status !== "open"}
										onClick={() => setApplyDialogOpen(true)}
									>
										Apply to task
									</Button>
									<Text size="1" color="gray" className="text-center leading-relaxed">
										Opens a short application form for the poster.
									</Text>
								</div>
							)}
						</Card>
					</aside>
				</div>
			</div>
			{!isOwnTask && !applied ? (
				<ApplyToTaskDialog
					open={applyDialogOpen}
					onOpenChange={setApplyDialogOpen}
					taskId={taskId}
					taskTitle={task.title}
					budgetLabel={task.budgetLabel}
					onSuccess={handleApplySuccess}
				/>
			) : null}
		</AppShell>
	);
}
