"use client";

import { AppShell } from "@/components/tasks/app-shell";
import { TASK_CATEGORY_OPTIONS } from "@/lib/tasks/mock-data";
import type { TaskCategory } from "@/lib/tasks/types";
import { api } from "@convex/_generated/api";
import {
	Button,
	Callout,
	Card,
	FilterChip,
	Heading,
	Text,
	TextArea,
	TextField,
} from "@whop/react/components";
import { useMutation } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

function FormField({
	label,
	id,
	children,
}: {
	label: string;
	id: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-2">
			<Text as="label" htmlFor={id} size="2" weight="medium">
				{label}
			</Text>
			{children}
		</div>
	);
}

function parseDeadlineMs(dateValue: string): number {
	const [year, month, day] = dateValue.split("-").map(Number);
	return new Date(year, month - 1, day).getTime();
}

export function PostTaskForm() {
	const router = useRouter();
	const createTask = useMutation(api.tasks.create);
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [category, setCategory] = useState<TaskCategory>("design");

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);
		setIsSubmitting(true);

		const form = event.currentTarget;
		const formData = new FormData(form);
		const title = String(formData.get("title") ?? "");
		const description = String(formData.get("description") ?? "");
		const budget = Number(formData.get("budget"));
		const deadlineValue = String(formData.get("deadline") ?? "");

		try {
			const taskId = await createTask({
				title,
				description,
				category,
				budget,
				deadline: parseDeadlineMs(deadlineValue),
			});
			router.push(`/tasks/${taskId}`);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to publish task",
			);
			setIsSubmitting(false);
		}
	}

	return (
		<AppShell>
			<div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
				<div className="flex items-start justify-between gap-4">
					<div className="flex min-w-0 flex-col gap-1.5">
						<Heading size="7" className="tracking-tight">
							Post a task
						</Heading>
						<Text size="3" color="gray" className="max-w-md leading-relaxed">
							List what you need done. Members can browse and apply
							right away.
						</Text>
					</div>
					<Link href="/browse" className="shrink-0 pt-1">
						<Button size="1" variant="ghost" color="gray">
							← Back
						</Button>
					</Link>
				</div>

				{error ? (
					<Callout.Root color="red" variant="soft">
						<Callout.Text>{error}</Callout.Text>
					</Callout.Root>
				) : null}

				<Card size="3" variant="surface" className="overflow-hidden p-0">
					<form onSubmit={handleSubmit}>
						<div className="grid gap-5 p-5 md:grid-cols-[1fr_272px] md:gap-6 md:p-6">
							<div className="flex flex-col gap-4">
								<FormField label="Title" id="task-title">
									<TextField.Root size="3" variant="surface">
										<TextField.Input
											id="task-title"
											name="title"
											placeholder="e.g. Design launch graphics for Instagram"
											required
											disabled={isSubmitting}
										/>
									</TextField.Root>
								</FormField>

								<FormField label="Description" id="task-description">
									<TextArea
										id="task-description"
										name="description"
										size="3"
										variant="surface"
										placeholder="Scope, deliverables, and any links…"
										rows={5}
										required
										disabled={isSubmitting}
										className="min-h-[120px] resize-y"
									/>
								</FormField>
							</div>

							<div className="flex flex-col gap-4">
								<FormField label="Category" id="task-category">
									<div
										className="flex flex-wrap gap-2"
										role="group"
										aria-labelledby="task-category"
									>
										{TASK_CATEGORY_OPTIONS.map((item) => (
											<FilterChip
												key={item.value}
												checked={category === item.value}
												onCheckedChange={() =>
													setCategory(item.value)
												}
												disabled={isSubmitting}
											>
												{item.label}
											</FilterChip>
										))}
									</div>
								</FormField>

								<FormField label="Budget (USD)" id="task-budget">
									<TextField.Root size="3" variant="surface">
										<TextField.Slot>
											<Text size="2" color="gray">
												$
											</Text>
										</TextField.Slot>
										<TextField.Input
											id="task-budget"
											name="budget"
											type="number"
											min={1}
											placeholder="250"
											required
											disabled={isSubmitting}
										/>
									</TextField.Root>
								</FormField>

								<FormField label="Deadline" id="task-deadline">
									<TextField.Root size="3" variant="surface">
										<TextField.Input
											id="task-deadline"
											name="deadline"
											type="date"
											required
											disabled={isSubmitting}
										/>
									</TextField.Root>
								</FormField>
							</div>
						</div>

						<div className="flex items-center justify-between gap-3 border-t border-gray-6 bg-gray-2 px-5 py-4 md:px-6">
							<Link href="/browse">
								<Button
									type="button"
									size="2"
									variant="ghost"
									color="gray"
									disabled={isSubmitting}
								>
									Cancel
								</Button>
							</Link>
							<Button
								type="submit"
								size="3"
								variant="solid"
								color="blue"
								disabled={isSubmitting}
							>
								{isSubmitting ? "Publishing…" : "Publish task"}
							</Button>
						</div>
					</form>
				</Card>
			</div>
		</AppShell>
	);
}
